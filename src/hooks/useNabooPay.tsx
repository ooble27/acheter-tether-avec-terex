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
        // Tenter de lire le corps de la réponse de la fonction edge pour
        // récupérer le vrai message d'erreur (ex: clé NabooPay manquante,
        // rejet de l'API NabooPay…) au lieu d'un message générique.
        let detail = error.message;
        try {
          const ctx = (error as any)?.context;
          if (ctx && typeof ctx.json === 'function') {
            const body = await ctx.json();
            if (body?.error) detail = body.error;
          }
        } catch (_) { /* ignore */ }

        console.error('Error creating NabooPay transaction:', detail);
        toast.error(`Paiement impossible : ${detail}`);
        return { success: false, error: detail };
      }

      if (data?.success) {
        setCheckoutUrl(data.checkoutUrl);
        return {
          success: true,
          checkoutUrl: data.checkoutUrl,
          naboopayOrderId: data.naboopayOrderId
        };
      } else {
        const detail = data?.error || 'Erreur inconnue';
        toast.error(`Paiement impossible : ${detail}`);
        return { success: false, error: detail };
      }
    } catch (error: any) {
      console.error('Error in createTransaction:', error);
      toast.error(`Paiement impossible : ${error?.message || 'Erreur réseau'}`);
      return { success: false, error: error?.message };
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
