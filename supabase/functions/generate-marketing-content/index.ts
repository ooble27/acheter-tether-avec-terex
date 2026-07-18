import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Anthropic from "npm:@anthropic-ai/sdk@0.68.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Libellés lisibles pour la plateforme ciblée.
const PLATFORM_GUIDE: Record<string, string> = {
  facebook: "Facebook — ton chaleureux, 2 à 4 phrases, un emoji ou deux, un appel à l'action clair.",
  instagram: "Instagram — accrocheur, visuel, phrases courtes, emojis pertinents, hashtags à la fin.",
  tiktok: "TikTok — script court et rythmé (accroche + corps + chute), style parlé, dynamique.",
  whatsapp: "Statut WhatsApp — très court (1 à 2 phrases), direct, incitatif, un emoji.",
  twitter: "X / Twitter — percutant, sous 280 caractères, une idée forte, ton assuré.",
};

const TONE_GUIDE: Record<string, string> = {
  educatif: "pédagogique : explique simplement, rassure les débutants en crypto.",
  promo: "promotionnel : met en avant l'offre, crée l'envie et l'urgence sans être agressif.",
  confiance: "axé confiance : rassure sur la sécurité, la rapidité, le sérieux de Terex.",
  proximite: "proche et humain : parle comme à un ami, chaleureux, local (Sénégal / UEMOA).",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "missing_api_key",
          message:
            "La clé ANTHROPIC_API_KEY n'est pas configurée. Ajoute-la dans les secrets Supabase pour activer le générateur.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const platform: string = body.platform || "facebook";
    const tone: string = body.tone || "proximite";
    const topic: string = (body.topic || "").toString().slice(0, 400);
    const count: number = Math.min(Math.max(Number(body.count) || 3, 1), 5);
    const rate: string = (body.rate || "").toString().slice(0, 40);

    const platformGuide = PLATFORM_GUIDE[platform] || PLATFORM_GUIDE.facebook;
    const toneGuide = TONE_GUIDE[tone] || TONE_GUIDE.proximite;

    const system = [
      "Tu es le responsable marketing de Terex (Teranga Exchange), une plateforme fiable d'achat et de vente d'USDT (Tether) en francs CFA, basée au Sénégal et destinée à l'Afrique de l'Ouest (zone UEMOA).",
      "Les clients paient et sont payés via Mobile Money : Wave et Orange Money. Terex est rapide, sûr et humain.",
      "Ton objectif : créer des publications qui donnent CONFIANCE (le frein n°1 du crypto en Afrique de l'Ouest, c'est la peur des arnaques) et donnent envie de passer à l'action.",
      "Écris en français, avec un vocabulaire simple et accessible — beaucoup de clients débutent en crypto.",
      "Reste honnête et concret : pas de promesses de gains, pas de « devenez riche ». Terex est un service d'échange, pas un placement.",
      "N'invente jamais de chiffres, de taux ou de témoignages précis qui ne sont pas fournis.",
    ].join(" ");

    const userPrompt = [
      `Génère ${count} variantes distinctes d'une publication marketing pour Terex.`,
      `Plateforme : ${platformGuide}`,
      `Ton : ${toneGuide}`,
      topic ? `Sujet / angle demandé : ${topic}` : "Sujet libre : présente Terex et invite à acheter/vendre de l'USDT facilement.",
      rate ? `Tu peux mentionner le taux du jour : ${rate}.` : "",
      "",
      "Réponds UNIQUEMENT avec un objet JSON valide, sans texte autour, exactement de cette forme :",
      '{"variants":[{"text":"le texte prêt à publier","hashtags":["mot1","mot2"]}]}',
      "Les hashtags sont de simples mots, sans le caractère #.",
    ].filter(Boolean).join("\n");

    const anthropic = new Anthropic({ apiKey });

    const message = await anthropic.messages.create({
      model: "claude-opus-4-8",
      max_tokens: 2000,
      system,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = (message.content as any[]).find((b) => b.type === "text");
    const raw: string = textBlock?.text || "";
    // Extraction robuste : on isole le premier objet JSON du texte.
    let variants: any[] = [];
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}");
      const json = start >= 0 && end > start ? raw.slice(start, end + 1) : raw;
      variants = JSON.parse(json).variants || [];
    } catch (_) {
      variants = [];
    }

    return new Response(JSON.stringify({ variants }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("generate-marketing-content error:", error);
    const status = error?.status;
    let message = "Une erreur est survenue lors de la génération.";
    if (status === 401) message = "Clé API invalide. Vérifie ta clé ANTHROPIC_API_KEY.";
    else if (status === 429) message = "Limite atteinte ou crédit épuisé. Recharge ton crédit sur console.anthropic.com.";
    return new Response(JSON.stringify({ error: "generation_failed", message }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
