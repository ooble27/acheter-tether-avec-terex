
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRole = () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user) {
        setRoles([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);

        if (error) {
          console.error('Erreur lors de la récupération des rôles:', error);
          setRoles([]);
        } else {
          setRoles(data?.map(r => r.role) || []);
        }
      } catch (error) {
        console.error('Erreur inattendue:', error);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoles();
  }, [user]);

  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isKYCReviewer = () => hasRole('kyc_reviewer') || hasRole('admin');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isKYCReviewer
  };
};
