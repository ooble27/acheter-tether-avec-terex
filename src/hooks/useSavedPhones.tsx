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

/**
 * Numéros Mobile Money enregistrés par le client — même approche que
 * useSavedWallets. Filtre optionnel par provider (wave, orange).
 */
export function useSavedPhones(provider?: string) {
  const { user } = useAuth();
  const [phones, setPhones] = useState<SavedPhone[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!user?.id) { setPhones([]); return; }
    setLoading(true);
    let q = supabase
      .from('saved_phones' as any)
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    if (provider) q = q.eq('provider', provider);
    const { data } = await q;
    setPhones((data as unknown as SavedPhone[]) || []);
    setLoading(false);
  }, [user?.id, provider]);

  useEffect(() => { reload(); }, [reload]);

  const add = useCallback(async (input: { provider: string; phone: string; label?: string; setDefault?: boolean }) => {
    if (!user?.id) return null;
    const row = {
      user_id: user.id,
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
      if (error.code === '23505') { await reload(); return null; }
      throw error;
    }
    if (input.setDefault) {
      await supabase
        .from('saved_phones' as any)
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('provider', input.provider)
        .neq('id', (data as any).id);
    }
    await reload();
    return data as unknown as SavedPhone;
  }, [user?.id, reload]);

  const remove = useCallback(async (id: string) => {
    await supabase.from('saved_phones' as any).delete().eq('id', id);
    await reload();
  }, [reload]);

  const setDefault = useCallback(async (id: string, prov: string) => {
    if (!user?.id) return;
    await supabase
      .from('saved_phones' as any)
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('provider', prov);
    await supabase
      .from('saved_phones' as any)
      .update({ is_default: true })
      .eq('id', id);
    await reload();
  }, [user?.id, reload]);

  return { phones, loading, add, remove, setDefault, reload };
}
