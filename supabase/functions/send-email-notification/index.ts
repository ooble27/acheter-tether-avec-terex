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

      case 'job_application':
        // Email de confirmation pour le candidat
        subject = `Candidature reçue - ${orderData.position} chez Terex`;
        htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <!-- Header avec gradient Terex -->
            <div style="background: linear-gradient(135deg, #3B968F 0%, #4BA89F 100%); color: white; padding: 40px 30px; text-align: center;">
              <div style="margin-bottom: 20px;">
                <h1 style="margin: 0; font-size: 32px; font-weight: 800; letter-spacing: 2px;">TEREX</h1>
                <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9; font-weight: 400;">Plateforme d'échange crypto & transferts internationaux</p>
              </div>
              <div style="width: 60px; height: 2px; background: rgba(255, 255, 255, 0.3); margin: 20px auto;"></div>
              <h2 style="margin: 0; font-size: 24px; font-weight: 600;">Candidature reçue avec succès</h2>
            </div>
            
            <!-- Contenu principal -->
            <div style="padding: 40px 30px;">
              <div style="background: #f8fafc; padding: 30px; border-radius: 12px; border-left: 4px solid #3B968F; margin-bottom: 30px;">
                <h3 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">Bonjour ${orderData.first_name},</h3>
                
                <p style="color: #475569; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
                  Nous avons bien reçu votre candidature pour le poste de <strong style="color: #3B968F;">${orderData.position}</strong> chez Terex.
                </p>
                
                <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin: 20px 0;">
                  <h4 style="color: #3B968F; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Récapitulatif de votre candidature</h4>
                  <div style="display: flex; flex-direction: column; gap: 8px;">
                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Poste :</strong> ${orderData.position}</p>
                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Nom :</strong> ${orderData.first_name} ${orderData.last_name}</p>
                    <p style="margin: 0; color: #475569; font-size: 14px;"><strong>Email :</strong> ${orderData.email}</p>
                    ${orderData.experience_years ? `<p style="margin: 0; color: #475569; font-size: 14px;"><strong>Expérience :</strong> ${orderData.experience_years} années</p>` : ''}
                    ${orderData.location ? `<p style="margin: 0; color: #475569; font-size: 14px;"><strong>Localisation :</strong> ${orderData.location}</p>` : ''}
                  </div>
                </div>
              </div>
              
              <!-- Prochaines étapes -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #bfdbfe;">
                <h4 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚀 Prochaines étapes</h4>
                <ul style="color: #475569; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Notre équipe RH va examiner votre candidature dans les <strong>48 heures</strong></li>
                  <li style="margin-bottom: 8px;">Si votre profil correspond à nos besoins, nous vous contacterons pour un premier entretien</li>
                  <li style="margin-bottom: 8px;">Le processus de recrutement comprend généralement 2-3 étapes d'entretiens</li>
                  <li>Vous recevrez une notification par email à chaque étape</li>
                </ul>
              </div>
              
              <!-- À propos du poste -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #f7fee7 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid #bbf7d0;">
                <h4 style="color: #15803d; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">💼 À propos de ${orderData.position}</h4>
                <p style="color: #475569; line-height: 1.6; margin: 0;">
                  Un rôle clé pour contribuer à notre mission de révolutionner les transferts d'argent et les échanges crypto en Afrique. 
                  Rejoignez une équipe passionnée et innovante qui façonne l'avenir de la fintech africaine.
                </p>
              </div>
              
              <!-- Support -->
              <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                <p style="color: #92400e; margin: 0; text-align: center; font-size: 14px;">
                  <strong>💬 Des questions sur votre candidature ?</strong><br>
                  Contactez-nous : <a href="mailto:terangaexchange@gmail.com" style="color: #b45309; text-decoration: none;">terangaexchange@gmail.com</a> | 
                  WhatsApp : <a href="https://wa.me/14182619091" style="color: #b45309; text-decoration: none;">+1 418 261 9091</a>
                </p>
              </div>
            </div>
            
            <!-- Footer -->
            <div style="background: #f1f5f9; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">
                Cordialement,<br><span style="color: #3B968F; font-weight: 700;">L'équipe Terex</span>
              </p>
              <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">
                <a href="https://app.terangaexchange.com" style="color: #3B968F; text-decoration: none; font-weight: 500;">app.terangaexchange.com</a>
              </p>
              <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                  © 2025 Terex. Tous droits réservés.<br>
                  Fondé par Mohamed Lo • Basé au Sénégal, Dakar
                </p>
              </div>
            </div>
          </div>
        `;

        // Envoyer aussi une notification à l'équipe RH Terex
        try {
          const adminNotificationHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
              <!-- Header Admin -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px; font-weight: 700;">🔔 NOUVELLE CANDIDATURE</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Système de recrutement Terex</p>
              </div>
              
              <div style="padding: 30px;">
                <div style="background: #f8fafc; padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 4px solid #3B968F;">
                  <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 22px; font-weight: 600;">
                    Poste : ${orderData.position}
                  </h2>
                  
                  <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                    <h3 style="color: #3B968F; margin: 0 0 15px 0; font-size: 18px;">👤 Informations du candidat</h3>
                    <div style="display: grid; gap: 10px;">
                      <p style="margin: 0; color: #475569;"><strong>Nom complet :</strong> ${orderData.first_name} ${orderData.last_name}</p>
                      <p style="margin: 0; color: #475569;"><strong>Email :</strong> <a href="mailto:${orderData.email}" style="color: #3B968F;">${orderData.email}</a></p>
                      ${orderData.phone ? `<p style="margin: 0; color: #475569;"><strong>Téléphone :</strong> <a href="tel:${orderData.phone}" style="color: #3B968F;">${orderData.phone}</a></p>` : ''}
                      ${orderData.location ? `<p style="margin: 0; color: #475569;"><strong>Localisation :</strong> ${orderData.location}</p>` : ''}
                      ${orderData.experience_years ? `<p style="margin: 0; color: #475569;"><strong>Années d'expérience :</strong> ${orderData.experience_years}</p>` : ''}
                      ${orderData.availability ? `<p style="margin: 0; color: #475569;"><strong>Disponibilité :</strong> ${orderData.availability}</p>` : ''}
                      ${orderData.salary_expectation ? `<p style="margin: 0; color: #475569;"><strong>Prétentions salariales :</strong> ${orderData.salary_expectation}</p>` : ''}
                    </div>
                  </div>
                  
                  ${orderData.linkedin_profile || orderData.portfolio_url ? `
                    <div style="background: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px;">
                      <h3 style="color: #3B968F; margin: 0 0 15px 0; font-size: 18px;">🔗 Liens professionnels</h3>
                      ${orderData.linkedin_profile ? `<p style="margin: 0 0 10px 0; color: #475569;"><strong>LinkedIn :</strong> <a href="${orderData.linkedin_profile}" style="color: #0077b5;" target="_blank">${orderData.linkedin_profile}</a></p>` : ''}
                      ${orderData.portfolio_url ? `<p style="margin: 0; color: #475569;"><strong>Portfolio :</strong> <a href="${orderData.portfolio_url}" style="color: #3B968F;" target="_blank">${orderData.portfolio_url}</a></p>` : ''}
                    </div>
                  ` : ''}
                </div>
                
                ${orderData.cover_letter ? `
                  <div style="background: #ffffff; padding: 25px; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 25px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
                    <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📝 Lettre de motivation</h3>
                    <div style="background: #fefce8; padding: 20px; border-radius: 8px; border: 1px solid #fde047;">
                      <p style="white-space: pre-wrap; color: #713f12; line-height: 1.6; margin: 0; font-size: 15px;">${orderData.cover_letter}</p>
                    </div>
                  </div>
                ` : ''}
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://app.terangaexchange.com/admin" style="background: linear-gradient(135deg, #3B968F 0%, #4BA89F 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(59, 150, 143, 0.3);">
                    🚀 Voir dans l'admin
                  </a>
                </div>
              </div>
              
              <div style="background: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; margin: 0; font-size: 14px;">
                  <strong>Système de recrutement Terex</strong> - Notification automatique<br>
                  Reçu le ${new Date().toLocaleDateString('fr-FR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          `;

          await resend.emails.send({
            from: "Terex Careers <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `🔔 Nouvelle candidature : ${orderData.position} - ${orderData.first_name} ${orderData.last_name}`,
            html: adminNotificationHtml,
          });

          console.log('Notification RH envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification RH:', teamError);
        }
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
