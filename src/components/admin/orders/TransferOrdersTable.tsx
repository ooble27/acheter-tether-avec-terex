
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Eye,
  Copy,
  Send
} from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface TransferOrdersTableProps {
  orders: UnifiedOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
}

export function TransferOrdersTable({ orders, onStatusUpdate }: TransferOrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      processing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
      completed: 'bg-green-500/10 text-green-500 border-green-500/20',
      cancelled: 'bg-red-500/10 text-red-500 border-red-500/20'
    };

    const statusLabels = {
      pending: 'En attente',
      processing: 'En traitement',
      completed: 'Terminé',
      cancelled: 'Annulé'
    };

    return (
      <Badge 
        variant="outline" 
        className={statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500/10 text-gray-500'}
      >
        {statusLabels[status as keyof typeof statusLabels] || status}
      </Badge>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-terex-gray/30 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Aucun transfert</h3>
        <p className="text-gray-400">Il n'y a aucun transfert à afficher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-terex-gray/30 rounded-lg border border-terex-gray/50 overflow-hidden"
        >
          {/* Order Header */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Order Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Send className="w-6 h-6 text-blue-500" />
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-white font-medium">
                      #TEREX-{order.id.slice(-8)}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                    <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>Transfert International</span>
                    <span>•</span>
                    <span>{order.recipient_country}</span>
                  </div>
                </div>
              </div>

              {/* Amount Info */}
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {order.amount.toLocaleString()} {order.from_currency || order.currency}
                </div>
                <div className="text-sm text-blue-500">
                  → {order.total_amount?.toLocaleString()} {order.to_currency}
                </div>
                <div className="text-xs text-gray-400">
                  vers {order.recipient_name}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  variant="outline"
                  size="sm"
                  className="border-terex-gray text-white hover:bg-terex-gray"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {expandedOrder === order.id ? 'Masquer' : 'Détails'}
                </Button>

                {order.status === 'pending' && (
                  <>
                    <Button
                      onClick={() => onStatusUpdate(order.id, 'processing' as OrderStatus)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Traiter
                    </Button>
                    <Button
                      onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      size="sm"
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </>
                )}

                {order.status === 'processing' && (
                  <>
                    <Button
                      onClick={() => onStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Terminer
                    </Button>
                    <Button
                      onClick={() => onStatusUpdate(order.id, 'cancelled' as OrderStatus)}
                      size="sm"
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            <div className="border-t border-terex-gray/50 bg-terex-gray/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Informations d'envoi</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Méthode de paiement:</span>
                      <span className="text-white">
                        {order.payment_method === 'card' ? 'Carte bancaire' : 
                         order.payment_method === 'interac' ? 'Interac E-Transfer' : 
                         order.payment_method === 'bank' ? 'Virement bancaire' : 
                         order.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Taux:</span>
                      <span className="text-white">{order.exchange_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frais:</span>
                      <span className="text-white">{order.fees} {order.from_currency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Destinataire</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nom:</span>
                      <span className="text-white">{order.recipient_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pays:</span>
                      <span className="text-white">{order.recipient_country}</span>
                    </div>
                    {order.payment_reference && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Référence:</span>
                        <span className="text-white">{order.payment_reference}</span>
                      </div>
                    )}
                  </div>
                </div>

                {order.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Notes</h4>
                    <div className="bg-terex-gray/50 p-3 rounded text-sm text-white">
                      {order.notes}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
