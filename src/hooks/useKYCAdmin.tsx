
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
  identity_document_type?: 'passport' | 'national_id' | 'drivers_license';
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
      
      // Récupérer toutes les vérifications KYC
      const { data: verificationsData, error: verificationsError } = await supabase
        .from('kyc_verifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (verificationsError) {
        console.error('Erreur lors de la récupération des vérifications:', verificationsError);
        return;
      }

      // Pour l'instant, on ne récupère pas l'historique car la table n'est pas encore dans les types
      // Une fois que Supabase aura regénéré les types, nous pourrons ajouter ceci :
      const verificationsWithHistory = (verificationsData || []).map((verification) => ({
        ...verification,
        status: verification.status as 'pending' | 'submitted' | 'under_review' | 'approved' | 'rejected',
        history: [] // Temporairement vide jusqu'à ce que les types soient mis à jour
      }));

      setVerifications(verificationsWithHistory);

      // Calculer les statistiques
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
      // Utiliser une requête directe au lieu de RPC pour éviter les problèmes de types
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

      toast({
        title: "Vérification approuvée",
        description: "La vérification d'identité a été approuvée avec succès",
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
