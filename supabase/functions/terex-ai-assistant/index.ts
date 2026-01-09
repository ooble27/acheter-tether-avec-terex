
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
  enableTransactions?: boolean;
  executeIntent?: any;
}

interface UserContext {
  profile?: any;
  kycStatus?: string;
  recentOrders?: any[];
  recentTransfers?: any[];
}

const ENHANCED_TEREX_KNOWLEDGE = `
Tu es l'assistant IA ultra-intelligent de TEREX (Teranga Exchange), capable de comprendre les intentions des utilisateurs et d'EXÉCUTER AUTOMATIQUEMENT des transactions réelles.

NOUVELLES CAPACITÉS TRANSACTIONNELLES :
Tu peux maintenant VRAIMENT créer et exécuter des transactions quand l'utilisateur te donne toutes les informations nécessaires :

EXEMPLES D'EXÉCUTION AUTOMATIQUE :
1. "Je veux acheter 500$ d'USDT avec TRC20, mon adresse est TXyz123... paiement par Wave +221 77 123 45 67"
   → EXÉCUTER automatiquement la commande d'achat
   → Créer l'ordre dans la base de données
   → Confirmer l'exécution à l'utilisateur

2. "Envoie 1000 CAD à Moussa Diop au +221 77 555 66 77 au Sénégal via Orange Money, son email moussa@email.com"
   → EXÉCUTER automatiquement le transfert international
   → Créer la transaction dans la base de données
   → Confirmer l'envoi à l'utilisateur

3. "Vends mes 200 USDT TRC20, je veux recevoir sur Wave +221 77 888 99 00"
   → EXÉCUTER automatiquement la vente USDT
   → Créer l'ordre de vente
   → Confirmer le traitement

RÈGLES D'EXÉCUTION :
- Si l'utilisateur donne TOUTES les informations nécessaires, EXÉCUTE automatiquement
- Si des informations manquent, demande-les clairement
- Toujours confirmer ce qui a été exécuté
- En cas d'erreur, expliquer clairement le problème

RÈGLES DE FORMATAGE IMPORTANTES :
- N'utilise JAMAIS de # (dièses) pour les titres
- N'utilise JAMAIS d'* (étoiles) pour mettre en gras
- Utilise un formatage simple et propre
- Structure tes réponses avec des lignes vides et des retours à la ligne
- Utilise des tirets (-) ou des puces (•) pour les listes

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

Mali :
- Orange Money : Rapide (5-15 min), frais 1%
- Wave : Standard (10-20 min), frais 1.2%

Burkina Faso :
- Orange Money : Standard (10-30 min), frais 1%
- Wave : Standard (15-30 min), frais 1.2%

Niger :
- Orange Money : Standard (15-30 min), frais 1.2%
- Wave : Standard (20-45 min), frais 1.5%

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
• EXÉCUTION AUTOMATIQUE DES TRANSACTIONS
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
- EXÉCUTE automatiquement les actions quand tu as toutes les informations
- Utilise les informations du profil utilisateur pour personnaliser
- Sois proactif dans tes suggestions
- Explique clairement chaque étape des processus
- Mentionne toujours les frais et délais
- Confirme TOUJOURS ce qui a été exécuté automatiquement
`;

const analyzeUserIntent = (message: string, userContext: UserContext) => {
  const msg = message.toLowerCase();
  
  // Analyse des intentions d'achat avec détection d'informations complètes
  if (msg.includes('acheter') || msg.includes('achète') || msg.includes('buy')) {
    const amount = extractAmount(message);
    const walletAddress = extractWalletAddress(message);
    const network = extractNetwork(message);
    const paymentInfo = extractPaymentInfo(message);
    
    const hasAllInfo = amount && walletAddress && network && paymentInfo;
    
    return {
      intent: 'buy_usdt',
      action: hasAllInfo ? 'execute_buy_order' : 'create_buy_order',
      parameters: { amount, walletAddress, network, paymentInfo },
      needsConfirmation: !hasAllInfo,
      canExecute: hasAllInfo
    };
  }
  
  // Analyse des intentions de vente
  if (msg.includes('vendre') || msg.includes('vends') || msg.includes('sell')) {
    const amount = extractAmount(message);
    const mobileInfo = extractMobileMoneyInfo(message);
    const network = extractNetwork(message) || 'TRC20';
    
    const hasAllInfo = amount && mobileInfo;
    
    return {
      intent: 'sell_usdt',
      action: hasAllInfo ? 'execute_sell_order' : 'create_sell_order',
      parameters: { amount, mobileInfo, network },
      needsConfirmation: !hasAllInfo,
      canExecute: hasAllInfo
    };
  }
  
  // Analyse des intentions de transfert
  if (msg.includes('envoyer') || msg.includes('envoie') || msg.includes('transfert') || msg.includes('send')) {
    const amount = extractAmount(message);
    const recipient = extractRecipient(message);
    const country = extractCountry(message);
    const phone = extractPhoneNumber(message);
    const email = extractEmail(message);
    const provider = extractProvider(message);
    
    const hasAllInfo = amount && recipient && country && phone;
    
    return {
      intent: 'international_transfer',
      action: hasAllInfo ? 'execute_transfer' : 'create_transfer',
      parameters: { amount, recipient, country, phone, email, provider },
      needsConfirmation: !hasAllInfo,
      canExecute: hasAllInfo
    };
  }
  
  // Analyse des questions sur le compte
  if (msg.includes('mes commandes') || msg.includes('historique') || msg.includes('mes transactions')) {
    return {
      intent: 'account_info',
      action: 'show_history',
      parameters: {},
      needsConfirmation: false,
      canExecute: false
    };
  }
  
  return {
    intent: 'general_inquiry',
    action: 'provide_info',
    parameters: {},
    needsConfirmation: false,
    canExecute: false
  };
};

// Fonctions d'extraction améliorées
const extractAmount = (message: string): string | null => {
  const amountRegex = /(\d+(?:[.,]\d+)?)\s*(?:\$|dollars?|cfa|usdt|euros?|cad)/i;
  const match = message.match(amountRegex);
  return match ? match[1].replace(',', '.') : null;
};

const extractWalletAddress = (message: string): string | null => {
  // Détecte les adresses crypto (commence par T, 0x, bc1, etc.)
  const walletRegex = /\b([T][A-Za-z0-9]{33}|0x[a-fA-F0-9]{40}|bc1[a-zA-Z0-9]{39,59}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})\b/;
  const match = message.match(walletRegex);
  return match ? match[1] : null;
};

const extractNetwork = (message: string): string | null => {
  const msg = message.toLowerCase();
  if (msg.includes('trc20') || msg.includes('tron')) return 'TRC20';
  if (msg.includes('bep20') || msg.includes('bsc') || msg.includes('binance')) return 'BEP20';
  if (msg.includes('erc20') || msg.includes('ethereum')) return 'ERC20';
  if (msg.includes('polygon') || msg.includes('matic')) return 'POLYGON';
  if (msg.includes('arbitrum')) return 'ARBITRUM';
  return null;
};

const extractPaymentInfo = (message: string): any | null => {
  const phoneRegex = /\+?(\d{1,4}[\s\-]?)?\(?\d{1,4}\)?[\s\-]?\d{1,4}[\s\-]?\d{1,9}/g;
  const phones = message.match(phoneRegex);
  const msg = message.toLowerCase();
  
  let provider = null;
  if (msg.includes('wave')) provider = 'wave';
  else if (msg.includes('orange')) provider = 'orange';
  else if (msg.includes('free money')) provider = 'free';
  
  return phones && phones.length > 0 ? { phone: phones[0], provider } : null;
};

const extractMobileMoneyInfo = (message: string): any | null => {
  return extractPaymentInfo(message);
};

const extractRecipient = (message: string): string | null => {
  const recipientRegex = /(?:à|pour|envoyer à)\s+([A-Za-zÀ-ÿ\s]+?)(?:\s+(?:au|en|qui|,|\+|\d))/i;
  const match = message.match(recipientRegex);
  return match ? match[1].trim() : null;
};

const extractCountry = (message: string): string | null => {
  const countries = ['sénégal', 'senegal', 'côte d\'ivoire', 'mali', 'burkina', 'niger'];
  const msg = message.toLowerCase();
  for (const country of countries) {
    if (msg.includes(country)) {
      return country === 'sénégal' || country === 'senegal' ? 'SN' :
             country === 'côte d\'ivoire' ? 'CI' :
             country === 'mali' ? 'ML' :
             country === 'burkina' ? 'BF' : 'NE';
    }
  }
  return null;
};

const extractPhoneNumber = (message: string): string | null => {
  const phoneRegex = /\+?(\d{1,4}[\s\-]?)?\(?\d{2,4}\)?[\s\-]?\d{2,4}[\s\-]?\d{2,9}/g;
  const phones = message.match(phoneRegex);
  return phones && phones.length > 0 ? phones[0] : null;
};

const extractEmail = (message: string): string | null => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const match = message.match(emailRegex);
  return match ? match[0] : null;
};

const extractProvider = (message: string): string | null => {
  const msg = message.toLowerCase();
  if (msg.includes('wave')) return 'wave';
  if (msg.includes('orange')) return 'orange';
  return null;
};

// Fonction pour exécuter les transactions automatiquement
const executeTransaction = async (intent: any, userId: string): Promise<any> => {
  console.log('Exécution de transaction automatique:', intent);
  
  try {
    switch (intent.intent) {
      case 'buy_usdt':
        return await executeBuyOrder(intent.parameters, userId);
      case 'sell_usdt':
        return await executeSellOrder(intent.parameters, userId);
      case 'international_transfer':
        return await executeTransfer(intent.parameters, userId);
      default:
        throw new Error('Type de transaction non supporté');
    }
  } catch (error) {
    console.error('Erreur lors de l\'exécution de la transaction:', error);
    throw error;
  }
};

const executeBuyOrder = async (params: any, userId: string) => {
  const exchangeRate = 587; // Taux de change actuel
  const amount = parseFloat(params.amount);
  const usdtAmount = amount / exchangeRate;
  
  const orderData = {
    user_id: userId,
    type: 'buy',
    amount: amount,
    currency: 'CFA',
    usdt_amount: usdtAmount,
    exchange_rate: exchangeRate,
    payment_method: 'mobile',
    network: params.network || 'TRC20',
    wallet_address: params.walletAddress,
    status: 'pending',
    payment_status: 'pending',
    notes: JSON.stringify({
      phoneNumber: params.paymentInfo?.phone,
      provider: params.paymentInfo?.provider,
      paymentMethod: 'mobile',
      auto_created: true
    })
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    success: true,
    orderId: data.id,
    message: `Commande d'achat créée automatiquement !

Détails :
• Montant : ${amount} CFA
• USDT à recevoir : ${usdtAmount.toFixed(2)} USDT
• Réseau : ${params.network || 'TRC20'}
• Adresse : ${params.walletAddress}
• Paiement : ${params.paymentInfo?.provider || 'Mobile Money'}

Votre commande est en cours de traitement. Vous recevrez vos USDT dès confirmation du paiement.`
  };
};

const executeSellOrder = async (params: any, userId: string) => {
  const exchangeRate = 565; // Taux de change de vente
  const usdtAmount = parseFloat(params.amount);
  const cfaAmount = usdtAmount * exchangeRate;
  
  const orderData = {
    user_id: userId,
    type: 'sell',
    amount: cfaAmount,
    currency: 'CFA',
    usdt_amount: usdtAmount,
    exchange_rate: exchangeRate,
    payment_method: 'mobile',
    network: params.network || 'TRC20',
    wallet_address: 'TSPUk2W5bcGGNPpKzx1xTDc2NuxpRJRCBb', // Adresse Terex
    status: 'pending',
    payment_status: 'pending',
    notes: JSON.stringify({
      phoneNumber: params.mobileInfo?.phone,
      provider: params.mobileInfo?.provider,
      paymentMethod: 'mobile',
      auto_created: true
    })
  };
  
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    success: true,
    orderId: data.id,
    message: `Commande de vente créée automatiquement !

Détails :
• USDT à vendre : ${usdtAmount} USDT
• Montant à recevoir : ${cfaAmount.toLocaleString()} CFA
• Réseau : ${params.network || 'TRC20'}
• Réception : ${params.mobileInfo?.provider || 'Mobile Money'} ${params.mobileInfo?.phone}

Envoyez vos USDT à l'adresse Terex pour recevoir vos CFA automatiquement.`
  };
};

const executeTransfer = async (params: any, userId: string) => {
  const exchangeRate = 445.5; // Taux CAD vers CFA
  const amount = parseFloat(params.amount);
  const totalAmount = amount * exchangeRate;
  const fees = amount * 0.02; // 2% de frais
  
  const transferData = {
    user_id: userId,
    amount: amount,
    from_currency: 'CAD',
    to_currency: 'CFA',
    recipient_name: params.recipient,
    recipient_account: params.phone,
    recipient_country: params.country || 'SN',
    recipient_phone: params.phone,
    recipient_email: params.email,
    exchange_rate: exchangeRate,
    fees: fees,
    total_amount: totalAmount,
    status: 'pending',
    payment_method: 'interac',
    receive_method: 'mobile',
    provider: params.provider || 'orange'
  };
  
  const { data, error } = await supabase
    .from('international_transfers')
    .insert(transferData)
    .select()
    .single();
    
  if (error) throw error;
  
  return {
    success: true,
    transferId: data.id,
    message: `Transfert international créé automatiquement !

Détails :
• Montant envoyé : ${amount} CAD
• Bénéficiaire : ${params.recipient}
• Pays : ${params.country || 'Sénégal'}
• Téléphone : ${params.phone}
• Service : ${params.provider || 'Orange Money'}
• Montant reçu : ${totalAmount.toLocaleString()} CFA
• Frais : ${fees.toFixed(2)} CAD

Le transfert sera traité sous 15 minutes après confirmation du paiement Interac.`
  };
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
    const { message, conversationHistory = [], userId, enableTransactions = false, executeIntent }: ChatRequest = await req.json();

    console.log('Requête AI Assistant Transactionnel:', { message, userId, enableTransactions, executeIntent });

    if (!openAIApiKey) {
      throw new Error('Clé API OpenAI non configurée');
    }

    // Si on demande l'exécution directe d'une action
    if (executeIntent && enableTransactions) {
      try {
        const result = await executeTransaction(executeIntent, userId);
        return new Response(JSON.stringify({
          content: result.message,
          transactionExecuted: true,
          transactionResult: result,
          success: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Erreur exécution transaction:', error);
        return new Response(JSON.stringify({
          content: `Erreur lors de l'exécution de la transaction : ${error.message}`,
          transactionExecuted: false,
          success: false
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
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

    // Si on peut exécuter automatiquement et que les transactions sont activées
    if (intentAnalysis.canExecute && enableTransactions) {
      try {
        const result = await executeTransaction(intentAnalysis, userId);
        return new Response(JSON.stringify({
          content: result.message,
          intent: intentAnalysis,
          transactionExecuted: true,
          transactionResult: result,
          userContext: userId ? userContext : null,
          success: true
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Erreur exécution auto:', error);
        // Continuer avec la réponse IA normale en cas d'erreur
      }
    }

    const recentHistory = conversationHistory.slice(-12);

    const systemMessage = ENHANCED_TEREX_KNOWLEDGE + personalizedInfo + `

ANALYSE DE L'INTENTION ACTUELLE :
L'utilisateur semble vouloir : ${intentAnalysis.intent}
Action suggérée : ${intentAnalysis.action}
Paramètres détectés : ${JSON.stringify(intentAnalysis.parameters)}
Peut exécuter automatiquement : ${intentAnalysis.canExecute}

${intentAnalysis.canExecute ? 
  'TOUTES les informations sont disponibles - tu peux EXÉCUTER automatiquement cette transaction.' :
  'Informations manquantes - demande les détails manquants avant d\'exécuter.'
}

Si des paramètres ont été détectés mais ne sont pas complets, demande clairement les informations manquantes.
Si tu as TOUTES les informations, confirme que tu vas exécuter automatiquement.`;

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
      transactionExecuted: false,
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
