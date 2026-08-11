import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface SavedPhone {
  id: string;
  user_id: string;
  provider: string;
  label: string | null;
  phone: string;
  is_default: boolean;
  created_at: string;
}

// Voir useSavedWallets pour l'explication du cache et du bus.
const cache = new Map<string, SavedPhone[]>();
let listeners: Array<() => void> = [];
const notify = () => listeners.forEach(fn => fn());

const cacheKey = (userId: string) => userId;

function filterByProvider(all: SavedPhone[], provider?: string): SavedPhone[] {
  const filtered = provider ? all.filter(p => p.provider === provider) : all;
  return [...filtered].sort((a, b) => {
    if (a.is_default !== b.is_default) return a.is_default ? -1 : 1;
    return b.created_at.localeCompare(a.created_at);
  });
}

/**
 * Numéros Mobile Money enregistrés par le client.
 * Cache-first : affichage immédiat depuis le cache, refetch en arrière-plan.
 */
export function useSavedPhones(provider?: string) {
  const { user } = useAuth();
  const userId = user?.id;
  const [phones, setPhones] = useState<SavedPhone[]>(() =>
    userId ? filterByProvider(cache.get(cacheKey(userId)) || [], provider) : []
  );
  const [, setTick] = useState(0);

  useEffect(() => {
    const fn = () => {
      if (!userId) { setPhones([]); return; }
      setPhones(filterByProvider(cache.get(cacheKey(userId)) || [], provider));
      setTick(t => t + 1);
    };
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }, [userId, provider]);

  const reload = useCallback(async () => {
    if (!userId) { setPhones([]); return; }
    const { data } = await supabase
      .from('saved_phones' as any)
      .select('*')
      .eq('user_id', userId);
    const all = (data as unknown as SavedPhone[]) || [];
    cache.set(cacheKey(userId), all);
    setPhones(filterByProvider(all, provider));
  }, [userId, provider]);

  useEffect(() => { reload(); }, [reload]);

  useEffect(() => {
    if (userId) setPhones(filterByProvider(cache.get(cacheKey(userId)) || [], provider));
  }, [userId, provider]);

  const add = useCallback(async (input: { provider: string; phone: string; label?: string; setDefault?: boolean }) => {
    if (!userId) return null;

    if (input.setDefault) {
      await supabase
        .from('saved_phones' as any)
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('provider', input.provider);
      const current = cache.get(cacheKey(userId)) || [];
      cache.set(cacheKey(userId), current.map(p =>
        p.provider === input.provider ? { ...p, is_default: false } : p
      ));
    }

    const row = {
      user_id: userId,
      provider: input.provider,
      phone: input.phone.trim(),
      label: input.label?.trim() || null,
      is_default: !!input.setDefault,
    };
    const { data, error } = await supabase
      .from('saved_phones' as any)
      .insert(row)
      .select('*')
      .single();
    if (error) {
      if (error.code === '23505') { notify(); return null; }
      throw error;
    }
    const inserted = data as unknown as SavedPhone;
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), [inserted, ...current]);
    notify();
    return inserted;
  }, [userId]);

  const remove = useCallback(async (id: string) => {
    if (!userId) return;
    await supabase.from('saved_phones' as any).delete().eq('id', id);
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), current.filter(p => p.id !== id));
    notify();
  }, [userId]);

  const setDefault = useCallback(async (id: string, prov: string) => {
    if (!userId) return;
    await supabase
      .from('saved_phones' as any)
      .update({ is_default: false })
      .eq('user_id', userId)
      .eq('provider', prov);
    await supabase
      .from('saved_phones' as any)
      .update({ is_default: true })
      .eq('id', id);
    const current = cache.get(cacheKey(userId)) || [];
    cache.set(cacheKey(userId), current.map(p =>
      p.provider === prov ? { ...p, is_default: p.id === id } : p
    ));
    notify();
  }, [userId]);

  return { phones, loading: false, add, remove, setDefault, reload };
}
