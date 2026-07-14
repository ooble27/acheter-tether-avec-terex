import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];
type DatabasePaymentMethod = Database['public']['Enums']['payment_method'];

export interface UnifiedOrder {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'transfer';
  status: OrderStatus;
  amount: number;
  currency: string;
  usdt_amount?: number;
  exchange_rate: number;
  payment_method?: 'card' | 'mobile' | 'wave' | 'orange_money' | 'bank' | 'bank_transfer' | 'interac';
  payment_reference?: string;
  wallet_address?: string;
  network?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  processed_by?: string;
  payment_status?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  // Prise en charge par un opérateur (multi-employés, anti-double-traitement)
  assigned_to?: string | null;
  assigned_at?: string | null;
  
  // Propriétés spécifiques aux transferts
  from_currency?: string;
  to_currency?: string;
  recipient_name?: string;
  recipient_phone?: string;
  recipient_country?: string;
  recipient_address?: string;
  recipient_email?: string;
  total_amount?: number;
  fees?: number;
  transfer_purpose?: string;
  
  // Propriétés pour les détails de paiement
  payment_details?: string;
}

// Helper function to map payment methods to database-compatible types
const mapPaymentMethodToDatabase = (paymentMethod?: string): DatabasePaymentMethod => {
  switch (paymentMethod) {
    case 'wave':
    case 'orange_money':
      return 'mobile';
    case 'bank':
    case 'bank_transfer':
    case 'interac':
      return 'card';
    default:
      return (paymentMethod as DatabasePaymentMethod) || 'card';
  }
};

// Cache module-level : les commandes déjà chargées restent disponibles quand on
// change d'onglet admin (File d'attente ↔ Commandes). Chaque écran s'affiche
// AVEC les données en cache (aucun spinner « Chargement… » qui clignote), puis
// se rafraîchit en arrière-plan. Corrige les flashs entre les pages du back-office.
let ordersCache: UnifiedOrder[] = [];

// ── Transformations (une seule source de vérité) ────────────────────────────
// Utilisées À LA FOIS par le chargement initial ET par le temps réel incrémental,
// pour qu'une ligne reçue en direct ait exactement la même forme qu'au fetch.
function transformOrder(order: any): UnifiedOrder {
  return {
    id: order.id,
    user_id: order.user_id,
    type: order.type as 'buy' | 'sell',
    status: order.status,
    amount: Number(order.amount),
    currency: order.currency,
    usdt_amount: Number(order.usdt_amount),
    exchange_rate: Number(order.exchange_rate),
    payment_method: order.payment_method as any,
    payment_reference: order.payment_reference,
    wallet_address: order.wallet_address,
    network: order.network,
    notes: order.notes,
    created_at: order.created_at,
    updated_at: order.updated_at,
    processed_at: order.processed_at,
    processed_by: order.processed_by,
    payment_status: order.payment_status,
    is_deleted: order.is_deleted ?? false,
    deleted_at: order.deleted_at ?? undefined,
    assigned_to: order.assigned_to ?? null,
    assigned_at: order.assigned_at ?? null,
  };
}

function transformTransfer(transfer: any): UnifiedOrder {
  return {
    id: transfer.id,
    user_id: transfer.user_id,
    type: 'transfer' as const,
    status: transfer.status as OrderStatus,
    amount: Number(transfer.amount),
    currency: transfer.from_currency,
    from_currency: transfer.from_currency,
    to_currency: transfer.to_currency,
    exchange_rate: Number(transfer.exchange_rate),
    payment_method: transfer.payment_method as any,
    payment_reference: transfer.reference_number,
    recipient_name: transfer.recipient_name,
    recipient_phone: transfer.recipient_phone,
    recipient_country: transfer.recipient_country,
    recipient_address: transfer.recipient_bank || transfer.recipient_account,
    recipient_email: transfer.recipient_email,
    total_amount: Number(transfer.total_amount),
    fees: Number(transfer.fees),
    notes: `Service: ${transfer.receive_method || 'Mobile Money'}, Téléphone: ${transfer.recipient_phone}, Montant: ${transfer.total_amount} ${transfer.to_currency}`,
    created_at: transfer.created_at,
    updated_at: transfer.updated_at,
    processed_at: transfer.processed_at,
    processed_by: transfer.processed_by,
    is_deleted: false,
    assigned_to: transfer.assigned_to ?? null,
    assigned_at: transfer.assigned_at ?? null,
  };
}

// Pagination complète : Supabase plafonne à 1000 lignes par requête. On boucle
// par tranches jusqu'à tout récupérer — plus aucune commande « invisible » au
// delà de 1000. (À terme, les vues passeront en pagination serveur ; ceci
// garantit déjà la complétude sans rien casser dans l'UI actuelle.)
const PAGE_SIZE = 1000;
async function fetchAllRows(table: 'orders' | 'international_transfers'): Promise<any[]> {
  const rows: any[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .neq('admin_hidden', true)
      .order('created_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data || []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

export function useOrders() {
  const [orders, setOrders] = useState<UnifiedOrder[]>(ordersCache);
  // On ne montre le plein écran de chargement que s'il n'y a VRAIMENT rien en cache.
  const [loading, setLoading] = useState(ordersCache.length === 0);
  const { toast } = useToast();
  const { sendEmailNotification } = useEmailNotifications();

  // Garder le cache synchronisé avec le dernier état connu.
  useEffect(() => { ordersCache = orders; }, [orders]);

  const fetchOrders = async () => {
    try {
      // Rafraîchissement discret quand on a déjà des données (pas de spinner).
      if (ordersCache.length === 0) setLoading(true);

      const [ordersData, transfersData] = await Promise.all([
        fetchAllRows('orders'),
        fetchAllRows('international_transfers'),
      ]);

      const allOrders = [
        ...ordersData.map(transformOrder),
        ...transfersData.map(transformTransfer),
      ];
      setOrders(allOrders);
    } catch (error) {
      console.error('Error in fetchOrders:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Applique UNE ligne reçue en temps réel, sans recharger toute la table.
    // C'est ce qui évite l'effondrement lors d'un « rush » de commandes :
    // 500 commandes = 500 petites mises à jour ciblées, pas 500 rechargements complets.
    const applyRow = (row: UnifiedOrder | null, deletedId?: string) => {
      setOrders(prev => {
        if (deletedId) return prev.filter(o => o.id !== deletedId);
        if (!row) return prev;
        const idx = prev.findIndex(o => o.id === row.id);
        if (idx === -1) return [row, ...prev];
        const next = prev.slice();
        next[idx] = row;
        return next;
      });
    };

    const onOrders = (payload: any) => {
      if (payload.eventType === 'DELETE') return applyRow(null, payload.old?.id);
      const raw = payload.new;
      // Masquée côté admin → on la retire de la liste au lieu de l'afficher.
      if (raw?.admin_hidden) return applyRow(null, raw.id);
      applyRow(transformOrder(raw));
    };
    const onTransfers = (payload: any) => {
      if (payload.eventType === 'DELETE') return applyRow(null, payload.old?.id);
      const raw = payload.new;
      if (raw?.admin_hidden) return applyRow(null, raw.id);
      applyRow(transformTransfer(raw));
    };

    // Nom de canal unique par instance : évite les collisions quand on change
    // d'onglet (l'ancien composant se démonte pendant que le nouveau s'abonne).
    const channelName = `orders-live-${Math.random().toString(36).slice(2)}`;
    let subscribedOnce = false;
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, onOrders)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'international_transfers' }, onTransfers)
      .subscribe((status) => {
        // Chargement initial à la 1re souscription, puis RE-synchronisation
        // complète à chaque reconnexion (réseau coupé/repris) pour rattraper
        // les événements manqués pendant la coupure.
        if (status === 'SUBSCRIBED') {
          fetchOrders();
          subscribedOnce = true;
        }
      });

    // Filet de sécurité : si le Realtime n'est pas activé sur la base, la
    // callback SUBSCRIBED peut ne jamais faire de fetch utile → on charge quand même.
    if (!subscribedOnce) fetchOrders();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createOrder = async (orderData: Omit<UnifiedOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Création d\'une nouvelle commande:', orderData);
      
      // Map the order data to match database schema
      const dbOrderData = {
        user_id: orderData.user_id,
        type: orderData.type,
        amount: orderData.amount,
        currency: orderData.currency,
        usdt_amount: orderData.usdt_amount || 0,
        exchange_rate: orderData.exchange_rate,
        payment_method: mapPaymentMethodToDatabase(orderData.payment_method),
        payment_reference: orderData.payment_reference,
        wallet_address: orderData.wallet_address,
        network: orderData.network || 'TRC20',
        notes: orderData.notes,
        status: orderData.status,
        payment_status: orderData.payment_status
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([dbOrderData])
        .select()
        .single();

      if (error) throw error;

      console.log('Commande créée avec succès:', data);

      // Envoyer l'email de confirmation au client + notification admin
      try {
        console.log('Envoi de l\'email de confirmation pour:', orderData.type);
        await sendEmailNotification('order_confirmation', orderData.type, {
          ...orderData,
          id: data.id,
          created_at: data.created_at,
          updated_at: data.updated_at
        }, data.id);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de confirmation:', emailError);
      }

      // NOTE: l'email admin « nouvelle commande » est déjà envoyé par la fonction
      // send-email-notification (cas 'order_confirmation' → adminNewOrderHtml).
      // On NE rappelle PAS notifyNewOrder ici, sinon l'admin reçoit 2 emails.

      await fetchOrders();
      
      toast({
        title: "Succès",
        description: "Commande créée avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: string) => {
    try {
      // IMPORTANT: Récupérer les données de la commande AVANT la mise à jour
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        console.error('Commande non trouvée:', orderId);
        return;
      }

      console.log('Mise à jour du statut pour la commande:', orderId, 'Nouveau statut:', status);
      console.log('Commande trouvée - Client ID:', order.user_id, 'Type:', order.type);

      if (order.type === 'transfer') {
        const { error } = await supabase
          .from('international_transfers')
          .update({ 
            status: status as any,
            processed_at: status === 'completed' ? new Date().toISOString() : null
          })
          .eq('id', orderId);

        if (error) throw error;
      } else {
        const updateData: any = { 
          status,
          updated_at: new Date().toISOString()
        };
        
        if (paymentStatus) {
          updateData.payment_status = paymentStatus;
        }
        
        if (status === 'completed') {
          updateData.processed_at = new Date().toISOString();
        }

        const { error } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', orderId);

        if (error) throw error;
      }

      // CORRECTION: Envoyer l'email au CLIENT avec son ID, pas l'admin connecté
      console.log('Envoi de l\'email de notification au client:', order.user_id);
      
      try {
        if (status === 'processing') {
          // Email de mise à jour de statut - utiliser l'ID du CLIENT
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: order.user_id, // UTILISER L'ID DU CLIENT, PAS L'ADMIN
              orderId: orderId,
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'status_update',
              transactionType: order.type,
              orderData: { ...order, status }
            },
          });
        } else if (status === 'completed') {
          // Email de confirmation de paiement - utiliser l'ID du CLIENT
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: order.user_id, // UTILISER L'ID DU CLIENT, PAS L'ADMIN
              orderId: orderId,
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'payment_confirmed',
              transactionType: order.type,
              orderData: { ...order, status }
            },
          });
        } else if (status === 'cancelled') {
          // Email d'annulation - utiliser l'ID du CLIENT
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: order.user_id, // UTILISER L'ID DU CLIENT, PAS L'ADMIN
              orderId: orderId,
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'status_update',
              transactionType: order.type,
              orderData: { ...order, status }
            },
          });
        }
        
        console.log('Email de notification envoyé avec succès au client:', order.user_id);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email de notification:', emailError);
      }

      await fetchOrders(); // Refresh the orders list
      
      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  const moveToTrash = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      if (order.type === 'transfer') {
        // Transfers don't have is_deleted column, delete directly
        const { error } = await supabase
          .from('international_transfers')
          .delete()
          .eq('id', orderId);
        if (error) throw error;
        setOrders(prev => prev.filter(o => o.id !== orderId));
      } else {
        const { error } = await supabase
          .from('orders')
          .update({ is_deleted: true, deleted_at: new Date().toISOString() })
          .eq('id', orderId);
        if (error) throw error;
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_deleted: true, deleted_at: new Date().toISOString() } : o));
      }

      toast({ title: "Succès", description: "Commande déplacée vers la corbeille" });
    } catch (error) {
      console.error('Error moving to trash:', error);
      toast({ title: "Erreur", description: "Impossible de supprimer", variant: "destructive" });
    }
  };

  const restoreFromTrash = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ is_deleted: false, deleted_at: null })
        .eq('id', orderId);
      if (error) throw error;

      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, is_deleted: false, deleted_at: undefined } : o));
      toast({ title: "Succès", description: "Commande restaurée" });
    } catch (error) {
      console.error('Error restoring from trash:', error);
      toast({ title: "Erreur", description: "Impossible de restaurer", variant: "destructive" });
    }
  };

  const purgeAllOrders = async () => {
    try {
      // Masquer toutes les commandes côté admin (sans supprimer les données client)
      const { error: ordersError } = await supabase
        .from('orders')
        .update({ admin_hidden: true })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (ordersError) throw ordersError;

      // Masquer tous les transferts internationaux côté admin
      const { error: transfersError } = await supabase
        .from('international_transfers')
        .update({ admin_hidden: true })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (transfersError) throw transfersError;

      setOrders([]);
      toast({ title: "Succès", description: "Toutes les commandes ont été masquées du tableau de bord admin" });
    } catch (error: any) {
      console.error('Error hiding all orders:', error);
      toast({ title: "Erreur", description: error?.message || "Impossible de masquer les commandes", variant: "destructive" });
    }
  };

  const deletePermanently = async (orderId: string) => {
    try {
      // Trouver la commande pour savoir si c'est un transfer ou un order
      const order = orders.find(o => o.id === orderId);
      
      if (!order) {
        toast({
          title: "Erreur",
          description: "Commande introuvable",
          variant: "destructive",
        });
        return;
      }

      // Supprimer de la bonne table selon le type
      if (order.type === 'transfer') {
        const { error } = await supabase
          .from('international_transfers')
          .delete()
          .eq('id', orderId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('orders')
          .delete()
          .eq('id', orderId);

        if (error) throw error;
      }

      // Mettre à jour l'état local
      setOrders(prevOrders => prevOrders.filter(o => o.id !== orderId));
      
      toast({
        title: "Succès",
        description: "Commande supprimée définitivement",
      });
    } catch (error) {
      console.error('Error deleting order permanently:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande",
        variant: "destructive",
      });
    }
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  // Vider la Corbeille : suppression DÉFINITIVE des seules commandes déjà
  // mises à la corbeille (is_deleted). Ne touche JAMAIS aux commandes actives
  // ni à l'historique terminé — contrairement à l'ancien « tout masquer ».
  const emptyTrash = async () => {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('is_deleted', true);
      if (error) throw error;
      setOrders(prev => prev.filter(o => !o.is_deleted));
      toast({ title: 'Corbeille vidée', description: 'Les commandes de la corbeille ont été supprimées définitivement.' });
    } catch (error: any) {
      console.error('Error emptying trash:', error);
      toast({ title: 'Erreur', description: error?.message || 'Impossible de vider la corbeille', variant: 'destructive' });
    }
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refreshOrders,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    emptyTrash,
    purgeAllOrders
  };
}
