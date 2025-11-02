import React, { createContext, useContext, useState, ReactNode } from 'react';

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

interface TransactionRepeatContextType {
  transactionToRepeat: Transaction | null;
  isRepeating: boolean;
  setTransactionToRepeat: (transaction: Transaction | null) => void;
  clearTransactionToRepeat: () => void;
}

const TransactionRepeatContext = createContext<TransactionRepeatContextType | undefined>(undefined);

export const TransactionRepeatProvider = ({ children }: { children: ReactNode }) => {
  const [transactionToRepeat, setTransactionToRepeatState] = useState<Transaction | null>(null);

  const setTransactionToRepeat = (transaction: Transaction | null) => {
    setTransactionToRepeatState(transaction);
  };

  const clearTransactionToRepeat = () => {
    setTransactionToRepeatState(null);
  };

  const isRepeating = transactionToRepeat !== null;

  return (
    <TransactionRepeatContext.Provider
      value={{
        transactionToRepeat,
        isRepeating,
        setTransactionToRepeat,
        clearTransactionToRepeat,
      }}
    >
      {children}
    </TransactionRepeatContext.Provider>
  );
};

export const useTransactionRepeat = () => {
  const context = useContext(TransactionRepeatContext);
  if (context === undefined) {
    throw new Error('useTransactionRepeat must be used within a TransactionRepeatProvider');
  }
  return context;
};
