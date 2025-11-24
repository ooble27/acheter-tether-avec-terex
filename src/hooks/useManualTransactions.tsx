import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface ManualTransaction {
  id: string;
  user_id: string;
  transaction_date: string;
  amount: number;
  currency: string;
  crypto_amount: number;
  crypto_currency: string;
  buy_price: number;
  sell_price: number;
  profit: number;
  profit_percentage: number;
  client_name?: string;
  client_phone?: string;
  payment_method?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const useManualTransactions = () => {
  const [transactions, setTransactions] = useState<ManualTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('manual_transactions')
        .select('*')
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
      toast.error('Erreur lors du chargement des transactions');
    } finally {
      setLoading(false);
    }
  };

  const addTransaction = async (transaction: Omit<ManualTransaction, 'id' | 'user_id' | 'profit' | 'profit_percentage' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('manual_transactions')
        .insert({
          ...transaction,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Transaction ajoutée avec succès');
      await fetchTransactions();
      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction:', error);
      toast.error('Erreur lors de l\'ajout de la transaction');
    }
  };

  const updateTransaction = async (id: string, updates: Partial<ManualTransaction>) => {
    try {
      const { error } = await supabase
        .from('manual_transactions')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transaction mise à jour');
      await fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('manual_transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast.success('Transaction supprimée');
      await fetchTransactions();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const getStats = () => {
    const totalProfit = transactions.reduce((sum, t) => sum + (t.profit || 0), 0);
    const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
    const totalCryptoVolume = transactions.reduce((sum, t) => sum + t.crypto_amount, 0);
    const averageProfitPercentage = transactions.length > 0
      ? transactions.reduce((sum, t) => sum + (t.profit_percentage || 0), 0) / transactions.length
      : 0;

    return {
      totalProfit,
      totalVolume,
      totalCryptoVolume,
      averageProfitPercentage,
      transactionCount: transactions.length
    };
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  return {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    refetch: fetchTransactions,
    stats: getStats()
  };
};
