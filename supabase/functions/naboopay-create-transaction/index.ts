import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Product {
  name: string;
  category: string;
  amount: number;
  quantity: number;
  description: string;
}

interface TransactionRequest {
  orderId: string;
  amount: number;
  products: Product[];
  paymentMethods: string[];
  successUrl: string;
  errorUrl: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const naboopayApiKey = Deno.env.get('NABOOPAY_API_KEY');
    if (!naboopayApiKey) {
      throw new Error('NABOOPAY_API_KEY not configured');
    }

    const { orderId, amount, products, paymentMethods, successUrl, errorUrl }: TransactionRequest = await req.json();

    console.log('Creating NabooPay transaction for order:', orderId);

    // Créer la transaction avec NabooPay
    const naboopayResponse = await fetch('https://api.naboopay.com/api/v1/transaction/create-transaction', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${naboopayApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method_of_payment: paymentMethods,
        products: products,
        success_url: successUrl,
        error_url: errorUrl,
        is_escrow: false,
        is_merchant: false
      }),
    });

    if (!naboopayResponse.ok) {
      const errorText = await naboopayResponse.text();
      console.error('NabooPay API error:', errorText);
      throw new Error(`NabooPay API error: ${errorText}`);
    }

    const naboopayData = await naboopayResponse.json();
    console.log('NabooPay transaction created:', naboopayData);

    // Mettre à jour l'ordre avec les informations de paiement NabooPay
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        payment_reference: naboopayData.order_id,
        payment_status: 'pending',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutUrl: naboopayData.checkout_url,
        naboopayOrderId: naboopayData.order_id,
        status: naboopayData.transaction_status
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in naboopay-create-transaction:', error);
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
