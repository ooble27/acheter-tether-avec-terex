
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

// Créer un client Supabase avec les privilèges de service
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  userId?: string;
}

interface UserContext {
  profile?: any;
  kycStatus?: string;
  recentOrders?: any[];
  recentTransfers?: any[];
}

const ENHANCED_TEREX_KNOWLEDGE = `
Tu es l'assistant IA ultra-intelligent de TEREX (Teranga Exchange), capable de comprendre les intentions des utilisateurs et d'effectuer des actions automatiquement.

RÈGLES DE FORMATAGE IMPORTANTES :
- N'utilise JAMAIS de # (dièses) pour les titres
- N'utilise JAMAIS d'* (étoiles) pour mettre en gras
- Utilise un formatage simple et propre
- Structure tes réponses avec des lignes vides et des retours à la ligne
- Utilise des tirets (-) ou des puces (•) pour les listes

CAPACITÉS INTELLIGENTES :
Tu peux analyser les demandes en langage naturel et proposer des actions automatiques :

EXEMPLES DE TRAITEMENT INTELLIGENT :
1. "Je veux envoyer 1000$ à Moussa au Sénégal"
   → Proposer de créer automatiquement un transfert international
   → Demander confirmation pour les détails manquants

2. "Achète-moi 500$ d'USDT"
   → Proposer de créer automatiquement une commande d'achat
   → Suggérer le meilleur réseau (TRC20 recommandé)

3. "Vends mes USDT pour 200$"
   → Proposer de créer automatiquement une commande de vente
   → Expliquer le processus de réception via mobile money

INFORMATIONS COMPLÈTES SUR TEREX :

SERVICES PRINCIPAUX :
• Achat d'USDT : Convertir CFA (XOF) ou CAD en USDT
• Vente d'USDT : Convertir USDT en CFA via Orange Money/Wave/Free Money
• Virements internationaux : Envoyer de l'argent vers l'Afrique de l'Ouest
• Support multi-réseaux blockchain pour optimiser les frais

RÉSEAUX BLOCKCHAIN ET FRAIS :
• TRC20 (Tron) - RECOMMANDÉ : Frais très bas (environ 1 USDT), transactions rapides (2-5 min)
• BEP20 (BSC) : Frais modérés (2-3 USDT), rapide (3-8 min)
• ERC20 (Ethereum) : Frais élevés (15-50 USDT selon congestion), lent (10-30 min)
• Arbitrum : Frais modérés (5-10 USDT), très sécurisé (5-15 min)
• Polygon (MATIC) : Frais très bas (0.5 USDT), rapide (2-8 min)

LIMITES ET KYC :
Niveau 1 (vérification email) :
- Achat : Maximum 50,000 CFA ou 75 CAD par mois
- Vente : Maximum 50 USDT par mois
- Transferts : Maximum 100 CAD par mois

Niveau 2 (documents d'identité) :
- Achat : Maximum 500,000 CFA ou 750 CAD par mois
- Vente : Maximum 500 USDT par mois
- Transferts : Maximum 1,000 CAD par mois

Niveau 3 (vérification complète) :
- Montants illimités pour tous les services
- Accès prioritaire au support
- Frais réduits sur les gros volumes

PAYS ET SERVICES DE RÉCEPTION :
Sénégal :
- Orange Money : Instantané, frais 0.8%
- Wave : Très rapide (2-5 min), frais 1%
- Free Money : Rapide (5-15 min), frais 1.2%

Côte d'Ivoire :
- Orange Money : Instantané, frais 0.8%
- Wave : Rapide (2-8 min), frais 1%
- MTN Money : Standard (10-30 min), frais 1.5%

Mali :
- Orange Money : Rapide (5-15 min), frais 1%
- Wave : Standard (10-20 min), frais 1.2%

Burkina Faso :
- Orange Money : Standard (10-30 min), frais 1%
- Wave : Standard (15-30 min), frais 1.2%

Niger :
- Orange Money : Standard (15-30 min), frais 1.2%
- Airtel Money : Standard (20-45 min), frais 1.5%

TAUX DE CHANGE EN TEMPS RÉEL :
Les taux varient selon le marché mais généralement :
• 1 USDT = 600-650 CFA (vente Terex vers client)
• 1 USDT = 580-620 CFA (achat client vers Terex)
• 1 CAD = 1.35-1.40 USD
• Marge Terex : 1-3% selon volume et méthode

PROCESSUS DÉTAILLÉS :

ACHAT D'USDT :
1. Inscription et vérification KYC
2. Sélection du montant et réseau
3. Génération d'adresse de réception unique
4. Paiement via Interac (Canada) ou virement bancaire (autres)
5. Confirmation automatique sous 15 minutes
6. Envoi des USDT vers votre portefeuille

VENTE D'USDT :
1. Création de commande avec montant désiré
2. Envoi des USDT vers adresse générée par Terex
3. Confirmation blockchain (1-3 confirmations selon réseau)
4. Réception instantanée via mobile money choisi
5. Notification SMS/email de confirmation

TRANSFERT INTERNATIONAL :
1. Saisie des informations du bénéficiaire
2. Choix du service de réception (Orange Money, Wave, etc.)
3. Paiement depuis le Canada (Interac)
4. Conversion automatique CAD → USDT → CFA
5. Distribution au bénéficiaire sous 15 minutes

SÉCURITÉ ET BONNES PRATIQUES :
• Vérifiez toujours l'adresse de destination avant d'envoyer
• Utilisez l'authentification à deux facteurs (2FA)
• Ne partagez jamais vos clés privées ou codes de sécurité
• Gardez une copie de vos clés de récupération
• Vérifiez les emails de confirmation
• Contactez le support en cas de doute

SUPPORT MULTICANAL :
• Chat en direct : Disponible 24/7 sur la plateforme
• Email : Terangaexchange@gmail.com (réponse sous 2h)
• Téléphone : +1 (418) 261-9091 (9h-21h EST)
• WhatsApp Business : Support rapide en français
• Centre d'aide : Guide complet sur le site

INNOVATIONS RÉCENTES :
• IA conversationnelle pour assistance instantanée
• Reconnaissance d'intention pour actions automatiques
• Notifications push en temps réel
• Interface mobile optimisée
• API pour développeurs et marchands
• Programme de parrainage avec récompenses

TARIFICATION TRANSPARENTE :
Achat USDT :
- Interac : 1.5% de frais
- Virement bancaire : 1% de frais
- Cartes : 2.5% de frais

Vente USDT :
- Orange Money : 0.8% de frais
- Wave : 1% de frais
- Autres services : 1-1.5% de frais

Virements internationaux :
- Frais Terex : GRATUIT
- Frais du service récepteur : Variable (0.8-1.5%)
- Taux de change : Marché + 1-2% de marge

INSTRUCTIONS COMPORTEMENTALES :
- Réponds UNIQUEMENT aux questions liées à Terex et aux crypto-monnaies
- Si une question est hors sujet, redirige poliment vers les services Terex
- Analyse l'intention derrière chaque message
- Propose des actions concrètes quand possible
- Utilise les informations du profil utilisateur pour personnaliser
- Sois proactif dans tes suggestions
- Explique clairement chaque étape des processus
- Mentionne toujours les frais et délais
`;

const analyzeUserIntent = (message: string, userContext: UserContext) => {
  const msg = message.toLowerCase();
  
  // Analyse des intentions d'achat
  if (msg.includes('acheter') || msg.includes('achète') || msg.includes('buy')) {
    const amount = extractAmount(message);
    return {
      intent: 'buy_usdt',
      action: 'create_buy_order',
      parameters: { amount },
      needsConfirmation: true
    };
  }
  
  // Analyse des intentions de vente
  if (msg.includes('vendre') || msg.includes('vends') || msg.includes('sell')) {
    const amount = extractAmount(message);
    return {
      intent: 'sell_usdt',
      action: 'create_sell_order',
      parameters: { amount },
      needsConfirmation: true
    };
  }
  
  // Analyse des intentions de transfert
  if (msg.includes('envoyer') || msg.includes('envoie') || msg.includes('transfert') || msg.includes('send')) {
    const amount = extractAmount(message);
    const recipient = extractRecipient(message);
    const country = extractCountry(message);
    return {
      intent: 'international_transfer',
      action: 'create_transfer',
      parameters: { amount, recipient, country },
      needsConfirmation: true
    };
  }
  
  // Analyse des questions sur le compte
  if (msg.includes('mes commandes') || msg.includes('historique') || msg.includes('mes transactions')) {
    return {
      intent: 'account_info',
      action: 'show_history',
      parameters: {},
      needsConfirmation: false
    };
  }
  
  return {
    intent: 'general_inquiry',
    action: 'provide_info',
    parameters: {},
    needsConfirmation: false
  };
};

const extractAmount = (message: string): string | null => {
  const amountRegex = /(\d+(?:[.,]\d+)?)\s*(?:\$|dollars?|cfa|usdt|euros?)/i;
  const match = message.match(amountRegex);
  return match ? match[1].replace(',', '.') : null;
};

const extractRecipient = (message: string): string | null => {
  const recipientRegex = /(?:à|pour)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+(?:au|en|qui|,))/i;
  const match = message.match(recipientRegex);
  return match ? match[1].trim() : null;
};

const extractCountry = (message: string): string | null => {
  const countries = ['sénégal', 'senegal', 'côte d\'ivoire', 'mali', 'burkina', 'niger'];
  const msg = message.toLowerCase();
  for (const country of countries) {
    if (msg.includes(country)) {
      return country;
    }
  }
  return null;
};

const getUserContext = async (userId: string): Promise<UserContext> => {
  try {
    // Récupérer le profil utilisateur
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // Récupérer le statut KYC
    const { data: kyc } = await supabase
      .from('kyc_verifications')
      .select('status')
      .eq('user_id', userId)
      .single();

    // Récupérer les commandes récentes
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    // Récupérer les transferts récents
    const { data: recentTransfers } = await supabase
      .from('international_transfers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    return {
      profile,
      kycStatus: kyc?.status || 'pending',
      recentOrders: recentOrders || [],
      recentTransfers: recentTransfers || []
    };
  } catch (error) {
    console.error('Erreur lors de la récupération du contexte utilisateur:', error);
    return {};
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [], userId }: ChatRequest = await req.json();

    console.log('Requête AI Assistant Avancé:', { message, userId, historyLength: conversationHistory.length });

    if (!openAIApiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    // Récupérer le contexte utilisateur si un userId est fourni
    let userContext: UserContext = {};
    let personalizedInfo = '';
    
    if (userId) {
      userContext = await getUserContext(userId);
      console.log('Contexte utilisateur récupéré:', userContext);
      
      if (userContext.profile) {
        personalizedInfo = `\n\nINFORMATIONS UTILISATEUR CONNECTÉ :
- Nom : ${userContext.profile.full_name || 'Non renseigné'}
- Pays : ${userContext.profile.country || 'Non renseigné'}
- Statut KYC : ${userContext.kycStatus}
- Nombre de commandes : ${userContext.recentOrders?.length || 0}
- Nombre de transferts : ${userContext.recentTransfers?.length || 0}

Utilise ces informations pour personnaliser tes réponses.`;
      }
    }

    // Analyser l'intention de l'utilisateur
    const intentAnalysis = analyzeUserIntent(message, userContext);
    console.log('Analyse d\'intention:', intentAnalysis);

    const recentHistory = conversationHistory.slice(-8);

    const systemMessage = ENHANCED_TEREX_KNOWLEDGE + personalizedInfo + `

ANALYSE DE L'INTENTION ACTUELLE :
L'utilisateur semble vouloir : ${intentAnalysis.intent}
Action suggérée : ${intentAnalysis.action}
Paramètres détectés : ${JSON.stringify(intentAnalysis.parameters)}

Si des paramètres ont été détectés (montant, destinataire, pays), propose de créer automatiquement la transaction correspondante.
Demande confirmation avant de procéder et explique chaque étape clairement.`;

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: systemMessage
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
        max_tokens: 800,
        temperature: 0.2,
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
      intent: intentAnalysis,
      userContext: userId ? userContext : null,
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
