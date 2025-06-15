
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  order_updates: boolean;
  kyc_updates: boolean;
  transfer_updates: boolean;
  marketing: boolean;
}

export const useNotificationSettings = () => {
  const [settings, setSettings] = useState<NotificationSettings>({
    order_updates: true,
    kyc_updates: true,
    transfer_updates: true,
    marketing: false
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSettings = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('order_updates, kyc_updates, transfer_updates, marketing')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur récupération paramètres:', error);
        return;
      }

      if (data) {
        setSettings(data);
      } else {
        // Créer des paramètres par défaut
        const { error: insertError } = await supabase
          .from('notification_settings')
          .insert({
            user_id: user.id,
            order_updates: true,
            kyc_updates: true,
            transfer_updates: true,
            marketing: false
          });

        if (insertError) {
          console.error('Erreur création paramètres:', insertError);
        }
      }
    } catch (error) {
      console.error('Erreur dans fetchSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Erreur mise à jour paramètres:', error);
        toast({
          title: "Erreur",
          description: "Impossible de sauvegarder les paramètres",
          variant: "destructive",
        });
        return;
      }

      setSettings(updatedSettings);
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos préférences de notification ont été mises à jour",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Erreur updateSettings:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [user]);

  return {
    settings,
    loading,
    updateSettings
  };
};
