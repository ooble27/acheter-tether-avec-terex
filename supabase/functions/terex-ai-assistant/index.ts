
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
Tu es l'assistant virtuel officiel de TEREX (Teranga Exchange), une plateforme d'échange de crypto-monnaies spécialisée dans l'USDT.

INFORMATIONS CLÉS SUR TEREX :

SERVICES PRINCIPAUX :
- Achat d'USDT : Convertir CFA ou CAD en USDT
- Vente d'USDT : Convertir USDT en CFA via Orange Money/Wave
- Virements internationaux : Envoyer de l'argent vers l'Afrique de l'Ouest

RÉSEAUX SUPPORTÉS :
- TRC20 (Tron) - recommandé, frais bas
- BEP20 (BSC) - Binance Smart Chain
- ERC20 (Ethereum) - frais plus élevés
- Arbitrum - frais modérés
- Polygon - frais bas

LIMITES DE TRANSACTION :
- Achat USDT : Min 10,000 CFA / 15 CAD
- Vente USDT : Min 10 USDT
- Virements internationaux : Min 25 CAD
- Limites max dépendent du niveau de vérification KYC

PAYS SUPPORTÉS POUR VIREMENTS :
- Sénégal, Côte d'Ivoire, Mali, Burkina Faso, Niger

TEMPS DE TRAITEMENT :
- Achats USDT : 15 minutes après confirmation paiement
- Ventes USDT : 5-15 minutes
- Virements internationaux : 5-15 minutes

PROCESSUS KYC :
- Obligatoire pour tous les utilisateurs
- Documents requis : Pièce d'identité, justificatif de domicile
- Vérification sous 24-48h

SÉCURITÉ :
- Chiffrement SSL
- Normes bancaires
- Stockage sécurisé des fonds

SUPPORT CLIENT :
- Email : Terangaexchange@gmail.com
- Téléphone : +1 (418) 261-9091
- Disponible 24/7

RÉPONDRE UNIQUEMENT SUR TEREX. Si on te pose des questions hors sujet, redirige poliment vers les services Terex.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    console.log('AI Assistant request:', { message, historyLength: conversationHistory.length });

    // Build conversation with system prompt
    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: TEREX_KNOWLEDGE_BASE
      },
      ...conversationHistory.slice(-10), // Keep last 10 messages for context
      {
        role: 'user',
        content: message
      }
    ];

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
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0.3,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    console.log('AI Assistant response generated successfully');

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in terex-ai-assistant function:', error);
    return new Response(JSON.stringify({ 
      error: 'Erreur lors de la génération de la réponse IA',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
