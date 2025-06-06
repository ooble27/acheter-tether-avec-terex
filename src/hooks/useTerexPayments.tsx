
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type TerexPayment = Database['public']['Tables']['terex_payments']['Row'];
type TerexPaymentInsert = Database['public']['Tables']['terex_payments']['Insert'];

export const useTerexPayments = () => {
  const [payments, setPayments] = useState<TerexPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchPayments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('terex_payments')
        .select(`
          *,
          merchant_accounts!inner(business_name, user_id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        throw error;
      }

      setPayments(data || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData: {
    merchantId: string;
    amount: number;
    currency?: string;
    description?: string;
    customerEmail?: string;
    customerPhone?: string;
    expiresInMinutes?: number;
  }) => {
    try {
      // Récupérer le taux de change actuel (ici simplifié)
      const exchangeRate = 650; // CFA pour 1 USDT
      const usdtAmount = paymentData.amount / exchangeRate;
      const commission = paymentData.amount * 0.005; // 0.5%
      const netAmount = paymentData.amount - commission;

      // Générer la référence de paiement
      const { data: refData, error: refError } = await supabase
        .rpc('generate_payment_reference');

      if (refError) throw refError;

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + (paymentData.expiresInMinutes || 30));

      const insertData: TerexPaymentInsert = {
        merchant_id: paymentData.merchantId,
        customer_id: user?.id || null,
        amount: paymentData.amount,
        currency: paymentData.currency || 'CFA',
        usdt_amount: usdtAmount,
        exchange_rate: exchangeRate,
        commission: commission,
        net_amount: netAmount,
        reference_number: refData,
        customer_email: paymentData.customerEmail,
        customer_phone: paymentData.customerPhone,
        description: paymentData.description,
        expires_at: expiresAt.toISOString()
      };

      const { data, error } = await supabase
        .from('terex_payments')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du paiement:', error);
        throw error;
      }

      toast({
        title: "Paiement créé",
        description: `Référence: ${data.reference_number}`,
      });

      await fetchPayments();
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le paiement",
        variant: "destructive",
      });
      return null;
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: string) => {
    try {
      const updateData: any = { status };
      
      if (status === 'completed') {
        updateData.paid_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('terex_payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      }

      toast({
        title: "Statut mis à jour",
        description: "Le statut du paiement a été mis à jour",
      });

      await fetchPayments();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [user]);

  return {
    payments,
    loading,
    createPayment,
    updatePaymentStatus,
    refreshPayments: fetchPayments
  };
};
