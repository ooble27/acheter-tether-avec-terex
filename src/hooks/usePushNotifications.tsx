
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker enregistré:', registration);
        
        // Attendre que le service worker soit prêt
        await navigator.serviceWorker.ready;
        
        return registration;
      } catch (error) {
        console.error('Erreur d\'enregistrement du Service Worker:', error);
        throw new Error('Service Worker non disponible');
      }
    }
    throw new Error('Service Worker non supporté');
  };

  const requestPermission = async () => {
    if (!isSupported) {
      throw new Error('Les notifications push ne sont pas supportées par ce navigateur');
    }

    try {
      const result = await Notification.requestPermission();
      console.log('Permission result:', result);
      setPermission(result);
      
      if (result !== 'granted') {
        throw new Error('Permission refusée pour les notifications');
      }
      
      return result;
    } catch (error) {
      console.error('Erreur demande permission:', error);
      throw new Error('Impossible de demander la permission pour les notifications');
    }
  };

  const subscribeToNotifications = async () => {
    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      console.log('Début de la souscription aux notifications...');

      // Demander la permission
      await requestPermission();

      // Enregistrer le service worker
      const registration = await registerServiceWorker();
      console.log('Service Worker prêt');

      // Vérifier si le pushManager est disponible
      if (!registration.pushManager) {
        throw new Error('Push Manager non disponible');
      }

      // Créer l'abonnement push
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9b2qKwCNAMYhfApMRuLnYwfv-7Oox9TfPmXp4pJXDh7CZJ3uNVdw'
        )
      });

      console.log('Push subscription créé:', pushSubscription);

      // Extraire les clés
      const p256dhKey = pushSubscription.getKey('p256dh');
      const authKey = pushSubscription.getKey('auth');

      if (!p256dhKey || !authKey) {
        throw new Error('Impossible d\'obtenir les clés de chiffrement');
      }

      const subscriptionData = {
        user_id: user.id,
        endpoint: pushSubscription.endpoint,
        p256dh: arrayBufferToBase64(p256dhKey),
        auth: arrayBufferToBase64(authKey)
      };

      console.log('Sauvegarde abonnement en base...', subscriptionData);

      // Sauvegarder l'abonnement en base
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert(subscriptionData, {
          onConflict: 'user_id,endpoint'
        });

      if (error) {
        console.error('Erreur sauvegarde abonnement:', error);
        throw new Error(`Erreur base de données: ${error.message}`);
      }

      console.log('Abonnement sauvegardé avec succès');

      setSubscription({
        endpoint: pushSubscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(p256dhKey),
          auth: arrayBufferToBase64(authKey)
        }
      });

      toast({
        title: "Notifications activées",
        description: "Vous recevrez maintenant des notifications push",
        className: "bg-green-600 text-white border-green-600",
      });

      return pushSubscription;
    } catch (error) {
      console.error('Erreur abonnement notifications:', error);
      
      let errorMessage = "Impossible d'activer les notifications";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const unsubscribeFromNotifications = async () => {
    try {
      if (!user) return;

      // Supprimer de la base de données
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Erreur suppression abonnement:', error);
        throw error;
      }

      // Désabonner du navigateur
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const pushSubscription = await registration.pushManager.getSubscription();
        if (pushSubscription) {
          await pushSubscription.unsubscribe();
        }
      }

      setSubscription(null);
      
      toast({
        title: "Notifications désactivées",
        description: "Vous ne recevrez plus de notifications push",
        className: "bg-orange-600 text-white border-orange-600",
      });
    } catch (error) {
      console.error('Erreur désabonnement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver les notifications",
        variant: "destructive",
      });
    }
  };

  const checkExistingSubscription = async () => {
    try {
      if (!user) return;

      const { data, error } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur vérification abonnement:', error);
        return;
      }

      if (data) {
        setSubscription({
          endpoint: data.endpoint,
          keys: {
            p256dh: data.p256dh,
            auth: data.auth
          }
        });
      }
    } catch (error) {
      console.error('Erreur vérification abonnement:', error);
    }
  };

  useEffect(() => {
    if (user) {
      checkExistingSubscription();
    }
  }, [user]);

  return {
    isSupported,
    permission,
    subscription,
    subscribeToNotifications,
    unsubscribeFromNotifications,
    isSubscribed: !!subscription
  };
};

// Fonctions utilitaires
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
