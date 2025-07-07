
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

export interface JobApplicationAdmin {
  id: string;
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
  status: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useJobApplicationsAdmin = () => {
  const [applications, setApplications] = useState<JobApplicationAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const { sendEmailNotification } = useEmailNotifications();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les candidatures.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id: string, status: string, adminNotes?: string) => {
    setUpdating(true);
    try {
      // Récupérer l'application actuelle pour comparaison
      const currentApplication = applications.find(app => app.id === id);
      
      const { error } = await supabase
        .from('job_applications')
        .update({ 
          status, 
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Mettre à jour la liste locale
      setApplications(prev => 
        prev.map(app => 
          app.id === id 
            ? { ...app, status, admin_notes: adminNotes || app.admin_notes }
            : app
        )
      );

      // Envoyer un email de notification si le statut a changé
      if (currentApplication && currentApplication.status !== status) {
        console.log('Envoi de notification email pour changement de statut:', {
          currentStatus: currentApplication.status,
          newStatus: status,
          email: currentApplication.email
        });

        try {
          await sendEmailNotification(
            'job_application_status_update',
            'job_application',
            {
              ...currentApplication,
              status: status,
              admin_notes: adminNotes
            }
          );
          console.log('Email de notification envoyé avec succès');
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email:', emailError);
          // Ne pas faire échouer la mise à jour pour une erreur d'email
        }
      }

      toast({
        title: "Succès",
        description: "Statut de la candidature mis à jour.",
        className: "bg-green-600 text-white border-green-600",
      });

    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la candidature.",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const downloadCV = async (cvUrl: string, candidateName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('cvs')
        .download(cvUrl);

      if (error) {
        throw error;
      }

      // Créer un lien de téléchargement
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${candidateName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "CV téléchargé avec succès.",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Error downloading CV:', error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le CV.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  return {
    applications,
    loading,
    updating,
    fetchApplications,
    updateApplicationStatus,
    downloadCV
  };
};
