
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  userId: string;
  orderId?: string;
  transferId?: string;
  emailType: string;
  transactionType: 'buy' | 'sell' | 'transfer';
  data: any;
}

const getEmailTemplate = (emailType: string, transactionType: string, data: any) => {
  const baseStyles = `
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; }
      .content { background: #f9f9f9; padding: 20px; }
      .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; }
      .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
      .status { padding: 10px; border-radius: 5px; margin: 10px 0; }
      .status.pending { background: #fff3cd; border: 1px solid #ffeaa7; }
      .status.processing { background: #cce5ff; border: 1px solid #74b9ff; }
      .status.completed { background: #d4edda; border: 1px solid #00b894; }
      .status.cancelled { background: #f8d7da; border: 1px solid #e17055; }
    </style>
  `;

  if (transactionType === 'buy') {
    switch (emailType) {
      case 'order_confirmation':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Confirmation de votre commande USDT</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Nous avons bien reçu votre commande d'achat d'USDT.</p>
              <div class="status pending">
                <strong>Statut:</strong> En attente de traitement
              </div>
              <p><strong>Détails de la commande:</strong></p>
              <ul>
                <li>Montant: ${data.amount} ${data.currency}</li>
                <li>USDT à recevoir: ${data.usdtAmount} USDT</li>
                <li>Taux de change: ${data.exchangeRate}</li>
                <li>Méthode de paiement: ${data.paymentMethod}</li>
                <li>Réseau: ${data.network}</li>
              </ul>
              <p>Nous traiterons votre commande dans les plus brefs délais. Vous recevrez un email de confirmation une fois le traitement terminé.</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
      case 'processing':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Votre commande est en cours de traitement</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Votre commande d'achat d'USDT est maintenant en cours de traitement.</p>
              <div class="status processing">
                <strong>Statut:</strong> En cours de traitement
              </div>
              <p>Nous préparons le transfert de vos ${data.usdtAmount} USDT vers votre portefeuille.</p>
              <p><strong>Adresse de destination:</strong> ${data.walletAddress || 'Non spécifiée'}</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
      case 'completed':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Commande terminée avec succès!</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Excellente nouvelle! Votre commande d'achat d'USDT a été terminée avec succès.</p>
              <div class="status completed">
                <strong>Statut:</strong> Terminé
              </div>
              <p><strong>USDT transférés:</strong> ${data.usdtAmount} USDT</p>
              <p><strong>Réseau:</strong> ${data.network}</p>
              <p><strong>Adresse de destination:</strong> ${data.walletAddress}</p>
              <p>Vous devriez voir les fonds dans votre portefeuille sous peu. Le délai peut varier selon le réseau utilisé.</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
      case 'cancelled':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Commande annulée</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Nous vous informons que votre commande d'achat d'USDT a été annulée.</p>
              <div class="status cancelled">
                <strong>Statut:</strong> Annulée
              </div>
              <p><strong>Montant:</strong> ${data.amount} ${data.currency}</p>
              <p>Si vous avez des questions concernant cette annulation, n'hésitez pas à nous contacter.</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
    }
  } else if (transactionType === 'sell') {
    switch (emailType) {
      case 'order_confirmation':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Confirmation de votre vente d'USDT</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Nous avons bien reçu votre demande de vente d'USDT.</p>
              <div class="status pending">
                <strong>Statut:</strong> En attente de traitement
              </div>
              <p><strong>Détails de la vente:</strong></p>
              <ul>
                <li>USDT à vendre: ${data.usdtAmount} USDT</li>
                <li>Montant à recevoir: ${data.amount} ${data.currency}</li>
                <li>Taux de change: ${data.exchangeRate}</li>
                <li>Méthode de paiement: ${data.paymentMethod}</li>
              </ul>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
      case 'completed':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Vente terminée avec succès!</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Votre vente d'USDT a été terminée avec succès.</p>
              <div class="status completed">
                <strong>Statut:</strong> Terminé
              </div>
              <p><strong>Montant reçu:</strong> ${data.amount} ${data.currency}</p>
              <p>Le paiement sera effectué selon la méthode choisie dans les plus brefs délais.</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
    }
  } else if (transactionType === 'transfer') {
    switch (emailType) {
      case 'transfer_initiated':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Virement international initié</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Votre demande de virement international a été initiée.</p>
              <div class="status pending">
                <strong>Statut:</strong> En cours de traitement
              </div>
              <p><strong>Détails du virement:</strong></p>
              <ul>
                <li>Montant: ${data.amount} ${data.fromCurrency}</li>
                <li>Destinataire: ${data.recipientName}</li>
                <li>Pays: ${data.recipientCountry}</li>
                <li>Montant à recevoir: ${data.totalAmount} ${data.toCurrency}</li>
                <li>Taux de change: ${data.exchangeRate}</li>
                <li>Frais: ${data.fees} ${data.fromCurrency}</li>
              </ul>
              <p><strong>Numéro de référence:</strong> ${data.referenceNumber || 'En cours de génération'}</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
      case 'transfer_completed':
        return `
          ${baseStyles}
          <div class="container">
            <div class="header">
              <h1>Virement international terminé</h1>
            </div>
            <div class="content">
              <h2>Bonjour,</h2>
              <p>Votre virement international a été terminé avec succès!</p>
              <div class="status completed">
                <strong>Statut:</strong> Terminé
              </div>
              <p><strong>Numéro de référence:</strong> ${data.referenceNumber}</p>
              <p><strong>Montant envoyé:</strong> ${data.totalAmount} ${data.toCurrency}</p>
              <p><strong>Destinataire:</strong> ${data.recipientName}</p>
              <p>Les fonds ont été transférés avec succès vers le compte du destinataire.</p>
            </div>
            <div class="footer">
              <p>© 2024 TeRex. Tous droits réservés.</p>
            </div>
          </div>
        `;
    }
  }

  return `
    ${baseStyles}
    <div class="container">
      <div class="header">
        <h1>Notification de transaction</h1>
      </div>
      <div class="content">
        <p>Une mise à jour concernant votre transaction a été effectuée.</p>
      </div>
      <div class="footer">
        <p>© 2024 TeRex. Tous droits réservés.</p>
      </div>
    </div>
  `;
};

const getEmailSubject = (emailType: string, transactionType: string) => {
  const subjects = {
    buy: {
      order_confirmation: "Confirmation d'achat USDT - TeRex",
      processing: "Votre commande USDT est en cours de traitement - TeRex",
      completed: "Achat USDT terminé avec succès - TeRex",
      cancelled: "Commande USDT annulée - TeRex"
    },
    sell: {
      order_confirmation: "Confirmation de vente USDT - TeRex",
      processing: "Votre vente USDT est en cours de traitement - TeRex",
      completed: "Vente USDT terminée avec succès - TeRex",
      cancelled: "Vente USDT annulée - TeRex"
    },
    transfer: {
      transfer_initiated: "Virement international initié - TeRex",
      transfer_completed: "Virement international terminé - TeRex",
      cancelled: "Virement international annulé - TeRex"
    }
  };

  return subjects[transactionType]?.[emailType] || "Notification de transaction - TeRex";
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, orderId, transferId, emailType, transactionType, data }: EmailRequest = await req.json();

    console.log('Email request received:', { userId, orderId, transferId, emailType, transactionType });

    // Get user profile for email address
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      throw new Error('User profile not found');
    }

    // Get user auth data for email
    const { data: authData, error: authError } = await supabase.auth.admin.getUserById(userId);
    
    if (authError || !authData.user?.email) {
      throw new Error('User email not found');
    }

    const userEmail = authData.user.email;
    const subject = getEmailSubject(emailType, transactionType);
    const htmlContent = getEmailTemplate(emailType, transactionType, data);

    console.log('Sending email to:', userEmail, 'Subject:', subject);

    // Send email via Resend
    const emailResponse = await resend.emails.send({
      from: "TeRex <noreply@terex.com>",
      to: [userEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log('Email sent successfully:', emailResponse);

    // Save email notification record
    const { error: insertError } = await supabase
      .from('email_notifications')
      .insert({
        user_id: userId,
        order_id: orderId,
        email_type: emailType,
        transaction_type: transactionType,
        email_address: userEmail,
        subject: subject,
        status: 'sent',
        sent_at: new Date().toISOString()
      });

    if (insertError) {
      console.error('Error saving email notification:', insertError);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error("Error in send-transaction-email function:", error);
    
    // Try to save failed email notification if we have enough data
    try {
      const requestData = await req.clone().json();
      if (requestData.userId) {
        await supabase
          .from('email_notifications')
          .insert({
            user_id: requestData.userId,
            order_id: requestData.orderId,
            email_type: requestData.emailType || 'unknown',
            transaction_type: requestData.transactionType || 'unknown',
            email_address: 'unknown',
            subject: 'Failed to send',
            status: 'failed',
            error_message: error.message
          });
      }
    } catch (logError) {
      console.error('Error logging failed email:', logError);
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
