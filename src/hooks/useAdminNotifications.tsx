
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAdminNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const sendAdminNotification = async (
    notificationType: 'new_order' | 'kyc_submission' | 'status_update' | 'high_volume_request',
    data: any
  ) => {
    try {
      // Send notification to admin email
      const { error } = await supabase.functions.invoke('send-admin-notification', {
        body: {
          notificationType,
          data,
          adminUserId: user?.id
        },
      });

      if (error) {
        console.error('Erreur notification admin:', error);
        return;
      }

      console.log('Notification admin envoyée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la notification admin:', error);
    }
  };

  const notifyNewOrder = async (orderData: any) => {
    await sendAdminNotification('new_order', {
      orderId: orderData.id,
      type: orderData.type,
      amount: orderData.amount,
      currency: orderData.currency,
      usdtAmount: orderData.usdt_amount,
      paymentMethod: orderData.payment_method,
      status: orderData.status,
      userId: orderData.user_id,
      createdAt: orderData.created_at
    });
  };

  const notifyKYCSubmission = async (kycData: any) => {
    await sendAdminNotification('kyc_submission', {
      userId: kycData.user_id,
      firstName: kycData.first_name,
      lastName: kycData.last_name,
      status: kycData.status,
      submittedAt: kycData.submitted_at
    });
  };

  const notifyStatusUpdate = async (orderData: any, oldStatus: string, newStatus: string) => {
    await sendAdminNotification('status_update', {
      orderId: orderData.id,
      type: orderData.type,
      oldStatus,
      newStatus,
      amount: orderData.amount,
      currency: orderData.currency
    });
  };

  return {
    sendAdminNotification,
    notifyNewOrder,
    notifyKYCSubmission,
    notifyStatusUpdate
  };
};
