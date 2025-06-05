
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UserRole = 'user' | 'admin' | 'kyc_reviewer';

export const useUserRole = () => {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
        setRoles(data?.map(r => r.role as UserRole) || []);
      }
    } catch (error) {
      console.error('Erreur inattendue:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const hasRole = (role: UserRole): boolean => {
    return roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isKYCReviewer = (): boolean => {
    return hasRole('kyc_reviewer') || hasRole('admin');
  };

  useEffect(() => {
    fetchUserRoles();
  }, [user]);

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isKYCReviewer,
    refetch: fetchUserRoles
  };
};
