
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
  Users,
  AlertTriangle
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { BuyOrdersTable } from './BuyOrdersTable';
import { SellOrdersTable } from './SellOrdersTable';
import { TransferOrdersTable } from './TransferOrdersTable';
import { TrashOrdersTable } from './TrashOrdersTable';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function OrdersDashboardNew() {
  const { orders, loading, updateOrderStatus, refreshOrders, moveToTrash, restoreFromTrash, deletePermanently } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('buy');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllOrders = async () => {
    const confirmed = window.confirm(
      "⚠️ ATTENTION CRITIQUE : Cette action supprimera DÉFINITIVEMENT toutes les commandes de tous les clients (achats, ventes et transferts). Cette action est IRRÉVERSIBLE. Êtes-vous absolument certain de vouloir continuer ?"
    );

    if (!confirmed) return;

    const doubleConfirm = window.confirm(
      "🚨 DERNIÈRE CONFIRMATION : Toutes les données seront perdues. Tapez OK pour confirmer."
    );

    if (!doubleConfirm) return;

    setIsDeleting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `https://mwwjrrduavfcwjiyniuy.supabase.co/functions/v1/admin-delete-all-orders`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete orders');
      }

      toast.success('Toutes les commandes ont été supprimées avec succès');
      await refreshOrders();
    } catch (error) {
      console.error('Error deleting all orders:', error);
      toast.error('Impossible de supprimer les commandes');
    } finally {
      setIsDeleting(false);
    }
  };

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
    <div className="min-h-screen bg-terex-dark p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header redesigné avec responsive mobile */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-accent/20 to-terex-dark rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-terex-gray/30">
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Gestion des Commandes</h1>
          <p className="text-terex-accent/80 text-sm sm:text-lg">Gérez efficacement toutes vos transactions</p>
        </div>
        
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-terex-accent/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-terex-accent/5 rounded-full translate-y-8 sm:translate-y-16 -translate-x-8 sm:-translate-x-16"></div>
      </div>

      {/* Stats Cards redesignées pour mobile */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">Commandes Actives</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{activeOrders.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-terex-accent/20 rounded-full self-center">
                <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">Clients Actifs</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {new Set(activeOrders.map(order => order.user_id)).size}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-terex-accent/20 rounded-full self-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300 col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">En Attente</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {activeOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-full self-center">
                <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Barre de recherche optimisée mobile */}
      <Card className="bg-terex-darker border-terex-gray/50">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terex-accent/60 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Rechercher par ID, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 bg-terex-gray/50 border-terex-gray/50 text-white placeholder-terex-accent/40 focus:border-terex-accent text-sm sm:text-base h-10 sm:h-auto"
              />
            </div>
            <Button
              onClick={refreshOrders}
              variant="outline"
              size="sm"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white text-xs sm:text-sm px-3 py-2 h-10 sm:h-auto"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Actualiser</span>
              <span className="sm:hidden">Actualiser</span>
            </Button>
            {isAdmin() && (
              <Button
                onClick={handleDeleteAllOrders}
                disabled={isDeleting}
                variant="destructive"
                size="sm"
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-xs sm:text-sm px-3 py-2 h-10 sm:h-auto"
              >
                <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {isDeleting ? 'Suppression...' : 'Supprimer tout'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs redesignés pour mobile */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="bg-terex-darker rounded-lg p-1 sm:p-2 border border-terex-gray/50 overflow-x-auto">
          <TabsList className="bg-transparent w-full grid grid-cols-4 gap-1 sm:gap-2 min-w-max">
            <TabsTrigger 
              value="buy" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Achats ({buyOrders.length})</span>
              <span className="sm:hidden">Achats</span>
            </TabsTrigger>
            <TabsTrigger 
              value="sell" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Ventes ({sellOrders.length})</span>
              <span className="sm:hidden">Ventes</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transfer" 
              className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Transferts ({transferOrders.length})</span>
              <span className="sm:hidden">Transferts</span>
            </TabsTrigger>
            <TabsTrigger 
              value="trash" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-400 border border-transparent data-[state=active]:border-red-500/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Corbeille ({trashedOrders.length})</span>
              <span className="sm:hidden">Corbeille</span>
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
            onDeletePermanently={deletePermanently}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
