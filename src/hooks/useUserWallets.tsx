
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables } from '@/integrations/supabase/types';

// Utiliser le type généré par Supabase au lieu de définir notre propre interface
export type UserWallet = Tables<'user_wallets'>;

export function useUserWallets() {
  const [wallets, setWallets] = useState<UserWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWallets = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les wallets sauvegardés",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveWallet = async (walletData: Omit<UserWallet, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .insert([
          {
            ...walletData,
            user_id: user.id
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setWallets(prev => [data, ...prev]);
      
      toast({
        title: "Wallet sauvegardé",
        description: `Le wallet "${walletData.wallet_name}" a été sauvegardé avec succès`,
      });

      return data;
    } catch (error) {
      console.error('Error saving wallet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le wallet",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateWallet = async (id: string, updates: Partial<UserWallet>) => {
    try {
      const { data, error } = await supabase
        .from('user_wallets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWallets(prev => prev.map(wallet => 
        wallet.id === id ? { ...wallet, ...data } : wallet
      ));

      toast({
        title: "Wallet mis à jour",
        description: "Le wallet a été mis à jour avec succès",
      });

      return data;
    } catch (error) {
      console.error('Error updating wallet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le wallet",
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteWallet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_wallets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWallets(prev => prev.filter(wallet => wallet.id !== id));
      
      toast({
        title: "Wallet supprimé",
        description: "Le wallet a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Error deleting wallet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le wallet",
        variant: "destructive"
      });
      throw error;
    }
  };

  const setDefaultWallet = async (id: string) => {
    try {
      // Désactiver tous les wallets par défaut
      await supabase
        .from('user_wallets')
        .update({ is_default: false })
        .eq('user_id', user?.id);

      // Activer le wallet sélectionné comme défaut
      const { data, error } = await supabase
        .from('user_wallets')
        .update({ is_default: true })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWallets(prev => prev.map(wallet => ({
        ...wallet,
        is_default: wallet.id === id
      })));

      toast({
        title: "Wallet par défaut défini",
        description: "Ce wallet sera utilisé par défaut pour vos achats",
      });

      return data;
    } catch (error) {
      console.error('Error setting default wallet:', error);
      toast({
        title: "Erreur",
        description: "Impossible de définir le wallet par défaut",
        variant: "destructive"
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWallets();
    }
  }, [user]);

  return {
    wallets,
    loading,
    fetchWallets,
    saveWallet,
    updateWallet,
    deleteWallet,
    setDefaultWallet,
    binanceWallets: wallets.filter(w => w.wallet_type === 'binance'),
    personalWallets: wallets.filter(w => w.wallet_type === 'personal'),
    defaultWallet: wallets.find(w => w.is_default)
  };
}
