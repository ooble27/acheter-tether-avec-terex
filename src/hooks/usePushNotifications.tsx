
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface PushSubscription {
  endpoint: string;
  p256dh: string;
  auth: string;
}

export const usePushNotifications = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      checkSubscription();
    }
  }, [user]);

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        setIsSubscribed(true);
        const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'));
        const auth = arrayBufferToBase64(subscription.getKey('auth'));
        
        setSubscription({
          endpoint: subscription.endpoint,
          p256dh,
          auth
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer | null): string => {
    if (!buffer) return '';
    const bytes = new Uint8Array(buffer);
    const binary = String.fromCharCode(...bytes);
    return btoa(binary);
  };

  const subscribe = async () => {
    if (!isSupported || !user) return;

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // VAPID public key - vous devrez générer votre propre clé
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM70nKEV-8BkZTlbLUjDNHEVJrQ6FnQSBaQW2NgwHfRgSy1xjIaU-U';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      const p256dh = arrayBufferToBase64(subscription.getKey('p256dh'));
      const auth = arrayBufferToBase64(subscription.getKey('auth'));

      const subscriptionData = {
        endpoint: subscription.endpoint,
        p256dh,
        auth
      };

      // Sauvegarder dans Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .upsert({
          user_id: user.id,
          ...subscriptionData
        });

      if (error) throw error;

      setIsSubscribed(true);
      setSubscription(subscriptionData);
      
      toast({
        title: "Notifications activées",
        description: "Vous recevrez désormais des notifications push",
        className: "bg-green-600 text-white border-green-600",
      });
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'activer les notifications",
        className: "bg-red-600 text-white border-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Supprimer de Supabase
      await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id);

      setIsSubscribed(false);
      setSubscription(null);
      
      toast({
        title: "Notifications désactivées",
        description: "Vous ne recevrez plus de notifications push",
        className: "bg-blue-600 text-white border-blue-600",
      });
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de désactiver les notifications",
        className: "bg-red-600 text-white border-red-600",
      });
    } finally {
      setLoading(false);
    }
  };

  const urlBase64ToUint8Array = (base64String: string) => {
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
  };

  return {
    isSupported,
    isSubscribed,
    subscription,
    loading,
    subscribe,
    unsubscribe
  };
};
