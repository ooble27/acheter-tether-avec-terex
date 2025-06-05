
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
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
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
        toast({
          title: "Erreur",
          description: "Impossible de charger les commandes",
          variant: "destructive",
        });
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Erreur inattendue:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: {
    type: string;
    amount: number;
    currency: string;
    usdt_amount: number;
    exchange_rate: number;
    payment_method: 'card' | 'mobile';
    network: string;
    wallet_address?: string;
  }) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour passer une commande",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          ...orderData,
          user_id: user.id,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la commande:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la commande",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Commande créée",
        description: "Votre commande a été enregistrée et sera traitée rapidement",
      });

      // Rafraîchir la liste des commandes
      fetchOrders();
      
      return data;
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return null;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], notes?: string) => {
    try {
      const updateData: any = { 
        status,
        processed_by: user?.id,
        processed_at: new Date().toISOString()
      };
      
      if (notes) {
        updateData.notes = notes;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la commande",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Commande mise à jour",
        description: `Statut changé vers: ${status}`,
      });

      // Rafraîchir la liste
      fetchOrders();
      return true;
    } catch (error) {
      console.error('Erreur inattendue:', error);
      return false;
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
    refetch: fetchOrders
  };
};
