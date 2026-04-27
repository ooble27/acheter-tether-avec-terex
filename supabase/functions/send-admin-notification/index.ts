
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

// Import des templates d'emails admin
import { AdminNotificationEmail } from './_templates/admin-notification.tsx';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { notificationType, data, adminUserId } = await req.json();

    console.log('Notification admin:', { notificationType, dataKeys: Object.keys(data || {}) });

    // Email admin fixe
    const adminEmail = "terangaexchange@gmail.com";

    // ───── Enrichissement serveur des données client (pour new_order et status_update) ─────
    let enrichedData: any = { ...data };
    try {
      const targetUid = data?.userId || data?.user_id || null;
      if (targetUid && (notificationType === 'new_order' || notificationType === 'status_update')) {
        // Profile (téléphone, nom)
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name, last_name, phone')
          .eq('id', targetUid)
          .maybeSingle();

        // Auth user (email + metadata)
        const { data: authU } = await supabase.auth.admin.getUserById(targetUid);
        const meta: any = authU?.user?.user_metadata || {};

        const firstName = (profile as any)?.first_name || meta.first_name || meta.firstName || '';
        const lastName = (profile as any)?.last_name || meta.last_name || meta.lastName || '';
        const fullName = (profile as any)?.full_name || meta.full_name || `${firstName} ${lastName}`.trim();

        enrichedData = {
          ...enrichedData,
          user_id: targetUid,
          client_first_name: firstName || undefined,
          client_last_name: lastName || undefined,
          client_name: fullName || undefined,
          client_email: authU?.user?.email || enrichedData.email,
          client_phone: (profile as any)?.phone || meta.phone || enrichedData.phone,
        };

        // Si on a un orderId, récupérer plus de détails (notes, wallet, méthode...)
        const orderId = data?.orderId || data?.id;
        if (orderId && notificationType === 'new_order') {
          const { data: order } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .maybeSingle();
          if (order) {
            // Parse notes JSON pour extraire provider/numero
            let notesInfo: any = null;
            try { if ((order as any).notes) notesInfo = JSON.parse((order as any).notes); } catch (_) {}
            enrichedData = {
              ...enrichedData,
              ...(order as any),
              id: orderId,
              provider: notesInfo?.provider || (order as any).payment_method,
              phone_number: notesInfo?.phoneNumber || (order as any).phone_number,
            };
          }
        }
      }
    } catch (enrichErr) {
      console.warn('Enrichissement client échoué (non bloquant):', enrichErr);
    }

    let subject = '';
    let emailContent = '';

    switch (notificationType) {
      case 'new_order':
        const orderTypeText = enrichedData.type === 'buy' ? 'Achat USDT' :
                            enrichedData.type === 'sell' ? 'Vente USDT' : 'Transfert International';
        const clientLabel = enrichedData.client_name ? ` · ${enrichedData.client_name}` : '';
        subject = `🔔 Nouvelle commande ${orderTypeText} — ${Number(enrichedData.amount || 0).toLocaleString('fr-FR')} ${enrichedData.currency || 'CFA'}${clientLabel}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'new_order',
            data: enrichedData,
          })
        );
        break;

      case 'kyc_submission':
        subject = `🆔 Nouvelle vérification KYC — ${data.firstName} ${data.lastName}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'kyc_submission',
            data: enrichedData,
          })
        );
        break;

      case 'high_volume_request':
        subject = `💎 Demande de gros volume — ${data.clientInfo?.firstName} ${data.clientInfo?.lastName} · ${Number(data.clientInfo?.amount || 0).toLocaleString('fr-FR')} CFA`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'high_volume_request',
            data: enrichedData,
          })
        );
        break;

      case 'status_update':
        subject = `📊 Mise à jour commande #${data.orderId.slice(-8)} → ${data.newStatus}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'status_update',
            data: enrichedData,
          })
        );
        break;

      default:
        throw new Error(`Type de notification non supporté: ${notificationType}`);
    }

    console.log('Envoi notification admin à:', adminEmail, 'Sujet:', subject);

    // Envoyer l'email avec Resend
    const emailResponse = await resend.emails.send({
      from: "Terex Admin <admin@terangaexchange.com>",
      to: [adminEmail],
      subject: subject,
      html: emailContent,
    });

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      throw emailResponse.error;
    }

    console.log('Notification admin envoyée avec succès:', emailResponse);

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erreur dans send-admin-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
