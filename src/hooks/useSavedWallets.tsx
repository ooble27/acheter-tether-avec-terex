import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedWallet {
  id: string;
  user_id: string;
  network: string;
  label: string | null;
  address: string;
  is_default: boolean;
  created_at: string;
}

// ── Cache module-level + bus de notifications ──────────────────────────────
// Le cache garde les adresses en mémoire une fois chargées : quand le client
// revient à l'étape adresse, on affiche IMMÉDIATEMENT ce qu'on a en cache,
// puis on refetch en arrière-plan. Plus de "clignotement de chargement".
const cache = new Map<string, SavedWallet[]>(); // key = user_id
let listeners: Array<() => void> = [];
const notify = () => listeners.forEach(fn => fn());

const cacheKey = (userId: string) => userId;

function filterByNetwork(all: SavedWallet[], network?: string): SavedWallet[] {
  const filtered = network ? all.filter(w => w.network === network) : all;
  // Tri : défauts d'abord, puis plus récents
  return [...filtered].sort((a, b) => {
    if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
    return b.created_at.localeCompare(a.created_at);
  });
}

/**
 * Adresses USDT enregistrées par le client. Filtre optionnel par réseau.
 * Cache-first : affichage immédiat depuis le cache, refetch en arrière-plan.
 */
export function useSavedWallets(network?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [wallets, setWallets] = useState<SavedWallet[]>(() =>
    userId ? filterByNetwork(cache.get(cacheKey(userId)) || [], network) : []
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => {
      if (!userId) { setWallets([]); return; }
      setWallets(filterByNetwork(cache.get(cacheKey(userId)) || [], network));
      setTick(t => t + 1);
    };
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }, [userId, network]);

  const reload = useCallback(async () => {
    if (!userId) { setWallets([]); return; }
    const { data } = await supabase
      .from('saved_wallets' as any)
      .select('*')
      .eq('user_id', userId);
    const all = (data as unknown as SavedWallet[]) || [];
    cache.set(cacheKey(userId), all);
    setWallets(filterByNetwork(all, network));
  }, [userId, network]);

  // Toujours refetch en arrière-plan pour capter les changements hors-session.
  useEffect(() => { reload(); }, [reload]);

  // Sync quand le filtre network change (le cache est global, pas filtré).
  useEffect(() => {
    if (userId) setWallets(filterByNetwork(cache.get(cacheKey(userId)) || [], network));
  }, [userId, network]);

  const add = useCallback(async (input: { network: string; address: string; label?: string; setDefault?: boolean }) => {
    if (!userId) return null;

    // ORDRE CRUCIAL : démarquer l'ancien défaut AVANT l'insert pour ne pas
    // violer l'index unique (user_id, network) WHERE is_default IS TRUE.
    if (input.setDefault) {
      await supabase
        .from('saved_wallets' as any)
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('network', input.network);
      // Mise à jour optimiste du cache
      const current = cache.get(cacheKey(userId)) || [];
      cache.set(cacheKey(userId), current.map(w =>
        w.network === input.network ? { ...w, is_default: false } : w
      ));
    }

    const row = {
      user_id: userId,
      network: input.network,
      address: input.address.trim(),
      label: input.label?.trim() || null,
      is_default: !!input.setDefault,
    };
    const { data, error } = await supabase
      .from('saved_wallets' as any)
      .insert(row)
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') { notify(); return null; }
      throw error;
    }
    // Cache optimiste
    const inserted = data as unknown as SavedWallet;
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), [inserted, ...current]);
    notify();
    return inserted;
  }, [userId]);

  const remove = useCallback(async (id: string) => {
    if (!userId) return;
    await supabase.from('saved_wallets' as any).delete().eq('id', id);
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), current.filter(w => w.id !== id));
    notify();
  }, [userId]);

  const setDefault = useCallback(async (id: string, net: string) => {
    if (!userId) return;
    await supabase
      .from('saved_wallets' as any)
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('network', net);
    await supabase
      .from('saved_wallets' as any)
      .update({ is_default: true })
      .eq('id', id);
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), current.map(w =>
      w.network === net ? { ...w, is_default: w.id === id } : w
    ));
    notify();
  }, [userId]);

  return { wallets, loading: false, add, remove, setDefault, reload };
}
