
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'transfer';
  amount: string;
  currency: string;
  usdtAmount?: string;
  fiatAmount?: string;
  receiveCurrency?: string;
  network: string;
  address?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  date: string;
  recipient_name?: string;
  recipient_phone?: string;
  payment_method?: string;
}

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { user } = useAuth();

  const fetchTransactions = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Limiter à 50 transactions récentes pour éviter les problèmes de performance
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes:', ordersError);
      }

      const { data: transfers, error: transfersError } = await supabase
        .from('international_transfers')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (transfersError) {
        console.error('Erreur lors de la récupération des transferts:', transfersError);
      }

      const allTransactions: Transaction[] = [];

      // Transformer les commandes en transactions
      if (orders) {
        orders.forEach(order => {
          allTransactions.push({
            id: order.id,
            type: order.type as 'buy' | 'sell',
            amount: order.amount.toString(),
            currency: order.currency,
            usdtAmount: order.usdt_amount?.toString(),
            network: order.network || 'TRC20',
            address: order.wallet_address,
            status: order.status as any,
            date: order.created_at,
            payment_method: order.payment_method
          });
        });
      }

      // Transformer les transferts en transactions
      if (transfers) {
        transfers.forEach(transfer => {
          allTransactions.push({
            id: transfer.id,
            type: 'transfer',
            amount: transfer.amount.toString(),
            currency: transfer.from_currency,
            fiatAmount: transfer.total_amount?.toString(),
            receiveCurrency: transfer.to_currency,
            network: 'Transfert International',
            status: transfer.status as any,
            date: transfer.created_at,
            recipient_name: transfer.recipient_name,
            recipient_phone: transfer.recipient_phone,
            payment_method: transfer.payment_method
          });
        });
      }

      // Trier par date et limiter à 50 pour la performance
      allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(allTransactions.slice(0, 50));
      setHasLoaded(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ne charger que quand c'est demandé explicitement
  const loadTransactions = () => {
    if (!hasLoaded) {
      fetchTransactions();
    }
  };

  return {
    transactions,
    loading,
    refetch: fetchTransactions,
    loadTransactions,
    hasLoaded
  };
};
