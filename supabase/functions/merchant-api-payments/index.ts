import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract API key from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Validate API key and get merchant account
    const { data: merchant, error: merchantError } = await supabase
      .from('merchant_accounts')
      .select('*')
      .eq('api_key', apiKey)
      .eq('is_active', true)
      .single();

    if (merchantError || !merchant) {
      console.error('API key validation failed:', merchantError);
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Merchant authenticated:', merchant.id);

    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    
    // POST / - Create payment
    if (req.method === 'POST' && pathParts.length === 0) {
      const body = await req.json();
      
      // Validate required fields
      if (!body.amount || !body.currency) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: amount, currency' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Calculate USDT amount (example rate - in production use real-time rates)
      const exchangeRate = 585; // CFA to USDT rate
      const usdtAmount = Number(body.amount) / exchangeRate;
      
      // Generate payment reference
      const paymentReference = 'TPY-' + Array.from(crypto.getRandomValues(new Uint8Array(6)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('').toUpperCase();

      // Calculate commission
      const commission = Number(body.amount) * merchant.commission_rate;
      const netAmount = Number(body.amount) - commission;

      // Set expiration (30 minutes from now)
      const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('terex_payments')
        .insert({
          merchant_id: merchant.id,
          customer_id: body.customer_id || null,
          amount: body.amount,
          currency: body.currency,
          usdt_amount: usdtAmount,
          exchange_rate: exchangeRate,
          commission: commission,
          net_amount: netAmount,
          payment_method: 'usdt',
          status: 'pending',
          reference_number: paymentReference,
          description: body.description || null,
          customer_email: body.customer_email || null,
          customer_phone: body.customer_phone || null,
          metadata: body.metadata || null,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single();

      if (paymentError) {
        console.error('Payment creation error:', paymentError);
        return new Response(
          JSON.stringify({ error: 'Failed to create payment', details: paymentError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Payment created:', payment.id);

      // Send webhook if configured
      if (merchant.webhook_url) {
        try {
          await fetch(merchant.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event: 'payment.created',
              payment_id: payment.id,
              merchant_id: merchant.id,
              amount: payment.amount,
              currency: payment.currency,
              usdt_amount: payment.usdt_amount,
              status: payment.status,
              reference_number: payment.reference_number,
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment: {
            id: payment.id,
            reference_number: payment.reference_number,
            amount: payment.amount,
            currency: payment.currency,
            usdt_amount: payment.usdt_amount,
            exchange_rate: payment.exchange_rate,
            status: payment.status,
            payment_url: `${supabaseUrl.replace('supabase.co', 'lovableproject.com')}/pay/${payment.id}`,
            expires_at: payment.expires_at,
            created_at: payment.created_at,
          }
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /:payment_id - Get payment status
    if (req.method === 'GET' && pathParts.length === 1) {
      const paymentId = pathParts[0];

      const { data: payment, error: paymentError } = await supabase
        .from('terex_payments')
        .select('*')
        .eq('id', paymentId)
        .eq('merchant_id', merchant.id)
        .single();

      if (paymentError || !payment) {
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment: {
            id: payment.id,
            reference_number: payment.reference_number,
            amount: payment.amount,
            currency: payment.currency,
            usdt_amount: payment.usdt_amount,
            status: payment.status,
            paid_at: payment.paid_at,
            created_at: payment.created_at,
            expires_at: payment.expires_at,
            customer_email: payment.customer_email,
            metadata: payment.metadata,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Method not allowed
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in merchant-api-payments:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
