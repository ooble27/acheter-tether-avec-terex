import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import Anthropic from "npm:@anthropic-ai/sdk@0.68.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const RULES = `
═══════════════════════════════════════════════════════════════
RÈGLES DE RÉDACTION
═══════════════════════════════════════════════════════════════

⚠️ FORMATAGE — TEXTE BRUT UNIQUEMENT :
- N'utilise JAMAIS de markdown : pas de ** (gras), pas de * (italique), pas de # (titres), pas de _ (soulignement), pas de \` (code).
- N'utilise JAMAIS de listes à puces (pas de tirets -, pas de •, pas de numéros avec points 1.).
- Écris en paragraphes naturels séparés par des sauts de ligne. Comme un vrai email humain.
- Pas de mise en forme spéciale, pas d'émojis excessifs (1 ou 2 max dans tout le message si pertinent).

⚠️ CONTENU — NE JAMAIS INVENTER :
- Tu ne peux parler QUE de ce qui est décrit dans la CONNAISSANCE PLATEFORME ci-dessus.
- Si une fonctionnalité, une page, un bouton ou un processus n'y apparaît pas, C'EST QU'IL N'EXISTE PAS.
- Ne l'invente pas, ne le mentionne pas, ne le suggère pas.
- Si l'intention mentionne quelque chose qui n'est pas listé, ignore ce point ou dis que l'équipe peut aider.

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

const BRAND_VOICE_FALLBACK = `
═══════════════════════════════════════════════════════════════
VOIX DE MARQUE TEREX — GARDE-FOUS
═══════════════════════════════════════════════════════════════

🚫 INTERDITS ABSOLUS :
- AUCUNE comparaison bancaire. Jamais « contrairement aux banques classiques », jamais « là où ta banque met 5 jours », jamais « les frais bancaires ». Terex se raconte pour ce qu'elle est, pas contre ce qu'elle n'est pas.
- AUCUNE promesse de rendement ou d'investissement. Terex est un service d'achat/vente, pas une plateforme d'investissement.
- AUCUN superlatif vide : pas de « le meilleur service », « la plateforme la plus fiable », « n°1 en Afrique ». Si on ne peut pas prouver le chiffre, on ne l'écrit pas.
- AUCUN anglicisme gratuit : pas de « amazing », « game-changer », « next-gen ». On parle français naturel, avec les mots techniques qui existent (USDT, TRC20, wallet).
- AUCUNE urgence artificielle : pas de « offre limitée ! », « dernière chance ! », « agis maintenant ! ». On informe, on ne presse pas.
- AUCUN jargon crypto intimidant : pas de « DeFi », « yield farming », « liquidity pool ». Le lecteur veut acheter ou vendre des USDT, c'est tout.

✅ IMPÉRATIFS :
- Ton local et chaleureux. On tutoie. On dit « tu » pas « vous ». Sauf contexte professionnel explicite.
- Vocabulaire du quotidien sénégalais/UEMOA : Wave, Orange Money, CFA, « en quelques minutes ». Pas de « mobile payment solution ».
- Concret et factuel : montants réels, étapes réelles, réseaux réels (TRC20, BEP20, etc.).
- Bienveillant mais jamais condescendant. On n'explique pas « ce qu'est un stablecoin » sauf si le lecteur le demande.
- On signe « L'équipe Terex ». Jamais de nom personnel, jamais de « votre agent IA ».
- Le lien principal est toujours terangaexchange.com — jamais un lien raccourci, jamais un domaine tiers.
- On termine par une invitation à répondre en cas de question, jamais par une formule vide (« cordialement »).
`;

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

    // Charger la connaissance plateforme et la voix de marque depuis ai_config.
    let knowledgeBase = "";
    let brandVoice = "";
    try {
      const { data: configs } = await admin
        .from("ai_config")
        .select("key, value")
        .in("key", ["platform_knowledge", "brand_voice"]);
      for (const c of configs ?? []) {
        if (c.key === "platform_knowledge" && c.value) knowledgeBase = c.value;
        if (c.key === "brand_voice" && c.value) brandVoice = c.value;
      }
    } catch { /* table doesn't exist yet — use fallback */ }

    if (!knowledgeBase) knowledgeBase = FALLBACK_KNOWLEDGE;
    if (!brandVoice) brandVoice = BRAND_VOICE_FALLBACK;

    const anthropic = new Anthropic({ apiKey });

    const systemPrompt = `Tu es un agent IA du service client pour Terex. Tu connais TOUTE la plateforme dans le moindre détail. Tu écris des emails clients : chaleureux mais professionnels, en français, ton direct sans jargon. Tu écris comme un humain — pas de formatage markdown, pas de listes, du texte naturel.

═══════════════════════════════════════════════════════════════
CONNAISSANCE PLATEFORME TEREX
═══════════════════════════════════════════════════════════════

${knowledgeBase}

${brandVoice}

${RULES}`;

    const userPrompt = `Contexte destinataire :
${clientName ? `- Prénom : ${clientName}` : "- Nouveau contact (prénom sera injecté via {{prenom}})"}
${clientEmail ? `- Email : ${clientEmail}` : ""}

Intention du message :
${intention}

Rédige le draft. RAPPEL : texte brut uniquement, pas de markdown, pas de listes à puces, pas d'étoiles, pas de tirets. Écris comme un email humain naturel.`;

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

    // Nettoyage post-traitement : supprimer tout markdown résiduel du body
    let cleanBody = parsed.body;
    cleanBody = cleanBody.replace(/\*\*(.*?)\*\*/g, "$1"); // **gras** → gras
    cleanBody = cleanBody.replace(/\*(.*?)\*/g, "$1");     // *italique* → italique
    cleanBody = cleanBody.replace(/__(.*?)__/g, "$1");     // __soulignement__
    cleanBody = cleanBody.replace(/_(.*?)_/g, "$1");       // _italique_
    cleanBody = cleanBody.replace(/^#{1,6}\s+/gm, "");    // # titres
    cleanBody = cleanBody.replace(/^[-•]\s+/gm, "");      // - ou • listes à puces
    cleanBody = cleanBody.replace(/^\d+\.\s+/gm, "");     // 1. listes numérotées
    cleanBody = cleanBody.replace(/`(.*?)`/g, "$1");       // `code`

    return new Response(JSON.stringify({
      success: true,
      subject: parsed.subject,
      body: cleanBody,
      tokens: { in: response.usage.input_tokens, out: response.usage.output_tokens },
    }), { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erreur inconnue" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});

// Connaissance par défaut — utilisée si la table ai_config n'existe pas encore.
// Une fois la table créée, cette valeur n'est plus lue.
const FALLBACK_KNOWLEDGE = `Terex (terangaexchange.com) permet à des particuliers d'Afrique de l'Ouest d'acheter et vendre des USDT (stablecoin adossé au dollar US) contre des francs CFA (XOF), rapidement et sans passer par un exchange étranger complexe. Aussi disponible en application PWA installable sur téléphone.

INSCRIPTION ET CONNEXION
Inscription par email + mot de passe (champs : email, mot de passe, nom complet, code de parrainage optionnel). Connexion par email/mot de passe ou via Google (OAuth). Mot de passe oublié : envoi d'un email de réinitialisation. Vérification d'email obligatoire après inscription.

TABLEAU DE BORD (après connexion)
Le client voit : message d'accueil personnalisé avec son prénom, carte du taux USDT/CFA du jour en temps réel, deux boutons d'action rapide "Acheter" et "Vendre", logos des 6 réseaux blockchain supportés, ses 3 dernières transactions avec bouton "Répéter", barre de navigation en bas (Accueil, Acheter, Vendre), bouton profil en haut à droite.

ACHAT USDT — étapes exactes
Étape 1 Montant : le client entre le montant en CFA ou en USDT (conversion en temps réel). Limites : min 20 000 CFA, max 2 000 000 CFA.
Étape 2 Réseau : choix du réseau blockchain (TRC20, BEP20, ERC20, Polygon, Solana, Aptos, ou Binance Pay).
Étape 3 Adresse wallet : le client entre son adresse de réception ou utilise son Carnet d'adresses. Pour Binance : email Binance, nom d'utilisateur et ID Binance.
Étape 4 Confirmation : résumé de la commande. Vérification KYC obligatoire.
Étape 5 Paiement : redirection vers Wave ou Orange Money (via lien de paiement). Jamais de virement bancaire.
Étape 6 En attente : confirmation que le paiement est en cours de traitement.

VENTE USDT — étapes exactes
Étape 1 Montant : le client entre le montant en USDT ou en CFA (minimum 50 USDT).
Étape 2 Réseau : choix du réseau pour envoyer les USDT (TRC20, BEP20, ERC20, Solana, Aptos, ou Binance Pay).
Étape 3 Numéro mobile : le client entre son numéro Wave ou Orange Money ou utilise son Répertoire téléphonique.
Étape 4 Confirmation : résumé de la commande. Vérification KYC obligatoire.
Étape 5 Instructions d'envoi : affichage de l'adresse wallet Terex + QR code. Le client envoie ses USDT puis clique "J'ai envoyé les USDT".

MOYENS DE PAIEMENT (côté CFA) : Wave (principal), Orange Money. Paiement via lien généré automatiquement pour chaque commande.

RÉSEAUX BLOCKCHAIN : TRC20 (Tron), BEP20 (BNB Smart Chain), ERC20 (Ethereum), Polygon, Solana, Aptos, Binance Pay.

CARNET D'ADRESSES ET RÉPERTOIRE : le client peut sauvegarder des adresses wallet (dans le flux achat) et des numéros mobile (dans le flux vente) avec un label. Accessible uniquement depuis les flux achat/vente, pas de page séparée.

CYCLE D'UNE COMMANDE : En attente → En traitement → Terminée (ou Annulée/Échouée).

HISTORIQUE DE TRANSACTIONS : liste complète avec détails (type, montants, statut, date), reçu PDF téléchargeable, bouton "Répéter".

PROFIL UTILISATEUR — sections exactes : Informations personnelles (nom, email non modifiable, téléphone, pays, langue), Activité (stats transactions), Parrainage (code TEREX-XXXXXXXX, 5% parrain / 3% filleul), Partager l'application, FAQ, Contact, Déconnexion. PAS de page Paramètres, Mes coordonnées, Notifications, Portefeuille, Solde, Carte.

KYC : prénom, nom, date de naissance, nationalité, téléphone, pays, adresse, ville, document d'identité (CNI/Passeport/Permis) recto-verso, selfie, justificatif de domicile. Statuts : Non vérifié / Soumis / Approuvé / Rejeté.

TARIFICATION : taux CoinGecko + marge Terex (~2,5%), affiché en temps réel, pas de frais cachés.

SUPPORT : email terangaexchange@gmail.com, WhatsApp +1 418 261-9091, téléphone +1 418 261-9091.

ÉQUIPE : basé à Dakar, opérations zone UEMOA (Sénégal, Mali, Côte d'Ivoire, Burkina, Bénin, Togo, Niger, Guinée-Bissau) + Canada.

FONCTIONNALITÉS QUI N'EXISTENT PAS (ne jamais mentionner) : page Paramètres, Mes coordonnées, notifications push, alertes, programme de fidélité, points, carte de débit, carte virtuelle, portefeuille intégré, solde USDT dans l'app, trading/exchange intégré, staking, earn, enregistrement de coordonnées bancaires, virement bancaire comme moyen de paiement, transferts internationaux (pas encore actif), chat en direct.`;
