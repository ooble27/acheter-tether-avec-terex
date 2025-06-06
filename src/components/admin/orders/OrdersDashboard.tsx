
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { OrdersStatsGrid } from './OrdersStatsGrid';
import { OrdersTable } from './OrdersTable';
import { OrdersFilters } from './OrdersFilters';
import { OrderStatusChart } from './OrderStatusChart';

export function OrdersDashboard() {
  const { orders, loading, updateOrderStatus, refreshOrders } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

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

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const processingOrders = orders.filter(order => order.status === 'processing');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalVolume = orders.reduce((sum, order) => sum + order.amount, 0);

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
          <h1 className="text-3xl font-bold text-white">Dashboard des commandes</h1>
          <p className="text-gray-400">Gérez et surveillez toutes les transactions USDT</p>
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
          
          <Button
            variant="outline"
            className="border-terex-gray text-white hover:bg-terex-gray"
          >
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <OrdersStatsGrid 
        pendingCount={pendingOrders.length}
        processingCount={processingOrders.length}
        completedCount={completedOrders.length}
        totalVolume={totalVolume}
        totalOrders={orders.length}
      />

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrderStatusChart orders={orders} />
        
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
              Volume quotidien
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-3xl font-bold text-terex-accent mb-2">
                {totalVolume.toLocaleString()} CFA
              </div>
              <p className="text-gray-400">Volume total traité</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher par ID, adresse wallet, ou référence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-terex-gray border-terex-gray text-white placeholder-gray-400"
              />
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-terex-gray border-terex-gray text-white rounded-md px-3 py-2"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En traitement</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>
              
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="border-terex-gray text-white hover:bg-terex-gray"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtres
              </Button>
            </div>
          </div>
          
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-terex-gray">
              <OrdersFilters />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-terex-darker border-terex-gray">
        <CardHeader>
          <CardTitle className="text-white">
            Commandes ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable 
            orders={filteredOrders}
            onStatusUpdate={updateOrderStatus}
          />
        </CardContent>
      </Card>
    </div>
  );
}
