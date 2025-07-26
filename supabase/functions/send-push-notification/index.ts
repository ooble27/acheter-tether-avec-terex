
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9b2qKwCNAMYhfApMRuLnYwfv-7Oox9TfPmXp4pJXDh7CZJ3uNVdw'
const VAPID_PRIVATE_KEY = Deno.env.get('VAPID_PRIVATE_KEY') || 'YmVlZjdmNzItNTBmNi00YWIyLWI5MjAtMGJmNzY3YzU4NzEy'
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

// Fonction pour encoder en base64url
function base64urlEncode(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Fonction pour créer le JWT VAPID
function createVapidJWT(endpoint: string): string {
  const header = {
    "typ": "JWT",
    "alg": "ES256"
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    "aud": new URL(endpoint).origin,
    "exp": now + 24 * 60 * 60,
    "sub": VAPID_SUBJECT
  };

  const encodedHeader = base64urlEncode(new TextEncoder().encode(JSON.stringify(header)));
  const encodedPayload = base64urlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  
  // Pour une vraie implémentation, il faudrait signer avec la clé privée
  // Ici on utilise une signature simulée
  const signature = base64urlEncode(new TextEncoder().encode('mock_signature'));
  
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Fonction pour envoyer la notification push
async function sendPushNotification(subscription: PushSubscription, payload: string) {
  try {
    console.log('🚀 Envoi notification vers:', subscription.endpoint.substring(0, 50) + '...');

    // Créer les headers VAPID
    const jwt = createVapidJWT(subscription.endpoint);
    
    const headers = {
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'Authorization': `vapid t=${jwt}, k=${VAPID_PUBLIC_KEY}`,
      'TTL': '86400'
    };

    console.log('📤 Envoi vers endpoint:', subscription.endpoint);
    
    // Envoi réel vers le service push
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers,
      body: payload
    });

    console.log('📬 Réponse du service push:', response.status, response.statusText);

    if (response.status === 200 || response.status === 201 || response.status === 204) {
      console.log('✅ Notification envoyée avec succès');
      return {
        success: true,
        status: response.status,
        message: 'Notification envoyée avec succès'
      };
    } else {
      console.error('❌ Erreur réponse push service:', response.status, response.statusText);
      const responseText = await response.text();
      console.error('❌ Détails erreur:', responseText);
      
      return {
        success: false,
        status: response.status,
        message: `Erreur push service: ${response.statusText}`
      };
    }
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

    if (!subscription.endpoint || !subscription.keys?.p256dh || !subscription.keys?.auth) {
      console.error('❌ Abonnement invalide');
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
      requireInteraction: true,
      silent: false,
      tag: `terex-${Date.now()}`
    };

    console.log('✅ Données notification préparées:', {
      title: notificationData.title,
      body: notificationData.body.substring(0, 50) + '...'
    });

    const payload = JSON.stringify(notificationData);

    // Envoyer la notification
    const result = await sendPushNotification(subscription, payload);

    console.log('✅ Résultat envoi:', result);

    return new Response(
      JSON.stringify({ 
        success: result.success, 
        message: result.message,
        details: 'Notification traitée'
      }),
      { 
        status: result.success ? 200 : 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('❌ Erreur dans send-push-notification:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur interne du serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
