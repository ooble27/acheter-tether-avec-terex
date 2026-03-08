import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { encode as hexEncode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BINANCE_API_URL = 'https://api.binance.com';

// Mapping réseau Terex -> nom réseau Binance
const NETWORK_MAP: Record<string, string> = {
  'TRC20': 'TRX',
  'BEP20': 'BSC',
  'ERC20': 'ETH',
  'Polygon': 'MATIC',
  'Solana': 'SOL',
  'Arbitrum': 'ARBITRUM',
  'Base': 'BASE',
  'Aptos': 'APT',
};

// Coin name for USDT on Binance
const COIN = 'USDT';

async function signRequest(queryString: string, apiSecret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(queryString));
  return [...new Uint8Array(signature)].map(b => b.toString(16).padStart(2, '0')).join('');
}

async function binanceWithdraw(
  address: string,
  amount: number,
  network: string,
  apiKey: string,
  apiSecret: string,
  orderId: string
): Promise<{ success: boolean; txId?: string; binanceId?: string; error?: string }> {
  const binanceNetwork = NETWORK_MAP[network];
  if (!binanceNetwork) {
    return { success: false, error: `Réseau non supporté: ${network}` };
  }

  const timestamp = Date.now();
  const params = new URLSearchParams({
    coin: COIN,
    address: address,
    amount: amount.toFixed(4),
    network: binanceNetwork,
    withdrawOrderId: `terex-${orderId}`,
    timestamp: timestamp.toString(),
  });

  const queryString = params.toString();
  const signature = await signRequest(queryString, apiSecret);

  const url = `${BINANCE_API_URL}/sapi/v1/capital/withdraw/apply?${queryString}&signature=${signature}`;

  console.log(`Binance withdraw request: ${amount} USDT to ${address} on ${binanceNetwork}`);

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'X-MBX-APIKEY': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('Binance withdraw error:', data);
    return { 
      success: false, 
      error: `Binance error ${data.code}: ${data.msg}` 
    };
  }

  console.log('Binance withdraw success:', data);
  return { 
    success: true, 
    binanceId: data.id 
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: 'orderId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const BINANCE_API_KEY = Deno.env.get('BINANCE_API_KEY');
    const BINANCE_API_SECRET = Deno.env.get('BINANCE_API_SECRET');

    if (!BINANCE_API_KEY || !BINANCE_API_SECRET) {
      console.error('Binance API credentials not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Binance API not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Récupérer les détails de la commande
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
      return new Response(
        JSON.stringify({ success: false, error: 'Order not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Vérifier que la commande est en statut processing et paiement confirmé
    if (order.status !== 'processing' || order.payment_status !== 'confirmed') {
      console.log(`Order ${orderId} not ready for sending: status=${order.status}, payment=${order.payment_status}`);
      return new Response(
        JSON.stringify({ success: false, error: 'Order not ready for USDT sending' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Vérifier que c'est un ordre d'achat
    if (order.type !== 'buy') {
      return new Response(
        JSON.stringify({ success: false, error: 'Only buy orders can trigger USDT sending' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const walletAddress = order.wallet_address;
    const network = order.network;
    const usdtAmount = order.usdt_amount;

    if (!walletAddress || !network || !usdtAmount) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing wallet_address, network, or usdt_amount' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Si c'est Binance Pay (pas de réseau blockchain), on skip l'envoi auto
    if (network === 'BINANCE') {
      console.log('Binance Pay order - skipping auto withdrawal, needs Binance Pay transfer');
      await supabase.from('orders').update({
        notes: JSON.stringify({
          ...JSON.parse(order.notes || '{}'),
          auto_send_status: 'binance_pay_manual',
          auto_send_message: 'Binance Pay transfer requires manual processing'
        }),
        updated_at: new Date().toISOString()
      }).eq('id', orderId);

      return new Response(
        JSON.stringify({ success: false, error: 'Binance Pay orders need manual processing' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    console.log(`Processing auto-send: ${usdtAmount} USDT to ${walletAddress} on ${network}`);

    // Effectuer le retrait via Binance
    const result = await binanceWithdraw(
      walletAddress,
      usdtAmount,
      network,
      BINANCE_API_KEY,
      BINANCE_API_SECRET,
      orderId
    );

    if (result.success) {
      // Mettre à jour la commande comme complétée
      await supabase.from('orders').update({
        status: 'completed',
        processed_at: new Date().toISOString(),
        notes: JSON.stringify({
          ...JSON.parse(order.notes || '{}'),
          auto_send_status: 'completed',
          binance_withdraw_id: result.binanceId,
          auto_sent_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }).eq('id', orderId);

      // Envoyer notification email au client
      await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: order.user_id,
          emailType: 'payment_confirmed',
          transactionType: 'buy'
        }
      });

      console.log(`Auto-send completed for order ${orderId}, Binance ID: ${result.binanceId}`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          binanceId: result.binanceId,
          message: 'USDT sent successfully via Binance'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    } else {
      // Échec - noter l'erreur mais garder en processing pour retry/manual
      await supabase.from('orders').update({
        notes: JSON.stringify({
          ...JSON.parse(order.notes || '{}'),
          auto_send_status: 'failed',
          auto_send_error: result.error,
          auto_send_attempted_at: new Date().toISOString()
        }),
        updated_at: new Date().toISOString()
      }).eq('id', orderId);

      console.error(`Auto-send failed for order ${orderId}: ${result.error}`);

      // Notifier l'admin de l'échec
      await supabase.functions.invoke('send-admin-notification', {
        body: {
          type: 'auto_send_failed',
          orderId: orderId,
          error: result.error
        }
      });

      return new Response(
        JSON.stringify({ success: false, error: result.error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

  } catch (error) {
    console.error('Error in send-usdt:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
