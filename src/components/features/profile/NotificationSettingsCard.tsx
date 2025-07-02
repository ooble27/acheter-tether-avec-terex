
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';

export function NotificationSettingsCard() {
  const [settings, setSettings] = useState({
    orderUpdates: true,
    kycUpdates: true,
    transferUpdates: true,
    marketing: false,
    pushNotifications: true,
    emailNotifications: true
  });

  const handleSettingChange = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <CardTitle className="text-white flex items-center">
          <Bell className="w-5 h-5 mr-2 text-terex-accent" />
          Notifications
        </CardTitle>
        <CardDescription className="text-gray-400">
          Gérez vos préférences de notification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Notifications par type */}
        <div className="space-y-4">
          <h4 className="text-white font-medium text-sm">Notifications par type</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="order-updates" className="text-gray-300">
              Mises à jour des commandes
            </Label>
            <Switch
              id="order-updates"
              checked={settings.orderUpdates}
              onCheckedChange={() => handleSettingChange('orderUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="kyc-updates" className="text-gray-300">
              Vérification KYC
            </Label>
            <Switch
              id="kyc-updates"
              checked={settings.kycUpdates}
              onCheckedChange={() => handleSettingChange('kycUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="transfer-updates" className="text-gray-300">
              Transferts internationaux
            </Label>
            <Switch
              id="transfer-updates"
              checked={settings.transferUpdates}
              onCheckedChange={() => handleSettingChange('transferUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="marketing" className="text-gray-300">
              Notifications marketing
            </Label>
            <Switch
              id="marketing"
              checked={settings.marketing}
              onCheckedChange={() => handleSettingChange('marketing')}
            />
          </div>
        </div>

        {/* Canaux de notification */}
        <div className="space-y-4 pt-4 border-t border-terex-gray/50">
          <h4 className="text-white font-medium text-sm">Canaux de notification</h4>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="push-notifications" className="text-gray-300">
              Notifications push
            </Label>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={() => handleSettingChange('pushNotifications')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="text-gray-300">
              Notifications email
            </Label>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={() => handleSettingChange('emailNotifications')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
