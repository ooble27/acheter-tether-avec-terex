
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailNotificationRequest {
  userId: string;
  orderId?: string;
  emailAddress: string;
  emailType: string;
  transactionType: string;
  orderData?: any;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateEmailContent = (emailType: string, transactionType: string, orderData: any) => {
  const baseUrl = "https://app.terangaexchange.com";
  
  switch (emailType) {
    case 'order_confirmation':
      if (transactionType === 'buy') {
        return {
          subject: `Confirmation de votre achat USDT - ${orderData.amount} ${orderData.currency}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #1a202c;">Confirmation d'achat USDT</h1>
              <p>Bonjour,</p>
              <p>Nous avons bien reçu votre commande d'achat USDT. Voici les détails :</p>
              
              <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Détails de la commande</h3>
                <p><strong>Montant :</strong> ${orderData.amount} ${orderData.currency}</p>
                <p><strong>USDT à recevoir :</strong> ${orderData.usdt_amount} USDT</p>
                <p><strong>Taux de change :</strong> ${orderData.exchange_rate}</p>
                <p><strong>Réseau :</strong> ${orderData.network}</p>
                <p><strong>Adresse wallet :</strong> ${orderData.wallet_address}</p>
                <p><strong>Méthode de paiement :</strong> ${orderData.payment_method === 'card' ? 'Carte bancaire' : 'Mobile Money'}</p>
              </div>
              
              <p>Votre commande est en cours de traitement. Vous recevrez une notification dès que le paiement sera confirmé.</p>
              
              <p>
                <a href="${baseUrl}" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                  Voir ma commande
                </a>
              </p>
              
              <p>Cordialement,<br>L'équipe Teranga Exchange</p>
            </div>
          `
        };
      }
      break;
      
    case 'status_update':
      return {
        subject: `Mise à jour de votre commande - Statut: ${orderData.status}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a202c;">Mise à jour de votre commande</h1>
            <p>Bonjour,</p>
            <p>Le statut de votre commande a été mis à jour :</p>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Nouveau statut :</strong> ${orderData.status}</p>
              <p><strong>Montant :</strong> ${orderData.amount} ${orderData.currency}</p>
              <p><strong>USDT :</strong> ${orderData.usdt_amount} USDT</p>
            </div>
            
            <p>
              <a href="${baseUrl}" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Voir ma commande
              </a>
            </p>
            
            <p>Cordialement,<br>L'équipe Teranga Exchange</p>
          </div>
        `
      };
      
    default:
      return {
        subject: "Notification Teranga Exchange",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1a202c;">Notification</h1>
            <p>Vous avez reçu une nouvelle notification de Teranga Exchange.</p>
            <p>
              <a href="${baseUrl}" style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                Accéder à votre compte
              </a>
            </p>
            <p>Cordialement,<br>L'équipe Teranga Exchange</p>
          </div>
        `
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, orderId, emailAddress, emailType, transactionType, orderData }: EmailNotificationRequest = await req.json();

    // Créer l'enregistrement de notification
    const { data: notification, error: notificationError } = await supabase
      .from('email_notifications')
      .insert({
        user_id: userId,
        order_id: orderId,
        email_address: emailAddress,
        email_type: emailType,
        transaction_type: transactionType,
        subject: generateEmailContent(emailType, transactionType, orderData)?.subject || 'Notification Teranga Exchange',
        status: 'pending'
      })
      .select()
      .single();

    if (notificationError) {
      console.error('Erreur lors de la création de la notification:', notificationError);
      throw notificationError;
    }

    // Générer le contenu de l'email
    const emailContent = generateEmailContent(emailType, transactionType, orderData);
    
    if (!emailContent) {
      throw new Error('Type d\'email non supporté');
    }

    // Envoyer l'email avec Resend
    const emailResponse = await resend.emails.send({
      from: "Teranga Exchange <noreply@terangaexchange.com>",
      to: [emailAddress],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email envoyé avec succès:", emailResponse);

    // Mettre à jour le statut de la notification
    await supabase
      .from('email_notifications')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('id', notification.id);

    return new Response(JSON.stringify({ 
      success: true, 
      notificationId: notification.id,
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erreur lors de l'envoi de l'email:", error);

    // Si nous avons une notification en cours, marquer comme échec
    if (error.notificationId) {
      await supabase
        .from('email_notifications')
        .update({
          status: 'failed',
          error_message: error.message
        })
        .eq('id', error.notificationId);
    }

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
