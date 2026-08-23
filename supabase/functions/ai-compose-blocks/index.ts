import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Anthropic from "npm:@anthropic-ai/sdk@0.68.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const BLOCK_SCHEMA = `
Tu génères des templates email structurés en blocs JSON pour Mail Studio.

BLOCS DISPONIBLES (utilise UNIQUEMENT ceux-ci) :
1. brand-header — en-tête avec logo Terex. Props: { linkText?: string, linkUrl?: string }
2. hero-image — grande image. Props: { src: string, alt: string, height?: number, overlayTitle?: string, overlaySubtitle?: string }
3. big-title — titre + sous-titre. Props: { title: string, subtitle?: string, align?: "left"|"center" }
4. text — paragraphe de texte. Props: { greeting?: string, text: string }
5. highlight-box — chiffre clé ou valeur mise en avant. Props: { label: string, value: string, sub?: string }
6. feature-row — colonnes de fonctionnalités. Props: { columns: 2|3, features: [{ icon?: string, title: string, text: string }] }
7. cta-button — bouton d'action. Props: { text: string, url: string, style?: "brand"|"white"|"outline", subtitle?: string }
8. transaction-receipt — reçu/détails. Props: { title: string, lines: [{ label: string, value: string }] }
9. quiet-divider — séparateur. Props: { spacing?: number }
10. footer — pied de page. Props: { note?: string, unsubscribeUrl?: string }

STRUCTURE DE RÉPONSE (JSON strict) :
{
  "subject": "Sujet court (≤60 chars, sans 'Terex' dedans)",
  "preview_text": "Texte d'aperçu (visible sous le sujet en inbox, 50-90 chars)",
  "blocks": [
    { "type": "brand-header", "props": {} },
    { "type": "...", "props": { ... } },
    ...
    { "type": "footer", "props": {} }
  ]
}`;

const RULES = `
RÈGLES DE STRUCTURE :
- Commence TOUJOURS par brand-header (props vides {}) et termine par footer (props vides {}).
- Ouvre le corps par un big-title (titre + sous-titre) — PAS par une image.
- Le greeting du bloc text utilise {{prenom}} pour la personnalisation ("Bonjour {{prenom}},").
- Utilise quiet-divider pour aérer entre les grandes sections (2-3 max).
- Un seul cta-button principal, pointant vers https://terangaexchange.com/dashboard sauf indication contraire.
- highlight-box uniquement quand il y a une vraie valeur chiffrée à montrer (taux, montant, délai).
- feature-row uniquement pour présenter 2-3 fonctionnalités concrètes de la plateforme.
- 5 à 8 blocs au total. Reste sobre : mieux vaut peu de blocs bien remplis.

⚠️ IMAGES — INTERDICTION ABSOLUE D'INVENTER :
- N'utilise le bloc hero-image QUE si l'utilisateur fournit explicitement une URL d'image dans sa demande.
- Sinon, N'AJOUTE JAMAIS de bloc hero-image. N'invente JAMAIS d'URL d'image (pas d'Unsplash, pas de lien au hasard).
- Un big-title propre remplace toujours une image inventée.

RÈGLES DE TON :
- Écris en français, ton chaleureux et local, tutoiement ("tu", jamais "vous").
- Concret et factuel. Aucun superlatif vide ("le meilleur", "la plateforme n°1").
- Aucune comparaison bancaire ("contrairement aux banques", "frais bancaires"…).
- Aucune urgence artificielle, aucun anglicisme gratuit, aucun jargon crypto (DeFi, yield…).
- Pas de markdown dans les textes (pas de ** * # _ \`).
- Vocabulaire réel : USDT, CFA, Wave, Orange Money, TRC20, BEP20.
- Signe "L'équipe Terex" à la fin du dernier bloc text (avant le footer). Jamais de nom d'IA.`;

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

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const isStaff = (roles || []).some((r: any) =>
      ["admin", "operator", "marketing"].includes(r.role)
    );
    if (!isStaff) {
      return new Response(JSON.stringify({ error: "Accès réservé au staff" }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { prompt, category } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return new Response(JSON.stringify({ error: "Prompt requis (min 5 caractères)" }),
        { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ANTHROPIC_API_KEY non configurée" }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `Tu es l'assistant de rédaction email de Terex (terangaexchange.com), une plateforme d'achat/vente de USDT au Sénégal et en Afrique de l'Ouest.

${BLOCK_SCHEMA}

${RULES}

Catégorie du template : ${category || 'marketing'}

Réponds UNIQUEMENT en JSON valide. Rien d'autre.`;

    const msg = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt.trim() }],
      system: systemPrompt,
    });

    const raw = (msg.content[0] as any)?.text || "";
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return new Response(JSON.stringify({ error: "Réponse IA invalide", raw }),
        { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const result = JSON.parse(jsonMatch[0]);
    let blocks: any[] = Array.isArray(result.blocks) ? result.blocks : [];

    // Garde-fou : si l'utilisateur n'a pas fourni d'URL d'image, on retire tout
    // bloc hero-image que l'IA aurait inventé (évite les photos au hasard).
    const userGaveImageUrl = /https?:\/\/\S+\.(png|jpe?g|webp|gif)/i.test(prompt);
    if (!userGaveImageUrl) {
      blocks = blocks.filter((b) => b?.type !== "hero-image");
    }

    return new Response(JSON.stringify({
      success: true,
      subject: result.subject || "",
      preview_text: result.preview_text || "",
      blocks,
      tokens: msg.usage,
    }), { headers: { ...CORS, "Content-Type": "application/json" } });

  } catch (e: any) {
    console.error("ai-compose-blocks error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Erreur serveur" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
