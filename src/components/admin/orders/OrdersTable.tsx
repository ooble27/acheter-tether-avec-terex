
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Eye,
  MoreHorizontal,
  ArrowUpDown
} from 'lucide-react';
import type { UnifiedOrder } from '@/hooks/useOrders';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface OrdersTableProps {
  orders: UnifiedOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
}

export function OrdersTable({ orders, onStatusUpdate }: OrdersTableProps) {
  const [sortField, setSortField] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'En attente', className: 'bg-amber-100 text-amber-800 border-amber-200' },
      processing: { label: 'En traitement', className: 'bg-blue-100 text-blue-800 border-blue-200' },
      completed: { label: 'Terminé', className: 'bg-green-100 text-green-800 border-green-200' },
      cancelled: { label: 'Annulé', className: 'bg-red-100 text-red-800 border-red-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || 
      { label: status, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <Badge variant="outline" className={`${config.className} font-medium`}>
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      buy: { label: 'Achat', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
      sell: { label: 'Vente', className: 'bg-orange-100 text-orange-800 border-orange-200' },
      transfer: { label: 'Transfert', className: 'bg-purple-100 text-purple-800 border-purple-200' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || 
      { label: type, className: 'bg-gray-100 text-gray-800 border-gray-200' };

    return (
      <Badge variant="outline" className={`${config.className} font-medium text-xs`}>
        {config.label}
      </Badge>
    );
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown className="h-3 w-3 text-gray-400" />
      </div>
    </TableHead>
  );

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Clock className="h-12 w-12 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande</h3>
        <p className="text-gray-500">Il n'y a actuellement aucune commande à afficher.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow className="border-gray-200">
            <SortableHeader field="id">ID</SortableHeader>
            <TableHead>Type</TableHead>
            <SortableHeader field="amount">Montant</SortableHeader>
            <SortableHeader field="usdt_amount">USDT</SortableHeader>
            <TableHead>Paiement</TableHead>
            <TableHead>Statut</TableHead>
            <SortableHeader field="created_at">Date</SortableHeader>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="border-gray-200 hover:bg-gray-50">
              <TableCell className="font-mono text-sm">
                #{order.id.slice(0, 8)}
              </TableCell>
              <TableCell>
                {getTypeBadge(order.type)}
              </TableCell>
              <TableCell className="font-semibold">
                {(order.amount || 0).toLocaleString()} {order.currency || 'CFA'}
              </TableCell>
              <TableCell className="font-semibold text-terex-accent">
                {(order.usdt_amount || 0).toFixed(2)} USDT
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {order.payment_method || 'N/A'}
              </TableCell>
              <TableCell>
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(order.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  {order.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(order.id, 'processing' as OrderStatus)}
                        className="h-8 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Traiter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                        className="h-8 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
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
                        onClick={() => onStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')}
                        className="h-8 px-2 text-xs border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                        className="h-8 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Annuler
                      </Button>
                    </>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-gray-200 text-gray-500 hover:bg-gray-50"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
