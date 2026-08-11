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

// ── Bus de notifications simple ────────────────────────────────────────────
// Deux instances du hook (parent + enfant) partagent les mises à jour :
// dès qu'une add/remove/setDefault s'exécute, toutes les autres instances
// rechargent leurs données. Résout le bug "je viens d'ajouter une adresse
// mais elle n'apparaît pas dans le carnet".
let listeners: Array<() => void> = [];
const notify = () => listeners.forEach(fn => fn());

/**
 * Adresses USDT enregistrées par le client. Filtre optionnel par réseau.
 */
export function useSavedWallets(network?: string) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);

  // Abonnement au bus : toute add/remove faite ailleurs déclenche un reload ici.
  useEffect(() => {
    const fn = () => setTick(t => t + 1);
    listeners.push(fn);
    return () => { listeners = listeners.filter(l => l !== fn); };
  }, []);

  const reload = useCallback(async () => {
    if (!user?.id) { setWallets([]); return; }
    setLoading(true);
    let q = supabase
      .from('saved_wallets' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (network) q = q.eq('network', network);
    const { data } = await q;
    setWallets((data as unknown as SavedWallet[]) || []);
    setLoading(false);
  }, [user?.id, network]);

  useEffect(() => { reload(); }, [reload, tick]);

  const add = useCallback(async (input: { network: string; address: string; label?: string; setDefault?: boolean }) => {
    if (!user?.id) return null;

    // ORDRE CRUCIAL : quand on marque la nouvelle adresse comme défaut,
    // on doit démarquer l'ancienne défaut AVANT l'insert. Sinon l'index
    // unique (user_id, network) WHERE is_default fait échouer l'insert
    // avec un 23505 — c'est le bug qui empêchait d'enregistrer plus
    // d'une adresse par réseau.
    if (input.setDefault) {
      await supabase
        .from('saved_wallets' as any)
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('network', input.network);
    }

    const row = {
      user_id: user.id,
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
      // Doublon d'adresse (unique index (user_id, network, address)) :
      // on remonte silencieusement et on force reload.
      if (error.code === '23505') { notify(); return null; }
      throw error;
    }
    notify();
    return data as unknown as SavedWallet;
  }, [user?.id]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('saved_wallets' as any).delete().eq('id', id);
    notify();
  }, []);

  const setDefault = useCallback(async (id: string, net: string) => {
    if (!user?.id) return;
    await supabase
      .from('saved_wallets' as any)
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('network', net);
    await supabase
      .from('saved_wallets' as any)
      .update({ is_default: true })
      .eq('id', id);
    notify();
  }, [user?.id]);

  return { wallets, loading, add, remove, setDefault, reload };
}
