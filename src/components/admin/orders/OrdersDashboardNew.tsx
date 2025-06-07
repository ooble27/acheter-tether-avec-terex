
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
  Trash2,
  Archive,
  Users
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { BuyOrdersTable } from './BuyOrdersTable';
import { SellOrdersTable } from './SellOrdersTable';
import { TransferOrdersTable } from './TransferOrdersTable';
import { TrashOrdersTable } from './TrashOrdersTable';

export function OrdersDashboardNew() {
  const { orders, loading, updateOrderStatus, refreshOrders, moveToTrash, restoreFromTrash } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

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

  // Séparer les commandes par type et exclure celles dans la corbeille
  const activeOrders = orders.filter(order => !order.is_deleted);
  const trashedOrders = orders.filter(order => order.is_deleted);
  
  const buyOrders = activeOrders.filter(order => order.type === 'buy');
  const sellOrders = activeOrders.filter(order => order.type === 'sell');
  const transferOrders = activeOrders.filter(order => order.type === 'transfer');

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

  const filteredTrashedOrders = trashedOrders.filter(order => 
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
    <div className="min-h-screen bg-terex-dark p-6 space-y-8">
      {/* Header redesigné avec le style Terex */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-accent/20 to-terex-dark rounded-2xl p-8 border border-terex-gray/30">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-3">Gestion des Commandes</h1>
          <p className="text-terex-accent/80 text-lg">Gérez efficacement toutes vos transactions</p>
        </div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-terex-accent/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-terex-accent/5 rounded-full translate-y-16 -translate-x-16"></div>
      </div>

      {/* Stats Cards redesignées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-terex-accent/70 text-sm font-medium">Commandes Actives</p>
                <p className="text-3xl font-bold text-white mt-2">{activeOrders.length}</p>
              </div>
              <div className="p-3 bg-terex-accent/20 rounded-full">
                <ShoppingCart className="w-6 h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-terex-accent/70 text-sm font-medium">Clients Actifs</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {new Set(activeOrders.map(order => order.user_id)).size}
                </p>
              </div>
              <div className="p-3 bg-terex-accent/20 rounded-full">
                <Users className="w-6 h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-terex-accent/70 text-sm font-medium">En Attente</p>
                <p className="text-3xl font-bold text-white mt-2">
                  {activeOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/20 rounded-full">
                <RefreshCw className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche */}
      <Card className="bg-terex-darker border-terex-gray/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terex-accent/60 w-5 h-5" />
              <Input
                placeholder="Rechercher par ID, adresse, nom du destinataire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-terex-gray/50 border-terex-gray/50 text-white placeholder-terex-accent/40 focus:border-terex-accent"
              />
            </div>
            <Button
              onClick={refreshOrders}
              variant="outline"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs redesignés */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="bg-terex-darker rounded-lg p-2 border border-terex-gray/50">
          <TabsList className="bg-transparent w-full grid grid-cols-4 gap-2">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-lg"
            >
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-4 h-4 mr-2" />
              <span>Achats ({buyOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sell" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-lg"
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              <span>Ventes ({sellOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-lg"
            >
              <Send className="w-4 h-4 mr-2" />
              <span>Transferts ({transferOrders.length})</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trash" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-400 border border-transparent data-[state=active]:border-red-500/50 rounded-lg"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Corbeille ({trashedOrders.length})</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buy">
          <BuyOrdersTable 
            orders={filteredBuyOrders}
            onStatusUpdate={updateOrderStatus}
            onMoveToTrash={moveToTrash}
          />
        </TabsContent>

        <TabsContent value="sell">
          <SellOrdersTable 
            orders={filteredSellOrders}
            onStatusUpdate={updateOrderStatus}
            onMoveToTrash={moveToTrash}
          />
        </TabsContent>

        <TabsContent value="transfer">
          <TransferOrdersTable 
            orders={filteredTransferOrders}
            onStatusUpdate={updateOrderStatus}
            onMoveToTrash={moveToTrash}
          />
        </TabsContent>

        <TabsContent value="trash">
          <TrashOrdersTable 
            orders={filteredTrashedOrders}
            onRestoreFromTrash={restoreFromTrash}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
