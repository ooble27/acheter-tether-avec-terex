import { useEffect } from 'react';
import { useTransactionRepeat } from '@/contexts/TransactionRepeatContext';

interface UseRepeatTransactionOptions {
  onRepeat: (transaction: any) => void;
  transactionType?: 'buy' | 'sell' | 'transfer';
}

export const useRepeatTransaction = ({ onRepeat, transactionType }: UseRepeatTransactionOptions) => {
  const { transactionToRepeat, isRepeating, clearTransactionToRepeat } = useTransactionRepeat();

  useEffect(() => {
    if (isRepeating && transactionToRepeat) {
      // Only apply if transaction type matches
      if (!transactionType || transactionToRepeat.type === transactionType) {
        onRepeat(transactionToRepeat);
      }
    }
  }, [isRepeating, transactionToRepeat, transactionType]);

  return {
    isRepeating: isRepeating && (!transactionType || transactionToRepeat?.type === transactionType),
    clearRepeat: clearTransactionToRepeat,
    repeatedTransaction: transactionToRepeat
  };
};
