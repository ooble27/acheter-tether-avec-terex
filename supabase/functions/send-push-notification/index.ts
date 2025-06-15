
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9b2qKwCNAMYhfApMRuLnYwfv-7Oox9TfPmXp4pJXDh7CZJ3uNVdw'
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || ''
const VAPID_SUBJECT = 'mailto:contact@terex.africa'

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: any;
}

// Fonction pour créer les headers JWT pour VAPID
function createJWT(endpoint: string) {
  const header = {
    "typ": "JWT",
    "alg": "ES256"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    "aud": new URL(endpoint).origin,
    "exp": now + 24 * 60 * 60, // 24 heures
    "sub": VAPID_SUBJECT
  };

  // Pour le moment, on simule le JWT (nécessiterait une vraie implémentation)
  const headerB64 = btoa(JSON.stringify(header));
  const payloadB64 = btoa(JSON.stringify(payload));
  
  return `${headerB64}.${payloadB64}.signature_placeholder`;
}

// Fonction pour envoyer la notification push
async function sendPushNotification(subscription: PushSubscription, payload: string) {
  try {
    console.log('🚀 Envoi notification vers:', subscription.endpoint.substring(0, 50) + '...');

    // Créer les headers nécessaires
    const jwt = createJWT(subscription.endpoint);
    
    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'Authorization': `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
      'TTL': '86400'
    };

    console.log('📤 Headers préparés:', Object.keys(headers));

    // Pour l'instant, on simule l'envoi car nous n'avons pas de vraie clé VAPID privée
    console.log('⚠️ Mode simulation - notification non envoyée réellement');
    console.log('📝 Payload:', payload.substring(0, 100) + '...');
    
    // Simulation d'une réponse réussie
    return { 
      success: true, 
      status: 200,
      message: 'Notification simulée avec succès'
    };

    // Code réel qui serait utilisé avec une vraie clé VAPID :
    /*
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers,
      body: payload
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return {
      success: true,
      status: response.status,
      message: 'Notification envoyée avec succès'
    };
    */
  } catch (error) {
    console.error('❌ Erreur envoi push:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔄 Début traitement notification push');
    
    const requestBody = await req.json();
    console.log('📥 Corps de la requête reçu');
    
    const { subscription, notification }: { subscription: PushSubscription, notification: NotificationPayload } = requestBody;

    // Validation des données
    if (!subscription || !notification) {
      console.error('❌ Données manquantes:', { 
        hasSubscription: !!subscription, 
        hasNotification: !!notification 
      });
      return new Response(
        JSON.stringify({ error: 'Abonnement et notification requis' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validation de l'abonnement
    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      console.error('❌ Abonnement invalide:', {
        hasEndpoint: !!subscription.endpoint,
        hasP256dh: !!subscription.keys?.p256dh,
        hasAuth: !!subscription.keys?.auth
      });
      return new Response(
        JSON.stringify({ error: 'Format d\'abonnement invalide' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Préparer les données de notification
    const notificationData = {
      title: notification.title,
      body: notification.body,
      icon: notification.icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      badge: notification.badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      data: {
        url: notification.url,
        ...notification.data
      },
      actions: [
        {
          action: 'open',
          title: 'Ouvrir',
          icon: '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png'
        }
      ],
      requireInteraction: false,
      silent: false,
      tag: `terex-${Date.now()}`
    };

    console.log('✅ Données notification préparées:', {
      title: notificationData.title,
      body: notificationData.body.substring(0, 50) + '...'
    });

    // Préparer le payload
    const payload = JSON.stringify(notificationData);

    // Envoyer la notification
    const result = await sendPushNotification(subscription, payload);

    console.log('✅ Résultat envoi:', result);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: result.message,
        details: 'Notification traitée avec succès'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans send-push-notification:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
