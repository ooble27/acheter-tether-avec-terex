
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  Users,
  DollarSign,
  TrendingUp,
  Bell,
  Settings,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Send
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useKYCAdmin } from '@/hooks/useKYCAdmin';
import { useUserRole } from '@/hooks/useUserRole';
import { OrdersTable } from './orders/OrdersTable';
import { OrderStatusChart } from './orders/OrderStatusChart';

export function AdminPortal() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { verifications, stats: kycStats } = useKYCAdmin();
  const { isAdmin, isKYCReviewer } = useUserRole();

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <Card className="bg-terex-darker border-terex-gray p-8">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-bold text-white mb-2">Accès Administrateur Requis</h2>
            <p className="text-gray-400">Ce portail est réservé aux administrateurs autorisés.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Calculs des métriques
  const totalVolume = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalUSDT = orders.reduce((sum, order) => sum + order.usdt_amount, 0);
  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const completedOrders = orders.filter(order => order.status === 'completed');
  
  // Métriques par type
  const buyOrders = orders.filter(order => order.type === 'buy');
  const sellOrders = orders.filter(order => order.type === 'sell');
  const transferOrders = orders.filter(order => order.type === 'transfer');

  const successRate = orders.length > 0 ? (completedOrders.length / orders.length) * 100 : 0;
  const avgOrderValue = orders.length > 0 ? totalVolume / orders.length : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <Activity className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement du portail admin...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <div className="bg-terex-darker border-b border-terex-gray p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center">
              <Shield className="w-8 h-8 mr-3 text-terex-accent" />
              Portail Administrateur TEREX
            </h1>
            <p className="text-gray-400 mt-1">Gestion complète des opérations et transactions</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
              <Activity className="w-3 h-3 mr-1" />
              En ligne
            </Badge>
            <Button variant="outline" className="border-terex-gray text-white hover:bg-terex-gray">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" className="border-terex-gray text-white hover:bg-terex-gray">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Volume Total</p>
                  <p className="text-2xl font-bold text-white">
                    {(totalVolume / 1000000000).toFixed(2)}B CFA
                  </p>
                  <p className="text-xs text-terex-accent">{totalUSDT.toLocaleString()} USDT</p>
                </div>
                <DollarSign className="w-8 h-8 text-terex-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Commandes Actives</p>
                  <p className="text-2xl font-bold text-white">{pendingOrders.length + processingOrders.length}</p>
                  <p className="text-xs text-yellow-400">{pendingOrders.length} en attente</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Taux de Réussite</p>
                  <p className="text-2xl font-bold text-white">{successRate.toFixed(1)}%</p>
                  <p className="text-xs text-green-400">{completedOrders.length} terminées</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">KYC en Attente</p>
                  <p className="text-2xl font-bold text-white">{kycStats.submitted + kycStats.under_review}</p>
                  <p className="text-xs text-blue-400">{kycStats.submitted} nouvelles</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métriques par type de transaction */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Achats USDT</h3>
                <ArrowUpRight className="w-5 h-5 text-green-500" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{buyOrders.length}</p>
                <p className="text-sm text-gray-400">
                  {buyOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()} CFA
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Ventes USDT</h3>
                <ArrowDownRight className="w-5 h-5 text-red-500" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{sellOrders.length}</p>
                <p className="text-sm text-gray-400">
                  {sellOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()} CFA
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium">Transferts</h3>
                <Send className="w-5 h-5 text-blue-500" />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-white">{transferOrders.length}</p>
                <p className="text-sm text-gray-400">
                  {transferOrders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()} 
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal avec onglets */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-terex-gray">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-terex-accent">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-terex-accent">
              <DollarSign className="w-4 h-4 mr-2" />
              Commandes ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="kyc" className="data-[state=active]:bg-terex-accent">
              <Users className="w-4 h-4 mr-2" />
              KYC ({verifications.length})
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-terex-accent">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <OrderStatusChart orders={orders} />
              
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-terex-accent" />
                    Activité Récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-terex-gray/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-terex-accent/20 rounded-full flex items-center justify-center">
                            {order.type === 'buy' ? <ArrowUpRight className="w-4 h-4 text-green-500" /> :
                             order.type === 'sell' ? <ArrowDownRight className="w-4 h-4 text-red-500" /> :
                             <Send className="w-4 h-4 text-blue-500" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">
                              #{order.id.slice(-8)} - {order.type}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {order.amount.toLocaleString()} {order.currency}
                            </p>
                          </div>
                        </div>
                        <Badge className={
                          order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          order.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                          order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }>
                          {order.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">
                  Gestion des Commandes ({orders.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OrdersTable 
                  orders={orders}
                  onStatusUpdate={updateOrderStatus}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="kyc">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white">
                  Vérifications KYC ({verifications.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">Interface KYC en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Statistiques Avancées</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valeur moyenne des commandes:</span>
                    <span className="text-white font-medium">{avgOrderValue.toLocaleString()} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commandes aujourd'hui:</span>
                    <span className="text-white font-medium">
                      {orders.filter(order => 
                        new Date(order.created_at).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume USDT total:</span>
                    <span className="text-terex-accent font-medium">{totalUSDT.toLocaleString()} USDT</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader>
                  <CardTitle className="text-white">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Temps de traitement moyen:</span>
                    <span className="text-white font-medium">~2.5h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Satisfaction client:</span>
                    <span className="text-green-400 font-medium">98.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime système:</span>
                    <span className="text-green-400 font-medium">99.9%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
