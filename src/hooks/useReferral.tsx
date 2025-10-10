import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ReferralCode {
  id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

interface Referral {
  id: string;
  referred_id: string;
  referral_code: string;
  status: 'pending' | 'completed' | 'rewarded';
  reward_amount: number;
  created_at: string;
  completed_at?: string;
  profiles?: {
    full_name: string;
  };
}

interface ReferralReward {
  id: string;
  amount: number;
  reward_type: 'referral_bonus' | 'referee_bonus' | 'milestone_bonus';
  description: string;
  created_at: string;
}

export function useReferral() {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferralData();
    }
  }, [user]);

  const fetchReferralData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Récupérer le code de parrainage
      const { data: codeData, error: codeError } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (codeError && codeError.code !== 'PGRST116') throw codeError;
      setReferralCode(codeData);

      // Récupérer les filleuls
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      if (referralsError) throw referralsError;
      
      // Enrichir avec les profils
      const enrichedReferrals = await Promise.all(
        (referralsData || []).map(async (ref) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', ref.referred_id)
            .single();
          
          return {
            ...ref,
            profiles: profile
          } as Referral;
        })
      );
      
      setReferrals(enrichedReferrals);

      // Récupérer les récompenses
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (rewardsError) throw rewardsError;
      setRewards((rewardsData || []) as ReferralReward[]);

      // Calculer le total des gains
      const total = rewardsData?.reduce((sum, reward) => sum + Number(reward.amount), 0) || 0;
      setTotalEarnings(total);
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Erreur lors du chargement des données de parrainage');
    } finally {
      setLoading(false);
    }
  };

  const shareReferralCode = (code: string) => {
    const url = `${window.location.origin}?ref=${code}`;
    const text = `Rejoignez Terex avec mon code de parrainage ${code} et bénéficiez d'avantages exclusifs! ${url}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Rejoignez Terex',
        text: text,
        url: url,
      }).catch(() => {
        copyToClipboard(url);
      });
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Lien copié dans le presse-papiers!');
  };

  return {
    referralCode,
    referrals,
    rewards,
    totalEarnings,
    loading,
    shareReferralCode,
    copyToClipboard,
    refreshData: fetchReferralData,
  };
}
