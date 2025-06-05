
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
        console.log('Envoi des notifications email pour le transfert:', transferId, 'nouveau statut:', status);
        console.log('ID du client du transfert:', transferDetails.user_id);
        
        // CORRECTION IMPORTANTE: Utiliser l'ID du client qui a créé le transfert, pas l'admin
        try {
          // Email de mise à jour de statut
          await supabase.functions.invoke('send-email-notification', {
            body: {
              userId: transferDetails.user_id, // ID du CLIENT, pas de l'admin
              orderId: null, // Pas d'orderId pour les transferts
              emailAddress: null, // Sera récupéré côté serveur
              emailType: 'status_update',
              transactionType: 'transfer',
              orderData: { ...transferDetails, status }
            },
          });

          // Si le statut passe à "processing", envoyer email de paiement confirmé
          if (status === 'processing') {
            await supabase.functions.invoke('send-email-notification', {
              body: {
                userId: transferDetails.user_id, // ID du CLIENT, pas de l'admin
                orderId: null, // Pas d'orderId pour les transferts
                emailAddress: null, // Sera récupéré côté serveur
                emailType: 'payment_confirmed',
                transactionType: 'transfer',
                orderData: { ...transferDetails, status }
              },
            });
          }

          console.log('Emails de notification de transfert envoyés avec succès au client:', transferDetails.user_id);
        } catch (emailError) {
          console.error('Erreur lors de l\'envoi des emails de transfert:', emailError);
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
