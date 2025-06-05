
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useEmailNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendEmailNotification = async (
    emailType: string,
    transactionType: string,
    orderData: any,
    orderId?: string
  ) => {
    if (!user?.email) {
      console.log('Pas d\'adresse email utilisateur disponible');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: user.id,
          orderId,
          emailAddress: user.email,
          emailType,
          transactionType,
          orderData
        },
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
      }

      console.log('Email envoyé avec succès:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification email:', error);
      toast({
        title: "Attention",
        description: "L'email de confirmation n'a pas pu être envoyé, mais votre commande est bien enregistrée.",
        variant: "default",
      });
    }
  };

  // Fonction pour les confirmations d'achat USDT
  const sendBuyConfirmation = async (orderData: any, orderId: string) => {
    return sendEmailNotification('order_confirmation', 'buy', orderData, orderId);
  };

  // Fonction pour les confirmations de vente USDT
  const sendSellConfirmation = async (orderData: any, orderId: string) => {
    return sendEmailNotification('order_confirmation', 'sell', orderData, orderId);
  };

  // Fonction pour les confirmations de paiement
  const sendPaymentConfirmation = async (orderData: any, orderId: string) => {
    return sendEmailNotification('payment_confirmed', orderData.type, orderData, orderId);
  };

  // Fonction pour les notifications de transfert international
  const sendTransferNotification = async (
    emailType: string,
    transferData: any,
    transferId?: string
  ) => {
    if (!user?.email) {
      console.log('Pas d\'adresse email utilisateur disponible');
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: user.id,
          orderId: null, // Pas d'orderId pour les transferts
          emailAddress: user.email,
          emailType,
          transactionType: 'transfer',
          orderData: transferData
        },
      });

      if (error) {
        console.error('Erreur lors de l\'envoi de l\'email de transfert:', error);
        throw error;
      }

      console.log('Email de transfert envoyé avec succès:', data);
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification de transfert:', error);
      toast({
        title: "Attention",
        description: "L'email de notification n'a pas pu être envoyé, mais votre transfert est bien enregistré.",
        variant: "default",
      });
    }
  };

  return {
    sendEmailNotification,
    sendBuyConfirmation,
    sendSellConfirmation,
    sendPaymentConfirmation,
    sendTransferNotification
  };
};
