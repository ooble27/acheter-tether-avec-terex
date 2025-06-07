import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

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

export function useOrders() {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch regular orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw ordersError;
      }

      // Fetch international transfers
      const { data: transfersData, error: transfersError } = await supabase
        .from('international_transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (transfersError) {
        console.error('Error fetching transfers:', transfersError);
        throw transfersError;
      }

      // Transform orders to unified format
      const transformedOrders: UnifiedOrder[] = ordersData?.map(order => ({
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
        is_deleted: false,
      })) || [];

      // Transform transfers to unified format
      const transformedTransfers: UnifiedOrder[] = transfersData?.map(transfer => ({
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
      })) || [];

      // Combine all orders
      const allOrders = [...transformedOrders, ...transformedTransfers];
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
    fetchOrders();
  }, []);

  const createOrder = async (orderData: Omit<UnifiedOrder, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      await fetchOrders(); // Refresh the orders list
      
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
      // Check if it's a transfer or regular order
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

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

  // Local simulation for trash functionality (will be replaced with real DB logic later)
  const moveToTrash = async (orderId: string) => {
    // For now, just update local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, is_deleted: true, deleted_at: new Date().toISOString() }
          : order
      )
    );
    
    toast({
      title: "Succès",
      description: "Commande déplacée vers la corbeille",
    });
  };

  const restoreFromTrash = async (orderId: string) => {
    // For now, just update local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, is_deleted: false, deleted_at: undefined }
          : order
      )
    );
    
    toast({
      title: "Succès",
      description: "Commande restaurée",
    });
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refreshOrders,
    moveToTrash,
    restoreFromTrash
  };
}
