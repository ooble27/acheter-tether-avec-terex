
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Download, 
  Filter, 
  Eye,
  CheckCircle, 
  Clock, 
  TrendingUp,
  XCircle,
  DollarSign,
  Calendar
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface SimpleOrder {
  id: string;
  type: string;
  amount: number;
  usdt_amount: number;
  currency: string;
  status: string;
  payment_method: string;
  created_at: string;
  user_id: string;
  wallet_address?: string;
  payment_reference?: string;
}

interface OrderStats {
  pending: number;
  processing: number;
  completed: number;
  totalToday: number;
  usdtToday: number;
}

export function ModernOrdersAdmin() {
  const [orders, setOrders] = useState<SimpleOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<SimpleOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState<OrderStats>({
    pending: 0,
    processing: 0,
    completed: 0,
    totalToday: 0,
    usdtToday: 0
  });
  
  const { toast } = useToast();
  const { isAdmin, isKYCReviewer } = useUserRole();

  // Vérification des permissions
  const hasPermission = isAdmin?.() || isKYCReviewer?.();
  
  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96 text-center">
          <CardContent className="p-8">
            <h2 className="text-xl font-bold mb-2 text-gray-900">Accès non autorisé</h2>
            <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Charger les commandes
  const loadOrders = async () => {
    try {
      setLoading(true);
      
      // Récupérer les commandes normales
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) {
        throw ordersError;
      }

      // Récupérer les transferts internationaux
      const { data: transfersData, error: transfersError } = await supabase
        .from('international_transfers')
        .select('*')
        .order('created_at', { ascending: false });

      if (transfersError) {
        throw transfersError;
      }

      // Convertir en format uniforme
      const normalizedOrders: SimpleOrder[] = [
        ...(ordersData || []).map(order => ({
          id: order.id,
          type: order.type,
          amount: order.amount || 0,
          usdt_amount: order.usdt_amount || 0,
          currency: order.currency || 'CFA',
          status: order.status,
          payment_method: order.payment_method || 'N/A',
          created_at: order.created_at,
          user_id: order.user_id,
          wallet_address: order.wallet_address,
          payment_reference: order.payment_reference
        })),
        ...(transfersData || []).map(transfer => ({
          id: transfer.id,
          type: 'transfer',
          amount: transfer.amount || 0,
          usdt_amount: transfer.amount || 0,
          currency: transfer.from_currency || 'USDT',
          status: transfer.status,
          payment_method: 'bank_transfer',
          created_at: transfer.created_at,
          user_id: transfer.user_id,
          payment_reference: transfer.reference_number
        }))
      ];

      setOrders(normalizedOrders);
      calculateStats(normalizedOrders);
      
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculer les statistiques
  const calculateStats = (ordersList: SimpleOrder[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayOrders = ordersList.filter(order => 
      new Date(order.created_at).getTime() >= today.getTime()
    );

    const newStats: OrderStats = {
      pending: ordersList.filter(o => o.status === 'pending').length,
      processing: ordersList.filter(o => o.status === 'processing').length,
      completed: ordersList.filter(o => o.status === 'completed').length,
      totalToday: todayOrders.reduce((sum, o) => sum + o.amount, 0),
      usdtToday: todayOrders.reduce((sum, o) => sum + o.usdt_amount, 0)
    };

    setStats(newStats);
  };

  // Filtrer les commandes
  useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.wallet_address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.payment_reference || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter]);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId: string, newStatus: string, orderType: string) => {
    try {
      if (orderType === 'transfer') {
        const { error } = await supabase
          .from('international_transfers')
          .update({ status: newStatus })
          .eq('id', orderId);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('orders')
          .update({ status: newStatus })
          .eq('id', orderId);
        
        if (error) throw error;
      }

      toast({
        title: "Succès",
        description: "Statut mis à jour avec succès",
      });
      
      loadOrders();
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des commandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gestion Moderne des Commandes
          </h1>
          <p className="text-gray-600">
            Interface simplifiée pour gérer toutes vos transactions
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">En traitement</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.processing}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Terminées</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Volume jour</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.totalToday.toLocaleString()} CFA
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">USDT jour</p>
                  <p className="text-lg font-bold text-gray-900">
                    {stats.usdtToday.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="bg-white mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-3 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher par ID, adresse, référence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="pending">En attente</option>
                  <option value="processing">En traitement</option>
                  <option value="completed">Terminé</option>
                  <option value="cancelled">Annulé</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Exporter
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle>
              Commandes ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucune commande
                </h3>
                <p className="text-gray-500">
                  Il n'y a actuellement aucune commande à afficher.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Badge variant="outline" className={
                            order.type === 'buy' ? 'bg-emerald-100 text-emerald-800' :
                            order.type === 'sell' ? 'bg-orange-100 text-orange-800' :
                            'bg-purple-100 text-purple-800'
                          }>
                            {order.type === 'buy' ? 'Achat' : 
                             order.type === 'sell' ? 'Vente' : 'Transfert'}
                          </Badge>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            #{order.id.slice(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {order.amount.toLocaleString()} {order.currency}
                          </p>
                          <p className="text-sm text-blue-600">
                            {order.usdt_amount.toFixed(2)} USDT
                          </p>
                        </div>

                        <div>
                          <Badge variant="outline" className={
                            order.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {order.status === 'pending' ? 'En attente' :
                             order.status === 'processing' ? 'En traitement' :
                             order.status === 'completed' ? 'Terminé' : 'Annulé'}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'processing', order.type)}
                              className="text-blue-700 border-blue-200 hover:bg-blue-50"
                            >
                              <TrendingUp className="w-3 h-3 mr-1" />
                              Traiter
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'cancelled', order.type)}
                              className="text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}
                        
                        {order.status === 'processing' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'completed', order.type)}
                              className="text-green-700 border-green-200 hover:bg-green-50"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Valider
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateOrderStatus(order.id, 'cancelled', order.type)}
                              className="text-red-700 border-red-200 hover:bg-red-50"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Annuler
                            </Button>
                          </>
                        )}

                        <Button
                          size="sm"
                          variant="outline"
                          className="text-gray-500 border-gray-200 hover:bg-gray-50"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''} sur {orders.length} au total
        </div>
      </div>
    </div>
  );
}
