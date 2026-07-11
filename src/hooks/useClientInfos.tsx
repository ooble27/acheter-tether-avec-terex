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
    if (unique.length === 0) return;

    // Toujours refléter le cache courant dans l'état local. Corrige le nom qui
    // redevenait « Client » au retour depuis le détail : au remontage, les ids
    // peuvent déjà être en cache mais absents de l'état ; sans cette synchro,
    // l'effet retournait tôt (rien à charger) et laissait l'état vide.
    const fromCache: Record<string, ClientInfo> = {};
    for (const id of unique) {
      const c = cache.get(id);
      if (c) fromCache[id] = c;
    }
    if (Object.keys(fromCache).length) {
      setInfos((prev) => ({ ...prev, ...fromCache }));
    }

    const missing = unique.filter((id) => !cache.has(id));
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        // Passe par une edge function admin (service role) : l'API auth.admin
        // n'est PAS accessible depuis le navigateur, d'où les clients « sans nom ».
        const { data, error } = await supabase.functions.invoke('get-client-infos', {
          body: { userIds: missing },
        });
        if (error) throw error;

        const next: Record<string, ClientInfo> = {};
        for (const info of (data?.infos as ClientInfo[]) || []) {
          cache.set(info.user_id, info);
          next[info.user_id] = info;
        }
        // Marquer aussi les user_ids sans retour pour éviter de re-fetch en boucle.
        for (const uid of missing) {
          if (!next[uid]) {
            const empty: ClientInfo = { user_id: uid };
            cache.set(uid, empty);
            next[uid] = empty;
          }
        }

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
