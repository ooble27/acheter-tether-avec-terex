
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];

export type { Order };

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendBuyConfirmation, sendSellConfirmation, sendEmailNotification, sendPaymentConfirmation } = useEmailNotifications();

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

  const createOrder = async (orderData: OrderInsert) => {
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
        .insert(orderData)
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

      // Envoyer l'email de confirmation selon le type de commande
      if (data.type === 'buy') {
        await sendBuyConfirmation(data, data.id);
      } else if (data.type === 'sell') {
        await sendSellConfirmation(data, data.id);
      }

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

  const updateOrderStatus = async (orderId: string, status: Database['public']['Enums']['order_status'], paymentStatus?: string) => {
    try {
      const updateData: Partial<OrderInsert> = { 
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

      // Récupérer les données de la commande pour l'email
      const { data: orderDetails } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (orderDetails) {
        console.log('Envoi des notifications email pour la commande:', orderId, 'nouveau statut:', status);
        
        // Envoyer directement les emails via la edge function en utilisant l'ID utilisateur
        // La edge function se chargera de récupérer l'email côté serveur
        try {
          // Email de mise à jour de statut
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: orderDetails.user_id,
              orderId: orderId,
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'status_update',
              transactionType: orderDetails.type,
              orderData: { ...orderDetails, status }
            },
          });

          // Si le statut passe à "processing" avec payment_status "confirmed", envoyer email de paiement confirmé
          if (status === 'processing' && paymentStatus === 'confirmed') {
            await supabase.functions.invoke('send-email-notification', {
              body: {
                userId: orderDetails.user_id,
                orderId: orderId,
                emailAddress: null, // Sera récupéré côté serveur
                emailType: 'payment_confirmed',
                transactionType: orderDetails.type,
                orderData: { ...orderDetails, status }
              },
            });
          }

          console.log('Emails de notification envoyés avec succès');
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi des emails:', emailError);
        }
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
