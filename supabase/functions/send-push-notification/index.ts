
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
    const { subscription, notification }: { subscription: PushSubscription, notification: NotificationPayload } = await req.json()

    if (!subscription || !notification) {
      return new Response(
        JSON.stringify({ error: 'Abonnement et notification requis' }),
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
    }

    // Créer le message push
    const message = JSON.stringify(notificationData)

    // Envoyer la notification push
    const response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Encoding': 'aes128gcm',
        'TTL': '86400'
      },
      body: message
    })

    if (!response.ok) {
      console.error('Erreur envoi push notification:', response.status, response.statusText)
      return new Response(
        JSON.stringify({ 
          error: 'Erreur envoi notification', 
          status: response.status, 
          statusText: response.statusText 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification envoyée avec succès' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Erreur dans send-push-notification:', error)
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
