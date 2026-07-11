import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

/**
 * Opérations multi-employés sur les commandes :
 * - claimOrder / releaseOrder : prise en charge ATOMIQUE (deux opérateurs ne
 *   peuvent jamais prendre la même commande — le second reçoit un refus).
 * - logOrderEvent : journal d'activité append-only (order_events).
 * - useOrderEvents : timeline d'une commande.
 */

export interface OrderEvent {
  id: string;
  order_id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  details: string | null;
  created_at: string;
}

// Libellés lisibles de la timeline
export const EVENT_LABELS: Record<string, string> = {
  claimed: 'Prise en charge',
  released: 'Remise en file d\'attente',
  status_processing: 'Passée « En traitement »',
  status_completed: 'Marquée « Terminée »',
  status_cancelled: 'Annulée',
  cancellation_email_sent: 'Email d\'annulation envoyé au client',
  note: 'Note interne',
};

let cachedActorName: { userId: string; name: string } | null = null;

async function resolveActorName(userId: string, email?: string | null): Promise<string> {
  if (cachedActorName?.userId === userId) return cachedActorName.name;
  let name = '';
  try {
    const { data } = await supabase.from('profiles').select('full_name').eq('id', userId).maybeSingle();
    name = (data as any)?.full_name || '';
  } catch { /* silencieux */ }
  if (!name) name = email?.split('@')[0] || 'Opérateur';
  cachedActorName = { userId, name };
  return name;
}

export function useOrderOps() {
  const { user } = useAuth();
  const { toast } = useToast();

  const logOrderEvent = useCallback(async (orderId: string, action: string, details?: string) => {
    if (!user) return;
    try {
      const actorName = await resolveActorName(user.id, user.email);
      await (supabase as any).from('order_events').insert({
        order_id: orderId,
        actor_id: user.id,
        actor_name: actorName,
        action,
        details: details || null,
      });
    } catch (e) {
      console.error('logOrderEvent:', e);
    }
  }, [user]);

  /** Prise en charge atomique. Retourne false si déjà prise par quelqu'un d'autre.
   *  `orderType` détermine la table (les virements sont dans international_transfers). */
  const claimOrder = useCallback(async (orderId: string, orderType?: string): Promise<boolean> => {
    if (!user) return false;
    const table = orderType === 'transfer' ? 'international_transfers' : 'orders';
    const { data, error } = await (supabase as any)
      .from(table)
      .update({ assigned_to: user.id, assigned_at: new Date().toISOString() })
      .eq('id', orderId)
      .is('assigned_to', null) // ← garantie anti-course : ne prend que si LIBRE
      .select('id');
    if (error) {
      toast({ title: 'Erreur', description: 'Prise en charge impossible', variant: 'destructive' });
      return false;
    }
    if (!data || data.length === 0) {
      toast({ title: 'Déjà prise en charge', description: 'Un autre membre de l\'équipe traite déjà cette commande.', variant: 'destructive' });
      return false;
    }
    await logOrderEvent(orderId, 'claimed');
    toast({ title: 'Commande prise en charge', description: 'Elle est maintenant dans « Mes commandes ».' });
    return true;
  }, [user, toast, logOrderEvent]);

  /** Remet la commande dans la file d'attente (seulement si c'est la mienne). */
  const releaseOrder = useCallback(async (orderId: string, orderType?: string): Promise<boolean> => {
    if (!user) return false;
    const table = orderType === 'transfer' ? 'international_transfers' : 'orders';
    const { data, error } = await (supabase as any)
      .from(table)
      .update({ assigned_to: null, assigned_at: null })
      .eq('id', orderId)
      .eq('assigned_to', user.id)
      .select('id');
    if (error || !data || data.length === 0) {
      toast({ title: 'Erreur', description: 'Impossible de libérer cette commande', variant: 'destructive' });
      return false;
    }
    await logOrderEvent(orderId, 'released');
    return true;
  }, [user, toast, logOrderEvent]);

  return { claimOrder, releaseOrder, logOrderEvent, currentUserId: user?.id };
}

/** Timeline (journal) d'une commande — rechargée à la demande. */
export function useOrderEvents(orderId: string | undefined) {
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const reload = useCallback(async () => {
    if (!orderId) return;
    setLoading(true);
    try {
      const { data } = await (supabase as any)
        .from('order_events')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true });
      setEvents((data as OrderEvent[]) || []);
    } catch (e) {
      console.error('useOrderEvents:', e);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => { reload(); }, [reload]);

  return { events, loading, reload };
}
