
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

    console.log('Notification admin:', { notificationType, data });

    // Email admin fixe
    const adminEmail = "terangaexchange@gmail.com";

    let subject = '';
    let emailContent = '';

    switch (notificationType) {
      case 'new_order':
        const orderTypeText = data.type === 'buy' ? 'Achat USDT' : 
                            data.type === 'sell' ? 'Vente USDT' : 'Transfert International';
        subject = `🔔 Nouvelle commande ${orderTypeText} - ${data.amount} ${data.currency}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'new_order',
            data
          })
        );
        break;

      case 'kyc_submission':
        subject = `🆔 Nouvelle vérification KYC - ${data.firstName} ${data.lastName}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'kyc_submission',
            data
          })
        );
        break;

      case 'status_update':
        subject = `📊 Mise à jour commande #${data.orderId.slice(-8)} - ${data.newStatus}`;
        emailContent = await renderAsync(
          React.createElement(AdminNotificationEmail, {
            notificationType: 'status_update',
            data
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
