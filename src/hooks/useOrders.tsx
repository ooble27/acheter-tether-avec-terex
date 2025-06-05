
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailNotifications } from './useEmailNotifications';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export interface Order {
  id: string;
  user_id: string;
  amount: number;
  usdt_amount: number;
  exchange_rate: number;
  payment_method: string;
  status: OrderStatus;
  type: string;
  currency: string;
  network: string;
  wallet_address?: string;
  payment_status?: string;
  payment_reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  processed_by?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { sendOrderConfirmation, sendOrderStatusUpdate } = useEmailNotifications();

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      try {
        await sendOrderConfirmation(data);
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't throw error, just log it
      }

      await fetchOrders();
      toast.success('Commande créée avec succès');
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la création de la commande');
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({
          status,
          payment_status: paymentStatus,
          processed_at: status === 'completed' ? new Date().toISOString() : null,
          processed_by: user?.id
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Send status update email
      try {
        await sendOrderStatusUpdate(data, status);
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Don't throw error, just log it
      }

      await fetchOrders();
      toast.success('Statut de la commande mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refetch: fetchOrders
  };
};
