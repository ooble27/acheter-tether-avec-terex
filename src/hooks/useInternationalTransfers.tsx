
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

    console.log('Création du transfert avec les données:', transferData);

    try {
      // Validation des données requises
      if (!transferData.amount || !transferData.recipient_name || !transferData.recipient_country) {
        throw new Error('Données manquantes pour créer le transfert');
      }

      const transferPayload = {
        user_id: user.id,
        amount: transferData.amount,
        from_currency: transferData.from_currency || 'CAD',
        to_currency: transferData.to_currency || 'CFA',
        exchange_rate: transferData.exchange_rate,
        fees: transferData.fees,
        total_amount: transferData.total_amount,
        recipient_name: transferData.recipient_name,
        recipient_account: transferData.recipient_account || null,
        recipient_bank: transferData.recipient_bank || null,
        recipient_country: transferData.recipient_country,
        recipient_phone: transferData.recipient_phone || null,
        recipient_email: transferData.recipient_email || null,
        payment_method: transferData.payment_method,
        receive_method: transferData.receive_method,
        provider: transferData.provider || null,
        status: 'pending'
      };

      console.log('Payload à insérer:', transferPayload);

      const { data, error } = await supabase
        .from('international_transfers')
        .insert(transferPayload)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du transfert:', error);
        throw error;
      }

      console.log('Transfert créé avec succès:', data);

      toast({
        title: "Transfert créé",
        description: "Votre transfert international a été créé avec succès",
      });

      // Envoyer l'email de confirmation automatiquement
      try {
        await sendTransferNotification(
          'transfer_confirmation',
          data,
          data.id
        );
        console.log('Email de confirmation envoyé');
      } catch (emailError) {
        console.error('Erreur lors de l\'envoi de l\'email:', emailError);
        // Ne pas faire échouer la création du transfert si l'email échoue
      }

      await fetchTransfers();
      return data;
    } catch (error: any) {
      console.error('Erreur complète:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de créer le transfert",
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
