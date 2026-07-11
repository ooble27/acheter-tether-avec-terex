import { useMemo, useState } from 'react';
import {
  Search, RefreshCw, Coins, HandCoins, Send, Trash2,
  Download, AlertTriangle, ChevronRight, RotateCcw, Inbox,
} from 'lucide-react';
import { useOrders, UnifiedOrder } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { useClientInfos } from '@/hooks/useClientInfos';
import { OrderDetailsPage } from './OrderDetailsPage';
import { PageHeader, Tabs, StatusText, Avatar, FilterChip, drillStyles } from '@/components/admin/AdminDrill';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

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
    headStyles: { fillColor: [30, 30, 30] },
  });
  doc.save(`terex-commandes-${new Date().toISOString().slice(0, 10)}.pdf`);
}

type Zone = 'buy' | 'sell' | 'transfer' | 'trash';

const ZONES: Record<Zone, { label: string; single: string; Icon: any; danger?: boolean }> = {
  buy:      { label: 'Achats',    single: 'Achat',    Icon: Coins },
  sell:     { label: 'Ventes',    single: 'Vente',    Icon: HandCoins },
  transfer: { label: 'Virements', single: 'Virement', Icon: Send },
  trash:    { label: 'Corbeille', single: 'Commande', Icon: Trash2, danger: true },
};

const STATUS_FILTERS = [
  { id: 'all', label: 'Toutes' },
  { id: 'pending', label: 'En attente' },
  { id: 'processing', label: 'En traitement' },
  { id: 'completed', label: 'Terminées' },
  { id: 'cancelled', label: 'Annulées' },
];

export function OrdersDashboardNew() {
  const { orders, loading, updateOrderStatus, refreshOrders, moveToTrash, restoreFromTrash, deletePermanently, purgeAllOrders } = useOrders();
  const { isAdmin, isOperator } = useUserRole();
  const [zone, setZone] = useState<Zone>('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [detailOrder, setDetailOrder] = useState<UnifiedOrder | null>(null);

  const activeOrders = useMemo(() => orders.filter(o => !o.is_deleted), [orders]);
  const trashedOrders = useMemo(() => orders.filter(o => o.is_deleted), [orders]);

  const zoneOrders: Record<Zone, UnifiedOrder[]> = {
    buy: activeOrders.filter(o => o.type === 'buy'),
    sell: activeOrders.filter(o => o.type === 'sell'),
    transfer: activeOrders.filter(o => o.type === 'transfer'),
    trash: trashedOrders,
  };

  // Noms des clients pour les lignes visibles
  const visibleIds = useMemo(() => {
    return Array.from(new Set(zoneOrders[zone].slice(0, 120).map(o => o.user_id)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, orders]);
  const infos = useClientInfos(visibleIds);

  if (!isAdmin() && !isOperator()) {
    return (
      <div className="flex items-center justify-center py-20">
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '32px', textAlign: 'center' }}>
          <h2 className="text-lg font-bold text-white mb-2">Accès non autorisé</h2>
          <p className="text-gray-400 text-sm">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="text-sm">Chargement des commandes…</span>
        </div>
      </div>
    );
  }

  if (detailOrder) {
    return (
      <OrderDetailsPage
        order={orders.find(o => o.id === detailOrder.id) || detailOrder}
        onBack={() => { setDetailOrder(null); refreshOrders?.(); }}
        onStatusUpdate={updateOrderStatus}
      />
    );
  }

  const meta = ZONES[zone];
  const base = zoneOrders[zone];
  const q = searchTerm.toLowerCase();
  const list = base
    .filter(o => statusFilter === 'all' || o.status === statusFilter)
    .filter(o =>
      !q ||
      o.id.toLowerCase().includes(q) ||
      (infos[o.user_id]?.full_name || '').toLowerCase().includes(q) ||
      (o.wallet_address || '').toLowerCase().includes(q) ||
      (o.payment_reference || '').toLowerCase().includes(q) ||
      (o.recipient_name || '').toLowerCase().includes(q)
    )
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const isTrash = zone === 'trash';

  // ── Ligne de table — colonnes sur desktop, condensée sur mobile ─────────────
  const OrderRow = ({ o }: { o: UnifiedOrder }) => {
    const zm = ZONES[(o.type as Zone)] || ZONES.buy;
    const client = infos[o.user_id]?.full_name || (o.type === 'transfer' ? o.recipient_name : '') || 'Client';
    const d = new Date(o.created_at);
    return (
      <div className="crm-row cols-orders clickable" onClick={() => setDetailOrder(o)}>
        {/* Client */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Avatar name={client} />
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client}</p>
            <p style={{ color: '#6b7280', fontSize: 11, margin: '1px 0 0', fontFamily: 'ui-monospace,Menlo,monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              TEREX-{o.id.slice(-8).toUpperCase()}
            </p>
            {/* Statut visible sur mobile, sous la référence */}
            <span className="only-m" style={{ marginTop: 3 }}>
              <StatusText status={o.status} size={11.5} />
            </span>
          </div>
        </div>

        {/* Type */}
        <div className="only-d" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <zm.Icon size={13} color="rgba(255,255,255,0.45)" />
          <span style={{ color: '#9ca3af', fontSize: 12.5, whiteSpace: 'nowrap' }}>{zm.single}</span>
        </div>

        {/* Montant */}
        <div style={{ minWidth: 0, textAlign: 'right' }}>
          <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>{Number(o.amount).toLocaleString('fr-FR')} {o.currency}</p>
          <p style={{ color: '#6b7280', fontSize: 11, margin: '1px 0 0', whiteSpace: 'nowrap' }}>
            {o.type === 'transfer' ? (o.recipient_country || 'Transfert') : `${Number(o.usdt_amount || 0).toLocaleString('fr-FR')} USDT`}
          </p>
        </div>

        {/* Statut (desktop) */}
        <div className="only-d" style={{ minWidth: 0 }}>
          <StatusText status={o.status} />
        </div>

        {/* Date */}
        <div className="only-d" style={{ minWidth: 0 }}>
          <p style={{ color: '#6b7280', fontSize: 12, margin: 0, whiteSpace: 'nowrap' }}>
            {d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
          <p style={{ color: '#4b5563', fontSize: 11, margin: '1px 0 0', whiteSpace: 'nowrap' }}>
            {d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Actions */}
        {isTrash ? (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }} onClick={e => e.stopPropagation()}>
            <button title="Restaurer" onClick={() => restoreFromTrash(o.id)}
              style={{ width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RotateCcw size={13} color="rgba(255,255,255,0.7)" />
            </button>
            <button title="Supprimer définitivement" onClick={() => deletePermanently(o.id)}
              style={{ width: 30, height: 30, borderRadius: 9, background: 'transparent', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={13} color="#c98686" />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
            <button className="only-d" title="Mettre à la corbeille" onClick={(e) => { e.stopPropagation(); moveToTrash(o.id); }}
              style={{ width: 30, height: 30, borderRadius: 9, background: 'transparent', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={13} color="rgba(255,255,255,0.35)" />
            </button>
            <ChevronRight size={15} color="rgba(255,255,255,0.25)" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>

      {/* En-tête de page */}
      <PageHeader
        title="Commandes"
        sub={`${activeOrders.length} commande(s) · ${new Set(activeOrders.map(o => o.user_id)).size} client(s)`}
        right={
          <>
            <button className="ghost-btn" onClick={() => exportOrdersCSV(orders)}><Download size={13} /> CSV</button>
            <button className="ghost-btn" onClick={() => exportOrdersPDF(orders)}><Download size={13} /> PDF</button>
            <button className="ghost-btn" onClick={() => refreshOrders?.()}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
            {isTrash && isAdmin() && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="ghost-btn" style={{ color: '#c98686' }}>
                    <Trash2 size={13} /> Tout supprimer
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
            )}
          </>
        }
      />

      {/* Onglets — Achats / Ventes / Virements / Corbeille */}
      <Tabs
        tabs={(['buy', 'sell', 'transfer', 'trash'] as Zone[]).map(z => ({
          id: z, label: ZONES[z].label, count: zoneOrders[z].length, danger: ZONES[z].danger,
        }))}
        active={zone}
        onChange={(z) => { setZone(z as Zone); setStatusFilter('all'); }}
      />

      {/* Barre d'outils — recherche + filtres de statut */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 220px', minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
          <input
            placeholder="Rechercher : client, référence, adresse…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 11, padding: '9px 14px 9px 36px', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        {!isTrash && (
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', scrollbarWidth: 'none' }}>
            {STATUS_FILTERS.map(f => {
              const count = f.id === 'all' ? base.length : base.filter(o => o.status === f.id).length;
              return (
                <FilterChip key={f.id} label={f.label} count={count} selected={statusFilter === f.id}
                  onClick={() => setStatusFilter(f.id)} />
              );
            })}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="crm-table crm-fade">
        <div className="crm-thead cols-orders">
          <span className="crm-th">Client</span>
          <span className="crm-th">Type</span>
          <span className="crm-th" style={{ textAlign: 'right' }}>Montant</span>
          <span className="crm-th">Statut</span>
          <span className="crm-th">Date</span>
          <span className="crm-th" />
        </div>
        {list.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Inbox size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
              {searchTerm || statusFilter !== 'all' ? 'Aucune commande ne correspond aux filtres.' : `Aucune commande dans ${meta.label.toLowerCase()}.`}
            </p>
          </div>
        ) : (
          list.map(o => <OrderRow key={o.id} o={o} />)
        )}
      </div>
    </div>
  );
}
