import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";
import { Resend } from "npm:resend@2.0.0";

// Import des templates d'emails (HTML pur — pas de React)
import { orderConfirmationHtml } from './_templates/order-confirmation.tsx';
import { statusUpdateHtml } from './_templates/status-update.tsx';
import { paymentConfirmedHtml } from './_templates/payment-confirmed.tsx';
import { transferConfirmationHtml } from './_templates/transfer-confirmation.tsx';
import { kycApprovedHtml } from './_templates/kyc-approved-email.tsx';
import { kycRejectedHtml } from './_templates/kyc-rejected-email.tsx';
import { contactNotificationHtml } from './_templates/contact-notification.tsx';
import { welcomeHtml } from './_templates/welcome-email.tsx';
import { passwordResetHtml } from './_templates/password-reset-email.tsx';
import { securityAlertHtml } from './_templates/security-alert-email.tsx';
import { referralHtml } from './_templates/referral-email.tsx';
import { reengagementHtml } from './_templates/reengagement-email.tsx';
import { magicLinkHtml } from './_templates/magic-link-email.tsx';

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

    // Récupérer le prénom du client pour la salutation des templates
    let clientName: string | undefined = undefined;
    try {
      const targetUid = userId || (orderData?.user_id ?? null);
      if (targetUid) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, first_name, last_name')
          .eq('id', targetUid)
          .maybeSingle();
        if (profile) {
          clientName = (profile as any).first_name
            || ((profile as any).full_name ? String((profile as any).full_name).split(' ')[0] : undefined)
            || undefined;
        }
        if (!clientName) {
          const { data: authU } = await supabase.auth.admin.getUserById(targetUid);
          const meta: any = authU?.user?.user_metadata || {};
          clientName = meta.first_name || meta.firstName
            || (meta.full_name ? String(meta.full_name).split(' ')[0] : undefined)
            || (authU?.user?.email ? authU.user.email.split('@')[0] : undefined);
        }
      }
      if (!clientName && orderData?.recipient_name) {
        clientName = String(orderData.recipient_name).split(' ')[0];
      }
    } catch (e) {
      console.warn('Impossible de récupérer le nom du client:', e);
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
        htmlContent = orderConfirmationHtml({ orderData, transactionType: transactionType as 'buy' | 'sell', clientName });
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
        htmlContent = statusUpdateHtml({ orderData, transactionType, clientName });
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
        htmlContent = paymentConfirmedHtml({ orderData, transactionType, clientName });
        break;

      case 'transfer_confirmation':
        subject = `Votre transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} à ${orderData.recipient_name} a été confirmé`;
        htmlContent = transferConfirmationHtml({ transferData: orderData, clientName });
        break;

      case 'contact_message': {
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
                  Besoin d'une réponse urgente ? Contactez-nous sur WhatsApp : <a href="https://wa.me/14182619091" style="color: #1976d2;">+1 418 261 9091</a>
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
          const teamNotificationHtml = contactNotificationHtml({ contactData: orderData });
          await resend.emails.send({
            from: "Terex <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `Nouveau message de contact - ${orderData.subject}`,
            html: teamNotificationHtml,
          });
          console.log('Notification envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification équipe:', teamError);
        }
        break;
      }

      case 'kyc_approved': {
        subject = `Félicitations ! Votre vérification d'identité a été approuvée - Accédez à votre compte Terex`;

        const { data: magicLinkData, error: magicLinkError } = await supabase.auth.admin.generateLink({
          type: 'magiclink',
          email: finalEmailAddress,
          options: {
            redirectTo: `${supabaseUrl.replace('.supabase.co', '.supabase.co')}/auth/callback?redirect_to=${encodeURIComponent('https://terangaexchange.com/')}`
          }
        });

        if (magicLinkError) {
          console.error('Erreur lors de la génération du lien magique:', magicLinkError);
          throw new Error('Impossible de générer le lien de connexion');
        }

        htmlContent = kycApprovedHtml({
          magicLink: magicLinkData.properties?.action_link || '#',
          userFirstName: orderData.first_name || 'Cher utilisateur',
          userLastName: orderData.last_name || ''
        });
        break;
      }

      case 'job_application':
        // Email de confirmation pour le candidat
        subject = `Candidature reçue - ${orderData.position} chez Terex`;
        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 896px; margin: 0 auto; padding: 0;">
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
            </div>

            <div style="text-align: center; padding: 20px; color: #666; font-size: 14px;">
              <p>Cordialement,<br><strong>L'équipe Terex</strong></p>
              <p style="margin-top: 20px;">
                <a href="https://terangaexchange.com" style="color: #0FA958; text-decoration: none;">terangaexchange.com</a>
              </p>
            </div>
          </div>
        `;

        // Envoyer aussi une notification à l'équipe RH Terex
        try {
          const adminNotificationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 896px; margin: 0 auto;">
              <h1 style="background: #0FA958; color: white; padding: 20px; margin: 0; font-size: 24px;">Nouvelle Candidature</h1>
              <div style="padding: 20px;">
                <h2>Poste : ${orderData.position}</h2>
                <p><strong>Nom :</strong> ${orderData.first_name} ${orderData.last_name}</p>
                <p><strong>Email :</strong> ${orderData.email}</p>
                ${orderData.phone ? `<p><strong>Téléphone :</strong> ${orderData.phone}</p>` : ''}
                ${orderData.cover_letter ? `<div style="border-left: 4px solid #0FA958; padding-left: 16px; margin: 20px 0;"><h3>Lettre de motivation</h3><p>${orderData.cover_letter}</p></div>` : ''}
              </div>
            </div>
          `;

          await resend.emails.send({
            from: "Terex Careers <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `Nouvelle candidature : ${orderData.position}`,
            html: adminNotificationHtml,
          });

          console.log('Notification RH envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification RH:', teamError);
        }
        break;

      case 'job_application_status_update': {
        const statusMessages: Record<string, string> = {
          pending: 'En attente d\'examen',
          reviewing: 'En cours d\'examen',
          interview: 'Entretien programmé',
          accepted: 'Félicitations ! Votre candidature a été acceptée',
          rejected: 'Candidature non retenue'
        };

        const statusMessage = statusMessages[orderData.status] || 'Mise à jour de votre candidature';
        subject = `Candidature ${orderData.position} - ${statusMessage}`;

        htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 896px; margin: 0 auto; background: #000000; color: #ffffff; padding: 0;">
            <div style="padding: 40px 30px; text-align: center; border-bottom: 1px solid #333333;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">TEREX</h1>
            </div>
            <div style="padding: 40px 30px;">
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 10px 0;">${statusMessage}</h2>
              <p style="color: #888888; font-size: 16px; margin: 0 0 30px 0;">${orderData.position}</p>
              <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Bonjour ${orderData.first_name},</p>
              ${orderData.status === 'accepted' ? `<p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Nous avons le plaisir de vous informer que votre candidature pour le poste de <strong style="color: #ffffff;">${orderData.position}</strong> a été retenue. Notre équipe RH vous contactera dans les prochaines 48 heures.</p>` :
              orderData.status === 'rejected' ? `<p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Après examen attentif, nous ne pouvons pas donner suite à votre candidature pour ce poste. Votre profil a été ajouté à notre base de talents et nous vous contacterons si d'autres opportunités se présentent.</p>` :
              orderData.status === 'interview' ? `<p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Votre candidature a retenu notre attention. Un membre de notre équipe RH vous contactera dans les prochaines 48 heures pour organiser un entretien.</p>` :
              `<p style="color: #cccccc; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Votre candidature est ${orderData.status === 'reviewing' ? 'en cours d\'examen' : 'en attente d\'examen'} par notre équipe.</p>`}
              ${orderData.admin_notes ? `<div style="background: #111111; border: 1px solid #333333; border-radius: 8px; padding: 20px; margin: 30px 0;"><p style="color: #ffffff; font-weight: 600; margin: 0 0 10px 0;">Message de notre équipe RH</p><p style="color: #cccccc; margin: 0; font-style: italic;">"${orderData.admin_notes}"</p></div>` : ''}
            </div>
            <div style="border-top: 1px solid #333333; padding: 30px; text-align: center;">
              <p style="color: #888888; margin: 0; font-size: 14px;">Cordialement,<br><strong style="color: #ffffff;">L'équipe Terex</strong></p>
            </div>
          </div>
        `;
        break;
      }

      case 'cancellation_confirmation': {
        const cancelTypeLabel = transactionType === 'buy' ? 'achat' : transactionType === 'sell' ? 'vente' : 'transfert';
        subject = `Confirmation d'annulation - Votre ${cancelTypeLabel} USDT a été annulé`;
        htmlContent = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 0;">
            <div style="background: #0FA958; padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">TEREX</h1>
            </div>

            <div style="padding: 40px 30px;">
              <h2 style="color: #333; font-size: 20px; margin: 0 0 20px 0;">Annulation confirmée</h2>
              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Nous vous confirmons que votre demande de ${cancelTypeLabel} d'un montant de
                <strong>${orderData.amount?.toLocaleString()} ${orderData.currency || 'CFA'}</strong>
                (${orderData.usdt_amount || 0} USDT) a été annulée.
              </p>

              <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #333; font-weight: 600; margin: 0 0 10px 0;">Détails :</p>
                <p style="color: #555; margin: 5px 0;">Référence : TEREX-${(orderData.id || '').slice(-8).toUpperCase()}</p>
                <p style="color: #555; margin: 5px 0;">Type : ${cancelTypeLabel.charAt(0).toUpperCase() + cancelTypeLabel.slice(1)} USDT</p>
                <p style="color: #555; margin: 5px 0;">Montant : ${orderData.amount?.toLocaleString()} ${orderData.currency || 'CFA'}</p>
                <p style="color: #555; margin: 5px 0;">Statut : Annulé</p>
              </div>

              ${orderData.cancellation_reason ? `
                <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                  <p style="color: #856404; margin: 0; font-size: 14px;">
                    <strong>Motif :</strong> ${orderData.cancellation_reason}
                  </p>
                </div>
              ` : ''}

              <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Si un paiement a été effectué, un remboursement sera traité dans les 3 à 5 jours ouvrables.
              </p>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://terangaexchange.com" style="background: #0FA958; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; font-weight: 600; display: inline-block;">
                  Retour à Terex
                </a>
              </div>
            </div>

            <div style="border-top: 1px solid #eee; padding: 20px 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Cordialement, L'équipe Terex<br>
                <a href="https://terangaexchange.com" style="color: #0FA958; text-decoration: none;">terangaexchange.com</a>
              </p>
            </div>
          </div>
        `;
        break;
      }

      case 'magic_link':
        subject = `Votre lien de connexion sécurisé — Terex`;
        htmlContent = magicLinkHtml({
          magicLink: orderData?.magicLink || '#',
          userEmail: finalEmailAddress,
          otpCode: orderData?.otpCode,
        });
        break;

      case 'welcome':
        subject = `Bienvenue sur Terex${clientName ? `, ${clientName}` : ''} — Commencez par vérifier votre identité`;
        htmlContent = welcomeHtml({ userFirstName: clientName, kycLink: 'https://terangaexchange.com/dashboard' });
        break;

      case 'kyc_rejected':
        subject = `Votre vérification KYC n'a pas abouti — Action requise`;
        htmlContent = kycRejectedHtml({
          userFirstName: clientName,
          reasons: orderData?.reasons || undefined,
          resubmitLink: 'https://terangaexchange.com/dashboard',
        });
        break;

      case 'password_reset':
        subject = `Réinitialisation de votre mot de passe Terex`;
        htmlContent = passwordResetHtml({ resetLink: orderData?.resetLink || '#', userEmail: finalEmailAddress });
        break;

      case 'security_alert':
        subject = `Alerte sécurité — Connexion depuis un nouvel appareil`;
        htmlContent = securityAlertHtml({
          device: orderData?.device || 'Appareil inconnu',
          location: orderData?.location || 'Localisation inconnue',
          date: orderData?.date || undefined,
          secureLink: orderData?.secureLink || 'https://terangaexchange.com/dashboard',
        });
        break;

      case 'referral':
        subject = `${orderData?.referrerName || 'Un ami'} vous invite à rejoindre Terex`;
        htmlContent = referralHtml({
          referrerName: orderData?.referrerName || 'Un ami',
          referralLink: orderData?.referralLink || 'https://terangaexchange.com',
          recipientEmail: finalEmailAddress,
        });
        break;

      case 'reengagement':
        subject = `Ça fait un moment${clientName ? `, ${clientName}` : ''} — Le taux du jour vous attend sur Terex`;
        htmlContent = reengagementHtml({
          userFirstName: clientName,
          currentRate: orderData?.currentRate || undefined,
          dashboardLink: 'https://terangaexchange.com/dashboard',
        });
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
