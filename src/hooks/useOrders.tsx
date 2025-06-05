
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Order {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  currency: string;
  usdt_amount: number;
  exchange_rate: number;
  payment_method: 'card' | 'mobile';
  network: string;
  wallet_address?: string;
  status: string;
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
  const { toast } = useToast();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des commandes:', error);
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une commande",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          ...orderData,
          user_id: user.id,
          status: orderData.status || 'pending',
          payment_status: orderData.payment_status || 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      }

      toast({
        title: "Commande créée",
        description: "Votre commande a été créée avec succès",
      });

      await fetchOrders();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, paymentStatus?: string) => {
    try {
      const updateData: any = { 
        status,
        processed_by: user?.id,
        processed_at: new Date().toISOString()
      };
      
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été mis à jour",
      });

      await fetchOrders();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    refreshOrders: fetchOrders
  };
};
