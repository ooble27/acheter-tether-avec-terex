
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type MerchantAccount = Database['public']['Tables']['merchant_accounts']['Row'];
type MerchantAccountInsert = Database['public']['Tables']['merchant_accounts']['Insert'];

export const useMerchantAccount = () => {
  const [merchantAccount, setMerchantAccount] = useState<MerchantAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchMerchantAccount = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('merchant_accounts')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la récupération du compte marchand:', error);
        throw error;
      }

      setMerchantAccount(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const createMerchantAccount = async (accountData: Omit<MerchantAccountInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour créer un compte marchand",
        variant: "destructive",
      });
      return null;
    }

    try {
      const { data, error } = await supabase
        .from('merchant_accounts')
        .insert({
          ...accountData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création du compte marchand:', error);
        toast({
          title: "Erreur",
          description: `Impossible de créer le compte marchand: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Compte marchand créé",
        description: "Votre compte marchand Terex Pay a été créé avec succès",
      });

      setMerchantAccount(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  const updateMerchantAccount = async (updates: Partial<MerchantAccountInsert>) => {
    if (!merchantAccount) return null;

    try {
      const { data, error } = await supabase
        .from('merchant_accounts')
        .update(updates)
        .eq('id', merchantAccount.id)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour:', error);
        toast({
          title: "Erreur",
          description: `Impossible de mettre à jour le compte: ${error.message}`,
          variant: "destructive",
        });
        throw error;
      }

      toast({
        title: "Compte mis à jour",
        description: "Votre compte marchand a été mis à jour avec succès",
      });

      setMerchantAccount(data);
      return data;
    } catch (error) {
      console.error('Erreur:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchMerchantAccount();
  }, [user]);

  return {
    merchantAccount,
    loading,
    createMerchantAccount,
    updateMerchantAccount,
    refreshMerchantAccount: fetchMerchantAccount
  };
};
