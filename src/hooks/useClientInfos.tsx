import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ClientInfo {
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

/**
 * Récupère en batch les infos clients (nom + email + téléphone) pour une liste d'user_ids.
 * Utilise un cache module-level pour éviter les rechargements inutiles entre composants.
 */
const cache = new Map<string, ClientInfo>();

export function useClientInfos(userIds: string[]): Record<string, ClientInfo> {
  const [infos, setInfos] = useState<Record<string, ClientInfo>>(() => {
    const initial: Record<string, ClientInfo> = {};
    for (const id of userIds) {
      const cached = cache.get(id);
      if (cached) initial[id] = cached;
    }
    return initial;
  });

  useEffect(() => {
    const unique = Array.from(new Set(userIds.filter(Boolean)));
    const missing = unique.filter((id) => !cache.has(id));
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name, phone')
          .in('id', missing);

        const profileMap = new Map<string, { full_name?: string; phone?: string }>();
        for (const p of profiles || []) {
          profileMap.set(p.id, { full_name: p.full_name || undefined, phone: p.phone || undefined });
        }

        // Récupérer les emails un par un via auth.admin (pas d'API batch côté client)
        const next: Record<string, ClientInfo> = {};
        await Promise.all(
          missing.map(async (uid) => {
            try {
              const { data } = await supabase.auth.admin.getUserById(uid);
              const profile = profileMap.get(uid) || {};
              const info: ClientInfo = {
                user_id: uid,
                full_name: profile.full_name,
                phone: profile.phone,
                email: data?.user?.email || undefined,
              };
              cache.set(uid, info);
              next[uid] = info;
            } catch (e) {
              const profile = profileMap.get(uid) || {};
              const info: ClientInfo = { user_id: uid, ...profile };
              cache.set(uid, info);
              next[uid] = info;
            }
          })
        );

        if (!cancelled) {
          setInfos((prev) => ({ ...prev, ...next }));
        }
      } catch (e) {
        console.error('useClientInfos error:', e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userIds.join(',')]);

  return infos;
}
