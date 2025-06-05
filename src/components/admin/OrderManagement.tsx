
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useOrders, Order } from '@/hooks/useOrders';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export function OrderManagement() {
  const { orders, loading, updateOrderStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<Order['status']>('pending');
  const [notes, setNotes] = useState('');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
      case 'failed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
      case 'failed':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;

    const success = await updateOrderStatus(selectedOrder.id, newStatus, notes);
    if (success) {
      setSelectedOrder(null);
      setNotes('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement des commandes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Gestion des commandes</h2>
        <Badge variant="outline" className="text-terex-accent border-terex-accent">
          {orders.length} commande(s)
        </Badge>
      </div>

      <div className="grid gap-4">
        {orders.length === 0 ? (
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Aucune commande pour le moment</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="bg-terex-darker border-terex-gray">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(order.status)}`}></div>
                    <div>
                      <p className="text-white font-medium">
                        Commande #{order.id.slice(0, 8)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {format(new Date(order.created_at), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`flex items-center space-x-1 ${getStatusColor(order.status)} text-white border-0`}>
                    {getStatusIcon(order.status)}
                    <span className="capitalize">{order.status}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Type</p>
                    <p className="text-white font-medium capitalize">{order.type}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Montant</p>
                    <p className="text-white font-medium">
                      {order.amount} {order.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">USDT</p>
                    <p className="text-white font-medium">{order.usdt_amount} USDT</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-sm">Méthode de paiement</p>
                    <p className="text-white font-medium capitalize">{order.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Réseau</p>
                    <p className="text-white font-medium">{order.network}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Taux de change</p>
                    <p className="text-white font-medium">{order.exchange_rate}</p>
                  </div>
                </div>

                {order.wallet_address && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Adresse de réception</p>
                    <p className="text-white font-mono text-sm bg-terex-gray p-2 rounded">
                      {order.wallet_address}
                    </p>
                  </div>
                )}

                {order.notes && (
                  <div className="mb-4">
                    <p className="text-gray-400 text-sm">Notes</p>
                    <p className="text-white text-sm bg-terex-gray p-2 rounded">
                      {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    {order.processed_at && (
                      <span>
                        Traité le {format(new Date(order.processed_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                      </span>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setNotes(order.notes || '');
                        }}
                        className="bg-terex-accent hover:bg-terex-accent/80"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Gérer
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-terex-darker border-terex-gray max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          Gérer la commande #{selectedOrder?.id.slice(0, 8)}
                        </DialogTitle>
                      </DialogHeader>
                      
                      {selectedOrder && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-white text-sm font-medium">Nouveau statut</label>
                              <Select value={newStatus} onValueChange={(value: Order['status']) => setNewStatus(value)}>
                                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="processing">En cours</SelectItem>
                                  <SelectItem value="completed">Terminé</SelectItem>
                                  <SelectItem value="cancelled">Annulé</SelectItem>
                                  <SelectItem value="failed">Échoué</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <label className="text-white text-sm font-medium">Notes</label>
                            <Textarea
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Ajoutez des notes sur cette commande..."
                              className="bg-terex-gray border-terex-gray-light text-white"
                              rows={3}
                            />
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={handleUpdateStatus}
                              className="bg-terex-accent hover:bg-terex-accent/80"
                            >
                              Mettre à jour
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
