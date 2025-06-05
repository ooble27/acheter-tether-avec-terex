
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.10';
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderEmailRequest {
  orderId: string;
  userEmail: string;
  userName: string;
  orderData: {
    amount: number;
    currency: string;
    usdtAmount: number;
    status: string;
    paymentMethod: string;
    network: string;
    walletAddress?: string;
  };
  emailType: 'confirmation' | 'processing' | 'completed' | 'cancelled';
}

const getEmailTemplate = (emailType: string, orderData: any, orderId: string) => {
  const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/v1', '') || 'https://app.terangaexchange.com';
  
  switch (emailType) {
    case 'confirmation':
      return {
        subject: `✅ Commande confirmée #${orderId.slice(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">Terex Exchange</h1>
                <p style="color: #6b7280; margin: 5px 0;">Votre plateforme d'échange USDT de confiance</p>
              </div>
              
              <h2 style="color: #1f2937; margin-bottom: 20px;">🎉 Commande confirmée !</h2>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Détails de votre commande</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px 0; color: #6b7280;">N° de commande:</td><td style="padding: 8px 0; font-weight: bold;">#${orderId.slice(0, 8)}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Montant payé:</td><td style="padding: 8px 0; font-weight: bold;">${orderData.amount} ${orderData.currency}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">USDT à recevoir:</td><td style="padding: 8px 0; font-weight: bold; color: #10b981;">${orderData.usdtAmount} USDT</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Réseau:</td><td style="padding: 8px 0;">${orderData.network}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6b7280;">Méthode de paiement:</td><td style="padding: 8px 0;">${orderData.paymentMethod}</td></tr>
                </table>
              </div>
              
              <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #92400e;"><strong>⏳ Prochaines étapes:</strong></p>
                <p style="margin: 8px 0 0 0; color: #92400e;">Votre commande est en cours de traitement. Vous recevrez les USDT sous 24h ouvrées une fois le paiement validé.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Suivre ma commande</a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; color: #6b7280; font-size: 14px;">
                <p>Besoin d'aide ? Contactez notre support 24/7</p>
                <p>Email: support@terangaexchange.com | Tel: +221 XX XXX XXXX</p>
              </div>
            </div>
          </div>
        `
      };
      
    case 'processing':
      return {
        subject: `🔄 Commande en traitement #${orderId.slice(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">Terex Exchange</h1>
              </div>
              
              <h2 style="color: #1f2937; margin-bottom: 20px;">🔄 Votre commande est en traitement</h2>
              
              <p>Bonjour,</p>
              <p>Votre commande #${orderId.slice(0, 8)} est maintenant en cours de traitement par notre équipe.</p>
              
              <div style="background: #dbeafe; border: 1px solid #3b82f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #1e40af;"><strong>📋 Statut: En traitement</strong></p>
                <p style="margin: 8px 0 0 0; color: #1e40af;">Nos experts vérifient votre paiement et préparer le transfert USDT.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Voir le statut</a>
              </div>
            </div>
          </div>
        `
      };
      
    case 'completed':
      return {
        subject: `✅ USDT envoyés - Commande #${orderId.slice(0, 8)} terminée`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">Terex Exchange</h1>
              </div>
              
              <h2 style="color: #1f2937; margin-bottom: 20px;">🎉 Transaction réussie !</h2>
              
              <p>Félicitations ! Votre commande a été traitée avec succès.</p>
              
              <div style="background: #d1fae5; border: 1px solid #10b981; padding: 20px; border-radius: 6px; margin: 20px 0;">
                <h3 style="color: #065f46; margin-top: 0;">💰 USDT envoyés</h3>
                <p style="margin: 0; color: #065f46; font-size: 18px; font-weight: bold;">${orderData.usdtAmount} USDT</p>
                <p style="margin: 8px 0 0 0; color: #065f46;">Envoyés sur le réseau ${orderData.network}</p>
                ${orderData.walletAddress ? `<p style="margin: 8px 0 0 0; color: #065f46; word-break: break-all; font-family: monospace; font-size: 12px;">Adresse: ${orderData.walletAddress}</p>` : ''}
              </div>
              
              <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #374151;"><strong>💡 Conseils de sécurité:</strong></p>
                <p style="margin: 8px 0 0 0; color: #374151; font-size: 14px;">• Vérifiez toujours l'adresse de réception<br/>• Conservez cette confirmation pour vos dossiers<br/>• Les transactions blockchain sont irréversibles</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/dashboard/transactions" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Voir mes transactions</a>
              </div>
            </div>
          </div>
        `
      };
      
    case 'cancelled':
      return {
        subject: `❌ Commande annulée #${orderId.slice(0, 8)}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px;">
            <div style="background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #10b981; margin: 0;">Terex Exchange</h1>
              </div>
              
              <h2 style="color: #1f2937; margin-bottom: 20px;">❌ Commande annulée</h2>
              
              <p>Nous vous informons que votre commande #${orderId.slice(0, 8)} a été annulée.</p>
              
              <div style="background: #fee2e2; border: 1px solid #ef4444; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <p style="margin: 0; color: #dc2626;"><strong>Statut: Annulée</strong></p>
                <p style="margin: 8px 0 0 0; color: #dc2626;">Si un paiement a été effectué, il sera remboursé sous 3-5 jours ouvrés.</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${baseUrl}/buy-usdt" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Nouvelle commande</a>
              </div>
            </div>
          </div>
        `
      };
      
    default:
      return { subject: "Mise à jour de commande", html: "Statut de commande mis à jour." };
  }
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, userEmail, userName, orderData, emailType }: OrderEmailRequest = await req.json();

    console.log(`Sending ${emailType} email for order ${orderId} to ${userEmail}`);

    const template = getEmailTemplate(emailType, orderData, orderId);

    const emailResponse = await resend.emails.send({
      from: 'Terex Exchange <noreply@terangaexchange.com>',
      to: [userEmail],
      subject: template.subject,
      html: template.html,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
