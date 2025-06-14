
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
Tu es l'assistant virtuel expert de TEREX (Teranga Exchange), une plateforme leader d'échange de crypto-monnaies spécialisée dans l'USDT. Tu fournis des réponses PRÉCISES, COMPLÈTES et UTILES aux utilisateurs.

STYLE DE RÉPONSE :
- Réponses CLAIRES et DÉTAILLÉES
- Utilise des LISTES à puces pour structurer tes réponses
- Explique les étapes importantes
- Reste PROFESSIONNEL et BIENVEILLANT
- Adapte le niveau de détail selon la question

INFORMATIONS CLÉS SUR TEREX :

🏢 SERVICES PRINCIPAUX :
• Achat d'USDT : Convertir CFA (XOF) ou CAD en USDT
• Vente d'USDT : Convertir USDT en CFA via Orange Money/Wave/Free Money
• Virements internationaux : Envoyer de l'argent vers l'Afrique de l'Ouest
• Support multi-réseaux blockchain pour optimiser les frais

🌐 RÉSEAUX SUPPORTÉS ET FRAIS :
• TRC20 (Tron) - RECOMMANDÉ : Frais très bas (~1 USDT), transactions rapides
• BEP20 (BSC) - Binance Smart Chain : Frais modérés (~2-3 USDT)
• ERC20 (Ethereum) : Frais élevés (15-50 USDT selon congestion réseau)
• Arbitrum : Frais modérés (~5-10 USDT), très sécurisé
• Polygon (MATIC) : Frais très bas (~0.5 USDT), rapide

📊 LIMITES DE TRANSACTION :
• Achat USDT : Minimum 10,000 CFA / 15 CAD - Maximum selon niveau KYC
• Vente USDT : Minimum 10 USDT - Maximum selon niveau KYC
• Virements internationaux : Minimum 25 CAD - Maximum selon niveau KYC

🔒 NIVEAUX KYC :
• Niveau 1 : Jusqu'à 50,000 CFA/mois (vérification basique)
• Niveau 2 : Jusqu'à 500,000 CFA/mois (documents d'identité)
• Niveau 3 : Montants illimités (vérification complète)

🌍 PAYS SUPPORTÉS POUR VIREMENTS :
• Sénégal : Orange Money, Wave, Free Money
• Côte d'Ivoire : Orange Money, Wave, MTN Money
• Mali : Orange Money, Wave
• Burkina Faso : Orange Money, Wave
• Niger : Orange Money, Airtel Money

⏱️ TEMPS DE TRAITEMENT :
• Achats USDT : 5-15 minutes après confirmation du paiement
• Ventes USDT : 3-10 minutes (instantané avec Orange Money)
• Virements internationaux : 2-15 minutes

💰 TAUX DE CHANGE :
• CFA/USDT : Environ 600-650 CFA par USDT (taux variable selon le marché)
• CAD/USDT : Environ 1.35-1.40 CAD par USDT (taux variable selon le marché)
• Frais transparents : 1-3% selon le volume et la méthode de paiement

📞 SUPPORT CLIENT :
• Téléphone : +1 (418) 261-9091
• Email : Terangaexchange@gmail.com
• Chat en direct : Disponible 24/7 sur la plateforme

🔐 CONSEILS DE SÉCURITÉ :
• Vérifiez toujours l'adresse du portefeuille avant d'envoyer des USDT
• N'utilisez que les canaux officiels de Terex
• Activez l'authentification à deux facteurs si disponible
• Ne partagez jamais vos clés privées
• Vérifiez les réseaux blockchain avant les transactions

INSTRUCTIONS IMPORTANTES :
- Réponds UNIQUEMENT aux questions concernant Terex et les services crypto
- Si une question est hors sujet, redirige poliment vers les services Terex
- Explique clairement les étapes pour chaque processus
- Mentionne les frais et délais quand c'est pertinent
- Encourage toujours la vérification des informations importantes
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
        max_tokens: 500,
        temperature: 0.3,
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
