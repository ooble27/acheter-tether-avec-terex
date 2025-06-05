
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR').format(amount);
};

const getStatusText = (status: string) => {
  const statusMap = {
    'pending': 'En attente',
    'processing': 'En cours de traitement',
    'completed': 'Terminée',
    'cancelled': 'Annulée',
    'failed': 'Échouée'
  };
  return statusMap[status as keyof typeof statusMap] || status;
};

const getStatusColor = (status: string) => {
  const colorMap = {
    'pending': '#f59e0b',
    'processing': '#3b82f6',
    'completed': '#10b981',
    'cancelled': '#ef4444',
    'failed': '#ef4444'
  };
  return colorMap[status as keyof typeof colorMap] || '#6b7280';
};

const generateEmailContent = (emailType: string, transactionType: string, orderData: any) => {
  const baseUrl = "https://app.terangaexchange.com";
  const txId = `TRX-${orderData.id?.substring(0, 8).toUpperCase()}`;
  
  const baseTemplate = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 40px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
          TERANGA EXCHANGE
        </h1>
        <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
          Plateforme d'échange crypto professionnelle
        </p>
      </div>
  `;

  const footerTemplate = `
      <!-- Footer -->
      <div style="background: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
        <div style="text-align: center; margin-bottom: 20px;">
          <a href="${baseUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
            Accéder à mon compte
          </a>
        </div>
        
        <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; text-align: center;">
          <p style="color: #64748b; font-size: 12px; margin: 0 0 8px 0;">
            Cet email a été envoyé automatiquement par Teranga Exchange
          </p>
          <p style="color: #64748b; font-size: 12px; margin: 0;">
            © 2024 Teranga Exchange. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  `;

  switch (emailType) {
    case 'order_confirmation':
      if (transactionType === 'buy') {
        return {
          subject: `✅ Commande confirmée #${txId} - Achat USDT`,
          html: `${baseTemplate}
            <!-- Content -->
            <div style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px;">✓</span>
                </div>
                <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">
                  Commande confirmée !
                </h2>
                <p style="color: #64748b; margin: 8px 0 0 0; font-size: 16px;">
                  Votre achat USDT a été enregistré avec succès
                </p>
              </div>

              <!-- Transaction Details -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
                <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">
                  📋 Détails de la transaction
                </h3>
                
                <div style="display: grid; gap: 12px;">
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">Numéro de transaction</span>
                    <span style="color: #1e293b; font-weight: 600; font-family: monospace;">${txId}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">Montant payé</span>
                    <span style="color: #1e293b; font-weight: 600;">${formatCurrency(orderData.amount)} ${orderData.currency}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">USDT à recevoir</span>
                    <span style="color: #10b981; font-weight: 700; font-size: 16px;">${formatCurrency(orderData.usdt_amount)} USDT</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">Taux de change</span>
                    <span style="color: #1e293b; font-weight: 600;">1 USDT = ${formatCurrency(orderData.exchange_rate)} ${orderData.currency}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">Réseau blockchain</span>
                    <span style="color: #1e293b; font-weight: 600;">${orderData.network}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                    <span style="color: #64748b; font-weight: 500;">Adresse de réception</span>
                    <span style="color: #1e293b; font-weight: 600; font-family: monospace; word-break: break-all; font-size: 12px;">${orderData.wallet_address}</span>
                  </div>
                  <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                    <span style="color: #64748b; font-weight: 500;">Date de création</span>
                    <span style="color: #1e293b; font-weight: 600;">${formatDate(orderData.created_at)}</span>
                  </div>
                </div>
              </div>

              <!-- Status -->
              <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="display: flex; align-items: center;">
                  <div style="width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; margin-right: 12px;"></div>
                  <div>
                    <p style="color: #92400e; margin: 0; font-weight: 600;">Statut : En attente de traitement</p>
                    <p style="color: #92400e; margin: 4px 0 0 0; font-size: 14px;">Nous traitons votre commande. Vous recevrez une notification dès validation.</p>
                  </div>
                </div>
              </div>

              <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">🔍 Suivi blockchain</h4>
                <p style="color: #1e40af; margin: 0; font-size: 14px;">
                  Une fois votre paiement validé, vous pourrez suivre votre transaction USDT directement sur la blockchain ${orderData.network}.
                </p>
              </div>
            </div>
            ${footerTemplate}
          `
        };
      }
      break;
      
    case 'status_update':
      const statusText = getStatusText(orderData.status);
      const statusColor = getStatusColor(orderData.status);
      
      return {
        subject: `🔄 Mise à jour #${txId} - ${statusText}`,
        html: `${baseTemplate}
          <!-- Content -->
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: ${statusColor}; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🔄</span>
              </div>
              <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">
                Statut mis à jour
              </h2>
              <p style="color: #64748b; margin: 8px 0 0 0; font-size: 16px;">
                Transaction #${txId}
              </p>
            </div>

            <!-- Status Update -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <div style="text-align: center; margin-bottom: 20px;">
                <div style="display: inline-flex; align-items: center; background: ${statusColor}; color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600;">
                  <div style="width: 8px; height: 8px; background: white; border-radius: 50%; margin-right: 8px;"></div>
                  ${statusText}
                </div>
              </div>
              
              <div style="display: grid; gap: 12px;">
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-weight: 500;">Transaction ID</span>
                  <span style="color: #1e293b; font-weight: 600; font-family: monospace;">${txId}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-weight: 500;">Type</span>
                  <span style="color: #1e293b; font-weight: 600;">${transactionType === 'buy' ? 'Achat USDT' : 'Vente USDT'}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                  <span style="color: #64748b; font-weight: 500;">Montant</span>
                  <span style="color: #1e293b; font-weight: 600;">${formatCurrency(orderData.usdt_amount)} USDT</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 8px 0;">
                  <span style="color: #64748b; font-weight: 500;">Mis à jour le</span>
                  <span style="color: #1e293b; font-weight: 600;">${formatDate(new Date().toISOString())}</span>
                </div>
              </div>
            </div>

            ${orderData.status === 'completed' ? `
            <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <h4 style="color: #15803d; margin: 0 0 8px 0; font-size: 16px;">🎉 Transaction terminée !</h4>
              <p style="color: #15803d; margin: 0 0 8px 0; font-size: 14px;">
                Votre transaction a été complétée avec succès. Vous pouvez maintenant vérifier votre solde.
              </p>
              <p style="color: #15803d; margin: 0; font-size: 12px;">
                🔗 Consultez les détails sur la blockchain ${orderData.network}
              </p>
            </div>
            ` : orderData.status === 'processing' ? `
            <div style="background: #dbeafe; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">⏳ Transaction en cours</h4>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Votre transaction est actuellement en cours de traitement. Veuillez patienter.
              </p>
            </div>
            ` : ''}
          </div>
          ${footerTemplate}
        `
      };

    case 'payment_confirmed':
      return {
        subject: `💰 Paiement confirmé #${txId} - USDT en cours d'envoi`,
        html: `${baseTemplate}
          <!-- Content -->
          <div style="padding: 40px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">💰</span>
              </div>
              <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">
                Paiement confirmé !
              </h2>
              <p style="color: #64748b; margin: 8px 0 0 0; font-size: 16px;">
                Vos USDT sont en cours d'envoi
              </p>
            </div>

            <div style="background: #dcfce7; border: 1px solid #16a34a; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <h4 style="color: #15803d; margin: 0 0 16px 0; font-size: 18px;">✅ Paiement validé</h4>
              <p style="color: #15803d; margin: 0 0 12px 0; font-size: 14px;">
                Votre paiement de <strong>${formatCurrency(orderData.amount)} ${orderData.currency}</strong> a été confirmé.
              </p>
              <p style="color: #15803d; margin: 0; font-size: 14px;">
                Nous procédons maintenant à l'envoi de <strong>${formatCurrency(orderData.usdt_amount)} USDT</strong> vers votre adresse.
              </p>
            </div>

            <div style="background: #eff6ff; border: 1px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <h4 style="color: #1e40af; margin: 0 0 8px 0; font-size: 16px;">⏱️ Délai d'envoi</h4>
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                Les USDT seront envoyés dans les 5-10 minutes suivant cette confirmation.
              </p>
            </div>
          </div>
          ${footerTemplate}
        `
      };
      
    default:
      return {
        subject: `📬 Notification Teranga Exchange #${txId}`,
        html: `${baseTemplate}
          <!-- Content -->
          <div style="padding: 40px;">
            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 24px; font-weight: 700;">
              Notification
            </h2>
            <p style="color: #64748b; margin: 0 0 24px 0; font-size: 16px;">
              Vous avez reçu une nouvelle notification de Teranga Exchange.
            </p>
            <p style="color: #64748b; margin: 0; font-size: 14px;">
              Transaction: #${txId}
            </p>
          </div>
          ${footerTemplate}
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
