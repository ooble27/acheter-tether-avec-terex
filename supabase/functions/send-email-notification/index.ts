
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
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
            
            <!-- Header moderne avec gradient Terex -->
            <div style="background: linear-gradient(135deg, #3B968F 0%, #2D7B73 50%, #1E5A54 100%); position: relative; overflow: hidden;">
              <!-- Motif géométrique subtil -->
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMEw2MCAzMEwzMCA2MEwwIDMwWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPgo8L3N2Zz4K') repeat; opacity: 0.1;"></div>
              
              <div style="position: relative; z-index: 1; padding: 50px 40px; text-align: center; color: white;">
                <div style="margin-bottom: 24px;">
                  <h1 style="margin: 0; font-size: 42px; font-weight: 800; letter-spacing: 3px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">TEREX</h1>
                  <p style="margin: 8px 0 0 0; font-size: 15px; opacity: 0.9; font-weight: 400; letter-spacing: 1px;">Fintech • Crypto • Transferts Internationaux</p>
                </div>
                
                <div style="width: 80px; height: 3px; background: linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 100%); margin: 30px auto; border-radius: 2px;"></div>
                
                <div style="background: rgba(255, 255, 255, 0.15); backdrop-filter: blur(10px); border-radius: 16px; padding: 24px; margin: 20px 0; border: 1px solid rgba(255, 255, 255, 0.2);">
                  <h2 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">✨ Candidature Reçue</h2>
                  <p style="margin: 12px 0 0 0; font-size: 16px; opacity: 0.95; font-weight: 500;">Nous avons bien reçu votre candidature !</p>
                </div>
              </div>
            </div>
            
            <!-- Corps du message avec design moderne -->
            <div style="padding: 45px 40px;">
              
              <!-- Salutation personnalisée -->
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px; border-radius: 16px; margin-bottom: 35px; border-left: 5px solid #3B968F; position: relative;">
                <div style="position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; font-weight: bold;">👋</div>
                <h3 style="color: #1e293b; margin: 0 0 18px 0; font-size: 24px; font-weight: 700;">Bonjour ${orderData.first_name},</h3>
                
                <p style="color: #475569; line-height: 1.7; margin-bottom: 24px; font-size: 16px;">
                  Merci d'avoir postulé chez <strong style="color: #3B968F;">Terex</strong> ! Nous avons bien reçu votre candidature pour le poste de <strong style="color: #1e293b; background: #e0f2f1; padding: 2px 8px; border-radius: 6px;">${orderData.position}</strong>.
                </p>
                
                <!-- Récapitulatif de la candidature avec design moderne -->
                <div style="background: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; margin: 24px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                      <span style="color: white; font-size: 16px; font-weight: bold;">📋</span>
                    </div>
                    <h4 style="color: #1e293b; margin: 0; font-size: 20px; font-weight: 700;">Récapitulatif de votre candidature</h4>
                  </div>
                  
                  <div style="display: grid; gap: 12px;">
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-weight: 600; width: 140px; font-size: 14px;">Poste :</span>
                      <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${orderData.position}</span>
                    </div>
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-weight: 600; width: 140px; font-size: 14px;">Candidat :</span>
                      <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${orderData.first_name} ${orderData.last_name}</span>
                    </div>
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-weight: 600; width: 140px; font-size: 14px;">Email :</span>
                      <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${orderData.email}</span>
                    </div>
                    ${orderData.experience_years ? `
                    <div style="display: flex; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                      <span style="color: #64748b; font-weight: 600; width: 140px; font-size: 14px;">Expérience :</span>
                      <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${orderData.experience_years} années</span>
                    </div>
                    ` : ''}
                    ${orderData.location ? `
                    <div style="display: flex; padding: 8px 0;">
                      <span style="color: #64748b; font-weight: 600; width: 140px; font-size: 14px;">Localisation :</span>
                      <span style="color: #1e293b; font-weight: 500; font-size: 14px;">${orderData.location}</span>
                    </div>
                    ` : ''}
                  </div>
                </div>
              </div>
              
              <!-- Étapes du processus avec timeline moderne -->
              <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); padding: 32px; border-radius: 16px; margin: 35px 0; border: 1px solid #fde047; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; right: 0; width: 100px; height: 100px; background: radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%);"></div>
                
                <div style="position: relative; z-index: 1;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                      <span style="color: white; font-size: 18px; font-weight: bold;">🚀</span>
                    </div>
                    <h4 style="color: #92400e; margin: 0; font-size: 22px; font-weight: 700;">Prochaines étapes</h4>
                  </div>
                  
                  <div style="position: relative; padding-left: 24px;">
                    <!-- Timeline verticale -->
                    <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(to bottom, #f59e0b, #d97706); border-radius: 2px;"></div>
                    
                    <div style="position: relative; margin-bottom: 20px;">
                      <div style="position: absolute; left: -11px; top: 6px; width: 20px; height: 20px; background: #f59e0b; border-radius: 50%; border: 3px solid #fef3c7;"></div>
                      <p style="color: #92400e; line-height: 1.6; margin: 0; font-size: 15px; font-weight: 500; padding-left: 16px;">
                        <strong>Examen de votre candidature</strong> dans les <strong>48 heures</strong> par notre équipe RH
                      </p>
                    </div>
                    
                    <div style="position: relative; margin-bottom: 20px;">
                      <div style="position: absolute; left: -11px; top: 6px; width: 20px; height: 20px; background: #d97706; border-radius: 50%; border: 3px solid #fef3c7;"></div>
                      <p style="color: #92400e; line-height: 1.6; margin: 0; font-size: 15px; font-weight: 500; padding-left: 16px;">
                        <strong>Contact téléphonique</strong> si votre profil correspond à nos besoins
                      </p>
                    </div>
                    
                    <div style="position: relative; margin-bottom: 20px;">
                      <div style="position: absolute; left: -11px; top: 6px; width: 20px; height: 20px; background: #b45309; border-radius: 50%; border: 3px solid #fef3c7;"></div>
                      <p style="color: #92400e; line-height: 1.6; margin: 0; font-size: 15px; font-weight: 500; padding-left: 16px;">
                        <strong>Processus d'entretiens</strong> en 2-3 étapes (technique + culturel + final)
                      </p>
                    </div>
                    
                    <div style="position: relative;">
                      <div style="position: absolute; left: -11px; top: 6px; width: 20px; height: 20px; background: #92400e; border-radius: 50%; border: 3px solid #fef3c7;"></div>
                      <p style="color: #92400e; line-height: 1.6; margin: 0; font-size: 15px; font-weight: 500; padding-left: 16px;">
                        <strong>Décision finale</strong> et proposition d'embauche
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Section à propos du poste avec design attractif -->
              <div style="background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); padding: 32px; border-radius: 16px; margin: 35px 0; border: 1px solid #bbf7d0; position: relative;">
                <div style="position: absolute; top: 20px; right: 20px; width: 60px; height: 60px; background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1)); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <span style="font-size: 24px;">💼</span>
                </div>
                
                <h4 style="color: #15803d; margin: 0 0 20px 0; font-size: 22px; font-weight: 700;">À propos du poste : ${orderData.position}</h4>
                <p style="color: #166534; line-height: 1.7; margin: 0; font-size: 16px; font-weight: 500;">
                  Un rôle clé pour contribuer à notre mission de <strong>révolutionner les transferts d'argent et les échanges crypto en Afrique</strong>. 
                  Rejoignez une équipe passionnée et innovante qui façonne l'avenir de la fintech africaine avec des technologies de pointe.
                </p>
                
                <div style="background: rgba(255, 255, 255, 0.7); padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid rgba(34, 197, 94, 0.2);">
                  <p style="color: #15803d; margin: 0; font-size: 14px; font-weight: 600; text-align: center;">
                    💡 <strong>Pourquoi Terex ?</strong> Impact social • Innovation technologique • Équipe internationale • Croissance rapide
                  </p>
                </div>
              </div>
              
              <!-- Section support avec design moderne -->
              <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 28px; border-radius: 16px; margin: 35px 0; border: 1px solid #bfdbfe; text-align: center;">
                <div style="margin-bottom: 20px;">
                  <span style="font-size: 32px; margin-bottom: 16px; display: block;">💬</span>
                  <h4 style="color: #1e40af; margin: 0 0 12px 0; font-size: 20px; font-weight: 700;">Des questions sur votre candidature ?</h4>
                </div>
                
                <div style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
                  <a href="mailto:terangaexchange@gmail.com" style="color: #1e40af; text-decoration: none; background: rgba(255, 255, 255, 0.8); padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #bfdbfe; transition: all 0.2s;">
                    📧 Email Support
                  </a>
                  <a href="https://wa.me/14182619091" style="color: #1e40af; text-decoration: none; background: rgba(255, 255, 255, 0.8); padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #bfdbfe; transition: all 0.2s;">
                    📱 WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Footer moderne et professionnel -->
            <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 40px; text-align: center; position: relative; overflow: hidden;">
              <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPgo8L3N2Zz4K') repeat; opacity: 0.1;"></div>
              
              <div style="position: relative; z-index: 1;">
                <div style="margin-bottom: 24px;">
                  <h3 style="color: #ffffff; margin: 0 0 8px 0; font-size: 20px; font-weight: 700; letter-spacing: 1px;">L'équipe Terex</h3>
                  <p style="color: #94a3b8; margin: 0; font-size: 14px; font-weight: 500;">Votre partenaire fintech de confiance</p>
                </div>
                
                <div style="background: rgba(255, 255, 255, 0.1); padding: 20px; border-radius: 12px; margin: 24px 0; backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.1);">
                  <a href="https://app.terangaexchange.com" style="color: #60a5fa; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-flex; align-items: center; gap: 8px;">
                    🚀 Découvrir la plateforme Terex
                  </a>
                </div>
                
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 24px; margin-top: 24px;">
                  <p style="color: #64748b; margin: 0 0 8px 0; font-size: 13px; font-weight: 500;">
                    © 2025 Terex. Tous droits réservés.
                  </p>
                  <p style="color: #64748b; margin: 0; font-size: 12px; font-weight: 400;">
                    Fondé par Mohamed Lo • Basé au Sénégal, Dakar
                  </p>
                </div>
              </div>
            </div>
          </div>
        `;

        // Envoyer aussi une notification à l'équipe RH Terex avec design moderne
        try {
          const adminNotificationHtml = `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);">
              
              <!-- Header Admin avec design moderne -->
              <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #991b1b 100%); position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTAgMzBMMzAgMEw2MCAzMEwzMCA2MEwwIDMwWiIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAzKSIvPgo8L3N2Zz4K') repeat; opacity: 0.1;"></div>
                
                <div style="position: relative; z-index: 1; padding: 45px 40px; text-align: center; color: white;">
                  <div style="width: 80px; height: 80px; background: rgba(255, 255, 255, 0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; backdrop-filter: blur(10px); border: 2px solid rgba(255, 255, 255, 0.2);">
                    <span style="font-size: 36px;">🔔</span>
                  </div>
                  <h1 style="margin: 0 0 12px 0; font-size: 32px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">NOUVELLE CANDIDATURE</h1>
                  <p style="margin: 0; font-size: 16px; opacity: 0.9; font-weight: 500; letter-spacing: 0.5px;">Système de recrutement Terex</p>
                </div>
              </div>
              
              <!-- Corps du message admin -->
              <div style="padding: 45px 40px;">
                
                <!-- Alerte priorité haute -->
                <div style="background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); padding: 24px; border-radius: 12px; margin-bottom: 32px; border-left: 5px solid #dc2626;">
                  <div style="display: flex; align-items: center; margin-bottom: 12px;">
                    <span style="font-size: 20px; margin-right: 12px;">⚡</span>
                    <h2 style="color: #dc2626; margin: 0; font-size: 24px; font-weight: 700;">
                      Poste : ${orderData.position}
                    </h2>
                  </div>
                  <p style="color: #7f1d1d; margin: 0; font-size: 14px; font-weight: 600;">
                    📅 Reçu le ${new Date().toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <!-- Informations candidat avec design moderne -->
                <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 32px; border-radius: 16px; margin-bottom: 32px; border: 1px solid #e2e8f0;">
                  <div style="display: flex; align-items: center; margin-bottom: 24px;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 4px 12px rgba(59, 150, 143, 0.3);">
                      <span style="color: white; font-size: 20px; font-weight: bold;">👤</span>
                    </div>
                    <h3 style="color: #1e293b; margin: 0; font-size: 22px; font-weight: 700;">Profil du candidat</h3>
                  </div>
                  
                  <div style="background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);">
                    <div style="display: grid; gap: 16px;">
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">👨</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Nom complet</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">${orderData.first_name} ${orderData.last_name}</p>
                        </div>
                      </div>
                      
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">📧</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">
                            <a href="mailto:${orderData.email}" style="color: #3B968F; text-decoration: none;">${orderData.email}</a>
                          </p>
                        </div>
                      </div>
                      
                      ${orderData.phone ? `
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">📱</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Téléphone</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">
                            <a href="tel:${orderData.phone}" style="color: #3B968F; text-decoration: none;">${orderData.phone}</a>
                          </p>
                        </div>
                      </div>
                      ` : ''}
                      
                      ${orderData.location ? `
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">📍</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Localisation</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">${orderData.location}</p>
                        </div>
                      </div>
                      ` : ''}
                      
                      ${orderData.experience_years ? `
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">⭐</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Expérience</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">${orderData.experience_years} années</p>
                        </div>
                      </div>
                      ` : ''}
                      
                      ${orderData.availability ? `
                      <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">⏰</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Disponibilité</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">${orderData.availability}</p>
                        </div>
                      </div>
                      ` : ''}
                      
                      ${orderData.salary_expectation ? `
                      <div style="display: flex; align-items: center; padding: 12px 0;">
                        <div style="width: 32px; height: 32px; background: linear-gradient(135deg, #3B968F, #4BA89F); border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                          <span style="color: white; font-size: 14px; font-weight: bold;">💰</span>
                        </div>
                        <div>
                          <span style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Prétentions salariales</span>
                          <p style="margin: 2px 0 0 0; color: #1e293b; font-weight: 600; font-size: 16px;">${orderData.salary_expectation}</p>
                        </div>
                      </div>
                      ` : ''}
                    </div>
                  </div>
                </div>
                
                ${orderData.linkedin_profile || orderData.portfolio_url ? `
                <!-- Liens professionnels -->
                <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); padding: 28px; border-radius: 16px; margin: 32px 0; border: 1px solid #bae6fd;">
                  <div style="display: flex; align-items: center; margin-bottom: 20px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #0ea5e9, #0284c7); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                      <span style="color: white; font-size: 18px; font-weight: bold;">🔗</span>
                    </div>
                    <h3 style="color: #0c4a6e; margin: 0; font-size: 20px; font-weight: 700;">Liens professionnels</h3>
                  </div>
                  
                  <div style="display: flex; gap: 16px; flex-wrap: wrap;">
                    ${orderData.linkedin_profile ? `
                    <a href="${orderData.linkedin_profile}" style="color: #0077b5; text-decoration: none; background: rgba(255, 255, 255, 0.8); padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 8px;" target="_blank">
                      <span style="color: #0077b5;">💼</span> LinkedIn
                    </a>
                    ` : ''}
                    ${orderData.portfolio_url ? `
                    <a href="${orderData.portfolio_url}" style="color: #3B968F; text-decoration: none; background: rgba(255, 255, 255, 0.8); padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 8px;" target="_blank">
                      <span style="color: #3B968F;">🎨</span> Portfolio
                    </a>
                    ` : ''}
                  </div>
                </div>
                ` : ''}
                
                ${orderData.cover_letter ? `
                <!-- Lettre de motivation avec design moderne -->
                <div style="background: linear-gradient(135deg, #fefce8 0%, #fef3c7 100%); padding: 32px; border-radius: 16px; margin: 32px 0; border: 1px solid #fde047; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: 0; right: 0; width: 120px; height: 120px; background: radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, transparent 70%);"></div>
                  
                  <div style="position: relative; z-index: 1;">
                    <div style="display: flex; align-items: center; margin-bottom: 24px;">
                      <div style="width: 44px; height: 44px; background: linear-gradient(135deg, #f59e0b, #d97706); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-right: 16px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);">
                        <span style="color: white; font-size: 20px; font-weight: bold;">📝</span>
                      </div>
                      <h3 style="color: #92400e; margin: 0; font-size: 22px; font-weight: 700;">Lettre de motivation</h3>
                    </div>
                    
                    <div style="background: rgba(255, 255, 255, 0.8); padding: 24px; border-radius: 12px; border: 1px solid #fde047; backdrop-filter: blur(5px);">
                      <p style="white-space: pre-wrap; color: #92400e; line-height: 1.7; margin: 0; font-size: 15px; font-weight: 500;">${orderData.cover_letter}</p>
                    </div>
                  </div>
                </div>
                ` : ''}
                
                <!-- Action rapide -->
                <div style="text-align: center; margin: 40px 0;">
                  <a href="https://app.terangaexchange.com/admin" style="background: linear-gradient(135deg, #3B968F 0%, #4BA89F 100%); color: white; padding: 18px 36px; text-decoration: none; border-radius: 12px; display: inline-block; font-weight: 700; font-size: 16px; box-shadow: 0 6px 20px rgba(59, 150, 143, 0.4); transition: all 0.3s;">
                    🚀 Examiner dans l'admin
                  </a>
                </div>
              </div>
              
              <!-- Footer admin -->
              <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px; text-align: center;">
                <div style="margin-bottom: 16px;">
                  <h4 style="color: #ffffff; margin: 0 0 8px 0; font-size: 18px; font-weight: 700;">Système de recrutement Terex</h4>
                  <p style="color: #94a3b8; margin: 0; font-size: 14px;">Notification automatique</p>
                </div>
                
                <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px;">
                  <p style="color: #64748b; margin: 0; font-size: 13px;">
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
