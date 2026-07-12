import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Shift {
  id: string;
  user_id: string;
  actor_name: string | null;
  clock_in: string;
  clock_out: string | null;
}

// La table peut ne pas encore être déployée (script Lovable pas passé) :
// on détecte son absence pour NE RIEN afficher de cassé côté employé.
function isMissingTable(err: any): boolean {
  const code = err?.code || '';
  const msg = (err?.message || '').toLowerCase();
  return code === '42P01' || msg.includes('does not exist') || msg.includes('schema cache');
}

/**
 * Pointage de l'utilisateur courant : pointage ouvert + arrivée / sortie.
 * `available` = false tant que la table n'existe pas → l'UI reste masquée.
 */
export function useStaffShifts() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  const [current, setCurrent] = useState<Shift | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser();
    const id = auth?.user?.id ?? null;
    setUid(id);
    if (!id) return;
    const { data, error } = await (supabase as any)
      .from('staff_shifts')
      .select('id, user_id, actor_name, clock_in, clock_out')
      .eq('user_id', id)
      .is('clock_out', null)
      .order('clock_in', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) {
      if (isMissingTable(error)) { setAvailable(false); return; }
      setAvailable(true);
      return;
    }
    setAvailable(true);
    setCurrent((data as Shift) ?? null);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const clockIn = useCallback(async (actorName?: string) => {
    if (!uid || busy) return;
    setBusy(true);
    try {
      const { data, error } = await (supabase as any)
        .from('staff_shifts')
        .insert({ user_id: uid, actor_name: actorName ?? null })
        .select('id, user_id, actor_name, clock_in, clock_out')
        .single();
      if (!error && data) setCurrent(data as Shift);
    } finally { setBusy(false); }
  }, [uid, busy]);

  const clockOut = useCallback(async () => {
    if (!current || busy) return;
    setBusy(true);
    try {
      const { error } = await (supabase as any)
        .from('staff_shifts')
        .update({ clock_out: new Date().toISOString() })
        .eq('id', current.id);
      if (!error) setCurrent(null);
    } finally { setBusy(false); }
  }, [current, busy]);

  return { available, current, busy, clockIn, clockOut, refresh };
}
