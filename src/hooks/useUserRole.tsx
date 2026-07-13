
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Cache module : les rôles de l'utilisateur connecté survivent aux remontages
// de composant. Ainsi, en revenant sur une page protégée, on n'affiche jamais
// « Accès non autorisé » le temps d'un rechargement — les rôles sont déjà là.
let rolesCache: { userId: string; roles: string[] } | null = null;

export const useUserRole = () => {
  const { user } = useAuth();
  const cached = user && rolesCache?.userId === user.id ? rolesCache.roles : null;
  const [roles, setRoles] = useState<string[]>(cached ?? []);
  // On ne « charge » que si on n'a pas déjà les rôles en cache pour cet utilisateur.
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    let cancelled = false;
    const fetchUserRoles = async () => {
      if (!user) {
        rolesCache = null;
        setRoles([]);
        setLoading(false);
        return;
      }

      // Rôles déjà connus pour cet utilisateur → affichage immédiat,
      // on rafraîchit silencieusement en arrière-plan (pas de spinner).
      if (rolesCache?.userId === user.id) {
        setRoles(rolesCache.roles);
        setLoading(false);
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id);
        if (cancelled) return;

        if (error) {
          console.error('Erreur lors de la récupération des rôles:', error);
          if (rolesCache?.userId !== user.id) setRoles([]);
        } else {
          const next = data?.map(r => r.role) || [];
          rolesCache = { userId: user.id, roles: next };
          setRoles(next);
        }
      } catch (error) {
        if (cancelled) return;
        console.error('Erreur inattendue:', error);
        if (rolesCache?.userId !== user.id) setRoles([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUserRoles();
    return () => { cancelled = true; };
  }, [user]);

  const hasRole = (role: string) => roles.includes(role);
  const isAdmin = () => hasRole('admin');
  const isKYCReviewer = () => hasRole('kyc_reviewer') || hasRole('admin');
  const isOperator = () => hasRole('operator') || hasRole('admin');
  const isMarketing = () => hasRole('marketing') || hasRole('admin');
  const isHR = () => hasRole('hr') || hasRole('admin');
  /** Membre du staff = possède au moins un rôle métier (≠ simple client). */
  const isStaff = () => roles.some(r => r !== 'user');

  return {
    roles,
    loading,
    hasRole,
    isAdmin,
    isKYCReviewer,
    isOperator,
    isMarketing,
    isHR,
    isStaff
  };
};
