
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactionAuthorization = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kycStatus, setKycStatus] = useState<string | null>(null);
  const { user } = useAuth();

  const checkAuthorization = async () => {
    if (!user) {
      setIsAuthorized(false);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Vérifier le statut KYC de l'utilisateur
      const { data: kycData, error } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('🔒 KYC Verification Check:', { user_id: user.id, kycData, error });

      if (error) {
        console.error('❌ Erreur lors de la vérification KYC:', error);
        setIsAuthorized(false);
        setKycStatus(null);
      } else if (kycData) {
        const status = kycData.status;
        setKycStatus(status);
        const authorized = status === 'approved';
        setIsAuthorized(authorized);
        console.log('✅ KYC Status:', status, 'Authorized:', authorized);
      } else {
        // Aucun enregistrement KYC trouvé
        console.log('⚠️ Aucun KYC trouvé pour l\'utilisateur');
        setKycStatus('pending');
        setIsAuthorized(false);
      }
    } catch (error) {
      console.error('❌ Erreur inattendue lors de la vérification:', error);
      setIsAuthorized(false);
      setKycStatus(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthorization();
  }, [user]);

  return {
    isAuthorized,
    loading,
    kycStatus,
    refetch: checkAuthorization
  };
};
