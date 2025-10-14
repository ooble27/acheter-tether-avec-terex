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

      // Send webhook if configured with logging
      if (merchant.webhook_url) {
        const webhookPayload = {
          event: 'payment.created',
          payment_id: payment.id,
          merchant_id: merchant.id,
          amount: payment.amount,
          currency: payment.currency,
          usdt_amount: payment.usdt_amount,
          status: payment.status,
          reference_number: payment.reference_number,
          timestamp: new Date().toISOString(),
        };

        try {
          const webhookResponse = await fetch(merchant.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          });

          const responseBody = await webhookResponse.text();

          // Log webhook
          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.created',
            payload: webhookPayload,
            url: merchant.webhook_url,
            response_status: webhookResponse.status,
            response_body: responseBody.substring(0, 1000), // Limit to 1000 chars
            delivered_at: new Date().toISOString(),
          });

          console.log('Webhook sent successfully:', webhookResponse.status);
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          
          // Log failed webhook
          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.created',
            payload: webhookPayload,
            url: merchant.webhook_url,
            error_message: webhookError.message,
          });
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

    // GET / - List payments with pagination and filters
    if (req.method === 'GET' && pathParts.length === 0) {
      const status = url.searchParams.get('status');
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '10');
      const offset = (page - 1) * limit;

      let query = supabase
        .from('terex_payments')
        .select('*', { count: 'exact' })
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (status) {
        query = query.eq('status', status);
      }

      const { data: payments, error: paymentsError, count } = await query;

      if (paymentsError) {
        console.error('Payments list error:', paymentsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch payments', details: paymentsError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          payments: payments.map(p => ({
            id: p.id,
            reference_number: p.reference_number,
            amount: p.amount,
            currency: p.currency,
            usdt_amount: p.usdt_amount,
            status: p.status,
            paid_at: p.paid_at,
            created_at: p.created_at,
            expires_at: p.expires_at,
          })),
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit),
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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

    // PUT /:payment_id/confirm - Confirm payment manually
    if (req.method === 'PUT' && pathParts.length === 2 && pathParts[1] === 'confirm') {
      const paymentId = pathParts[0];

      // Get payment
      const { data: payment, error: getError } = await supabase
        .from('terex_payments')
        .select('*')
        .eq('id', paymentId)
        .eq('merchant_id', merchant.id)
        .single();

      if (getError || !payment) {
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if payment is already completed or expired
      if (payment.status === 'completed') {
        return new Response(
          JSON.stringify({ error: 'Payment already completed' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (new Date(payment.expires_at) < new Date()) {
        return new Response(
          JSON.stringify({ error: 'Payment has expired' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update payment status
      const { data: updatedPayment, error: updateError } = await supabase
        .from('terex_payments')
        .update({
          status: 'completed',
          paid_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (updateError) {
        console.error('Payment confirmation error:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to confirm payment', details: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Payment confirmed:', updatedPayment.id);

      // Send webhook with logging
      if (merchant.webhook_url) {
        const webhookPayload = {
          event: 'payment.completed',
          payment_id: updatedPayment.id,
          merchant_id: merchant.id,
          amount: updatedPayment.amount,
          currency: updatedPayment.currency,
          usdt_amount: updatedPayment.usdt_amount,
          status: updatedPayment.status,
          reference_number: updatedPayment.reference_number,
          paid_at: updatedPayment.paid_at,
          timestamp: new Date().toISOString(),
        };

        try {
          const webhookResponse = await fetch(merchant.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          });

          const responseBody = await webhookResponse.text();

          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.completed',
            payload: webhookPayload,
            url: merchant.webhook_url,
            response_status: webhookResponse.status,
            response_body: responseBody.substring(0, 1000),
            delivered_at: new Date().toISOString(),
          });
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          
          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.completed',
            payload: webhookPayload,
            url: merchant.webhook_url,
            error_message: webhookError.message,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment: {
            id: updatedPayment.id,
            reference_number: updatedPayment.reference_number,
            amount: updatedPayment.amount,
            status: updatedPayment.status,
            paid_at: updatedPayment.paid_at,
          }
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /:payment_id/refund - Create refund
    if (req.method === 'POST' && pathParts.length === 2 && pathParts[1] === 'refund') {
      const paymentId = pathParts[0];
      const body = await req.json();

      // Get payment
      const { data: payment, error: getError } = await supabase
        .from('terex_payments')
        .select('*')
        .eq('id', paymentId)
        .eq('merchant_id', merchant.id)
        .single();

      if (getError || !payment) {
        return new Response(
          JSON.stringify({ error: 'Payment not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if payment is completed
      if (payment.status !== 'completed') {
        return new Response(
          JSON.stringify({ error: 'Can only refund completed payments' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validate refund amount
      const refundAmount = body.amount || payment.amount;
      if (refundAmount > payment.amount) {
        return new Response(
          JSON.stringify({ error: 'Refund amount cannot exceed payment amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check existing refunds
      const { data: existingRefunds } = await supabase
        .from('refunds')
        .select('amount')
        .eq('payment_id', paymentId);

      const totalRefunded = existingRefunds?.reduce((sum, r) => sum + Number(r.amount), 0) || 0;
      if (totalRefunded + refundAmount > payment.amount) {
        return new Response(
          JSON.stringify({ error: 'Total refunds cannot exceed payment amount' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create refund
      const { data: refund, error: refundError } = await supabase
        .from('refunds')
        .insert({
          payment_id: paymentId,
          amount: refundAmount,
          reason: body.reason || null,
          status: 'pending',
        })
        .select()
        .single();

      if (refundError) {
        console.error('Refund creation error:', refundError);
        return new Response(
          JSON.stringify({ error: 'Failed to create refund', details: refundError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Update payment status to refunded if full refund
      if (refundAmount === payment.amount) {
        await supabase
          .from('terex_payments')
          .update({ status: 'refunded' })
          .eq('id', paymentId);
      }

      console.log('Refund created:', refund.id);

      // Send webhook with logging
      if (merchant.webhook_url) {
        const webhookPayload = {
          event: 'payment.refunded',
          payment_id: paymentId,
          refund_id: refund.id,
          merchant_id: merchant.id,
          refund_amount: refundAmount,
          payment_amount: payment.amount,
          reason: body.reason || null,
          timestamp: new Date().toISOString(),
        };

        try {
          const webhookResponse = await fetch(merchant.webhook_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload),
          });

          const responseBody = await webhookResponse.text();

          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.refunded',
            payload: webhookPayload,
            url: merchant.webhook_url,
            response_status: webhookResponse.status,
            response_body: responseBody.substring(0, 1000),
            delivered_at: new Date().toISOString(),
          });
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          
          await supabase.from('webhook_logs').insert({
            merchant_id: merchant.id,
            event_type: 'payment.refunded',
            payload: webhookPayload,
            url: merchant.webhook_url,
            error_message: webhookError.message,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          refund: {
            id: refund.id,
            payment_id: paymentId,
            amount: refund.amount,
            reason: refund.reason,
            status: refund.status,
            created_at: refund.created_at,
          }
        }),
        { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /webhooks/test - Test webhook endpoint
    if (req.method === 'POST' && pathParts.length === 2 && pathParts[0] === 'webhooks' && pathParts[1] === 'test') {
      if (!merchant.webhook_url) {
        return new Response(
          JSON.stringify({ error: 'No webhook URL configured' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const testPayload = {
        event: 'webhook.test',
        merchant_id: merchant.id,
        message: 'This is a test webhook from Terex API',
        timestamp: new Date().toISOString(),
      };

      try {
        const webhookResponse = await fetch(merchant.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testPayload),
        });

        const responseBody = await webhookResponse.text();

        // Log test webhook
        await supabase.from('webhook_logs').insert({
          merchant_id: merchant.id,
          event_type: 'webhook.test',
          payload: testPayload,
          url: merchant.webhook_url,
          response_status: webhookResponse.status,
          response_body: responseBody.substring(0, 1000),
          delivered_at: new Date().toISOString(),
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Test webhook sent successfully',
            status: webhookResponse.status,
            response: responseBody.substring(0, 500),
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Test webhook error:', error);

        // Log failed test webhook
        await supabase.from('webhook_logs').insert({
          merchant_id: merchant.id,
          event_type: 'webhook.test',
          payload: testPayload,
          url: merchant.webhook_url,
          error_message: error.message,
        });

        return new Response(
          JSON.stringify({
            success: false,
            error: 'Failed to send test webhook',
            details: error.message,
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // GET /webhooks/logs - Get webhook logs
    if (req.method === 'GET' && pathParts.length === 2 && pathParts[0] === 'webhooks' && pathParts[1] === 'logs') {
      const page = parseInt(url.searchParams.get('page') || '1');
      const limit = parseInt(url.searchParams.get('limit') || '20');
      const offset = (page - 1) * limit;

      const { data: logs, error: logsError, count } = await supabase
        .from('webhook_logs')
        .select('*', { count: 'exact' })
        .eq('merchant_id', merchant.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (logsError) {
        console.error('Webhook logs error:', logsError);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch webhook logs', details: logsError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          logs: logs.map(log => ({
            id: log.id,
            event_type: log.event_type,
            url: log.url,
            response_status: log.response_status,
            error_message: log.error_message,
            created_at: log.created_at,
            delivered_at: log.delivered_at,
            payload: log.payload,
          })),
          pagination: {
            page,
            limit,
            total: count || 0,
            total_pages: Math.ceil((count || 0) / limit),
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
