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
    
    // Pour les candidatures, utiliser directement l'email du candidat
    if (emailType === 'job_application_status_update' && orderData?.email) {
      finalEmailAddress = orderData.email;
      console.log('Utilisation de l\'email du candidat:', finalEmailAddress);
    }
    // Pour les transferts, utiliser directement l'userId passé (qui est celui du client)
    else if (transactionType === 'transfer') {
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
    }
    // Pour les autres cas, récupérer l'email de l'utilisateur s'il n'est pas fourni
    else if (!emailAddress && userId) {
      console.log('Récupération de l\'email pour l\'utilisateur:', userId);
      
      const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
      
      if (authError || !authUser.user?.email) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', authError);
        throw new Error('Impossible de récupérer l\'email de l\'utilisateur');
      }
      
      finalEmailAddress = authUser.user.email;
      console.log('Email trouvé pour l\'utilisateur:', userId, '-> Email:', finalEmailAddress);
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
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #0FA958 0%, #08a045 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Candidature reçue avec succès</h1>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
              <h2 style="color: #333; margin-bottom: 20px;">Bonjour ${orderData.first_name},</h2>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                Nous avons bien reçu votre candidature pour le poste de <strong>${orderData.position}</strong> chez Terex.
              </p>
              
              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1976d2; margin-top: 0;">Prochaines étapes</h3>
                <ul style="color: #555; line-height: 1.6;">
                  <li>Notre équipe RH va examiner votre candidature dans les 48 heures</li>
                  <li>Si votre profil correspond à nos besoins, nous vous contacterons pour un premier entretien</li>
                  <li>Le processus de recrutement comprend généralement 2-3 étapes d'entretiens</li>
                </ul>
              </div>
              
              <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #0FA958; margin: 20px 0;">
                <h3 style="color: #0FA958; margin-top: 0;">À propos de ${orderData.position}</h3>
                <p style="color: #555; line-height: 1.6;">Un rôle clé pour contribuer à notre mission de révolutionner les transferts d'argent en Afrique.</p>
              </div>
              
              <p style="color: #555; line-height: 1.6; margin-bottom: 20px;">
                En attendant, n'hésitez pas à nous suivre sur nos réseaux sociaux pour rester informé de nos actualités.
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
              <p>Cordialement,<br><strong>L'équipe Terex</strong></p>
              <p style="margin-top: 20px;">
                <a href="https://app.terangaexchange.com" style="color: #0FA958; text-decoration: none;">app.terangaexchange.com</a>
              </p>
            </div>
          </div>
        `;

        // Envoyer aussi une notification à l'équipe RH Terex
        try {
          const adminNotificationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #0FA958 0%, #08a045 100%); color: white; padding: 30px; border-radius: 10px; text-align: center;">
                <h1 style="margin: 0; font-size: 28px;">Nouvelle Candidature</h1>
              </div>
              
              <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; margin: 20px 0;">
                <h2 style="color: #333; margin-bottom: 20px;">Poste : ${orderData.position}</h2>
                
                <h3 style="color: #0FA958; margin-top: 30px;">Informations du candidat</h3>
                <p><strong>Nom :</strong> ${orderData.first_name} ${orderData.last_name}</p>
                <p><strong>Email :</strong> ${orderData.email}</p>
                ${orderData.phone ? `<p><strong>Téléphone :</strong> ${orderData.phone}</p>` : ''}
                ${orderData.location ? `<p><strong>Localisation :</strong> ${orderData.location}</p>` : ''}
                ${orderData.experience_years ? `<p><strong>Années d'expérience :</strong> ${orderData.experience_years}</p>` : ''}
                ${orderData.availability ? `<p><strong>Disponibilité :</strong> ${orderData.availability}</p>` : ''}
                ${orderData.salary_expectation ? `<p><strong>Prétentions salariales :</strong> ${orderData.salary_expectation}</p>` : ''}
                ${orderData.linkedin_profile ? `<p><strong>LinkedIn :</strong> <a href="${orderData.linkedin_profile}">${orderData.linkedin_profile}</a></p>` : ''}
                ${orderData.portfolio_url ? `<p><strong>Portfolio :</strong> <a href="${orderData.portfolio_url}">${orderData.portfolio_url}</a></p>` : ''}
              </div>
              
              ${orderData.cover_letter ? `
                <div style="background: white; padding: 20px; border-left: 4px solid #0FA958; margin: 20px 0;">
                  <h3 style="color: #0FA958; margin-top: 0;">Lettre de motivation</h3>
                  <p style="white-space: pre-wrap; color: #555; line-height: 1.6;">${orderData.cover_letter}</p>
                </div>
              ` : ''}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="https://app.terangaexchange.com/admin" style="background: #0FA958; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Voir dans l'admin
                </a>
              </div>
            </div>
          `;

          await resend.emails.send({
            from: "Terex Careers <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `🔔 Nouvelle candidature : ${orderData.position}`,
            html: adminNotificationHtml,
          });

          console.log('Notification RH envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification RH:', teamError);
        }
        break;

      case 'job_application_status_update':
        const statusMessages = {
          pending: 'En attente d\'examen',
          reviewing: 'En cours d\'examen',
          interview: 'Entretien programmé',
          accepted: 'Félicitations ! Votre candidature a été acceptée',
          rejected: 'Candidature non retenue'
        };

        const statusMessage = statusMessages[orderData.status as keyof typeof statusMessages] || 'Mise à jour de votre candidature';
        subject = `Candidature ${orderData.position} - ${statusMessage}`;

        // Email de mise à jour de statut pour le candidat
        htmlContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
            <!-- Header avec gradient Terex -->
            <div style="background: linear-gradient(135deg, #0FA958 0%, #08a045 100%); padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0;">
              <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 12px; backdrop-filter: blur(10px);">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  Mise à jour de votre candidature
                </h1>
                <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">
                  ${orderData.position} chez Terex
                </p>
              </div>
            </div>

            <!-- Contenu principal -->
            <div style="background: white; padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 80px; height: 80px; margin: 0 auto 20px; background: linear-gradient(135deg, #0FA958, #08a045); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 32px rgba(15, 169, 88, 0.3);">
                  ${orderData.status === 'accepted' 
                    ? '<span style="color: white; font-size: 40px;">🎉</span>'
                    : orderData.status === 'rejected'
                    ? '<span style="color: white; font-size: 40px;">📋</span>'
                    : orderData.status === 'interview'
                    ? '<span style="color: white; font-size: 40px;">📞</span>'
                    : '<span style="color: white; font-size: 40px;">⏳</span>'
                  }
                </div>
                <h2 style="color: #1a202c; font-size: 24px; font-weight: 700; margin: 0;">
                  ${statusMessage}
                </h2>
              </div>

              <div style="background: #f7fafc; border-left: 4px solid #0FA958; padding: 20px; border-radius: 8px; margin: 25px 0;">
                <p style="color: #2d3748; font-size: 16px; line-height: 1.6; margin: 0;">
                  Bonjour <strong>${orderData.first_name}</strong>,
                </p>
                <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 15px 0 0 0;">
                  ${orderData.status === 'accepted' 
                    ? `Nous avons le plaisir de vous informer que votre candidature pour le poste de <strong>${orderData.position}</strong> a été retenue ! Notre équipe RH vous contactera dans les plus brefs délais pour organiser les prochaines étapes.`
                    : orderData.status === 'rejected'
                    ? `Après un examen attentif de votre candidature pour le poste de <strong>${orderData.position}</strong>, nous avons le regret de vous informer que nous ne pouvons pas donner suite à votre candidature pour le moment. Nous conserverons votre profil dans notre base de données pour de futures opportunités.`
                    : orderData.status === 'interview'
                    ? `Votre candidature pour le poste de <strong>${orderData.position}</strong> a retenu notre attention ! Nous souhaitons vous rencontrer lors d'un entretien. Notre équipe RH vous contactera prochainement pour fixer un rendez-vous.`
                    : orderData.status === 'reviewing'
                    ? `Votre candidature pour le poste de <strong>${orderData.position}</strong> est actuellement en cours d'examen par notre équipe. Nous vous tiendrons informé de l'évolution de votre dossier.`
                    : `Votre candidature pour le poste de <strong>${orderData.position}</strong> a bien été reçue et est en cours de traitement.`
                  }
                </p>
              </div>

              ${orderData.admin_notes ? `
                <div style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 25px 0;">
                  <h3 style="color: #c2410c; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                    💬 Message de notre équipe RH
                  </h3>
                  <p style="color: #9a3412; margin: 0; font-style: italic; line-height: 1.5;">
                    "${orderData.admin_notes}"
                  </p>
                </div>
              ` : ''}

              <!-- Timeline de processus -->
              <div style="margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px;">
                <h3 style="color: #1a202c; font-size: 18px; font-weight: 600; margin: 0 0 20px 0; text-align: center;">
                  🔄 Processus de recrutement
                </h3>
                <div style="display: flex; justify-content: space-between; align-items: center; position: relative;">
                  <div style="flex: 1; text-align: center;">
                    <div style="width: 40px; height: 40px; margin: 0 auto 10px; background: #0FA958; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-weight: bold;">✓</span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #4a5568; font-weight: 500;">Candidature reçue</p>
                  </div>
                  <div style="flex: 1; text-align: center;">
                    <div style="width: 40px; height: 40px; margin: 0 auto 10px; background: ${orderData.status === 'reviewing' || orderData.status === 'interview' || orderData.status === 'accepted' ? '#0FA958' : '#e2e8f0'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: ${orderData.status === 'reviewing' || orderData.status === 'interview' || orderData.status === 'accepted' ? 'white' : '#9ca3af'}; font-weight: bold;">${orderData.status === 'reviewing' || orderData.status === 'interview' || orderData.status === 'accepted' ? '✓' : '2'}</span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #4a5568; font-weight: 500;">Examen du dossier</p>
                  </div>
                  <div style="flex: 1; text-align: center;">
                    <div style="width: 40px; height: 40px; margin: 0 auto 10px; background: ${orderData.status === 'interview' || orderData.status === 'accepted' ? '#0FA958' : '#e2e8f0'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: ${orderData.status === 'interview' || orderData.status === 'accepted' ? 'white' : '#9ca3af'}; font-weight: bold;">${orderData.status === 'interview' || orderData.status === 'accepted' ? '✓' : '3'}</span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #4a5568; font-weight: 500;">Entretien</p>
                  </div>
                  <div style="flex: 1; text-align: center;">
                    <div style="width: 40px; height: 40px; margin: 0 auto 10px; background: ${orderData.status === 'accepted' ? '#0FA958' : '#e2e8f0'}; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: ${orderData.status === 'accepted' ? 'white' : '#9ca3af'}; font-weight: bold;">${orderData.status === 'accepted' ? '✓' : '4'}</span>
                    </div>
                    <p style="margin: 0; font-size: 12px; color: #4a5568; font-weight: 500;">Décision finale</p>
                  </div>
                </div>
              </div>

              ${orderData.status === 'interview' ? `
                <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 25px 0; text-align: center;">
                  <h3 style="color: #1e40af; font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">
                    📞 Prochaines étapes
                  </h3>
                  <p style="color: #1e3a8a; margin: 0; line-height: 1.5;">
                    Un membre de notre équipe RH vous contactera dans les 48 heures pour organiser votre entretien. 
                    Assurez-vous que vos coordonnées sont à jour !
                  </p>
                </div>
              ` : ''}
            </div>

            <!-- Footer -->
            <div style="background: #1a202c; padding: 30px; text-align: center; border-radius: 0 0 12px 12px;">
              <div style="margin-bottom: 20px;">
                <h3 style="color: white; font-size: 18px; font-weight: 600; margin: 0 0 10px 0;">
                  Questions ?
                </h3>
                <p style="color: #a0aec0; margin: 0; font-size: 14px;">
                  Notre équipe RH est là pour vous accompagner
                </p>
              </div>
              
              <div style="border-top: 1px solid #4a5568; padding-top: 20px;">
                <p style="color: #718096; margin: 0 0 15px 0; font-size: 14px;">
                  Cordialement,<br>
                  <strong style="color: #0FA958;">L'équipe Terex</strong>
                </p>
                <div style="margin-top: 20px;">
                  <a href="mailto:terangaexchange@gmail.com" style="color: #0FA958; text-decoration: none; font-weight: 500; margin: 0 15px;">
                    ✉️ Contact RH
                  </a>
                  <a href="https://app.terangaexchange.com" style="color: #0FA958; text-decoration: none; font-weight: 500; margin: 0 15px;">
                    🌐 Notre plateforme
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      default:
        throw new Error(`Type d'email non supporté: ${emailType}`);
    }

    // Sauvegarder la notification dans la base de données
    const notificationData: any = {
      user_id: userId || null,
      email_address: finalEmailAddress,
      email_type: emailType,
      transaction_type: transactionType,
      subject: subject,
      status: 'pending'
    };

    // Seulement ajouter order_id si ce n'est pas un transfert international ou une candidature
    if (transactionType !== 'transfer' && emailType !== 'job_application_status_update' && orderId) {
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
