
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  RotateCcw,
  Eye,
  Copy,
  Trash2,
  DollarSign,
  TrendingDown,
  Send
} from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';

interface TrashOrdersTableProps {
  orders: UnifiedOrder[];
  onRestoreFromTrash: (orderId: string) => void;
  onDeletePermanently: (orderId: string) => void;
}

export function TrashOrdersTable({ orders, onRestoreFromTrash, onDeletePermanently }: TrashOrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
        Supprimé
      </Badge>
    );
  };

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-6 h-6" />;
      case 'sell':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      case 'transfer':
        return <Send className="w-6 h-6 text-blue-500" />;
      default:
        return <DollarSign className="w-6 h-6 text-gray-500" />;
    }
  };

  const getOrderTypeLabel = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Achat USDT';
      case 'sell':
        return 'Vente USDT';
      case 'transfer':
        return 'Transfert International';
      default:
        return type;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-terex-gray/30 rounded-full flex items-center justify-center">
          <Trash2 className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Corbeille vide</h3>
        <p className="text-gray-400">Aucune commande supprimée à afficher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div 
          key={order.id} 
          className="bg-terex-darker/50 rounded-xl border border-gray-500/30 overflow-hidden opacity-75"
        >
          {/* Order Header */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Order Info */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center">
                  {getOrderIcon(order.type)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-gray-300 font-medium">
                      #TEREX-{order.id.slice(-8)}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                      className="text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    {getStatusBadge(order.status)}
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                    <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    <span>•</span>
                    <span>{getOrderTypeLabel(order.type)}</span>
                  </div>
                </div>
              </div>

              {/* Amount Info */}
              <div className="text-right">
                {order.type === 'buy' && (
                  <>
                    <div className="text-2xl font-bold text-gray-300">
                      {order.amount.toLocaleString()} {order.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      → {order.usdt_amount} USDT
                    </div>
                  </>
                )}
                
                {order.type === 'sell' && (
                  <>
                    <div className="text-2xl font-bold text-gray-300">
                      {order.usdt_amount} USDT
                    </div>
                    <div className="text-sm text-gray-500">
                      → {order.amount.toLocaleString()} {order.currency}
                    </div>
                  </>
                )}
                
                {order.type === 'transfer' && (
                  <>
                    <div className="text-2xl font-bold text-gray-300">
                      {order.amount.toLocaleString()} {order.from_currency || order.currency}
                    </div>
                    <div className="text-sm text-gray-500">
                      → {order.total_amount?.toLocaleString()} {order.to_currency}
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  variant="outline"
                  size="sm"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  {expandedOrder === order.id ? 'Masquer' : 'Détails'}
                </Button>

                <Button
                  onClick={() => onRestoreFromTrash(order.id)}
                  variant="outline"
                  size="sm"
                  className="border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Restaurer
                </Button>

                <Button
                  onClick={() => {
                    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement cette commande ? Cette action est irréversible.')) {
                      onDeletePermanently(order.id);
                    }
                  }}
                  variant="destructive"
                  size="sm"
                  className="bg-red-600/90 hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Supprimer
                </Button>
              </div>
            </div>
          </div>

          {/* Expanded Details */}
          {expandedOrder === order.id && (
            <div className="border-t border-gray-500/30 bg-gray-800/20 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Informations générales</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="text-gray-300">{getOrderTypeLabel(order.type)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Date de suppression:</span>
                      <span className="text-gray-300">{new Date(order.deleted_at || order.updated_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>

                {order.payment_method && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Méthode de paiement</h4>
                    <div className="text-sm text-gray-300">{order.payment_method}</div>
                  </div>
                )}

                {order.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Notes</h4>
                    <div className="bg-gray-700/50 p-3 rounded text-sm text-gray-300">
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
