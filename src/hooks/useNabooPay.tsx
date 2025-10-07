import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Product {
  name: string;
  category: string;
  amount: number;
  quantity: number;
  description: string;
}

interface CreateTransactionParams {
  orderId: string;
  amount: number;
  products: Product[];
  paymentMethods: string[];
  successUrl: string;
  errorUrl: string;
}

export function useNabooPay() {
  const [loading, setLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const createTransaction = async (params: CreateTransactionParams) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('naboopay-create-transaction', {
        body: params
      });

      if (error) {
        console.error('Error creating NabooPay transaction:', error);
        toast.error('Erreur lors de la création du paiement');
        throw error;
      }

      if (data.success) {
        setCheckoutUrl(data.checkoutUrl);
        return {
          success: true,
          checkoutUrl: data.checkoutUrl,
          naboopayOrderId: data.naboopayOrderId
        };
      } else {
        toast.error(data.error || 'Erreur lors de la création du paiement');
        return { success: false };
      }
    } catch (error) {
      console.error('Error in createTransaction:', error);
      toast.error('Erreur lors de la création du paiement');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (naboopayOrderId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('naboopay-check-status', {
        body: { naboopayOrderId }
      });

      if (error) {
        console.error('Error checking NabooPay status:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in checkTransactionStatus:', error);
      return { success: false };
    }
  };

  return {
    loading,
    checkoutUrl,
    createTransaction,
    checkTransactionStatus
  };
}
