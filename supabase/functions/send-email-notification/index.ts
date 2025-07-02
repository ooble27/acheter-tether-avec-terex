
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

// Import des templates d'emails
import { OrderConfirmationEmail } from './_templates/order-confirmation.tsx';
import { StatusUpdateEmail } from './_templates/status-update.tsx';
import { PaymentConfirmedEmail } from './_templates/payment-confirmed.tsx';
import { TransferConfirmationEmail } from './_templates/transfer-confirmation.tsx';
import { KYCApprovedEmail } from './_templates/kyc-approved-email.tsx';
import { ContactNotificationEmail } from './_templates/contact-notification.tsx';

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
    const { 
      userId, 
      orderId, 
      emailAddress, 
      emailType, 
      transactionType, 
      orderData 
    } = await req.json();

    console.log('Début de l\'envoi d\'email:', {
      userId,
      emailType,
      transactionType,
      emailAddress,
      orderData: orderData ? 'présent' : 'absent'
    });

    let finalEmailAddress = emailAddress;
    
    // Pour les transferts, utiliser directement l'userId passé (qui est celui du client)
    const targetUserId = userId;
    console.log('Utilisation de l\'ID utilisateur:', targetUserId);

    // Récupérer l'email de l'utilisateur s'il n'est pas fourni
    if (!emailAddress && targetUserId) {
      console.log('Récupération de l\'email pour l\'utilisateur:', targetUserId);
      
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(targetUserId);
      
      if (authError || !authUser.user?.email) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', authError);
        throw new Error('Impossible de récupérer l\'email de l\'utilisateur');
      }
      
      finalEmailAddress = authUser.user.email;
      console.log('Email trouvé pour l\'utilisateur:', targetUserId, '-> Email:', finalEmailAddress);
    }

    if (!finalEmailAddress) {
      throw new Error('Adresse email manquante');
    }

    // Générer le contenu de l'email en fonction du type
    let subject = '';
    let htmlContent = '';

    switch (emailType) {
      case 'order_confirmation':
        if (transactionType === 'buy') {
          subject = `Votre demande d'achat de ${orderData.usdt_amount || 0} USDT a été reçue`;
        } else if (transactionType === 'sell') {
          subject = `Votre demande de vente de ${orderData.usdt_amount || 0} USDT a été reçue`;
        } else {
          subject = `Votre demande a été reçue - TEREX-${orderData.id?.slice(-8)}`;
        }
        htmlContent = await renderAsync(
          React.createElement(OrderConfirmationEmail, {
            orderData,
            transactionType: transactionType as 'buy' | 'sell'
          })
        );
        break;

      case 'status_update':
        if (transactionType === 'buy') {
          subject = `Mise à jour de votre achat USDT - En cours de traitement`;
        } else if (transactionType === 'sell') {
          subject = `Mise à jour de votre vente USDT - En cours de traitement`;
        } else if (transactionType === 'transfer') {
          subject = `Mise à jour de votre transfert - En cours de traitement`;
        } else {
          subject = `Mise à jour de votre transaction - En cours de traitement`;
        }
        htmlContent = await renderAsync(
          React.createElement(StatusUpdateEmail, {
            orderData,
            transactionType
          })
        );
        break;

      case 'payment_confirmed':
        if (transactionType === 'buy') {
          subject = `Votre achat de ${orderData.usdt_amount || 0} USDT a été finalisé avec succès`;
        } else if (transactionType === 'sell') {
          subject = `Votre vente de ${orderData.usdt_amount || 0} USDT a été finalisée avec succès`;
        } else if (transactionType === 'transfer') {
          subject = `Votre transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} à ${orderData.recipient_name} a été déposé avec succès`;
        } else {
          subject = `Votre transaction a été finalisée avec succès`;
        }
        
        // Pour les transferts, créer un objet compatible avec PaymentConfirmedEmail
        let emailData = orderData;
        if (transactionType === 'transfer') {
          emailData = {
            ...orderData,
            notes: null, // Pas de notes pour les transferts internationaux
            type: 'transfer'
          };
        }
        
        htmlContent = await renderAsync(
          React.createElement(PaymentConfirmedEmail, {
            orderData: emailData,
            transactionType
          })
        );
        break;

      case 'transfer_confirmation':
        subject = `Votre transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} à ${orderData.recipient_name} a été confirmé`;
        htmlContent = await renderAsync(
          React.createElement(TransferConfirmationEmail, {
            transferData: orderData
          })
        );
        break;

      case 'contact_message':
        // Email de confirmation pour le client
        subject = `Nous avons bien reçu votre message - ${orderData.subject}`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Merci pour votre message !</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${orderData.user_name},</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Nous avons bien reçu votre message concernant "<strong>${orderData.subject}</strong>" et nous vous remercions de nous avoir contactés.
              </p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0;">
                <h3 style="color: #333; margin-top: 0;">Votre message :</h3>
                <p style="color: #555; line-height: 1.6; font-style: italic;">"${orderData.message}"</p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Notre équipe va examiner votre demande et vous répondra dans les plus brefs délais, généralement sous 24 heures.
              </p>
              
              <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #1976d2; margin: 0; text-align: center;">
                  💬 <strong>Besoin d'une réponse urgente ?</strong><br>
                  Contactez-nous sur WhatsApp : <a href="https://wa.me/14182619091" style="color: #1976d2;">+1 418 261 9091</a>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
              <p>Cordialement,<br><strong>L'équipe Terex</strong></p>
              <p style="margin-top: 20px;">
                <a href="https://app.terangaexchange.com" style="color: #667eea; text-decoration: none;">app.terangaexchange.com</a>
              </p>
            </div>
          </div>
        `;

        // Envoyer aussi une notification à l'équipe Terex
        try {
          const teamNotificationHtml = await renderAsync(
            React.createElement(ContactNotificationEmail, {
              contactData: orderData
            })
          );

          await resend.emails.send({
            from: "Terex <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `🔔 Nouveau message de contact - ${orderData.subject}`,
            html: teamNotificationHtml,
          });

          console.log('Notification envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification équipe:', teamError);
        }
        break;

      case 'kyc_approved':
        subject = `🎉 Félicitations ! Votre vérification d'identité a été approuvée - Accédez à votre compte Terex`;
        
        // Générer un lien de connexion magique pour l'utilisateur
        const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: finalEmailAddress,
          options: {
            redirectTo: `${supabaseUrl.replace('.supabase.co', '.supabase.co')}/auth/callback?redirect_to=${encodeURIComponent('https://app.terangaexchange.com/')}`
          }
        });

        if (magicLinkError) {
          console.error('Erreur lors de la génération du lien magique:', magicLinkError);
          throw new Error('Impossible de générer le lien de connexion');
        }

        htmlContent = await renderAsync(
          React.createElement(KYCApprovedEmail, {
            magicLink: magicLinkData.properties?.action_link || '#',
            userFirstName: orderData.first_name || 'Cher utilisateur',
            userLastName: orderData.last_name || ''
          })
        );
        break;

      default:
        throw new Error(`Type d'email non supporté: ${emailType}`);
    }

    // Sauvegarder la notification dans la base de données
    const notificationData: any = {
      user_id: targetUserId,
      email_address: finalEmailAddress,
      email_type: emailType,
      transaction_type: transactionType,
      subject: subject,
      status: 'pending'
    };

    // Seulement ajouter order_id si ce n'est pas un transfert international
    if (transactionType !== 'transfer' && orderId) {
      notificationData.order_id = orderId;
    }

    const { data: notification, error: notificationError } = await supabase
      .from('email_notifications')
      .insert(notificationData)
      .select()
      .single();

    if (notificationError) {
      console.error('Erreur lors de la création de la notification:', notificationError);
    } else {
      console.log('Notification créée:', notification.id);
    }

    console.log('Envoi de l\'email à:', finalEmailAddress, 'Sujet:', subject);

    // Envoyer l'email avec Resend
    const emailResponse = await resend.emails.send({
      from: "Terex <noreply@terangaexchange.com>",
      to: [finalEmailAddress],
      subject: subject,
      html: htmlContent,
    });

    if (emailResponse.error) {
      console.error('Erreur Resend:', emailResponse.error);
      
      // Mettre à jour le statut de la notification
      if (notification?.id) {
        await supabase
          .from('email_notifications')
          .update({
            status: 'failed',
            error_message: emailResponse.error.message,
            sent_at: new Date().toISOString()
          })
          .eq('id', notification.id);
      }
      
      throw emailResponse.error;
    }

    console.log('Email envoyé avec succès:', emailResponse);

    // Mettre à jour le statut de la notification comme réussie
    if (notification?.id) {
      await supabase
        .from('email_notifications')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString()
        })
        .eq('id', notification.id);
    }

    return new Response(JSON.stringify({ success: true, data: emailResponse }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Erreur dans send-email-notification:", error);
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
