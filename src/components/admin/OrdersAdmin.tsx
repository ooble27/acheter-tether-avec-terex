
import { useState, useMemo } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { OrdersStatsCards } from './orders/OrdersStatsCards';
import { OrdersTableFilters } from './orders/OrdersTableFilters';
import { OrdersTable } from './orders/OrdersTable';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

export function OrdersAdmin() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold mb-2 text-gray-900">Accès non autorisé</h2>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.wallet_address && order.wallet_address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (order.payment_reference && order.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesType = typeFilter === 'all' || order.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchTerm, statusFilter, typeFilter]);

  // Calculer les statistiques pour aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dailyOrders = orders.filter(order => 
    new Date(order.created_at).getTime() >= today.getTime()
  );

  const stats = useMemo(() => {
    const pendingCount = orders.filter(order => order.status === 'pending').length;
    const processingCount = orders.filter(order => order.status === 'processing').length;
    const completedCount = orders.filter(order => order.status === 'completed').length;
    const dailyVolume = dailyOrders.reduce((sum, order) => sum + order.amount, 0);
    const dailyUSDT = dailyOrders.reduce((sum, order) => sum + order.usdt_amount, 0);

    return {
      pendingCount,
      processingCount,
      completedCount,
      dailyVolume,
      dailyUSDT
    };
  }, [orders, dailyOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, paymentStatus?: string) => {
    await updateOrderStatus(orderId, newStatus, paymentStatus);
  };

  const handleExport = () => {
    // TODO: Implémenter l'export des données
    console.log('Export des commandes...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600 text-lg">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des commandes</h1>
          <p className="text-gray-600">
            Interface d'administration pour gérer toutes les transactions et commandes
          </p>
        </div>

        {/* Statistiques */}
        <OrdersStatsCards {...stats} />

        {/* Filtres */}
        <OrdersTableFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          onExport={handleExport}
        />

        {/* Tableau des commandes */}
        <OrdersTable
          orders={filteredOrders}
          onStatusUpdate={handleStatusUpdate}
        />

        {/* Footer avec info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''} sur {orders.length} au total
        </div>
      </div>
    </div>
  );
}
