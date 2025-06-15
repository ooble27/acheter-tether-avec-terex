
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Début envoi notification push');
    
    const requestBody = await req.json();
    console.log('Corps de la requête:', requestBody);
    
    const { subscription, notification }: { subscription: PushSubscription, notification: NotificationPayload } = requestBody;

    if (!subscription || !notification) {
      console.error('Données manquantes:', { subscription: !!subscription, notification: !!notification });
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
      console.error('Abonnement invalide:', subscription);
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
      silent: false
    };

    console.log('Données notification préparées:', notificationData);

    // Pour l'instant, on simule l'envoi réussi
    // TODO: Implémenter l'envoi réel avec les clés VAPID
    console.log('Simulation envoi vers:', subscription.endpoint);

    return new Response(
      JSON.stringify({ success: true, message: 'Notification envoyée avec succès (simulé)' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur dans send-push-notification:', error);
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
