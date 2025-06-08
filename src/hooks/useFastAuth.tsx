
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFastAuth = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const sendFastSignupEmail = async (email: string) => {
    setLoading(true);
    try {
      console.log('Envoi email rapide signup pour:', email);
      
      const { data, error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email,
          type: 'signup'
        },
      });

      if (error) throw error;

      console.log('Email signup envoyé:', data);
      
      toast({
        title: "Email envoyé !",
        description: `Un lien d'activation a été envoyé à ${email}. Vérifiez votre boîte de réception.`,
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erreur envoi email signup:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email. Réessayez dans quelques instants.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const sendFastLoginEmail = async (email: string) => {
    setLoading(true);
    try {
      console.log('Envoi email rapide login pour:', email);
      
      const { data, error } = await supabase.functions.invoke('send-auth-email', {
        body: {
          email,
          type: 'magiclink'
        },
      });

      if (error) throw error;

      console.log('Email login envoyé:', data);
      
      toast({
        title: "Email envoyé !",
        description: `Un lien de connexion a été envoyé à ${email}. Vérifiez votre boîte de réception.`,
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error: any) {
      console.error('Erreur envoi email login:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email. Réessayez dans quelques instants.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    sendFastSignupEmail,
    sendFastLoginEmail,
    loading
  };
};
