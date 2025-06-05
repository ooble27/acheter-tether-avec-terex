
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useOrderNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendOrderEmail = async (orderId: string, orderData: any, emailType: 'confirmation' | 'processing' | 'completed' | 'cancelled') => {
    if (!user) return;

    try {
      console.log(`Sending ${emailType} email for order ${orderId}`);
      
      const { data, error } = await supabase.functions.invoke('send-order-email', {
        body: {
          orderId,
          userEmail: user.email,
          userName: user.email?.split('@')[0] || 'Client',
          orderData: {
            amount: orderData.amount,
            currency: orderData.currency,
            usdtAmount: orderData.usdt_amount,
            status: orderData.status,
            paymentMethod: orderData.payment_method,
            network: orderData.network,
            walletAddress: orderData.wallet_address
          },
          emailType
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      console.log('Email sent successfully:', data);
      
      // Notification toast selon le type d'email
      const toastMessages = {
        confirmation: 'Email de confirmation envoyé',
        processing: 'Notification de traitement envoyée',
        completed: 'Email de confirmation de réception envoyé',
        cancelled: 'Notification d\'annulation envoyée'
      };

      toast({
        title: "Email envoyé",
        description: toastMessages[emailType],
      });

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer l'email de notification",
        variant: "destructive",
      });
    }
  };

  return { sendOrderEmail };
};
