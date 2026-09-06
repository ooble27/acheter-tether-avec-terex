import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';

let cache: { userId: string; hasAccess: boolean } | null = null;

export function useAcademyAccess() {
  const { user } = useAuth();
  const { isAdmin, loading: rolesLoading } = useUserRole();

  const cached = user && cache?.userId === user.id ? cache.hasAccess : null;
  const [hasAccess, setHasAccess] = useState(cached ?? false);
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      if (!user) {
        cache = null;
        setHasAccess(false);
        setLoading(false);
        return;
      }

      if (cache?.userId === user.id) {
        setHasAccess(cache.hasAccess);
        setLoading(false);
      }

      const { count, error } = await supabase
        .from('enrollments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (cancelled) return;

      if (error) {
        console.error('useAcademyAccess:', error);
        if (cache?.userId !== user.id) setHasAccess(false);
      } else {
        const enrolled = (count ?? 0) > 0;
        cache = { userId: user.id, hasAccess: enrolled };
        setHasAccess(enrolled);
      }
      setLoading(false);
    }

    check();
    return () => { cancelled = true; };
  }, [user]);

  return {
    hasAccess: hasAccess || isAdmin(),
    loading: loading || rolesLoading,
  };
}
