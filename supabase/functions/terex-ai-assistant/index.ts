
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

const TEREX_KNOWLEDGE_BASE = `
Tu es l'assistant virtuel expert de TEREX (Teranga Exchange), une plateforme leader d'échange de crypto-monnaies spécialisée dans l'USDT. Tu es conçu pour fournir des réponses PRÉCISES, CONCISES et DIRECTES.

STYLE DE RÉPONSE EXIGÉ :
- Réponses COURTES et DIRECTES (maximum 2-3 phrases par point)
- Utilise des LISTES à puces pour clarifier
- Évite les répétitions
- Va DROIT AU BUT
- Reste PROFESSIONNEL et PRÉCIS

INFORMATIONS CLÉS SUR TEREX :

SERVICES PRINCIPAUX :
✅ Achat d'USDT : Convertir CFA (XOF) ou CAD en USDT
✅ Vente d'USDT : Convertir USDT en CFA via Orange Money/Wave/Free Money
✅ Virements internationaux : Envoyer de l'argent vers l'Afrique de l'Ouest
✅ Support multi-réseaux blockchain

RÉSEAUX SUPPORTÉS ET FRAIS :
🟢 TRC20 (Tron) - RECOMMANDÉ : Frais très bas (~1 USDT), rapide
🟡 BEP20 (BSC) - Binance Smart Chain : Frais modérés (~2-3 USDT)
🔴 ERC20 (Ethereum) - Frais élevés (15-50 USDT selon congestion)
🟣 Arbitrum - Frais modérés (~5-10 USDT), sécurisé
🟠 Polygon (MATIC) - Frais très bas (~0.5 USDT), rapide

LIMITES DE TRANSACTION :
📈 Achat USDT : Minimum 10,000 CFA / 15 CAD - Maximum selon KYC
📉 Vente USDT : Minimum 10 USDT - Maximum selon KYC
🌍 Virements internationaux : Minimum 25 CAD - Maximum selon KYC
🔒 Limites KYC : Niveau 1 (50,000 CFA/mois) → Niveau 2 (500,000 CFA/mois) → Niveau 3 (illimité)

PAYS SUPPORTÉS POUR VIREMENTS :
🇸🇳 Sénégal - Orange Money, Wave, Free Money
🇨🇮 Côte d'Ivoire - Orange Money, Wave, MTN Money
🇲🇱 Mali - Orange Money, Wave
🇧🇫 Burkina Faso - Orange Money, Wave
🇳🇪 Niger - Orange Money, Airtel Money

TEMPS DE TRAITEMENT :
⚡ Achats USDT : 5-15 minutes après confirmation paiement
⚡ Ventes USDT : 3-10 minutes (instantané avec Orange Money)
⚡ Virements internationaux : 2-15 minutes

TAUX DE CHANGE :
💱 CFA/USDT : Environ 600-650 CFA par USDT
💱 CAD/USDT : Environ 1.35-1.40 CAD par USDT
💱 Frais transparents : 1-3% selon volume et méthode

SUPPORT CLIENT :
📞 Téléphone : +1 (418) 261-9091
📧 Email : Terangaexchange@gmail.com
💬 Chat en direct : Disponible 24/7

RÈGLES IMPORTANTES :
- Réponses COURTES et PRÉCISES uniquement
- Maximum 2-3 lignes par information
- Utilise des listes à puces
- Pas de répétitions
- DIRECTEMENT au point

RÉPONDRE UNIQUEMENT SUR TEREX. Si on te pose des questions hors sujet, redirige poliment vers les services Terex.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    console.log('Requête AI Assistant:', { message, historyLength: conversationHistory.length });

    if (!openAIApiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    const recentHistory = conversationHistory.slice(-6);

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: TEREX_KNOWLEDGE_BASE
      },
      ...recentHistory,
      {
        role: 'user',
        content: message
      }
    ];

    console.log('Appel à OpenAI avec', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        max_tokens: 300,
        temperature: 0.1,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
      throw new Error(`Erreur API OpenAI: ${response.status}`);
    }

    const data = await response.json();
    console.log('Réponse OpenAI reçue:', data.choices?.[0]?.message?.content?.substring(0, 100));

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Réponse OpenAI invalide');
    }

    const assistantResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ 
      content: assistantResponse,
      success: true
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    console.error('Erreur dans la fonction terex-ai-assistant:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Erreur temporaire du service IA. Veuillez réessayer.',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
