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
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <p className="text-gray-600">Chargement...</p>
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
            <Card key={stat.title} className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-black">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-black">{stat.value}</div>
                <p className="text-xs text-gray-600">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-black">Aperçu</CardTitle>
          <CardDescription className="text-gray-600">
            Statistiques de votre compte marchand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-black">Revenus estimés</p>
                <p className="text-sm text-gray-600">
                  Commission sur les transactions complétées
                </p>
              </div>
              <p className="text-2xl font-bold text-black">
                {(stats.totalVolume * 0.005).toLocaleString()} CFA
              </p>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div>
                <p className="font-medium text-black">Montant moyen par transaction</p>
                <p className="text-sm text-gray-600">
                  Sur les transactions réussies
                </p>
              </div>
              <p className="text-2xl font-bold text-black">
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
