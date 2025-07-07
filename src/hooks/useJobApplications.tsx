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
  cv_file?: File;
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
      // Récupérer l'utilisateur actuel - connexion obligatoire
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Vous devez être connecté pour postuler");
      }
      
      let cvUrl = null;
      
      // Upload du CV si fourni
      if (applicationData.cv_file) {
        const fileExt = applicationData.cv_file.name.split('.').pop();
        const fileName = `${Date.now()}-${applicationData.first_name}-${applicationData.last_name}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(filePath, applicationData.cv_file);
        
        if (uploadError) {
          throw uploadError;
        }
        
        cvUrl = uploadData.path;
      }
      
      // Préparer les données sans le fichier
      const { cv_file, ...dataToInsert } = applicationData;
      
      // Insérer la candidature dans la base de données
      const { error: dbError } = await supabase
        .from('job_applications')
        .insert({
          ...dataToInsert,
          cv_url: cvUrl,
          user_id: user.id,
        });

      if (dbError) {
        throw dbError;
      }

      // Envoyer les emails de notification
      const { data: emailData, error: emailError } = await supabase.functions.invoke(
        'send-job-application-notification',
        {
          body: {
            ...dataToInsert,
            cv_url: cvUrl,
          },
        }
      );

      if (emailError) {
        console.error('Email notification error:', emailError);
        // On ne fait pas échouer la candidature si l'email échoue
      } else {
        console.log('Email sent successfully:', emailData);
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