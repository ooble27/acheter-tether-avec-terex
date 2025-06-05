import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  DollarSign,
  Users,
  TrendingUp
} from 'lucide-react';
import { useOrders, Order } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export function OrdersAdmin() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="text-white text-center p-8">
        <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
        <p className="text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">En traitement</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-500 border-green-500">Payé</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-500 border-red-500">Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, paymentStatus?: string) => {
    await updateOrderStatus(orderId, newStatus, paymentStatus);
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const completedOrders = orders.filter(order => order.status === 'completed');

  const totalVolume = orders.reduce((sum, order) => sum + order.amount, 0);
  const totalUSDT = orders.reduce((sum, order) => sum + order.usdt_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Administration des commandes</h1>
          <p className="text-gray-400">Gérez toutes les commandes d'achat USDT</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-gray-400 text-sm">En attente</p>
                  <p className="text-white text-2xl font-bold">{pendingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">En traitement</p>
                  <p className="text-white text-2xl font-bold">{processingOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-terex-accent" />
                <div>
                  <p className="text-gray-400 text-sm">Volume total</p>
                  <p className="text-white text-2xl font-bold">{totalVolume.toLocaleString()} CFA</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">USDT vendus</p>
                  <p className="text-white text-2xl font-bold">{totalUSDT.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets des commandes */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-terex-gray">
            <TabsTrigger value="pending" className="data-[state=active]:bg-terex-accent">
              En attente ({pendingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-terex-accent">
              En traitement ({processingOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-terex-accent">
              Terminées ({completedOrders.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-terex-accent">
              Toutes ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <OrdersList 
              orders={pendingOrders} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="processing">
            <OrdersList 
              orders={processingOrders} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="completed">
            <OrdersList 
              orders={completedOrders} 
              onStatusUpdate={handleStatusUpdate}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="all">
            <OrdersList 
              orders={orders} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface OrdersListProps {
  orders: Order[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
  showActions: boolean;
}

function OrdersList({ orders, onStatusUpdate, showActions }: OrdersListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">En traitement</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'paid':
        return <Badge variant="outline" className="text-green-500 border-green-500">Payé</Badge>;
      case 'failed':
        return <Badge variant="outline" className="text-red-500 border-red-500">Échec</Badge>;
      default:
        return <Badge variant="outline">Inconnu</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Aucune commande à afficher</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order.id} className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-white font-medium">
                    Commande #{order.id.slice(0, 8)}
                  </h3>
                  {getStatusBadge(order.status)}
                  {getPaymentStatusBadge(order.payment_status)}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Montant:</span>
                    <p className="text-white font-medium">{order.amount} {order.currency}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">USDT:</span>
                    <p className="text-terex-accent font-medium">{order.usdt_amount} USDT</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Paiement:</span>
                    <p className="text-white">{order.payment_method}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{new Date(order.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                {order.wallet_address && (
                  <div className="text-sm">
                    <span className="text-gray-400">Adresse:</span>
                    <p className="text-white font-mono text-xs break-all">{order.wallet_address}</p>
                  </div>
                )}
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-2">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(order.id, 'processing' as OrderStatus)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Traiter
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    </>
                  )}
                  {order.status === 'processing' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
