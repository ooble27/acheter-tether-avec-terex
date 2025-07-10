
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface FavoriteRecipient {
  id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string | null;
  recipient_email: string | null;
  recipient_account: string | null;
  recipient_bank: string | null;
  recipient_country: string;
  receive_method: string;
  provider: string | null;
  last_amount: number | null;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export const useFavoriteRecipients = () => {
  const [recipients, setRecipients] = useState<FavoriteRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchRecipients = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('favorite_recipients')
        .select('*')
        .eq('user_id', user.id)
        .order('usage_count', { ascending: false })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des destinataires:', error);
        throw error;
      }

      setRecipients(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les destinataires favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveRecipient = async (recipientData: {
    recipient_name: string;
    recipient_phone?: string;
    recipient_email?: string;
    recipient_account?: string;
    recipient_bank?: string;
    recipient_country: string;
    receive_method: string;
    provider?: string;
    amount?: number;
  }) => {
    if (!user) return null;

    try {
      // Vérifier si le destinataire existe déjà
      const existingRecipient = recipients.find(r => 
        r.recipient_name === recipientData.recipient_name &&
        r.recipient_country === recipientData.recipient_country &&
        r.receive_method === recipientData.receive_method &&
        (recipientData.recipient_phone ? r.recipient_phone === recipientData.recipient_phone : true) &&
        (recipientData.provider ? r.provider === recipientData.provider : true)
      );

      if (existingRecipient) {
        // Mettre à jour l'existant
        const { error } = await supabase
          .from('favorite_recipients')
          .update({
            last_amount: recipientData.amount,
            usage_count: existingRecipient.usage_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecipient.id);

        if (error) throw error;
        
        await fetchRecipients();
        return existingRecipient;
      } else {
        // Créer un nouveau destinataire
        const { data, error } = await supabase
          .from('favorite_recipients')
          .insert({
            user_id: user.id,
            recipient_name: recipientData.recipient_name,
            recipient_phone: recipientData.recipient_phone || null,
            recipient_email: recipientData.recipient_email || null,
            recipient_account: recipientData.recipient_account || null,
            recipient_bank: recipientData.recipient_bank || null,
            recipient_country: recipientData.recipient_country,
            receive_method: recipientData.receive_method,
            provider: recipientData.provider || null,
            last_amount: recipientData.amount || null,
            usage_count: 1
          })
          .select()
          .single();

        if (error) throw error;
        
        await fetchRecipients();
        return data;
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du destinataire:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le destinataire",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteRecipient = async (recipientId: string) => {
    try {
      const { error } = await supabase
        .from('favorite_recipients')
        .delete()
        .eq('id', recipientId);

      if (error) throw error;

      toast({
        title: "Destinataire supprimé",
        description: "Le destinataire a été retiré de vos favoris",
      });

      await fetchRecipients();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le destinataire",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, [user]);

  return {
    recipients,
    loading,
    saveRecipient,
    deleteRecipient,
    refreshRecipients: fetchRecipients
  };
};
