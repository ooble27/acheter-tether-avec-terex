import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Délai avant annulation automatique d'un ACHAT non payé (minutes)
const STALE_MINUTES = 30;

// Délai étendu pour les commandes dont le paiement est en cours sur NabooPay (minutes).
// Wave direct > 200 000 FCFA peut prendre plus de 30 min pour confirmer.
const STALE_MINUTES_WITH_PAYMENT = 120;

const CANCEL_REASON =
  "Paiement non reçu dans le délai imparti. Votre commande a été annulée automatiquement — aucun montant n'a été débité. Vous pouvez créer une nouvelle commande à tout moment.";

// Statuts NabooPay considérés comme « paiement en cours » — ne pas annuler.
const NABOOPAY_IN_PROGRESS_STATUSES = new Set([
  'pending', 'processing', 'initiated', 'in_progress', 'waiting',
]);

// Statuts NabooPay qui confirment le paiement — mettre à jour l'ordre.
const NABOOPAY_SUCCESS_STATUSES = new Set([
  'completed', 'success', 'paid',
]);

async function checkNaboopayStatus(
  naboopayOrderId: string,
  apiKey: string,
): Promise<{ status: string | null; raw: any }> {
  try {
    const res = await fetch(
      `https://api.naboopay.com/api/v1/transaction/get-one-transaction?order_id=${naboopayOrderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!res.ok) {
      console.error('NabooPay status check failed:', res.status, await res.text());
      return { status: null, raw: null };
    }
    const data = await res.json();
    return { status: data.transaction_status ?? null, raw: data };
  } catch (e) {
    console.error('NabooPay status check error:', e);
    return { status: null, raw: null };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const naboopayApiKey = Deno.env.get('NABOOPAY_API_KEY') ?? '';

    const cutoff = new Date(Date.now() - STALE_MINUTES * 60 * 1000).toISOString();
    const extendedCutoff = new Date(Date.now() - STALE_MINUTES_WITH_PAYMENT * 60 * 1000).toISOString();

    // ACHATS uniquement : toujours en attente, paiement jamais confirmé par
    // le webhook Naboopay (payment_status reste 'pending'), créés il y a +30 min.
    const { data: staleOrders, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('type', 'buy')
      .eq('status', 'pending')
      .neq('payment_status', 'confirmed')
      .lt('created_at', cutoff);

    if (fetchError) throw fetchError;

    const results: Array<{ id: string; cancelled: boolean; emailed: boolean; reason?: string }> = [];

    for (const order of staleOrders || []) {
      // Si l'ordre a un payment_reference (transaction NabooPay créée),
      // vérifier le statut réel chez NabooPay avant d'annuler.
      if (order.payment_reference && naboopayApiKey) {
        const { status: nbStatus } = await checkNaboopayStatus(order.payment_reference, naboopayApiKey);

        if (nbStatus && NABOOPAY_SUCCESS_STATUSES.has(nbStatus)) {
          // Le paiement a bien été reçu — mettre à jour l'ordre au lieu de l'annuler.
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              payment_status: 'confirmed',
              status: 'processing',
              processed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('id', order.id)
            .eq('status', 'pending');

          if (!updateError) {
            console.log(`Commande ${order.id} : paiement confirmé via NabooPay (${nbStatus}), non annulée.`);
            // Déclencher l'envoi auto de USDT
            try {
              await supabase.functions.invoke('send-usdt', { body: { orderId: order.id } });
            } catch (e) {
              console.error('Auto-send USDT error pour', order.id, e);
            }
          }
          results.push({ id: order.id, cancelled: false, emailed: false, reason: `naboopay_${nbStatus}` });
          continue;
        }

        if (nbStatus && NABOOPAY_IN_PROGRESS_STATUSES.has(nbStatus)) {
          // Paiement toujours en cours — accorder le délai étendu.
          const createdAt = new Date(order.created_at).getTime();
          const extendedLimit = new Date(extendedCutoff).getTime();
          if (createdAt > extendedLimit) {
            console.log(`Commande ${order.id} : paiement en cours sur NabooPay (${nbStatus}), délai étendu.`);
            results.push({ id: order.id, cancelled: false, emailed: false, reason: `naboopay_in_progress_${nbStatus}` });
            continue;
          }
          // Si > délai étendu, on annule quand même (le paiement n'a pas abouti).
        }
        // Si NabooPay renvoie un statut d'échec ou inconnu, on continue l'annulation.
      }

      // Annuler la commande (garde une trace du motif dans notes)
      let notes: any = {};
      try { notes = order.notes ? JSON.parse(order.notes) : {}; } catch (_) { /* notes non-JSON */ }
      notes.auto_cancelled = true;
      notes.auto_cancelled_at = new Date().toISOString();
      notes.auto_cancel_reason = 'payment_not_received';

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: JSON.stringify(notes),
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
        .eq('status', 'pending');

      if (updateError) {
        console.error('Annulation impossible pour', order.id, updateError);
        results.push({ id: order.id, cancelled: false, emailed: false });
        continue;
      }

      // Email d'annulation au client
      let emailed = false;
      try {
        const { error: emailError } = await supabase.functions.invoke('send-email-notification', {
          body: {
            userId: order.user_id,
            orderId: order.id,
            emailAddress: null,
            emailType: 'cancellation_confirmation',
            transactionType: 'buy',
            orderData: { ...order, status: 'cancelled', cancellation_reason: CANCEL_REASON },
          },
        });
        emailed = !emailError;
        if (emailError) console.error('Email annulation échoué pour', order.id, emailError);
      } catch (e) {
        console.error('Email annulation erreur pour', order.id, e);
      }

      console.log(`Commande ${order.id} annulée automatiquement (impayée), email: ${emailed}`);
      results.push({ id: order.id, cancelled: true, emailed });
    }

    return new Response(
      JSON.stringify({ success: true, checked_before: cutoff, cancelled: results.filter(r => r.cancelled).length, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (e) {
    console.error('auto-cancel-stale-orders error:', e);
    return new Response(
      JSON.stringify({ success: false, error: String((e as Error).message || e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
