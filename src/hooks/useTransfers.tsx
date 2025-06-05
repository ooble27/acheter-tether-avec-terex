
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEmailNotifications } from './useEmailNotifications';
import { toast } from 'sonner';

export interface Transfer {
  id: string;
  user_id: string;
  amount: number;
  from_currency: string;
  to_currency: string;
  recipient_name: string;
  recipient_account: string;
  recipient_bank?: string;
  recipient_country: string;
  exchange_rate: number;
  fees: number;
  total_amount: number;
  status: string;
  reference_number?: string;
  created_at: string;
  updated_at: string;
  processed_at?: string;
  processed_by?: string;
}

export const useTransfers = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { sendTransferNotification } = useEmailNotifications();

  const fetchTransfers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('international_transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransfers(data || []);
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast.error('Erreur lors du chargement des virements');
    } finally {
      setLoading(false);
    }
  };

  const createTransfer = async (transferData: Omit<Transfer, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!user) throw new Error('User not authenticated');

    try {
      const { data, error } = await supabase
        .from('international_transfers')
        .insert({
          ...transferData,
          user_id: user.id,
          status: 'pending',
          reference_number: `TR${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      try {
        await sendTransferNotification(data, 'transfer_initiated');
      } catch (emailError) {
        console.error('Failed to send email notification:', emailError);
        // Don't throw error, just log it
      }

      await fetchTransfers();
      toast.success('Virement initié avec succès');
      return data;
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast.error('Erreur lors de la création du virement');
      throw error;
    }
  };

  const updateTransferStatus = async (transferId: string, status: string) => {
    try {
      const { data, error } = await supabase
        .from('international_transfers')
        .update({
          status,
          processed_at: status === 'completed' ? new Date().toISOString() : null,
          processed_by: user?.id
        })
        .eq('id', transferId)
        .select()
        .single();

      if (error) throw error;

      // Send email notification for completed transfers
      if (status === 'completed') {
        try {
          await sendTransferNotification(data, 'transfer_completed');
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
        }
      }

      await fetchTransfers();
      toast.success('Statut du virement mis à jour');
      return data;
    } catch (error) {
      console.error('Error updating transfer status:', error);
      toast.error('Erreur lors de la mise à jour du statut');
      throw error;
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
    refetch: fetchTransfers
  };
};
