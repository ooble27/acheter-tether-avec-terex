
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useTransactionAuthorization = () => {
  const [isAuthorized, setIsAuthorized] = useState(true); // KYC temporairement désactivé
  const [loading, setLoading] = useState(false); // Pas de chargement nécessaire
  const [kycStatus, setKycStatus] = useState<string | null>('approved'); // Statut par défaut
  const { user } = useAuth();

  const checkAuthorization = async () => {
    // KYC temporairement désactivé - tous les utilisateurs sont autorisés
    console.log('⚠️ KYC vérification désactivée temporairement');
    setIsAuthorized(true);
    setLoading(false);
    setKycStatus('approved');
  };

  useEffect(() => {
    checkAuthorization();
  }, [user]);

  return {
    isAuthorized: true, // Toujours autorisé
    loading: false, // Pas de chargement
    kycStatus: 'approved', // Toujours approuvé
    refetch: checkAuthorization
  };
};
