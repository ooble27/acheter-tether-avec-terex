
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  Send,
  DollarSign
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { OrdersStatsGrid } from './OrdersStatsGrid';
import { BuyOrdersTable } from './BuyOrdersTable';
import { SellOrdersTable } from './SellOrdersTable';
import { TransferOrdersTable } from './TransferOrdersTable';

export function OrdersDashboardNew() {
  const { orders, loading, updateOrderStatus, refreshOrders } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <Card className="bg-terex-darker border-terex-gray p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-2">Accès non autorisé</h2>
            <p className="text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </div>
        </Card>
      </div>
    );
  }

  // Séparer les commandes par type
  const buyOrders = orders.filter(order => order.type === 'buy');
  const sellOrders = orders.filter(order => order.type === 'sell');
  const transferOrders = orders.filter(order => order.type === 'transfer');

  const filteredBuyOrders = buyOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSellOrders = sellOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransferOrders = transferOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-white">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="text-lg">Chargement du dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Commandes</h1>
          <p className="text-gray-400">Gérez vos transactions par catégorie</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={refreshOrders}
            variant="outline"
            className="border-terex-gray text-white hover:bg-terex-gray"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <OrdersStatsGrid 
        pendingCount={orders.filter(o => o.status === 'pending').length}
        processingCount={orders.filter(o => o.status === 'processing').length}
        completedCount={orders.filter(o => o.status === 'completed').length}
        totalVolume={orders.reduce((sum, order) => sum + order.amount, 0)}
        totalOrders={orders.length}
      />

      {/* Search Global */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher par ID, adresse, nom du destinataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs séparés par type */}
      <Tabs defaultValue="buy" className="space-y-6">
        <TabsList className="bg-terex-gray grid w-full grid-cols-3">
          <TabsTrigger 
            value="buy" 
            className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Achats USDT ({buyOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="sell" 
            className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
          >
            <TrendingDown className="w-4 h-4" />
            <span>Ventes USDT ({sellOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger 
            value="transfer" 
            className="data-[state=active]:bg-terex-accent flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Transferts ({transferOrders.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-green-500" />
                Commandes d'Achat USDT ({filteredBuyOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BuyOrdersTable 
                orders={filteredBuyOrders}
                onStatusUpdate={updateOrderStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sell">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <TrendingDown className="w-5 h-5 mr-2 text-red-500" />
                Commandes de Vente USDT ({filteredSellOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SellOrdersTable 
                orders={filteredSellOrders}
                onStatusUpdate={updateOrderStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Send className="w-5 h-5 mr-2 text-blue-500" />
                Transferts Internationaux ({filteredTransferOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransferOrdersTable 
                orders={filteredTransferOrders}
                onStatusUpdate={updateOrderStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
