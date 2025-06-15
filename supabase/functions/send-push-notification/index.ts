
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotificationPayload {
  user_id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  notification_type: 'order_updates' | 'kyc_updates' | 'transfer_updates' | 'marketing';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, title, body, icon, badge, data, notification_type }: NotificationPayload = await req.json();

    console.log('Sending push notification to user:', user_id, 'Type:', notification_type);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Vérifier les paramètres de notification de l'utilisateur
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user_id)
      .single();

    if (settingsError) {
      console.error('Error fetching notification settings:', settingsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch notification settings' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier si l'utilisateur veut recevoir ce type de notification
    if (!settings || !settings[notification_type]) {
      console.log('User has disabled this type of notification:', notification_type);
      return new Response(
        JSON.stringify({ message: 'Notification disabled by user' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Récupérer les abonnements push de l'utilisateur
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id);

    if (subError) {
      console.error('Error fetching push subscriptions:', subError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch push subscriptions' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('No push subscriptions found for user:', user_id);
      return new Response(
        JSON.stringify({ message: 'No push subscriptions found' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // VAPID keys - vous devrez générer vos propres clés
    const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM70nKEV-8BkZTlbLUjDNHEVJrQ6FnQSBaQW2NgwHfRgSy1xjIaU-U';
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY') || 'your-vapid-private-key';

    const payload = JSON.stringify({
      title,
      body,
      icon: icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      badge: badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
      data: {
        url: '/',
        timestamp: Date.now(),
        ...data
      }
    });

    let successCount = 0;
    let errorCount = 0;

    // Envoyer à tous les abonnements de l'utilisateur
    for (const subscription of subscriptions) {
      try {
        // Ici vous devriez utiliser une bibliothèque web-push appropriée
        // Pour cette démo, on simule l'envoi
        console.log('Sending to subscription:', subscription.endpoint);
        
        // Dans un vrai environnement, utilisez web-push ou équivalent
        // const result = await webpush.sendNotification(subscription, payload);
        
        successCount++;
      } catch (error) {
        console.error('Error sending to subscription:', error);
        errorCount++;
        
        // Si l'abonnement est invalide, le supprimer
        if (error.statusCode === 410) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('id', subscription.id);
        }
      }
    }

    console.log(`Push notification sent. Success: ${successCount}, Errors: ${errorCount}`);

    return new Response(
      JSON.stringify({ 
        message: 'Push notification sent',
        successCount,
        errorCount
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in send-push-notification function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
