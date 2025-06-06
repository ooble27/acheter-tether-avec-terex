
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';
import type { Database } from '@/integrations/supabase/types';

type Order = Database['public']['Tables']['orders']['Row'];
type OrderInsert = Database['public']['Tables']['orders']['Insert'];
type InternationalTransfer = Database['public']['Tables']['international_transfers']['Row'];

// Créer un type unifié pour les "commandes" (orders + transferts)
export interface UnifiedOrder extends Omit<Order, 'type'> {
  type: 'buy' | 'sell' | 'transfer';
  // Champs spécifiques aux transferts
  recipient_name?: string;
  recipient_country?: string;
  from_currency?: string;
  to_currency?: string;
  fees?: number;
  total_amount?: number;
}

export type { Order };

export const useOrders = () => {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendBuyConfirmation, sendSellConfirmation, sendEmailNotification, sendPaymentConfirmation } = useEmailNotifications();

  const fetchOrders = async () => {
    if (!user) return;

    try {
      // Récupérer les commandes normales
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes:', ordersError);
        throw ordersError;
      }

      // Récupérer les transferts internationaux
      const { data: transfersData, error: transfersError } = await supabase
        .from('international_transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (transfersError) {
        console.error('Erreur lors de la récupération des transferts:', transfersError);
        throw transfersError;
      }

      // Convertir les transferts en format "order" unifié
      const convertedTransfers: UnifiedOrder[] = (transfersData || []).map((transfer: InternationalTransfer) => ({
        id: transfer.id,
        user_id: transfer.user_id,
        amount: transfer.amount,
        usdt_amount: transfer.amount, // Pour les transferts, c'est le même montant
        currency: transfer.from_currency || 'USDT',
        type: 'transfer' as const,
        status: transfer.status as any,
        payment_method: 'bank_transfer' as any,
        payment_status: transfer.status === 'completed' ? 'paid' : 'pending',
        exchange_rate: transfer.exchange_rate,
        network: 'TRC20',
        wallet_address: null,
        payment_reference: transfer.reference_number,
        notes: `Transfert vers ${transfer.recipient_country} - ${transfer.recipient_name}`,
        created_at: transfer.created_at,
        updated_at: transfer.updated_at,
        processed_at: transfer.processed_at,
        processed_by: transfer.processed_by,
        // Champs spécifiques aux transferts
        recipient_name: transfer.recipient_name,
        recipient_country: transfer.recipient_country,
        from_currency: transfer.from_currency,
        to_currency: transfer.to_currency,
        fees: transfer.fees,
        total_amount: transfer.total_amount,
      }));

      // Combiner et trier par date de création
      const allOrders = [...(ordersData || []), ...convertedTransfers]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setOrders(allOrders);
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
      // Détecter si c'est un transfert ou une commande normale
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (!orderToUpdate) {
        throw new Error('Commande non trouvée');
      }

      if (orderToUpdate.type === 'transfer') {
        // Mettre à jour un transfert international
        const { error } = await supabase
          .from('international_transfers')
          .update({
            status: status,
            processed_by: user?.id,
            processed_at: new Date().toISOString()
          })
          .eq('id', orderId);

        if (error) {
          console.error('Erreur lors de la mise à jour du transfert:', error);
          throw error;
        }
      } else {
        // Mettre à jour une commande normale
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
      }

      // Envoyer les notifications email
      try {
        console.log('Envoi des notifications email pour:', orderId, 'nouveau statut:', status);
        console.log('ID du client:', orderToUpdate.user_id);
        
        // Email de mise à jour de statut
        await supabase.functions.invoke('send-email-notification', {
          body: {
            userId: orderToUpdate.user_id, // ID du CLIENT
            orderId: orderId,
            emailAddress: null, // Sera récupéré côté serveur
            emailType: 'status_update',
            transactionType: orderToUpdate.type,
            orderData: { ...orderToUpdate, status }
          },
        });

        // Si le statut passe à "processing" avec payment_status "confirmed", envoyer email de paiement confirmé
        if (status === 'processing' && paymentStatus === 'confirmed') {
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: orderToUpdate.user_id, // ID du CLIENT
              orderId: orderId,
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'payment_confirmed',
              transactionType: orderToUpdate.type,
              orderData: { ...orderToUpdate, status }
            },
          });
        }

        console.log('Emails de notification envoyés avec succès au client:', orderToUpdate.user_id);
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi des emails:', emailError);
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
