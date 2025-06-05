
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface EmailData {
  orderId?: string;
  transferId?: string;
  emailType: string;
  transactionType: 'buy' | 'sell' | 'transfer';
  data: any;
}

export const useEmailNotifications = () => {
  const { user } = useAuth();

  const sendTransactionEmail = async (emailData: EmailData) => {
    if (!user) {
      console.error('No user found for email notification');
      return;
    }

    try {
      console.log('Sending transaction email:', emailData);
      
      const { data, error } = await supabase.functions.invoke('send-transaction-email', {
        body: {
          userId: user.id,
          ...emailData
        }
      });

      if (error) {
        console.error('Error sending email:', error);
        throw error;
      }

      console.log('Email sent successfully:', data);
      return data;
    } catch (error) {
      console.error('Failed to send transaction email:', error);
      throw error;
    }
  };

  const sendOrderConfirmation = async (orderData: any) => {
    return sendTransactionEmail({
      orderId: orderData.id,
      emailType: 'order_confirmation',
      transactionType: orderData.type,
      data: orderData
    });
  };

  const sendOrderStatusUpdate = async (orderData: any, status: string) => {
    return sendTransactionEmail({
      orderId: orderData.id,
      emailType: status,
      transactionType: orderData.type,
      data: orderData
    });
  };

  const sendTransferNotification = async (transferData: any, emailType: string) => {
    return sendTransactionEmail({
      transferId: transferData.id,
      emailType: emailType,
      transactionType: 'transfer',
      data: transferData
    });
  };

  return {
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendTransferNotification
  };
};
