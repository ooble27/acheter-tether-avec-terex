
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ContactMessage {
  subject: string;
  message: string;
  user_email: string;
  user_name: string;
  user_phone?: string;
}

export const useContactMessages = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const sendMessage = async (messageData: ContactMessage) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour envoyer un message.",
        variant: "destructive",
      });
      return { error: 'Not authenticated' };
    }

    try {
      setLoading(true);
      console.log('Envoi du message de contact:', messageData);

      const { error } = await supabase
        .from('contact_messages')
        .insert({
          user_id: user.id,
          subject: messageData.subject,
          message: messageData.message,
          user_email: messageData.user_email,
          user_name: messageData.user_name,
          user_phone: messageData.user_phone
        });

      if (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le message. Veuillez réessayer.",
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
        className: "bg-green-600 text-white border-green-600",
      });

      return { error: null };
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      });
      return { error: 'Une erreur est survenue' };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendMessage,
    loading
  };
};
