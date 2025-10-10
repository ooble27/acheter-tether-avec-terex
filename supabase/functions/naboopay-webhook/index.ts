import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const webhookData = await req.json();
    console.log('NabooPay webhook received:', webhookData);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Vérifier si la transaction est complétée ou réussie
    if (webhookData.transaction_status === 'completed' || webhookData.transaction_status === 'success') {
      console.log('Payment confirmed for order:', webhookData.order_id);

      // Mettre à jour l'ordre dans Supabase
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

      console.log('Order updated successfully');
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
