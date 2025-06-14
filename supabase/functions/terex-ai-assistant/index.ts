
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
- Réponses COURTES et DIRECTES (maximum 3-4 phrases par point)
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    console.log('AI Assistant request (streaming):', { message, historyLength: conversationHistory.length });

    // Garder les 10 derniers messages pour le contexte
    const recentHistory = conversationHistory.slice(-10);

    // Build conversation with enhanced system prompt
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

    // Appel à l'API OpenAI avec streaming activé
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages,
        max_tokens: 800, // Réduit pour des réponses plus concises
        temperature: 0.2, // Plus bas pour plus de précision
        top_p: 0.9,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
        stream: true, // Activation du streaming
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorData}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Configuration pour le streaming
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          let buffer = '';
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              controller.close();
              break;
            }

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim() === '') continue;
              if (line.trim() === 'data: [DONE]') continue;
              
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  const content = data.choices?.[0]?.delta?.content;
                  
                  if (content) {
                    const chunk = encoder.encode(`data: ${JSON.stringify({ content })}\n\n`);
                    controller.enqueue(chunk);
                  }
                } catch (e) {
                  console.error('Error parsing SSE data:', e);
                }
              }
            }
          }
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error in terex-ai-assistant function:', error);
    
    const errorMessage = error.message.includes('OpenAI API error') 
      ? 'Erreur temporaire du service IA. Veuillez réessayer.'
      : 'Erreur lors de la génération de la réponse IA.';
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false,
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
