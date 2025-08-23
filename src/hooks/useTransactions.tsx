
import { useState, useEffect, useCallback } from 'react';
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

// Cache par utilisateur pour éviter les mélanges entre comptes
let userCaches: { [userId: string]: { transactions: Transaction[], timestamp: number } } = {};
const CACHE_DURATION = 2 * 60 * 1000; // Réduire à 2 minutes pour voir les mises à jour plus rapidement

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { user } = useAuth();

  // Réinitialiser l'état quand l'utilisateur change
  useEffect(() => {
    console.log('useTransactions: User changed, resetting state', user?.id);
    setTransactions([]);
    setLoading(false);
    setHasLoaded(false);
    
    // Nettoyer les anciens caches (garder seulement les 3 derniers utilisateurs)
    const userIds = Object.keys(userCaches);
    if (userIds.length > 3) {
      const sortedIds = userIds.sort((a, b) => userCaches[b].timestamp - userCaches[a].timestamp);
      const toKeep = sortedIds.slice(0, 3);
      const newCache: typeof userCaches = {};
      toKeep.forEach(id => {
        newCache[id] = userCaches[id];
      });
      userCaches = newCache;
    }
  }, [user?.id]);

  const fetchTransactions = useCallback(async (forceRefresh = false) => {
    if (!user) {
      console.log('useTransactions: No user, clearing transactions');
      setTransactions([]);
      setLoading(false);
      setHasLoaded(true);
      return;
    }

    const userId = user.id;
    console.log('useTransactions: Fetching for user', userId, 'Force refresh:', forceRefresh);

    // Vérifier le cache spécifique à l'utilisateur
    const now = Date.now();
    const userCache = userCaches[userId];
    const isCacheValid = userCache && (now - userCache.timestamp) < CACHE_DURATION;
    
    // Si on a un cache valide pour cet utilisateur et pas de force refresh
    if (isCacheValid && userCache.transactions.length > 0 && !forceRefresh) {
      console.log('useTransactions: Using cache for user', userId);
      setTransactions(userCache.transactions);
      setHasLoaded(true);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('useTransactions: Fetching from database for user', userId);

      // Limiter à 50 transactions récentes pour éviter les problèmes de performance
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (ordersError) {
        console.error('Erreur lors de la récupération des commandes:', ordersError);
      }

      const { data: transfers, error: transfersError } = await supabase
        .from('international_transfers')
        .select('*')
        .eq('user_id', userId)
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
      const sortedTransactions = allTransactions.slice(0, 50);
      
      // Mettre à jour le cache spécifique à l'utilisateur
      userCaches[userId] = {
        transactions: sortedTransactions,
        timestamp: now
      };
      
      console.log('useTransactions: Loaded', sortedTransactions.length, 'transactions for user', userId);
      setTransactions(sortedTransactions);
      setHasLoaded(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Charger automatiquement au premier appel ou changement d'utilisateur
  useEffect(() => {
    if (user && !hasLoaded) {
      console.log('useTransactions: Auto-loading transactions for new user');
      fetchTransactions();
    }
  }, [user, hasLoaded, fetchTransactions]);

  // Fonction pour forcer le rafraîchissement (pour compatibilité)
  const refetch = useCallback(() => {
    console.log('useTransactions: Force refresh requested');
    // Vider le cache pour cet utilisateur
    if (user?.id) {
      delete userCaches[user.id];
    }
    return fetchTransactions(true);
  }, [fetchTransactions, user?.id]);

  // Fonction pour charger les transactions (pour compatibilité)
  const loadTransactions = useCallback(() => {
    console.log('useTransactions: Manual load requested');
    return fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    refetch,
    loadTransactions,
    hasLoaded
  };
};
