
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFastAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendFastAuthEmail = async (email: string) => {
    setIsLoading(true);
    
    try {
      console.log('Envoi d\'email de connexion classique pour:', email);
      
      // Utiliser uniquement le système classique Supabase
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false,
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Email envoyé !",
        description: "Vérifiez votre boîte mail pour vous connecter.",
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true, fastAuth: false };
      
    } catch (error: any) {
      console.error('Erreur envoi email:', error);
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendFastAuthEmail,
    isLoading
  };
};
