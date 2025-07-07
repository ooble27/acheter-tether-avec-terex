import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface JobApplication {
  position: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  experience_years?: number;
  cv_url?: string;
  cover_letter?: string;
  linkedin_profile?: string;
  portfolio_url?: string;
  availability?: string;
  salary_expectation?: string;
}

export const useJobApplications = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const submitApplication = async (applicationData: JobApplication) => {
    setIsSubmitting(true);
    
    try {
      // Récupérer l'utilisateur actuel ou permettre candidature anonyme
      const { data: { user } } = await supabase.auth.getUser();
      
      // Insérer la candidature dans la base de données
      const { error: dbError } = await supabase
        .from('job_applications')
        .insert({
          ...applicationData,
          user_id: user?.id || null,
        });

      if (dbError) {
        throw dbError;
      }

      // Envoyer les emails de notification
      const { error: emailError } = await supabase.functions.invoke(
        'send-job-application-notification',
        {
          body: applicationData,
        }
      );

      if (emailError) {
        console.error('Email notification error:', emailError);
        // On ne fait pas échouer la candidature si l'email échoue
      }

      toast({
        title: "Candidature envoyée !",
        description: "Votre candidature a été envoyée avec succès. Nous vous contacterons bientôt.",
        className: "bg-green-600 text-white border-green-600",
      });

      return { success: true };
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre candidature. Veuillez réessayer.",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMyApplications = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  };

  return {
    submitApplication,
    getMyApplications,
    isSubmitting,
  };
};