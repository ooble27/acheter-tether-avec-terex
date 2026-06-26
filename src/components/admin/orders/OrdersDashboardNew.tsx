
import { useState } from 'react';
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
      <div className="flex items-center justify-center py-20">
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
          <h2 className="text-lg font-bold text-white mb-2">Accès non autorisé</h2>
          <p className="text-gray-400 text-sm">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
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
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Chargement des commandes…</span>
        </div>
      </div>
    );
  }

  const ORDER_TABS = [
    { id: 'buy',      label: 'Achats',     count: buyOrders.length,      Icon: ShoppingCart },
    { id: 'sell',     label: 'Ventes',     count: sellOrders.length,     Icon: TrendingDown },
    { id: 'transfer', label: 'Transferts', count: transferOrders.length, Icon: Send },
    { id: 'trash',    label: 'Corbeille',  count: trashedOrders.length,  Icon: Trash2, danger: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'flex-end' }}>
        <button onClick={() => exportOrdersCSV(orders)} style={toolBtn}>
          <Download size={14} /> CSV
        </button>
        <button onClick={() => exportOrdersPDF(orders)} style={toolBtn}>
          <Download size={14} /> PDF
        </button>
        <button onClick={refreshOrders} style={toolBtn}>
          <RefreshCw size={14} /> Actualiser
        </button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button style={{ ...toolBtn, color: '#f87171', borderColor: 'rgba(248,113,113,0.25)' }}>
              <Trash2 size={14} /> Tout supprimer
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#1e1e1e] border-[rgba(255,255,255,0.07)]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Supprimer toutes les commandes ?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Cette action est <strong className="text-red-400">irréversible</strong>. Toutes les commandes (achats, ventes, transferts) seront supprimées définitivement.
                <br /><br />
                Pensez à exporter vos données en CSV ou PDF avant de continuer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-[#2d2d2d] text-white border-[rgba(255,255,255,0.07)] hover:bg-[#2d2d2d]">Annuler</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white" onClick={async () => { await purgeAllOrders(); }}>
                Supprimer tout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Commandes actives', value: activeOrders.length,                                      Icon: ShoppingCart },
          { label: 'Clients actifs',    value: new Set(activeOrders.map(o => o.user_id)).size,           Icon: Users        },
          { label: 'En attente',        value: activeOrders.filter(o => o.status === 'pending').length,  Icon: RefreshCw    },
        ].map(({ label, value, Icon }) => (
          <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '16px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#6b7280', fontSize: '11px', margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</p>
                <p style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: 0 }}>{value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
        <input
          placeholder="Rechercher par ID, adresse, destinataire…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: '14px', padding: '13px 16px 13px 42px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Tabs pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
        {ORDER_TABS.map(({ id, label, count, Icon, danger }) => {
          const isOn = id === activeTab;
          const onColor = danger ? '#ef4444' : '#ffffff';
          return (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0,
                padding: '9px 14px', borderRadius: '11px', cursor: 'pointer', whiteSpace: 'nowrap',
                background: isOn ? onColor : CARD,
                border: `1px solid ${isOn ? onColor : BORDER}`,
                color: isOn ? '#141414' : (danger ? '#f87171' : '#9ca3af'),
                fontSize: '13px', fontWeight: 600, transition: 'all 0.15s ease',
              }}>
              <Icon size={15} />
              {label}
              <span style={{ fontSize: '11px', fontWeight: 700, padding: '1px 7px', borderRadius: '999px', background: isOn ? 'rgba(0,0,0,0.10)' : 'rgba(255,255,255,0.06)', color: isOn ? '#141414' : 'rgba(255,255,255,0.6)' }}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'buy' && <BuyOrdersTable orders={filterOrders(buyOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />}
        {activeTab === 'sell' && <SellOrdersTable orders={filterOrders(sellOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />}
        {activeTab === 'transfer' && <TransferOrdersTable orders={filterOrders(transferOrders)} onStatusUpdate={updateOrderStatus} onMoveToTrash={moveToTrash} />}
        {activeTab === 'trash' && <TrashOrdersTable orders={filterOrders(trashedOrders)} onRestoreFromTrash={restoreFromTrash} onDeletePermanently={deletePermanently} />}
      </div>
    </div>
  );
}

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const toolBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
  background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.07)',
  color: '#d1d5db', fontSize: '12.5px', fontWeight: 600,
};