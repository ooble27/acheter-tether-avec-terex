
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  Send,
  Trash2,
  Users,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { BuyOrdersTable } from './BuyOrdersTable';
import { SellOrdersTable } from './SellOrdersTable';
import { TransferOrdersTable } from './TransferOrdersTable';
import { TrashOrdersTable } from './TrashOrdersTable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

function exportOrdersCSV(orders: any[]) {
  const headers = ['ID', 'Type', 'Statut', 'Montant', 'Devise', 'USDT', 'Méthode', 'Date', 'Client ID', 'Destinataire', 'Notes'];
  const rows = orders.map(o => [
    o.id, o.type, o.status, o.amount, o.currency, o.usdt_amount || '', 
    o.payment_method || '', new Date(o.created_at).toLocaleDateString('fr-FR'),
    o.user_id, o.recipient_name || '', (o.notes || '').replace(/,/g, ';')
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `terex-commandes-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
}

async function exportOrdersPDF(orders: any[]) {
  const { default: jsPDF } = await import('jspdf');
  const { default: autoTable } = await import('jspdf-autotable');
  const doc = new jsPDF({ orientation: 'landscape' });
  doc.setFontSize(18);
  doc.text('Terex - Export Commandes', 14, 22);
  doc.setFontSize(10);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}  |  Total: ${orders.length} commandes`, 14, 30);

  autoTable(doc, {
    startY: 36,
    head: [['ID', 'Type', 'Statut', 'Montant', 'Devise', 'USDT', 'Méthode', 'Date']],
    body: orders.map(o => [
      `TEREX-${o.id.slice(-8)}`, o.type, o.status, o.amount, o.currency,
      o.usdt_amount || '-', o.payment_method || '-',
      new Date(o.created_at).toLocaleDateString('fr-FR')
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 150, 143] },
  });

  doc.save(`terex-commandes-${new Date().toISOString().slice(0, 10)}.pdf`);
}

export function OrdersDashboardNew() {
  const { orders, loading, updateOrderStatus, refreshOrders, moveToTrash, restoreFromTrash, deletePermanently, purgeAllOrders } = useOrders();
  const { isAdmin, isKYCReviewer } = useUserRole();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('buy');

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

  const activeOrders = orders.filter(order => !order.is_deleted);
  const trashedOrders = orders.filter(order => order.is_deleted);
  
  const buyOrders = activeOrders.filter(order => order.type === 'buy');
  const sellOrders = activeOrders.filter(order => order.type === 'sell');
  const transferOrders = activeOrders.filter(order => order.type === 'transfer');

  const filterOrders = (list: typeof orders) => list.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.wallet_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.recipient_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-terex-dark p-3 sm:p-6 space-y-4 sm:space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-terex-accent/20 to-terex-dark rounded-xl sm:rounded-2xl p-4 sm:p-8 border border-terex-gray/30">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Gestion des Commandes</h1>
            <p className="text-terex-accent/80 text-sm sm:text-lg">Gérez efficacement toutes vos transactions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => exportOrdersCSV(orders)}
              variant="outline"
              size="sm"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              CSV
            </Button>
            <Button
              onClick={() => exportOrdersPDF(orders)}
              variant="outline"
              size="sm"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white"
            >
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Tout supprimer
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-terex-darker border-terex-gray">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Supprimer toutes les commandes ?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-400">
                    Cette action est <strong className="text-red-400">irréversible</strong>. Toutes les commandes (achats, ventes, transferts) seront supprimées définitivement.
                    <br /><br />
                    💡 Pensez à exporter vos données en CSV ou PDF avant de continuer.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-terex-gray text-white border-terex-gray">Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={async () => {
                      await purgeAllOrders();
                    }}
                  >
                    Supprimer tout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-terex-accent/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">Commandes Actives</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{activeOrders.length}</p>
              </div>
              <div className="p-2 sm:p-3 bg-terex-accent/20 rounded-full self-center">
                <ShoppingCart className="w-4 h-4 sm:w-6 sm:h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">Clients Actifs</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {new Set(activeOrders.map(order => order.user_id)).size}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-terex-accent/20 rounded-full self-center">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-terex-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray/50 hover:border-terex-accent/50 transition-all duration-300 col-span-2 md:col-span-1">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="min-w-0">
                <p className="text-terex-accent/70 text-xs sm:text-sm font-medium truncate">En Attente</p>
                <p className="text-xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">
                  {activeOrders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-yellow-500/20 rounded-full self-center">
                <RefreshCw className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-terex-darker border-terex-gray/50">
        <CardContent className="p-3 sm:p-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-terex-accent/60 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                placeholder="Rechercher par ID, adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 sm:pl-12 bg-terex-gray/50 border-terex-gray/50 text-white placeholder-terex-accent/40 focus:border-terex-accent text-sm sm:text-base h-10 sm:h-auto"
              />
            </div>
            <Button
              onClick={refreshOrders}
              variant="outline"
              size="sm"
              className="border-terex-accent text-terex-accent hover:bg-terex-accent hover:text-white text-xs sm:text-sm px-3 py-2 h-10 sm:h-auto"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
        <div className="bg-terex-darker rounded-lg p-1 sm:p-2 border border-terex-gray/50 overflow-x-auto">
          <TabsList className="bg-transparent w-full grid grid-cols-4 gap-1 sm:gap-2 min-w-max">
            <TabsTrigger value="buy" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
              <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" alt="USDT" className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Achats ({buyOrders.length})</span>
              <span className="sm:hidden">Achats</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
              <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Ventes ({sellOrders.length})</span>
              <span className="sm:hidden">Ventes</span>
            </TabsTrigger>
            <TabsTrigger value="transfer" className="data-[state=active]:bg-terex-accent data-[state=active]:text-white text-terex-accent/70 border border-transparent data-[state=active]:border-terex-accent/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
              <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Transferts ({transferOrders.length})</span>
              <span className="sm:hidden">Transferts</span>
            </TabsTrigger>
            <TabsTrigger value="trash" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-400 border border-transparent data-[state=active]:border-red-500/50 rounded-md text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap">
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">Corbeille ({trashedOrders.length})</span>
              <span className="sm:hidden">Corbeille</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="buy">
          <BuyOrdersTable orders={filterOrders(buyOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />
        </TabsContent>
        <TabsContent value="sell">
          <SellOrdersTable orders={filterOrders(sellOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />
        </TabsContent>
        <TabsContent value="transfer">
          <TransferOrdersTable orders={filterOrders(transferOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />
        </TabsContent>
        <TabsContent value="trash">
          <TrashOrdersTable orders={filterOrders(trashedOrders)} onRestoreFromTrash={restoreFromTrash} onDeletePermanently={deletePermanently} />
        </TabsContent>
      </Tabs>
    </div>
  );
}