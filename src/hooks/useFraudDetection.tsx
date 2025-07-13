
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FraudAlert {
  id: string;
  user_id: string;
  order_id?: string;
  alert_type: 'suspicious_amount' | 'rapid_transactions' | 'unusual_pattern' | 'blacklisted_address' | 'kyc_mismatch';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata: any;
  status: 'pending' | 'reviewed' | 'dismissed' | 'escalated';
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface FraudStats {
  totalAlerts: number;
  pendingAlerts: number;
  criticalAlerts: number;
  blockedTransactions: number;
  falsePositives: number;
  detectionRate: number;
}

export const useFraudDetection = () => {
  const [alerts, setAlerts] = useState<FraudAlert[]>([]);
  const [stats, setStats] = useState<FraudStats>({
    totalAlerts: 0,
    pendingAlerts: 0,
    criticalAlerts: 0,
    blockedTransactions: 0,
    falsePositives: 0,
    detectionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fraud_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAlerts((data || []) as FraudAlert[]);
      
      // Calculer les statistiques
      const totalAlerts = data?.length || 0;
      const pendingAlerts = data?.filter(alert => alert.status === 'pending').length || 0;
      const criticalAlerts = data?.filter(alert => alert.severity === 'critical').length || 0;
      const blockedTransactions = data?.filter(alert => 
        alert.alert_type === 'suspicious_amount' && alert.severity === 'critical'
      ).length || 0;

      setStats({
        totalAlerts,
        pendingAlerts,
        criticalAlerts,
        blockedTransactions,
        falsePositives: 0, // À calculer avec plus de données
        detectionRate: totalAlerts > 0 ? (criticalAlerts / totalAlerts) * 100 : 0
      });

    } catch (error) {
      console.error('Erreur lors de la récupération des alertes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de récupérer les alertes de fraude",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const analyzeTransaction = async (order: any) => {
    try {
      // Analyse automatique des transactions pour détecter les fraudes
      const alerts: Array<{
        user_id: string;
        order_id?: string;
        alert_type: 'suspicious_amount' | 'rapid_transactions' | 'unusual_pattern' | 'blacklisted_address' | 'kyc_mismatch';
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        metadata: any;
        status: 'pending' | 'reviewed' | 'dismissed' | 'escalated';
        created_at: string;
      }> = [];

      // 1. Montant suspect (> 100 000 CFA ou > 500 USDT)
      if (order.amount > 100000 || order.usdt_amount > 500) {
        alerts.push({
          user_id: order.user_id,
          order_id: order.id,
          alert_type: 'suspicious_amount',
          severity: order.amount > 500000 ? 'critical' : 'high',
          description: `Transaction de montant élevé: ${order.amount} ${order.currency}`,
          metadata: { amount: order.amount, currency: order.currency },
          status: 'pending',
          created_at: new Date().toISOString()
        });
      }

      // 2. Transactions rapides (plus de 3 en 1 heure)
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', order.user_id)
        .gte('created_at', new Date(Date.now() - 3600000).toISOString());

      if (recentOrders && recentOrders.length > 3) {
        alerts.push({
          user_id: order.user_id,
          order_id: order.id,
          alert_type: 'rapid_transactions',
          severity: recentOrders.length > 5 ? 'high' : 'medium',
          description: `${recentOrders.length} transactions en moins d'1 heure`,
          metadata: { count: recentOrders.length, timeframe: '1h' },
          status: 'pending',
          created_at: new Date().toISOString()
        });
      }

      // 3. Vérification du statut KYC
      const { data: kycData } = await supabase
        .from('kyc_verifications')
        .select('status')
        .eq('user_id', order.user_id)
        .single();

      if (!kycData || kycData.status !== 'approved') {
        alerts.push({
          user_id: order.user_id,
          order_id: order.id,
          alert_type: 'kyc_mismatch',
          severity: 'medium',
          description: 'Transaction sans KYC approuvé',
          metadata: { kyc_status: kycData?.status || 'not_found' },
          status: 'pending',
          created_at: new Date().toISOString()
        });
      }

      // Insérer les alertes dans la base
      if (alerts.length > 0) {
        const { error } = await supabase
          .from('fraud_alerts')
          .insert(alerts);

        if (error) throw error;
      }

      return alerts;
    } catch (error) {
      console.error('Erreur lors de l\'analyse de fraude:', error);
      return [];
    }
  };

  const updateAlertStatus = async (alertId: string, status: FraudAlert['status'], reviewerId: string) => {
    try {
      const { error } = await supabase
        .from('fraud_alerts')
        .update({
          status,
          reviewed_by: reviewerId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', alertId);

      if (error) throw error;

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status, reviewed_by: reviewerId, reviewed_at: new Date().toISOString() }
          : alert
      ));

      toast({
        title: "Succès",
        description: "Statut de l'alerte mis à jour",
        className: "bg-green-600 text-white border-green-600",
      });

    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'alerte",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return {
    alerts,
    stats,
    loading,
    analyzeTransaction,
    updateAlertStatus,
    refreshAlerts: fetchAlerts
  };
};
