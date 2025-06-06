
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Eye, MessageCircle, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

// Mock data pour les ordres OTC
const mockOrders = [
  {
    id: 'OTC001',
    type: 'buy',
    amount: 500000,
    targetPrice: 1.002,
    status: 'pending',
    createdAt: '2024-01-15T10:30:00Z',
    deadline: 'immediate',
    estimatedFees: 750,
    counterparty: null,
    notes: 'Achat urgent pour règlement fournisseur'
  },
  {
    id: 'OTC002',
    type: 'sell',
    amount: 1200000,
    targetPrice: 0.999,
    status: 'matched',
    createdAt: '2024-01-14T14:20:00Z',
    deadline: '4hours',
    estimatedFees: 1200,
    counterparty: 'Binance Pro',
    notes: 'Vente de position importante'
  },
  {
    id: 'OTC003',
    type: 'buy',
    amount: 750000,
    targetPrice: 1.001,
    status: 'completed',
    createdAt: '2024-01-13T09:15:00Z',
    deadline: '1hour',
    estimatedFees: 900,
    counterparty: 'Kraken OTC',
    notes: 'Transaction pour client institutionnel'
  },
  {
    id: 'OTC004',
    type: 'sell',
    amount: 2500000,
    targetPrice: 1.000,
    status: 'cancelled',
    createdAt: '2024-01-12T16:45:00Z',
    deadline: 'flexible',
    estimatedFees: 2000,
    counterparty: null,
    notes: 'Conditions de marché défavorables'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
    case 'matched': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
    case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/30';
    case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
    default: return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="h-4 w-4" />;
    case 'matched': return <AlertCircle className="h-4 w-4" />;
    case 'completed': return <CheckCircle className="h-4 w-4" />;
    case 'cancelled': return <XCircle className="h-4 w-4" />;
    default: return <Clock className="h-4 w-4" />;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'matched': return 'Apparié';
    case 'completed': return 'Terminé';
    case 'cancelled': return 'Annulé';
    default: return status;
  }
};

export function OTCOrdersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card className="bg-terex-darker border-terex-gray/30">
        <CardHeader>
          <CardTitle className="text-white">Mes ordres OTC</CardTitle>
          <CardDescription className="text-gray-400">
            Gérez et suivez vos transactions OTC
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par ID ou notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-terex-gray border-terex-gray text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="matched">Apparié</SelectItem>
                  <SelectItem value="completed">Terminé</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 bg-terex-gray border-terex-gray text-white">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-terex-darker border-terex-gray">
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="buy">Achat</SelectItem>
                  <SelectItem value="sell">Vente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des ordres */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card className="bg-terex-darker border-terex-gray/30">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Aucun ordre trouvé avec ces critères</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="bg-terex-darker border-terex-gray/30 hover:border-terex-accent/50 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">#{order.id}</span>
                      <span className="text-sm text-gray-400">{formatDate(order.createdAt)}</span>
                    </div>
                    <Badge variant="outline" className={`${order.type === 'buy' ? 'bg-green-500/10 text-green-500 border-green-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30'}`}>
                      {order.type === 'buy' ? 'ACHAT' : 'VENTE'}
                    </Badge>
                    <Badge variant="outline" className={getStatusColor(order.status)}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusLabel(order.status)}</span>
                      </div>
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-terex-gray text-gray-400 hover:text-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="border-terex-gray text-gray-400 hover:text-white">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Montant</p>
                    <p className="text-white font-medium">{order.amount.toLocaleString()} USDT</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Prix cible</p>
                    <p className="text-white font-medium">{order.targetPrice} USDT</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Frais estimés</p>
                    <p className="text-white font-medium">{order.estimatedFees.toLocaleString()} USDT</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Contrepartie</p>
                    <p className="text-white font-medium">{order.counterparty || 'Non attribuée'}</p>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-4 p-3 bg-terex-gray/20 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Notes:</p>
                    <p className="text-white text-sm">{order.notes}</p>
                  </div>
                )}

                {order.status === 'pending' && (
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      Annuler
                    </Button>
                    <Button variant="outline" size="sm" className="border-terex-accent/30 text-terex-accent hover:bg-terex-accent/10">
                      Modifier
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
