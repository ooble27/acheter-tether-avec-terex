
import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, X, TestTube } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function NotificationPermissionPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isSupported, permission, subscribeToNotifications, testNotification, isSubscribed } = usePushNotifications();

  useEffect(() => {
    // Afficher le prompt seulement si les notifications sont supportées,
    // que l'utilisateur n'a pas encore donné de permission et qu'il n'est pas abonné
    if (isSupported && permission === 'default' && !isSubscribed) {
      // Attendre 3 secondes avant d'afficher le prompt pour ne pas être trop intrusif
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSupported, permission, isSubscribed]);

  const handleActivateNotifications = async () => {
    try {
      await subscribeToNotifications();
      setShowPrompt(false);
    } catch (error) {
      console.error('Erreur activation notifications:', error);
    }
  };

  const handleTestNotification = async () => {
    try {
      await testNotification();
    } catch (error) {
      console.error('Erreur test notification:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Ne plus afficher pendant cette session
    sessionStorage.setItem('notification-prompt-dismissed', 'true');
  };

  // Ne pas afficher si déjà rejeté dans cette session
  if (sessionStorage.getItem('notification-prompt-dismissed')) {
    return null;
  }

  // Si l'utilisateur est déjà abonné, afficher un bouton de test
  if (isSubscribed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="bg-terex-darker border-terex-accent/30 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Bell className="w-5 h-5 text-green-400" />
                <h3 className="text-white font-medium text-sm">Notifications actives</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrompt(false)}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <p className="text-gray-300 text-xs mb-4">
              Vos notifications push sont configurées. Testez le système !
            </p>
            
            <Button
              onClick={handleTestNotification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
            >
              <TestTube className="w-3 h-3 mr-1" />
              Tester les notifications
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!showPrompt || !isSupported || permission !== 'default') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-terex-darker border-terex-accent/30 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-terex-accent" />
              <h3 className="text-white font-medium text-sm">Notifications</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-300 text-xs mb-4">
            Restez informé des mises à jour de vos commandes et transactions en temps réel.
          </p>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleActivateNotifications}
              className="flex-1 bg-terex-accent hover:bg-terex-accent/80 text-white text-xs h-8"
            >
              <Bell className="w-3 h-3 mr-1" />
              Activer
            </Button>
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 text-xs h-8"
            >
              <BellOff className="w-3 h-3 mr-1" />
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
