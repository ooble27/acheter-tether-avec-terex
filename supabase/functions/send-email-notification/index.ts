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
import { jobApplicationConfirmationHtml } from './_templates/job-application-confirmation.tsx';
import { jobApplicationStatusHtml } from './_templates/job-application-status.tsx';
import { jobApplicationAdminHtml } from './_templates/job-application-admin.tsx';
import { cancellationConfirmationHtml } from './_templates/cancellation-confirmation.tsx';
import { contactConfirmationHtml } from './_templates/contact-confirmation.tsx';
import { adminNewOrderHtml } from './_templates/admin-new-order.tsx';

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
          subject = `Votre demande a été reçue — TEREX-${orderData.id?.slice(-8)}`;
        }
        htmlContent = orderConfirmationHtml({ orderData, transactionType: transactionType as 'buy' | 'sell', clientName });

        // Notification admin pour nouvelle commande
        try {
          const adminOrderRef = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase()}`;
          const adminTypeLabel = transactionType === 'buy' ? 'Achat USDT' : transactionType === 'sell' ? 'Vente USDT' : 'Commande';
          await resend.emails.send({
            from: "Terex Admin <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `[Commande] ${adminTypeLabel} · ${adminOrderRef}`,
            html: adminNewOrderHtml({
              orderData,
              transactionType,
              clientName,
              clientEmail: finalEmailAddress,
            }),
          });
          console.log('Notification admin nouvelle commande envoyée');
        } catch (adminErr) {
          console.error('Erreur notification admin commande:', adminErr);
        }
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
        subject = `Nous avons bien reçu votre message — ${orderData.subject}`;
        htmlContent = contactConfirmationHtml({ contactData: orderData });

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
        subject = `Candidature reçue — ${orderData.position} chez Terex`;
        htmlContent = jobApplicationConfirmationHtml({
          firstName: orderData.first_name || 'Candidat',
          lastName: orderData.last_name || '',
          position: orderData.position || 'Poste',
          appliedAt: orderData.created_at,
        });

        // Notification admin RH Terex
        try {
          await resend.emails.send({
            from: "Terex Careers <noreply@terangaexchange.com>",
            to: ["terangaexchange@gmail.com"],
            subject: `[RH] Nouvelle candidature : ${orderData.position} — ${orderData.first_name} ${orderData.last_name || ''}`,
            html: jobApplicationAdminHtml({
              firstName: orderData.first_name || '',
              lastName: orderData.last_name || '',
              email: orderData.email || finalEmailAddress,
              phone: orderData.phone || undefined,
              position: orderData.position || 'Poste',
              coverLetter: orderData.cover_letter || undefined,
              appliedAt: orderData.created_at,
            }),
          });
          console.log('Notification RH envoyée à l\'équipe Terex');
        } catch (teamError) {
          console.error('Erreur lors de l\'envoi de la notification RH:', teamError);
        }
        break;

      case 'job_application_status_update': {
        const statusLabels: Record<string, string> = {
          pending:   "En attente d'examen",
          reviewing: 'En cours d\'examen',
          interview: 'Entretien programmé',
          accepted:  'Candidature acceptée',
          rejected:  'Candidature non retenue',
        };
        const statusLabel = statusLabels[orderData.status] || 'Mise à jour';
        subject = `Candidature ${orderData.position} — ${statusLabel}`;
        htmlContent = jobApplicationStatusHtml({
          firstName:   orderData.first_name || 'Candidat',
          position:    orderData.position   || 'Poste',
          status:      orderData.status     || 'pending',
          adminNotes:  orderData.admin_notes || undefined,
        });
        break;
      }

      case 'cancellation_confirmation': {
        const cancelTypeLabel = transactionType === 'buy' ? 'achat' : transactionType === 'sell' ? 'vente' : 'transfert';
        subject = `Confirmation d'annulation — Votre ${cancelTypeLabel} USDT a été annulé`;
        htmlContent = cancellationConfirmationHtml({ orderData, transactionType, clientName });
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
