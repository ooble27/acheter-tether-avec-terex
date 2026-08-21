import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Anthropic from "npm:@anthropic-ai/sdk@0.68.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Rédige un draft d'email pour le staff Terex à partir d'une intention libre.
 * Retourne { subject, body } — l'agent peut ensuite éditer.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });
    }
    // Réservé au staff : on vérifie qu'au moins un rôle staff existe.
    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const staffRoles = ["admin", "operator", "marketing", "hr", "kyc_reviewer", "support"];
    const isStaff = (roles || []).some((r: any) => staffRoles.includes(r.role));
    if (!isStaff) {
      return new Response(JSON.stringify({ error: "Accès réservé au staff" }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const { intention, clientName, clientEmail } = await req.json();
    if (!intention || typeof intention !== "string" || intention.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Intention requise (au moins 5 caractères)" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY non configurée" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `Tu es un rédacteur du service client pour Terex, plateforme d'échange USDT/CFA basée à Dakar (Sénégal) et opérant en Afrique de l'Ouest. Tu écris des emails clients : chaleureux mais professionnels, en français, ton direct sans jargon.

═══════════════════════════════════════════════════════════════
CONTEXTE TEREX — connaissance de la plateforme (à utiliser dans tes réponses)
═══════════════════════════════════════════════════════════════

▸ Qu'est-ce que Terex
Terex (terangaexchange.com) permet à des particuliers d'Afrique de l'Ouest d'acheter et vendre des USDT (stablecoin adossé au dollar US) contre des francs CFA (XOF), rapidement et sans passer par un exchange étranger complexe.

▸ Fonctionnalités disponibles
- Achat USDT : le client paie en CFA (Wave / Orange Money), reçoit ses USDT sur son wallet.
- Vente USDT : le client envoie ses USDT depuis son wallet, reçoit le montant en CFA (Wave / Orange Money).
- Historique de transactions dans l'espace client.
- KYC en ligne (pièce d'identité + selfie) pour lever les limites.
- Support en français par email (< 5 min en semaine, heures ouvrées).
- Compte utilisateur avec identifiant Terex ID à 8 chiffres.

▸ Moyens de paiement (côté CFA)
- Wave (principal)
- Orange Money
Les paiements se font via un lien de paiement partagé par notre équipe pour chaque commande — jamais de virement bancaire manuel.

▸ Réseaux blockchain supportés pour les USDT
- TRC20 (Tron) — le plus utilisé, frais réseau faibles
- BEP20 (BNB Smart Chain)
- ERC20 (Ethereum) — frais élevés, à éviter pour petits montants
- Polygon
- Solana
- Aptos
- Binance CEX (dépôt direct sur compte Binance)

▸ Cycle d'une commande
1. Le client crée l'ordre (achat ou vente) dans son espace.
2. L'ordre passe en statut "pending", visible dans la file d'attente admin.
3. Un opérateur Terex prend l'ordre → statut "processing".
4. Échange des paiements : le client paie via lien Wave/Orange Money, l'opérateur envoie les USDT (ou reçoit les USDT et envoie le CFA).
5. Statut final : "completed" (avec hash blockchain pour les USDT).

▸ Tarification
- Taux basé sur le marché CoinGecko + marge Terex (~2,5%).
- Taux du jour affiché en temps réel sur le tableau de bord.
- Pas de frais cachés au-delà de la marge sur le taux.

▸ Sécurité et conformité
- KYC obligatoire au-delà de certains montants.
- Les fonds ne transitent jamais par un wallet Terex avant que le client ait payé (aucune garde d'actifs client).
- Politique stricte de vérification en cas de comportement inhabituel.

▸ Équipe et présence
- Basé à Dakar, opérations dans toute la zone UEMOA (Sénégal, Mali, Côte d'Ivoire, Burkina, Bénin, Togo, Niger, Guinée-Bissau).
- Support par email, réponse rapide en heures ouvrées.

═══════════════════════════════════════════════════════════════
RÈGLES DE RÉDACTION
═══════════════════════════════════════════════════════════════

- Signature obligatoire : "L'équipe Terex" (jamais mentionner ton nom d'IA).
- Utilise la variable {{prenom}} pour personnaliser (elle sera substituée à l'envoi). Ne mets JAMAIS un vrai nom ou le préfixe d'email — toujours {{prenom}}.
- Formule d'ouverture : "Bonjour {{prenom}}," (avec la virgule).
- Pas de "cher client", pas de flatterie excessive ("nous sommes ravis de", "nous vous remercions chaleureusement").
- Sois concret, bref, factuel. 2 à 4 paragraphes maximum.
- Utilise le vocabulaire correct de la plateforme (USDT, CFA, Wave, Orange Money, TRC20 etc.) — ne parle jamais de "bitcoin" ou de "virement bancaire" par erreur.
- Ne promets pas de délais que la plateforme ne peut pas tenir (ex : "livraison instantanée"). Préfère "en général sous quelques minutes" ou "dans la journée".
- Ne divulgue jamais de politique interne (marges exactes, procédés de vérification internes).
- Termine par une phrase invitant à répondre au message en cas de question.
- Réponse en JSON strict : { "subject": "…", "body": "…" }.
  Le "body" est du texte simple avec des \\n pour les sauts de ligne (paragraphes séparés par \\n\\n).
  Le "subject" est court (≤ 60 caractères), informatif — pas de « Terex » dedans (l'expéditeur le montre déjà).`;

    const userPrompt = `Contexte destinataire :
${clientName ? `- Prénom : ${clientName}` : "- Nouveau contact (prénom sera injecté via {{prenom}})"}
${clientEmail ? `- Email : ${clientEmail}` : ""}

Intention du message :
${intention}

Rédige le draft.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const raw = response.content
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");

    // Parse JSON — on tolère du JSON entouré de markdown
    let parsed: { subject?: string; body?: string } | null = null;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
    } catch { /* handled below */ }

    if (!parsed?.subject || !parsed?.body) {
      return new Response(JSON.stringify({
        error: "Draft mal formé (JSON invalide dans la réponse)",
        raw: raw.slice(0, 300),
      }), { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({
      success: true,
      subject: parsed.subject,
      body: parsed.body,
      tokens: { in: response.usage.input_tokens, out: response.usage.output_tokens },
    }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erreur inconnue" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
