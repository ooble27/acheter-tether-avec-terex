
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalVolume: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
  kycApprovalRate: number;
  fraudDetectionRate: number;
}

interface ChartData {
  name: string;
  value: number;
  volume?: number;
  orders?: number;
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalVolume: 0,
    totalOrders: 0,
    conversionRate: 0,
    avgOrderValue: 0,
    kycApprovalRate: 0,
    fraudDetectionRate: 0
  });
  const [volumeData, setVolumeData] = useState<ChartData[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<ChartData[]>([]);
  const [ordersByTypeData, setOrdersByTypeData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Récupérer les statistiques de base
      const [ordersResult, kycResult, usersResult] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('kyc_verifications').select('status'),
        supabase.from('profiles').select('created_at')
      ]);

      const orders = ordersResult.data || [];
      const kycVerifications = kycResult.data || [];
      const users = usersResult.data || [];

      // Calculer les métriques
      const totalVolume = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
      const totalOrders = orders.length;
      const totalUsers = users.length;
      const approvedKyc = kycVerifications.filter(kyc => kyc.status === 'approved').length;
      const kycApprovalRate = kycVerifications.length > 0 ? (approvedKyc / kycVerifications.length) * 100 : 0;

      // Utilisateurs actifs (derniers 30 jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeUsers = users.filter(user => 
        new Date(user.created_at) >= thirtyDaysAgo
      ).length;

      setAnalytics({
        totalUsers,
        activeUsers,
        totalVolume,
        totalOrders,
        conversionRate: totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0,
        avgOrderValue: totalOrders > 0 ? totalVolume / totalOrders : 0,
        kycApprovalRate,
        fraudDetectionRate: 95.2 // Valeur fixe pour l'exemple
      });

      // Données pour les graphiques
      // Volume par jour (7 derniers jours)
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const volumeByDay = last7Days.map(day => {
        const dayOrders = orders.filter(order => 
          order.created_at.split('T')[0] === day
        );
        return {
          name: new Date(day).toLocaleDateString('fr-FR', { weekday: 'short' }),
          volume: dayOrders.reduce((sum, order) => sum + (order.amount || 0), 0),
          orders: dayOrders.length
        };
      });

      setVolumeData(volumeByDay);

      // Croissance des utilisateurs (12 derniers mois)
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        return date.toISOString().slice(0, 7); // YYYY-MM
      }).reverse();

      const userGrowth = last12Months.map(month => {
        const monthUsers = users.filter(user => 
          user.created_at.slice(0, 7) === month
        );
        return {
          name: new Date(month + '-01').toLocaleDateString('fr-FR', { month: 'short' }),
          value: monthUsers.length
        };
      });

      setUserGrowthData(userGrowth);

      // Commandes par type
      const ordersByType = [
        { name: 'Achat', value: orders.filter(o => o.type === 'buy').length },
        { name: 'Vente', value: orders.filter(o => o.type === 'sell').length },
        { name: 'Transfert', value: orders.filter(o => o.type === 'transfer').length }
      ];

      setOrdersByTypeData(ordersByType);

    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement des analytics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center">
          <BarChart className="w-8 h-8 mr-3 text-terex-accent" />
          Analytics Business
        </h1>
        <p className="text-gray-400">Tableaux de bord et métriques de performance</p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Utilisateurs Total</p>
                <p className="text-2xl font-bold text-white">{analytics.totalUsers.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+{analytics.activeUsers} ce mois</span>
                </div>
              </div>
              <Users className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Volume Total</p>
                <p className="text-2xl font-bold text-white">{analytics.totalVolume.toLocaleString()} CFA</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+12.5%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Taux Conversion</p>
                <p className="text-2xl font-bold text-white">{analytics.conversionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+2.1%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">KYC Approuvé</p>
                <p className="text-2xl font-bold text-white">{analytics.kycApprovalRate.toFixed(1)}%</p>
                <div className="flex items-center mt-1">
                  <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500 text-sm">-1.2%</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList className="bg-terex-gray">
          <TabsTrigger value="volume">Volume & Commandes</TabsTrigger>
          <TabsTrigger value="users">Croissance Utilisateurs</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="volume">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Volume par Jour (7 derniers jours)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="volume" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Commandes par Jour</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volumeData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line type="monotone" dataKey="orders" stroke="#F59E0B" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Croissance des Utilisateurs (12 mois)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Répartition des Commandes</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ordersByTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ordersByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">Métriques Clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-terex-gray rounded-lg">
                    <span className="text-gray-400">Valeur moyenne commande</span>
                    <Badge className="bg-green-600 text-white">
                      {analytics.avgOrderValue.toLocaleString()} CFA
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-terex-gray rounded-lg">
                    <span className="text-gray-400">Détection de fraude</span>
                    <Badge className="bg-blue-600 text-white">
                      {analytics.fraudDetectionRate}%
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-terex-gray rounded-lg">
                    <span className="text-gray-400">Utilisateurs actifs</span>
                    <Badge className="bg-terex-accent text-white">
                      {analytics.activeUsers}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
