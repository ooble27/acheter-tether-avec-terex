
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface KYCVerificationWithHistory {
  id: string;
  user_id: string;
  status: 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  nationality?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  phone_number?: string;
  identity_document_type?: 'passport' | 'national_id' | 'drivers_license' | null;
  identity_document_number?: string;
  identity_document_front_url?: string;
  identity_document_back_url?: string;
  selfie_url?: string;
  proof_of_address_url?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  history?: Array<{
    id: string;
    action: string;
    reason?: string;
    created_at: string;
    reviewer_id?: string;
  }>;
}

export const useKYCAdmin = () => {
  const [verifications, setVerifications] = useState<KYCVerificationWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    submitted: 0,
    under_review: 0,
    approved: 0,
    rejected: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchVerifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Récupérer toutes les vérifications KYC avec des données réelles
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('kyc_verifications')
        .select('*')
        .or('status.eq.submitted,status.eq.under_review,status.eq.approved,status.eq.rejected')
        .not('first_name', 'is', null)
        .not('last_name', 'is', null)
        .order('created_at', { ascending: false });

      if (verificationsError) {
        console.error('Erreur lors de la récupération des vérifications:', verificationsError);
        return;
      }

      // Filtrer les vérifications qui ont au minimum les informations de base
      const completeVerifications = (verificationsData || []).filter((verification) => {
        return verification.first_name && 
               verification.last_name && 
               verification.status !== 'pending' &&
               (verification.identity_document_front_url || verification.submitted_at);
      });

      // Mapper les données avec les types corrects
      const verificationsWithHistory = completeVerifications.map((verification) => ({
        ...verification,
        status: verification.status as 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected',
        identity_document_type: verification.identity_document_type as 'passport' | 'national_id' | 'drivers_license' | null,
        history: [] // Temporairement vide jusqu'à ce que les types soient mis à jour
      })) as KYCVerificationWithHistory[];

      setVerifications(verificationsWithHistory);

      // Calculer les statistiques uniquement sur les vérifications complètes
      const newStats = verificationsWithHistory.reduce(
        (acc, verification) => {
          acc[verification.status as keyof typeof acc]++;
          return acc;
        },
        { pending: 0, submitted: 0, under_review: 0, approved: 0, rejected: 0 }
      );
      setStats(newStats);

    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveVerification = async (verificationId: string, comment?: string) => {
    try {
      // D'abord, récupérer les informations de la vérification pour l'email
      const { data: verificationData, error: fetchError } = await supabase
        .from('kyc_verifications')
        .select('user_id, first_name, last_name')
        .eq('id', verificationId)
        .single();

      if (fetchError) {
        console.error('Erreur lors de la récupération des données de vérification:', fetchError);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les informations de vérification",
          variant: "destructive"
        });
        return { error: fetchError.message };
      }

      // Mettre à jour le statut de la vérification
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_reason: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) {
        console.error('Erreur lors de l\'approbation:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'approuver la vérification",
          variant: "destructive"
        });
        return { error: error.message };
      }

      // Envoyer l'email d'approbation KYC avec lien de connexion
      try {
        console.log('Envoi de l\'email d\'approbation KYC pour l\'utilisateur:', verificationData.user_id);
        
        const { error: emailError } = await supabase.functions.invoke('send-email-notification', {
          body: {
            userId: verificationData.user_id,
            emailType: 'kyc_approved',
            transactionType: 'kyc',
            orderData: {
              first_name: verificationData.first_name,
              last_name: verificationData.last_name,
              comment: comment || null
            }
          },
        });

        if (emailError) {
          console.error('Erreur lors de l\'envoi de l\'email d\'approbation:', emailError);
          // Ne pas bloquer l'approbation même si l'email échoue
        } else {
          console.log('Email d\'approbation KYC envoyé avec succès');
        }
      } catch (emailError) {
        console.error('Erreur inattendue lors de l\'envoi de l\'email:', emailError);
        // Ne pas bloquer l'approbation même si l'email échoue
      }

      toast({
        title: "Vérification approuvée",
        description: "La vérification d'identité a été approuvée avec succès et l'utilisateur a été notifié par email",
        className: "bg-green-600 text-white border-green-600"
      });

      await fetchVerifications();
      return { success: true };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return { error: 'Erreur inattendue' };
    }
  };

  const rejectVerification = async (verificationId: string, reason: string) => {
    try {
      // Utiliser une requête directe au lieu de RPC pour éviter les problèmes de types
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
          rejection_reason: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) {
        console.error('Erreur lors du rejet:', error);
        toast({
          title: "Erreur",
          description: "Impossible de rejeter la vérification",
          variant: "destructive"
        });
        return { error: error.message };
      }

      toast({
        title: "Vérification rejetée",
        description: "La vérification d'identité a été rejetée",
        variant: "destructive"
      });

      await fetchVerifications();
      return { success: true };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return { error: 'Erreur inattendue' };
    }
  };

  const setUnderReview = async (verificationId: string) => {
    try {
      const { error } = await supabase
        .from('kyc_verifications')
        .update({
          status: 'under_review',
          updated_at: new Date().toISOString()
        })
        .eq('id', verificationId);

      if (error) {
        console.error('Erreur lors de la mise en révision:', error);
        return { error: error.message };
      }

      toast({
        title: "Statut mis à jour",
        description: "La vérification est maintenant en cours d'examen",
        className: "bg-blue-600 text-white border-blue-600"
      });

      await fetchVerifications();
      return { success: true };
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return { error: 'Erreur inattendue' };
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, [user]);

  return {
    verifications,
    loading,
    stats,
    approveVerification,
    rejectVerification,
    setUnderReview,
    refetch: fetchVerifications
  };
};
