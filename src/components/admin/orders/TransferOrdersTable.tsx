

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Eye,
  Copy,
  Send,
  Trash2
} from 'lucide-react';
import { UnifiedOrder } from '@/hooks/useOrders';
import type { Database } from '@/integrations/supabase/types';

type OrderStatus = Database['public']['Enums']['order_status'];

interface TransferOrdersTableProps {
  orders: UnifiedOrder[];
  onStatusUpdate: (orderId: string, status: OrderStatus, paymentStatus?: string) => void;
  onMoveToTrash: (orderId: string) => void;
}

export function TransferOrdersTable({ orders, onStatusUpdate, onMoveToTrash }: TransferOrdersTableProps) {
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

  const getReceiveMethodName = (order: UnifiedOrder) => {
    // Extraire le service de réception depuis les notes
    if (order.notes) {
      if (order.notes.includes('Wave')) return 'Wave';
      if (order.notes.includes('Orange Money')) return 'Orange Money';
    }
    
    // Utiliser les propriétés spécifiques aux transferts
    if (order.payment_method === 'wave') return 'Wave';
    if (order.payment_method === 'orange_money') return 'Orange Money';
    
    // Fallback par défaut
    return 'Wave';
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus, paymentStatus?: string) => {
    // Empêcher le rechargement de la page
    await onStatusUpdate(orderId, status, paymentStatus);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-terex-gray/30 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">Aucun transfert international</h3>
        <p className="text-gray-400">Il n'y a aucun transfert à afficher.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const receiveMethod = getReceiveMethodName(order);
        
        return (
          <div 
            key={order.id} 
            className="bg-terex-darker rounded-xl border border-terex-gray/50 overflow-hidden hover:border-terex-accent/30 transition-all duration-300"
          >
            {/* Order Header */}
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                {/* Order Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-terex-accent/20 rounded-lg flex items-center justify-center">
                    <Send className="w-6 h-6 text-terex-accent" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="text-white font-medium">
                        #TEREX-{order.id.slice(-8)}
                      </h3>
                      <button
                        onClick={() => copyToClipboard(`TEREX-${order.id.slice(-8)}`)}
                        className="text-gray-400 hover:text-terex-accent transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      {getStatusBadge(order.status)}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-400">
                      <span>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      <span>•</span>
                      <span>Transfert</span>
                      <span>•</span>
                      <span>{receiveMethod}</span>
                    </div>
                  </div>
                </div>

                {/* Amount Info - Amélioration de l'alignement */}
                <div className="text-right">
                  <div className="flex flex-col items-end space-y-1">
                    <div className="text-lg font-bold text-white">
                      {order.amount} {order.from_currency}
                    </div>
                    <div className="text-sm text-terex-accent flex items-center">
                      <span>→ {order.total_amount} {order.to_currency}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 flex-wrap">
                  <Button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    variant="outline"
                    size="sm"
                    className="border-terex-gray text-white hover:bg-terex-gray"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {expandedOrder === order.id ? 'Masquer' : 'Détails'}
                  </Button>

                  <Button
                    onClick={() => onMoveToTrash(order.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  {order.status === 'pending' && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'processing' as OrderStatus)}
                        size="sm"
                        className="bg-terex-accent hover:bg-terex-accent/80 text-white"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Traiter
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled' as OrderStatus)}
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
                        onClick={() => handleStatusUpdate(order.id, 'completed' as OrderStatus, 'paid')}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Terminer
                      </Button>
                      <Button
                        onClick={() => handleStatusUpdate(order.id, 'cancelled' as OrderStatus)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-terex-accent mb-3">Détails du transfert</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Montant envoyé:</span>
                        <span className="text-white font-medium">{order.amount} {order.from_currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Montant à recevoir:</span>
                        <span className="text-white font-medium">{order.total_amount} {order.to_currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frais:</span>
                        <span className="text-white">{order.fees} {order.from_currency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Taux:</span>
                        <span className="text-white">{order.exchange_rate}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-terex-accent mb-3">Informations du destinataire</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400 block mb-1">Nom complet:</span>
                        <span className="text-white font-medium">{order.recipient_name}</span>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 block mb-1">Service de réception:</span>
                        <span className="text-white font-medium">{receiveMethod}</span>
                      </div>
                      
                      {order.recipient_phone && (
                        <div>
                          <span className="text-gray-400 block mb-1">Numéro de téléphone:</span>
                          <div className="flex items-center justify-between bg-terex-gray/50 p-2 rounded">
                            <span className="text-white font-mono">{order.recipient_phone}</span>
                            <Button
                              onClick={() => copyToClipboard(order.recipient_phone)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {order.recipient_country && (
                        <div>
                          <span className="text-gray-400 block mb-1">Pays:</span>
                          <span className="text-white">{order.recipient_country}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-terex-accent mb-3">Détails de paiement</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-gray-400 block mb-1">Méthode de paiement:</span>
                        <span className="text-white">
                          {order.payment_method === 'card' ? 'Carte bancaire' : 
                           order.payment_method === 'interac' ? 'Interac E-Transfer' : 
                           order.payment_method || 'N/A'}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-gray-400 block mb-1">Date:</span>
                        <span className="text-white">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>

                      {order.payment_reference && (
                        <div>
                          <span className="text-gray-400 block mb-1">Référence:</span>
                          <div className="flex items-center justify-between bg-terex-gray/50 p-2 rounded">
                            <span className="text-white font-mono text-xs">{order.payment_reference}</span>
                            <Button
                              onClick={() => copyToClipboard(order.payment_reference)}
                              size="sm"
                              variant="outline"
                              className="h-6 w-6 p-0 border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
