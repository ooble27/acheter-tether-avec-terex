
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  ArrowUpIcon,
  ArrowDownIcon
} from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  volume?: number;
  orders?: number;
}

interface Analytics {
  totalUsers: number;
  totalOrders: number;
  totalVolume: number;
  monthlyGrowth: number;
  ordersByStatus: ChartData[];
  volumeByMonth: ChartData[];
  userGrowth: ChartData[];
}

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalOrders: 0,
    totalVolume: 0,
    monthlyGrowth: 0,
    ordersByStatus: [],
    volumeByMonth: [],
    userGrowth: []
  });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Récupérer les statistiques des commandes
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*');

      if (ordersError) throw ordersError;

      // Calculer les statistiques de base
      const totalOrders = orders?.length || 0;
      const totalVolume = orders?.reduce((sum, order) => sum + order.amount, 0) || 0;

      // Grouper les commandes par statut
      const ordersByStatus = orders?.reduce((acc: Record<string, number>, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const statusData: ChartData[] = Object.entries(ordersByStatus).map(([status, count]) => ({
        name: status,
        value: count as number
      }));

      // Grouper par mois pour le volume
      const volumeByMonth = orders?.reduce((acc: Record<string, { volume: number; orders: number }>, order) => {
        const month = new Date(order.created_at).toLocaleDateString('fr-FR', { 
          year: 'numeric', 
          month: 'short' 
        });
        
        if (!acc[month]) {
          acc[month] = { volume: 0, orders: 0 };
        }
        
        acc[month].volume += order.amount;
        acc[month].orders += 1;
        
        return acc;
      }, {}) || {};

      const monthlyData: ChartData[] = Object.entries(volumeByMonth).map(([month, data]) => ({
        name: month,
        value: data.volume,
        volume: data.volume,
        orders: data.orders
      }));

      // Simuler la croissance d'utilisateurs (en attendant de vraies données)
      const userGrowthData: ChartData[] = [
        { name: 'Jan', value: 120 },
        { name: 'Fév', value: 145 },
        { name: 'Mar', value: 180 },
        { name: 'Avr', value: 220 },
        { name: 'Mai', value: 280 },
        { name: 'Jun', value: 350 }
      ];

      setAnalytics({
        totalUsers: 350, // Simulé
        totalOrders,
        totalVolume,
        monthlyGrowth: 15.5, // Simulé
        ordersByStatus: statusData,
        volumeByMonth: monthlyData,
        userGrowth: userGrowthData
      });

    } catch (error) {
      console.error('Erreur lors du chargement des analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <TrendingUp className="w-8 h-8 mr-3 text-terex-accent" />
            Analytics & Rapports
          </h1>
          <p className="text-gray-400">Vue d'ensemble des performances de la plateforme</p>
        </div>
      </div>

      {/* KPIs Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Utilisateurs Totaux</p>
                <p className="text-2xl font-bold text-white">{analytics.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm ml-1">+12.5%</span>
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
                <p className="text-gray-400 text-sm">Commandes Totales</p>
                <p className="text-2xl font-bold text-white">{analytics.totalOrders}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm ml-1">+8.2%</span>
                </div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Volume Total</p>
                <p className="text-2xl font-bold text-white">{analytics.totalVolume.toLocaleString()} CFA</p>
                <div className="flex items-center mt-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm ml-1">+25.3%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Croissance Mensuelle</p>
                <p className="text-2xl font-bold text-white">{analytics.monthlyGrowth}%</p>
                <div className="flex items-center mt-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                  <span className="text-green-500 text-sm ml-1">+2.1%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-terex-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList className="bg-terex-gray">
          <TabsTrigger value="volume">Volume par Mois</TabsTrigger>
          <TabsTrigger value="orders">Statut des Commandes</TabsTrigger>
          <TabsTrigger value="growth">Croissance Utilisateurs</TabsTrigger>
        </TabsList>

        <TabsContent value="volume">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Volume des Transactions par Mois</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={analytics.volumeByMonth}>
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
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Répartition des Commandes par Statut</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={analytics.ordersByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Croissance des Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={analytics.userGrowth}>
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
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
