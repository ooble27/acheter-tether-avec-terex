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
    const naboopayApiKey = Deno.env.get('NABOOPAY_API_KEY');
    if (!naboopayApiKey) {
      throw new Error('NABOOPAY_API_KEY not configured');
    }

    const { naboopayOrderId } = await req.json();

    console.log('Checking NabooPay transaction status:', naboopayOrderId);

    // Vérifier le statut avec NabooPay
    const naboopayResponse = await fetch(
      `https://api.naboopay.com/api/v1/transaction/get-one-transaction?order_id=${naboopayOrderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${naboopayApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!naboopayResponse.ok) {
      const errorText = await naboopayResponse.text();
      console.error('NabooPay API error:', errorText);
      throw new Error(`NabooPay API error: ${errorText}`);
    }

    const naboopayData = await naboopayResponse.json();
    console.log('NabooPay transaction status:', naboopayData);

    // Mettre à jour l'ordre dans Supabase si le paiement est complété
    if (naboopayData.transaction_status === 'completed' || naboopayData.transaction_status === 'success') {
      const supabaseClient = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({
          payment_status: 'paid',
          status: 'processing',
          processed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('payment_reference', naboopayOrderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        status: naboopayData.transaction_status,
        data: naboopayData
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in naboopay-check-status:', error);
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
