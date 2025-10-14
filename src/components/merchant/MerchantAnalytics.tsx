import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, DollarSign, Activity, CheckCircle } from 'lucide-react';

interface MerchantAnalyticsProps {
  merchantId: string;
}

export function MerchantAnalytics({ merchantId }: MerchantAnalyticsProps) {
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalVolume: 0,
    completedTransactions: 0,
    successRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [merchantId]);

  const loadAnalytics = async () => {
    const { data, error } = await supabase
      .from('terex_payments')
      .select('*')
      .eq('merchant_id', merchantId);

    if (!error && data) {
      const completed = data.filter(tx => tx.status === 'completed');
      const totalVolume = completed.reduce((sum, tx) => sum + Number(tx.amount), 0);
      const successRate = data.length > 0 ? (completed.length / data.length) * 100 : 0;

      setStats({
        totalTransactions: data.length,
        totalVolume,
        completedTransactions: completed.length,
        successRate
      });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Chargement...</p>
        </CardContent>
      </Card>
    );
  }

  const statCards = [
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: Activity,
      description: 'Toutes les transactions'
    },
    {
      title: 'Volume Total',
      value: `${stats.totalVolume.toLocaleString()} CFA`,
      icon: DollarSign,
      description: 'Montant traité'
    },
    {
      title: 'Transactions Réussies',
      value: stats.completedTransactions,
      icon: CheckCircle,
      description: 'Paiements complétés'
    },
    {
      title: 'Taux de Succès',
      value: `${stats.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      description: 'Taux de réussite'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aperçu</CardTitle>
          <CardDescription>
            Statistiques de votre compte marchand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Revenus estimés</p>
                <p className="text-sm text-muted-foreground">
                  Commission sur les transactions complétées
                </p>
              </div>
              <p className="text-2xl font-bold">
                {(stats.totalVolume * 0.005).toLocaleString()} CFA
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Montant moyen par transaction</p>
                <p className="text-sm text-muted-foreground">
                  Sur les transactions réussies
                </p>
              </div>
              <p className="text-2xl font-bold">
                {stats.completedTransactions > 0
                  ? (stats.totalVolume / stats.completedTransactions).toLocaleString()
                  : 0} CFA
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
