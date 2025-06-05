
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Send,
  DollarSign,
  Users,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useTransfers } from '@/hooks/useTransfers';
import { useUserRole } from '@/hooks/useUserRole';

export function TransfersAdmin() {
  const { transfers, loading, updateTransferStatus } = useTransfers();
  const { isAdmin, isKYCReviewer } = useUserRole();

  if (!isAdmin() && !isKYCReviewer()) {
    return (
      <div className="text-white text-center p-8">
        <h2 className="text-xl font-bold mb-2">Accès non autorisé</h2>
        <p className="text-gray-400">Vous n'avez pas les permissions pour accéder à cette page.</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">En traitement</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (transferId: string, newStatus: string) => {
    await updateTransferStatus(transferId, newStatus);
  };

  const pendingTransfers = transfers.filter(transfer => transfer.status === 'pending');
  const processingTransfers = transfers.filter(transfer => transfer.status === 'processing');
  const completedTransfers = transfers.filter(transfer => transfer.status === 'completed');

  const totalVolume = transfers.reduce((sum, transfer) => sum + transfer.amount, 0);
  const totalValueXOF = transfers.reduce((sum, transfer) => sum + transfer.total_amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-terex-dark flex items-center justify-center">
        <div className="text-white text-lg">Chargement des virements...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Administration des virements</h1>
          <p className="text-gray-400">Gérez tous les virements internationaux</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-gray-400 text-sm">En attente</p>
                  <p className="text-white text-2xl font-bold">{pendingTransfers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-gray-400 text-sm">En traitement</p>
                  <p className="text-white text-2xl font-bold">{processingTransfers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <DollarSign className="w-8 h-8 text-terex-accent" />
                <div>
                  <p className="text-gray-400 text-sm">Volume USDT</p>
                  <p className="text-white text-2xl font-bold">{totalVolume.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-gray-400 text-sm">Valeur totale</p>
                  <p className="text-white text-2xl font-bold">{totalValueXOF.toLocaleString()} XOF</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets des virements */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-terex-gray">
            <TabsTrigger value="pending" className="data-[state=active]:bg-terex-accent">
              En attente ({pendingTransfers.length})
            </TabsTrigger>
            <TabsTrigger value="processing" className="data-[state=active]:bg-terex-accent">
              En traitement ({processingTransfers.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-terex-accent">
              Terminés ({completedTransfers.length})
            </TabsTrigger>
            <TabsTrigger value="all" className="data-[state=active]:bg-terex-accent">
              Tous ({transfers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <TransfersList 
              transfers={pendingTransfers} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="processing">
            <TransfersList 
              transfers={processingTransfers} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>

          <TabsContent value="completed">
            <TransfersList 
              transfers={completedTransfers} 
              onStatusUpdate={handleStatusUpdate}
              showActions={false}
            />
          </TabsContent>

          <TabsContent value="all">
            <TransfersList 
              transfers={transfers} 
              onStatusUpdate={handleStatusUpdate}
              showActions={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface TransfersListProps {
  transfers: any[];
  onStatusUpdate: (transferId: string, status: string) => void;
  showActions: boolean;
}

function TransfersList({ transfers, onStatusUpdate, showActions }: TransfersListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">En attente</Badge>;
      case 'processing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">En traitement</Badge>;
      case 'completed':
        return <Badge variant="outline" className="text-green-500 border-green-500">Terminé</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="text-red-500 border-red-500">Annulé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (transfers.length === 0) {
    return (
      <Card className="bg-terex-darker border-terex-gray">
        <CardContent className="p-8 text-center">
          <p className="text-gray-400">Aucun virement à afficher</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <Card key={transfer.id} className="bg-terex-darker border-terex-gray">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <h3 className="text-white font-medium">
                    Virement #{transfer.id.slice(0, 8)}
                  </h3>
                  {getStatusBadge(transfer.status)}
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Montant:</span>
                    <p className="text-white font-medium">{transfer.amount} {transfer.from_currency}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">À recevoir:</span>
                    <p className="text-terex-accent font-medium">{transfer.total_amount.toLocaleString()} {transfer.to_currency}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Destinataire:</span>
                    <p className="text-white">{transfer.recipient_name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Pays:</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-white">{transfer.recipient_country}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Compte:</span>
                    <p className="text-white font-mono text-xs">{transfer.recipient_account}</p>
                  </div>
                  {transfer.recipient_bank && (
                    <div>
                      <span className="text-gray-400">Banque:</span>
                      <p className="text-white">{transfer.recipient_bank}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="text-white">{new Date(transfer.created_at).toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
                {transfer.reference_number && (
                  <div className="text-sm">
                    <span className="text-gray-400">Référence:</span>
                    <p className="text-white font-mono">{transfer.reference_number}</p>
                  </div>
                )}
              </div>

              {showActions && (
                <div className="flex flex-wrap gap-2">
                  {transfer.status === 'pending' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(transfer.id, 'processing')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Traiter
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusUpdate(transfer.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    </>
                  )}
                  {transfer.status === 'processing' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => onStatusUpdate(transfer.id, 'completed')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Finaliser
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onStatusUpdate(transfer.id, 'cancelled')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Annuler
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
