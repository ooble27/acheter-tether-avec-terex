import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-signature',
};

// Fonction pour générer et vérifier la signature HMAC-SHA256
async function verifySignature(payload: string, signature: string, secretKey: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const data = encoder.encode(payload);
  
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, data);
  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return expectedSignature === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawBody = await req.text();
    const webhookData = JSON.parse(rawBody);
    console.log('NabooPay webhook received:', webhookData);
    
    // Récupérer la signature depuis les headers
    const signature = req.headers.get('X-Signature') || req.headers.get('x-signature');
    const secretKey = Deno.env.get('NABOOPAY_WEBHOOK_SECRET') || Deno.env.get('NABOOPAY_API_KEY');
    
    if (!signature) {
      console.error('No signature provided in webhook');
      return new Response(
        JSON.stringify({ success: false, error: 'No signature provided' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    // Vérifier la signature
    const isValid = await verifySignature(rawBody, signature, secretKey ?? '');
    
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid signature' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }
    
    console.log('Webhook signature verified successfully');

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier si la transaction est complétée, réussie ou payée
    if (webhookData.transaction_status === 'completed' || 
        webhookData.transaction_status === 'success' || 
        webhookData.transaction_status === 'paid') {
      console.log('Payment confirmed for order:', webhookData.order_id);

      // Mettre à jour l'ordre dans Supabase en utilisant payment_reference
      const { data: orders, error: fetchError } = await supabaseClient
        .from('orders')
        .select('id')
        .eq('payment_reference', webhookData.order_id);

      if (fetchError) {
        console.error('Error fetching order:', fetchError);
        throw fetchError;
      }

      if (orders && orders.length > 0) {
        const { error: updateError } = await supabaseClient
          .from('orders')
          .update({
            payment_status: 'confirmed',
            status: 'processing',
            processed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('payment_reference', webhookData.order_id);

        if (updateError) {
          console.error('Error updating order:', updateError);
          throw updateError;
        }

        console.log('Order updated successfully:', webhookData.order_id);
        
        // Envoyer une notification email au client
        await supabaseClient.functions.invoke('send-email-notification', {
          body: {
            userId: orders[0].user_id,
            emailType: 'payment_confirmed',
            transactionType: 'buy'
          }
        });
      } else {
        console.log('No order found with payment_reference:', webhookData.order_id);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in naboopay-webhook:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
