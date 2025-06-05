
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useOrderNotifications } from './useOrderNotifications';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type OrderStatus = Database['public']['Enums']['order_status'];

export type { Order, OrderStatus };

export const useEnhancedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendOrderEmail } = useOrderNotifications();

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

  const createOrderWithNotification = async (orderData: Omit<OrderInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer une commande",
        variant: "destructive",
      });
      return null;
    }

    try {
      const insertData: OrderInsert = {
        ...orderData,
        user_id: user.id,
        status: 'pending',
        payment_status: 'pending'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la commande:', error);
        throw error;
      }

      console.log('Commande créée:', data);

      // Envoyer l'email de confirmation automatiquement
      await sendOrderEmail(data.id, data, 'confirmation');

      toast({
        title: "Commande créée avec succès",
        description: `Commande #${data.id.slice(0, 8)} créée. Email de confirmation envoyé.`,
        className: "bg-green-600 text-white border-green-600",
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

  const updateOrderStatusWithNotification = async (orderId: string, status: OrderStatus, paymentStatus?: string) => {
    try {
      const updateData: Partial<OrderInsert> = { 
        status,
        processed_by: user?.id,
        processed_at: new Date().toISOString()
      };
      
      if (paymentStatus) {
        updateData.payment_status = paymentStatus;
      }

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      console.log('Statut de commande mis à jour:', data);

      // Envoyer l'email de notification selon le nouveau statut
      let emailType: 'processing' | 'completed' | 'cancelled';
      let toastMessage = '';

      switch (status) {
        case 'processing':
          emailType = 'processing';
          toastMessage = 'Commande mise en traitement';
          break;
        case 'completed':
          emailType = 'completed';
          toastMessage = 'Commande terminée avec succès';
          break;
        case 'cancelled':
          emailType = 'cancelled';
          toastMessage = 'Commande annulée';
          break;
        default:
          // Pour les autres statuts, pas d'email automatique
          toast({
            title: "Statut mis à jour",
            description: "Le statut de la commande a été mis à jour",
          });
          await fetchOrders();
          return;
      }

      // Récupérer les infos utilisateur pour l'email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user_id)
        .single();

      if (!userError && userData) {
        // Récupérer l'email de l'utilisateur depuis auth.users
        const { data: authUser } = await supabase.auth.admin.getUserById(data.user_id);
        
        if (authUser.user?.email) {
          await sendOrderEmail(orderId, data, emailType);
        }
      }

      toast({
        title: "Statut mis à jour",
        description: toastMessage,
        className: status === 'completed' ? "bg-green-600 text-white border-green-600" : undefined,
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

  // Setup realtime subscription for order updates
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Order change detected:', payload);
          fetchOrders(); // Refresh orders when changes occur
          
          // Show notification for real-time updates
          if (payload.eventType === 'UPDATE') {
            toast({
              title: "Mise à jour en temps réel",
              description: "Une commande a été mise à jour",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    createOrder: createOrderWithNotification,
    updateOrderStatus: updateOrderStatusWithNotification,
    refreshOrders: fetchOrders,
    sendOrderEmail
  };
};
