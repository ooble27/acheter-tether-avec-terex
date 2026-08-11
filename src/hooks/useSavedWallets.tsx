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

/**
 * Adresses USDT enregistrées par le client — chargées une fois puis mises
 * à jour localement pour éviter les allers-retours réseau à chaque action.
 * Filtre optionnel par réseau (TRC20, BEP20, etc.).
 */
export function useSavedWallets(network?: string) {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<SavedWallet[]>([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => { reload(); }, [reload]);

  const add = useCallback(async (input: { network: string; address: string; label?: string; setDefault?: boolean }) => {
    if (!user?.id) return null;
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
      // Doublon (unique index) : on remonte silencieusement l'existant
      if (error.code === '23505') {
        await reload();
        return null;
      }
      throw error;
    }
    // Si on marque celle-ci par défaut, on démarque les autres du même réseau.
    if (input.setDefault) {
      await supabase
        .from('saved_wallets' as any)
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('network', input.network)
        .neq('id', (data as any).id);
    }
    await reload();
    return data as unknown as SavedWallet;
  }, [user?.id, reload]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('saved_wallets' as any).delete().eq('id', id);
    await reload();
  }, [reload]);

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
    await reload();
  }, [user?.id, reload]);

  return { wallets, loading, add, remove, setDefault, reload };
}
