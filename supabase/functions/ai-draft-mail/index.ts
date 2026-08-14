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

    const systemPrompt = `Tu es un rédacteur pour Terex, une plateforme d'échange USDT/CFA en Afrique de l'Ouest.
Tu écris des emails clients : chaleureux mais professionnels, en français, ton direct sans jargon.

Règles :
- Signature : "L'équipe Terex" (jamais mentionner ton nom).
- Utilise la variable {{prenom}} pour personnaliser (elle sera substituée à l'envoi).
- Pas de "cher client" — utilise "Bonjour {{prenom}}".
- Pas de flatterie excessive, pas de "nous sommes ravis de".
- Sois concret et bref. 2 à 4 paragraphes maximum.
- Termine par une phrase invitant à répondre au message en cas de question.
- Réponse en JSON strict : { "subject": "…", "body": "…" }.
  Le "body" est du texte simple avec des \\n pour les sauts de ligne (paragraphes séparés par \\n\\n).
  Le "subject" est court (≤ 60 caractères) et informatif — pas de « Terex » dedans (l'expéditeur le montre déjà).`;

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
