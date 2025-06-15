
import { supabase } from '@/integrations/supabase/client';

interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  data?: any;
}

export class NotificationService {
  static async sendNotificationToUser(
    userId: string, 
    notification: NotificationData,
    notificationType: 'order_updates' | 'kyc_updates' | 'transfer_updates' | 'marketing' = 'order_updates'
  ) {
    try {
      // Vérifier les paramètres de notification de l'utilisateur
      const { data: settings } = await supabase
        .from('notification_settings')
        .select(notificationType)
        .eq('user_id', userId)
        .single();

      if (!settings || !settings[notificationType]) {
        console.log(`Notifications ${notificationType} désactivées pour l'utilisateur ${userId}`);
        return;
      }

      // Récupérer les abonnements push de l'utilisateur
      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', userId);

      if (!subscriptions || subscriptions.length === 0) {
        console.log(`Aucun abonnement push trouvé pour l'utilisateur ${userId}`);
        return;
      }

      // Envoyer les notifications via la fonction edge
      for (const subscription of subscriptions) {
        try {
          const { error } = await supabase.functions.invoke('send-push-notification', {
            body: {
              subscription: {
                endpoint: subscription.endpoint,
                keys: {
                  p256dh: subscription.p256dh,
                  auth: subscription.auth
                }
              },
              notification: {
                title: notification.title,
                body: notification.body,
                icon: notification.icon || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
                badge: notification.badge || '/lovable-uploads/2deedbc3-65e1-4e12-85a2-301f882eaafb.png',
                url: notification.url,
                data: notification.data
              }
            }
          });

          if (error) {
            console.error('Erreur envoi notification push:', error);
          }
        } catch (error) {
          console.error('Erreur envoi notification à l\'abonnement:', error);
        }
      }
    } catch (error) {
      console.error('Erreur dans sendNotificationToUser:', error);
    }
  }

  static async notifyOrderStatusChange(userId: string, orderId: string, status: string, orderType: string) {
    const statusMessages = {
      processing: 'Votre commande est en cours de traitement',
      completed: 'Votre commande a été complétée avec succès',
      cancelled: 'Votre commande a été annulée',
      failed: 'Un problème est survenu avec votre commande'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Mise à jour de votre commande';

    await this.sendNotificationToUser(userId, {
      title: `Commande ${orderType.toUpperCase()} - ${status}`,
      body: message,
      url: `/?section=profile&tab=orders`,
      data: { orderId, status, type: 'order_update' }
    }, 'order_updates');
  }

  static async notifyKYCStatusChange(userId: string, status: string) {
    const statusMessages = {
      approved: 'Votre vérification KYC a été approuvée !',
      rejected: 'Votre vérification KYC a été rejetée. Veuillez soumettre de nouveaux documents.',
      under_review: 'Votre vérification KYC est en cours d\'examen'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Mise à jour de votre vérification KYC';

    await this.sendNotificationToUser(userId, {
      title: 'Vérification KYC',
      body: message,
      url: `/?section=profile&tab=kyc`,
      data: { status, type: 'kyc_update' }
    }, 'kyc_updates');
  }

  static async notifyTransferStatusChange(userId: string, transferId: string, status: string) {
    const statusMessages = {
      processing: 'Votre transfert est en cours de traitement',
      completed: 'Votre transfert a été complété avec succès',
      cancelled: 'Votre transfert a été annulé',
      failed: 'Un problème est survenu avec votre transfert'
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Mise à jour de votre transfert';

    await this.sendNotificationToUser(userId, {
      title: `Transfert International - ${status}`,
      body: message,
      url: `/?section=profile&tab=transfers`,
      data: { transferId, status, type: 'transfer_update' }
    }, 'transfer_updates');
  }
}
