
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

  return {
    sendEmailNotification
  };
};
