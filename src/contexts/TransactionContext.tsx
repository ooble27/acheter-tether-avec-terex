
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTransactions as useTransactionsHook } from '@/hooks/useTransactions';
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

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  refetch: () => void;
  loadTransactions: () => void;
  hasLoaded: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
  const { transactions, loading, refetch, loadTransactions, hasLoaded } = useTransactionsHook();
  const { user } = useAuth();

  // Log les changements d'utilisateur pour debugging
  useEffect(() => {
    console.log('TransactionContext: User changed', user?.id, 'Transactions count:', transactions.length);
  }, [user?.id, transactions.length]);

  return (
    <TransactionContext.Provider value={{ transactions, loading, refetch, loadTransactions, hasLoaded }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};
