
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import { useFraudDetection } from '@/hooks/useFraudDetection';

export interface Order {
  id: string;
  user_id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: number;
  usdt_amount: number;
  exchange_rate: number;
  currency: string;
  network: string;
  wallet_address?: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  payment_method: 'card' | 'mobile';
  payment_reference?: string;
  payment_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  processed_by?: string;
  is_deleted?: boolean;
  recipient_name?: string;
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { sendEmailNotification } = useEmailNotifications();
  const { analyzeTransaction } = useFraudDetection();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des commandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status'], notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus, 
          notes,
          updated_at: new Date().toISOString(),
          processed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour la liste locale
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, notes: notes || order.notes }
          : order
      ));

      // Analyser la transaction pour la détection de fraude
      if (data && newStatus === 'processing') {
        console.log('Analyse anti-fraude pour la commande:', orderId);
        try {
          await analyzeTransaction(data);
        } catch (fraudError) {
          console.error('Erreur lors de l\'analyse anti-fraude:', fraudError);
          // Ne pas bloquer la mise à jour de commande pour une erreur d'analyse
        }
      }

      // Envoyer une notification email
      try {
        await sendEmailNotification(
          'order_status_update',
          'order',
          { ...data, status: newStatus, notes }
        );
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
      }

      toast({
        title: "Succès",
        description: "Statut de la commande mis à jour",
        className: "bg-green-600 text-white border-green-600",
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
    }
  };

  const moveToTrash = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ is_deleted: true })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, is_deleted: true } : order
      ));

      toast({
        title: "Commande supprimée",
        description: "La commande a été déplacée vers la corbeille",
        className: "bg-orange-600 text-white border-orange-600",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande",
        variant: "destructive",
      });
    }
  };

  const restoreFromTrash = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ is_deleted: false })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, is_deleted: false } : order
      ));

      toast({
        title: "Commande restaurée",
        description: "La commande a été restaurée avec succès",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      toast({
        title: "Erreur",
        description: "Impossible de restaurer la commande",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    updateOrderStatus,
    moveToTrash,
    restoreFromTrash,
    refreshOrders: fetchOrders
  };
};
