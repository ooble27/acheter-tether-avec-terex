import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Délai avant annulation automatique d'un ACHAT non payé (minutes)
const STALE_MINUTES = 30;

const CANCEL_REASON =
  "Paiement non reçu dans le délai de 30 minutes. Votre commande a été annulée automatiquement — aucun montant n'a été débité. Vous pouvez créer une nouvelle commande à tout moment.";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const cutoff = new Date(Date.now() - STALE_MINUTES * 60 * 1000).toISOString();

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

    const results: Array<{ id: string; cancelled: boolean; emailed: boolean }> = [];

    for (const order of staleOrders || []) {
      // Annuler la commande (garde une trace du motif dans notes)
      let notes: any = {};
      try { notes = order.notes ? JSON.parse(order.notes) : {}; } catch (_) { /* notes non-JSON */ }
      notes.auto_cancelled = true;
      notes.auto_cancelled_at = new Date().toISOString();
      notes.auto_cancel_reason = 'payment_not_received_30min';

      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'cancelled',
          notes: JSON.stringify(notes),
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
        .eq('status', 'pending'); // garde-fou : ne pas écraser un statut qui vient de changer

      if (updateError) {
        console.error('Annulation impossible pour', order.id, updateError);
        results.push({ id: order.id, cancelled: false, emailed: false });
        continue;
      }

      // Email d'annulation au client (même template que l'annulation manuelle)
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

      console.log(`Commande ${order.id} annulée automatiquement (impayée > ${STALE_MINUTES} min), email: ${emailed}`);
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
