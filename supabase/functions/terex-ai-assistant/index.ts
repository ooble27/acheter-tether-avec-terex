
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
Tu es l'assistant virtuel expert de TEREX (Teranga Exchange), une plateforme leader d'échange de crypto-monnaies spécialisée dans l'USDT. Tu es conçu pour fournir des réponses précises, détaillées et personnalisées.

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

TEMPS DE TRAITEMENT OPTIMISÉS :
⚡ Achats USDT : 5-15 minutes après confirmation paiement
⚡ Ventes USDT : 3-10 minutes (instantané avec Orange Money)
⚡ Virements internationaux : 2-15 minutes
⚡ Vérification KYC : 12-24h (accéléré pour dossiers complets)

PROCESSUS KYC DÉTAILLÉ :
📋 Niveau 1 : Pièce d'identité + selfie (limite 50k CFA/mois)
📋 Niveau 2 : + justificatif domicile (limite 500k CFA/mois)
📋 Niveau 3 : + justificatif revenus (illimité)
✅ Vérification : 12-24h pour dossiers complets
❌ Rejet : Documents illisibles, informations incohérentes

TAUX DE CHANGE :
💱 Taux compétitifs mis à jour en temps réel
💱 CFA/USDT : Environ 600-650 CFA par USDT
💱 CAD/USDT : Environ 1.35-1.40 CAD par USDT
💱 Frais transparents : 1-3% selon volume et méthode

SÉCURITÉ RENFORCÉE :
🔐 Chiffrement SSL/TLS 256-bit
🔐 Authentification 2FA obligatoire
🔐 Cold storage pour 95% des fonds
🔐 Surveillance 24/7 anti-fraude
🔐 Assurance sur les fonds clients

SUPPORT CLIENT PREMIUM :
📞 Téléphone : +1 (418) 261-9091
📧 Email : Terangaexchange@gmail.com
💬 Chat en direct : Disponible 24/7
🕐 Temps de réponse : Moins de 2h en moyenne

CONSEILS PRATIQUES :
💡 Utilisez TRC20 pour minimiser les frais
💡 Vérifiez toujours l'adresse de réception
💡 Complétez votre KYC pour des limites plus élevées
💡 Surveillez les taux en temps réel avant vos transactions
💡 Gardez vos clés privées sécurisées

Tu dois TOUJOURS :
- Être précis et détaillé dans tes réponses
- Proposer des solutions concrètes
- Expliquer les avantages/inconvénients
- Guider étape par étape
- Être proactif en suggérant des optimisations

RÉPONDRE UNIQUEMENT SUR TEREX. Si on te pose des questions hors sujet, redirige poliment vers les services Terex en expliquant comment ils peuvent t'aider.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] }: ChatRequest = await req.json();

    console.log('AI Assistant request:', { message, historyLength: conversationHistory.length });

    // Amélioration de la gestion de l'historique : garder les 15 derniers messages pour plus de contexte
    const recentHistory = conversationHistory.slice(-15);

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

    // Appel à l'API OpenAI avec GPT-4 et paramètres optimisés
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4', // Changement vers GPT-4 pour de meilleures performances
        messages,
        max_tokens: 1000, // Augmenté pour des réponses plus complètes
        temperature: 0.3, // Réduit pour plus de cohérence et précision
        top_p: 0.9, // Maintenu pour un bon équilibre créativité/précision
        presence_penalty: 0.2, // Réduit pour éviter la répétition excessive
        frequency_penalty: 0.1, // Réduit pour plus de fluidité
        stream: false, // Désactivé pour l'instant, peut être activé plus tard
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorData}`);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response structure:', data);
      throw new Error('Invalid response from OpenAI API');
    }

    const assistantMessage = data.choices[0].message.content;

    console.log('AI Assistant response generated successfully', {
      model: 'gpt-4',
      tokens_used: data.usage?.total_tokens || 'unknown',
      response_length: assistantMessage.length
    });

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true,
      metadata: {
        model: 'gpt-4',
        tokens_used: data.usage?.total_tokens,
        conversation_length: messages.length
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in terex-ai-assistant function:', error);
    
    // Message d'erreur plus informatif
    const errorMessage = error.message.includes('OpenAI API error') 
      ? 'Erreur temporaire du service IA. Veuillez réessayer dans quelques instants.'
      : 'Erreur lors de la génération de la réponse IA. Notre équipe technique a été notifiée.';
    
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
