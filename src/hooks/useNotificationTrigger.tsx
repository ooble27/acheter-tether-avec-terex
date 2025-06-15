
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useNotificationTrigger = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Écouter les changements sur les commandes
    const ordersChannel = supabase
      .channel('order-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Order status changed:', payload);
          
          if (payload.new.status !== payload.old.status) {
            sendNotification({
              user_id: user.id,
              title: 'Mise à jour de commande',
              body: `Votre commande est maintenant ${getStatusText(payload.new.status)}`,
              notification_type: 'order_updates',
              data: {
                order_id: payload.new.id,
                status: payload.new.status
              }
            });
          }
        }
      )
      .subscribe();

    // Écouter les changements KYC
    const kycChannel = supabase
      .channel('kyc-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'kyc_verifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('KYC status changed:', payload);
          
          if (payload.new.status !== payload.old.status) {
            let title = 'Vérification KYC';
            let body = '';
            
            switch (payload.new.status) {
              case 'approved':
                title = 'KYC Approuvé ✅';
                body = 'Votre vérification d\'identité a été approuvée !';
                break;
              case 'rejected':
                title = 'KYC Rejeté ❌';
                body = 'Votre vérification d\'identité a été rejetée. Veuillez soumettre de nouveaux documents.';
                break;
              case 'under_review':
                title = 'KYC en cours';
                body = 'Votre vérification d\'identité est en cours d\'examen.';
                break;
            }
            
            sendNotification({
              user_id: user.id,
              title,
              body,
              notification_type: 'kyc_updates',
              data: {
                kyc_id: payload.new.id,
                status: payload.new.status
              }
            });
          }
        }
      )
      .subscribe();

    // Écouter les changements sur les transferts internationaux
    const transfersChannel = supabase
      .channel('transfer-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'international_transfers',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Transfer status changed:', payload);
          
          if (payload.new.status !== payload.old.status) {
            sendNotification({
              user_id: user.id,
              title: 'Mise à jour de transfert',
              body: `Votre transfert est maintenant ${getStatusText(payload.new.status)}`,
              notification_type: 'transfer_updates',
              data: {
                transfer_id: payload.new.id,
                status: payload.new.status
              }
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(kycChannel);
      supabase.removeChannel(transfersChannel);
    };
  }, [user]);

  const sendNotification = async (payload: any) => {
    try {
      const { error } = await supabase.functions.invoke('send-push-notification', {
        body: payload
      });

      if (error) {
        console.error('Error sending push notification:', error);
      }
    } catch (error) {
      console.error('Error invoking notification function:', error);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      pending: 'en attente',
      processing: 'en cours',
      completed: 'terminé',
      cancelled: 'annulé',
      approved: 'approuvé',
      rejected: 'rejeté',
      under_review: 'en cours d\'examen'
    };
    
    return statusMap[status] || status;
  };
};
