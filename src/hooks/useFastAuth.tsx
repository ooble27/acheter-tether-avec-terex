
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useFastAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Détecter si l'utilisateur est en Afrique (basé sur timezone, langue, etc.)
  const detectRegion = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      
      // Timezones africaines communes
      const africanTimezones = [
        'Africa/', 'Atlantic/Cape_Verde', 'Indian/Mauritius', 
        'Indian/Mayotte', 'Indian/Reunion'
      ];
      
      // Langues africaines communes
      const africanLanguages = ['fr', 'ar', 'sw', 'ha', 'am', 'pt', 'es'];
      
      const isAfricanTimezone = africanTimezones.some(tz => timezone.includes(tz));
      const isAfricanLanguage = africanLanguages.some(lang => language.startsWith(lang));
      
      if (isAfricanTimezone) {
        return `africa_${timezone.replace('Africa/', '').toLowerCase()}`;
      }
      if (isAfricanLanguage) {
        return `africa_lang_${language}`;
      }
      
      return 'other';
    } catch (error) {
      console.log('Erreur détection région:', error);
      return 'unknown';
    }
  };

  const sendFastAuthEmail = async (email: string) => {
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      const region = detectRegion();
      const isAfrican = region.includes('africa');
      
      console.log('Fast Auth - Région détectée:', region, 'Africain:', isAfrican);
      
      // Si utilisateur africain, utiliser le système rapide
      if (isAfrican) {
        console.log('Utilisation du système Fast Auth pour utilisateur africain');
        
        const { data, error } = await supabase.functions.invoke('send-fast-auth-email', {
          body: {
            email,
            redirectUrl: `${window.location.origin}/auth/callback`,
            region
          },
        });

        if (error) {
          console.error('Erreur Fast Auth:', error);
          // Fallback vers le système classique
          return await fallbackToClassicAuth(email);
        }

        const totalTime = Date.now() - startTime;
        console.log('Fast Auth - Succès en:', totalTime, 'ms');

        toast({
          title: "Email envoyé ultra-rapidement ! 🚀",
          description: `Vérifiez votre boîte mail. Optimisé pour l'Afrique (${totalTime}ms)`,
          className: "bg-green-600 text-white border-green-600",
        });

        return { success: true, data, fastAuth: true, timing: totalTime };
      } else {
        // Utilisateurs non-africains : système classique
        return await fallbackToClassicAuth(email);
      }
      
    } catch (error) {
      console.error('Erreur Fast Auth:', error);
      // Fallback vers le système classique
      return await fallbackToClassicAuth(email);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackToClassicAuth = async (email: string) => {
    console.log('Fallback vers système classique Supabase');
    
    try {
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
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    sendFastAuthEmail,
    isLoading
  };
};
