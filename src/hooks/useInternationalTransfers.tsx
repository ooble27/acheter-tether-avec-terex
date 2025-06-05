
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useEmailNotifications } from '@/hooks/useEmailNotifications';

export const useInternationalTransfers = () => {
  const [transfers, setTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendTransferNotification } = useEmailNotifications();

  const fetchTransfers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('international_transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des transferts:', error);
        throw error;
      }

      setTransfers(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les transferts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransfer = async (transferData: any) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un transfert",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('international_transfers')
        .insert({
          ...transferData,
          user_id: user.id,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du transfert:', error);
        throw error;
      }

      toast({
        title: "Transfert créé",
        description: "Votre transfert international a été créé avec succès",
      });

      // Envoyer l'email de confirmation automatiquement
      await sendTransferNotification(
        'transfer_confirmation',
        data,
        data.id
      );

      await fetchTransfers();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le transfert",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateTransferStatus = async (transferId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('international_transfers')
        .update({
          status,
          processed_by: user?.id,
          processed_at: new Date().toISOString()
        })
        .eq('id', transferId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      // Récupérer les données du transfert pour l'email
      const { data: transferDetails } = await supabase
        .from('international_transfers')
        .select('*')
        .eq('id', transferId)
        .single();

      if (transferDetails) {
        // Récupérer directement l'email du client via une requête auth
        const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
        
        if (!usersError && users) {
          const clientUser = users.find(u => u.id === transferDetails.user_id);
          const clientEmail = clientUser?.email;

          if (clientEmail) {
            console.log('Envoi email de statut transfert à:', clientEmail);
            
            // Envoyer un email de mise à jour de statut au CLIENT
            await supabase.functions.invoke('send-email-notification', {
              body: {
                userId: transferDetails.user_id,
                orderId: transferId,
                emailAddress: clientEmail,
                emailType: 'status_update',
                transactionType: 'transfer',
                orderData: { ...transferDetails, status }
              },
            });

            // Si le statut passe à "processing", envoyer email de paiement confirmé
            if (status === 'processing') {
              await supabase.functions.invoke('send-email-notification', {
                body: {
                  userId: transferDetails.user_id,
                  orderId: transferId,
                  emailAddress: clientEmail,
                  emailType: 'payment_confirmed',
                  transactionType: 'transfer',
                  orderData: { ...transferDetails, status }
                },
              });
            }
          }
        }
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut du transfert a été mis à jour",
      });

      await fetchTransfers();
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
    fetchTransfers();
  }, [user]);

  return {
    transfers,
    loading,
    createTransfer,
    updateTransferStatus,
    refreshTransfers: fetchTransfers
  };
};
