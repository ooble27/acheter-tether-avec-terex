
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Bell, BellOff, Settings } from 'lucide-react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettings {
  order_updates: boolean;
  kyc_updates: boolean;
  transfer_updates: boolean;
  marketing: boolean;
}

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>({
    order_updates: true,
    kyc_updates: true,
    transfer_updates: true,
    marketing: false
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const {
    isSupported,
    isSubscribed,
    loading: pushLoading,
    subscribe,
    unsubscribe
  } = usePushNotifications();

  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  const fetchSettings = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification settings:', error);
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
            ...settings
          });

        if (insertError) {
          console.error('Error creating notification settings:', insertError);
        }
      }
    } catch (error) {
      console.error('Error in fetchSettings:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<NotificationSettings>) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: user.id,
          ...updatedSettings
        });

      if (error) throw error;

      setSettings(updatedSettings);
      
      toast({
        title: "Paramètres mis à jour",
        description: "Vos préférences de notification ont été sauvegardées",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder vos préférences",
        className: "bg-red-600 text-white border-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <BellOff className="w-5 h-5 mr-2 text-gray-400" />
            Notifications Push
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">
            Les notifications push ne sont pas supportées par votre navigateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-terex-accent" />
          Notifications Push
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Activation/Désactivation globale */}
        <div className="flex items-center justify-between p-4 bg-terex-gray/30 rounded-lg">
          <div>
            <h4 className="text-white font-medium">Notifications Push</h4>
            <p className="text-gray-400 text-sm">
              {isSubscribed ? 'Activées' : 'Désactivées'}
            </p>
          </div>
          <Button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={pushLoading}
            variant={isSubscribed ? "destructive" : "default"}
            className={isSubscribed ? "" : "bg-terex-accent hover:bg-terex-accent/80"}
          >
            {pushLoading ? 'Chargement...' : isSubscribed ? 'Désactiver' : 'Activer'}
          </Button>
        </div>

        {/* Paramètres détaillés si activé */}
        {isSubscribed && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white font-medium">Mises à jour des commandes</h5>
                <p className="text-gray-400 text-sm">Changements de statut des achats/ventes</p>
              </div>
              <Switch
                checked={settings.order_updates}
                onCheckedChange={(checked) => updateSettings({ order_updates: checked })}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white font-medium">Vérification KYC</h5>
                <p className="text-gray-400 text-sm">Statut de vérification d'identité</p>
              </div>
              <Switch
                checked={settings.kyc_updates}
                onCheckedChange={(checked) => updateSettings({ kyc_updates: checked })}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white font-medium">Transferts internationaux</h5>
                <p className="text-gray-400 text-sm">Statut des virements</p>
              </div>
              <Switch
                checked={settings.transfer_updates}
                onCheckedChange={(checked) => updateSettings({ transfer_updates: checked })}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-white font-medium">Marketing</h5>
                <p className="text-gray-400 text-sm">Promotions et nouveautés</p>
              </div>
              <Switch
                checked={settings.marketing}
                onCheckedChange={(checked) => updateSettings({ marketing: checked })}
                disabled={loading}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
