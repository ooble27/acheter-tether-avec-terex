import { useMemo, useState } from 'react';
import {
  Search, RefreshCw, Coins, HandCoins, Send, Trash2,
  Download, AlertTriangle, Clock, ChevronRight, RotateCcw, Inbox,
} from 'lucide-react';
import { useOrders, UnifiedOrder } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { useClientInfos } from '@/hooks/useClientInfos';
import { OrderDetailsPage } from './OrderDetailsPage';
import { HubTile, TileGrid, SwitchPill, StatStrip, SectionLabel, DrillPage, drillStyles } from '@/components/admin/AdminDrill';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const toolBtn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 14px', borderRadius: '10px', cursor: 'pointer',
  background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.07)',
  color: '#d1d5db', fontSize: '12.5px', fontWeight: 600,
};

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

const ZONES: Record<Zone, { label: string; single: string; desc: string; Icon: any; danger?: boolean }> = {
  buy:      { label: 'Achats',     single: 'Achat',    desc: 'Les clients achètent des USDT en CFA', Icon: Coins },
  sell:     { label: 'Ventes',     single: 'Vente',    desc: 'Les clients vendent leurs USDT',       Icon: HandCoins },
  transfer: { label: 'Virements',  single: 'Virement', desc: 'Transferts internationaux',            Icon: Send },
  trash:    { label: 'Corbeille',  single: 'Commande', desc: 'Commandes masquées — restaurables',    Icon: Trash2, danger: true },
};

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'En attente',     color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
  processing: { label: 'En traitement',  color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  completed:  { label: 'Terminée',       color: 'rgba(255,255,255,0.65)', bg: 'rgba(255,255,255,0.06)' },
  cancelled:  { label: 'Annulée',        color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
  failed:     { label: 'Échouée',        color: '#f87171', bg: 'rgba(248,113,113,0.08)' },
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
  const [zone, setZone] = useState<Zone | null>(null);
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
    const list = zone ? zoneOrders[zone] : [];
    return Array.from(new Set(list.slice(0, 120).map(o => o.user_id)));
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

  // ── Ligne de commande — design unifié, propre, cliquable ────────────────────
  const OrderRow = ({ o }: { o: UnifiedOrder }) => {
    const meta = ZONES[(o.type as Zone)] || ZONES.buy;
    const st = STATUS_META[o.status] || STATUS_META.pending;
    const client = infos[o.user_id]?.full_name || (o.type === 'transfer' ? o.recipient_name : '') || 'Client';
    const isTrash = zone === 'trash';
    return (
      <div className="drill-row"
        style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px', borderBottom: `1px solid ${BORDER}`, cursor: 'pointer' }}
        onClick={() => setDetailOrder(o)}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <meta.Icon size={17} color="rgba(255,255,255,0.75)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{client}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: st.bg, color: st.color }}>{st.label}</span>
          </div>
          <p style={{ color: '#6b7280', fontSize: 12, margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 10.5 }}>TEREX-{o.id.slice(-8).toUpperCase()}</span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {new Date(o.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} {new Date(o.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{Number(o.amount).toLocaleString('fr-FR')} {o.currency}</p>
          <p style={{ color: '#6b7280', fontSize: 11, margin: '2px 0 0' }}>
            {o.type === 'transfer' ? (o.recipient_country || 'Transfert') : `${Number(o.usdt_amount || 0).toLocaleString('fr-FR')} USDT`}
          </p>
        </div>
        {/* Actions secondaires — sans déclencher l'ouverture */}
        {isTrash ? (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button title="Restaurer" onClick={() => restoreFromTrash(o.id)}
              style={{ width: 32, height: 32, borderRadius: 9, background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <RotateCcw size={13} color="rgba(255,255,255,0.7)" />
            </button>
            <button title="Supprimer définitivement" onClick={() => deletePermanently(o.id)}
              style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={13} color="#ef4444" />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            <button title="Mettre à la corbeille" onClick={(e) => { e.stopPropagation(); moveToTrash(o.id); }}
              style={{ width: 32, height: 32, borderRadius: 9, background: 'transparent', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Trash2 size={13} color="rgba(255,255,255,0.35)" />
            </button>
            <ChevronRight size={16} color="rgba(255,255,255,0.25)" />
          </div>
        )}
      </div>
    );
  };

  // ── SOUS-PAGE d'une zone (Achats / Ventes / Virements / Corbeille) ──────────
  if (zone) {
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

    return (
      <>
        <style>{drillStyles}</style>
        <DrillPage
          title={meta.label}
          sub={`${base.length} commande(s) · ${meta.desc}`}
          onBack={() => { setZone(null); setSearchTerm(''); setStatusFilter('all'); }}
          right={
            <button onClick={() => refreshOrders?.()} style={toolBtn}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          }>

          {/* Changer d'espace sans revenir en arrière */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {(['buy', 'sell', 'transfer', 'trash'] as Zone[]).map(z => (
              <SwitchPill key={z} icon={ZONES[z].Icon} label={ZONES[z].label} count={zoneOrders[z].length}
                selected={zone === z} danger={ZONES[z].danger}
                onClick={() => { if (z !== zone) { setZone(z); setStatusFilter('all'); } }} />
            ))}
          </div>

          {/* Recherche */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
            <input
              placeholder="Rechercher : client, référence, adresse…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 13, padding: '12px 16px 12px 42px', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filtres de statut — pilules compactes */}
          {zone !== 'trash' && (
            <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
              {STATUS_FILTERS.map(f => {
                const sel = statusFilter === f.id;
                const count = f.id === 'all' ? base.length : base.filter(o => o.status === f.id).length;
                return (
                  <button key={f.id} onClick={() => setStatusFilter(f.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, whiteSpace: 'nowrap',
                      padding: '7px 13px', borderRadius: 100, cursor: 'pointer', fontSize: 12.5,
                      fontWeight: sel ? 600 : 400, transition: 'all 0.15s',
                      border: `1px solid ${sel ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.14)'}`,
                      background: sel ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.05)',
                      color: sel ? '#fff' : 'rgba(255,255,255,0.55)',
                    }}>
                    {f.label}
                    <span style={{ fontSize: 10.5, opacity: 0.7 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Liste */}
          <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
            {list.length === 0 ? (
              <div style={{ padding: '36px 20px', textAlign: 'center' }}>
                <Inbox size={26} color="#4b5563" style={{ margin: '0 auto 10px' }} />
                <p style={{ color: '#6b7280', fontSize: 13.5, margin: 0 }}>
                  {searchTerm || statusFilter !== 'all' ? 'Aucune commande ne correspond aux filtres.' : `Aucune commande dans ${meta.label.toLowerCase()}.`}
                </p>
              </div>
            ) : (
              list.map(o => <OrderRow key={o.id} o={o} />)
            )}
          </div>
        </DrillPage>
      </>
    );
  }

  // ── HUB — page d'accueil de la section Commandes ─────────────────────────────
  const pendingCount = activeOrders.filter(o => o.status === 'pending').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <style>{drillStyles}</style>

      {/* Vue d'ensemble — une seule bande de chiffres, dense */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>Aperçu</SectionLabel>
        <StatStrip items={[
          { label: 'Commandes actives', value: activeOrders.length },
          { label: 'Clients', value: new Set(activeOrders.map(o => o.user_id)).size },
          { label: 'En attente', value: pendingCount, tone: pendingCount > 0 ? 'warn' : 'default' },
        ]} />
      </div>

      {/* Espaces — grille de tuiles, on RENTRE dans chaque catégorie */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SectionLabel>Espaces de travail</SectionLabel>
        <TileGrid>
          {(['buy', 'sell', 'transfer', 'trash'] as Zone[]).map((z, i) => {
            const meta = ZONES[z];
            const list = zoneOrders[z];
            const waiting = z === 'trash' ? 0 : list.filter(o => o.status === 'pending' || o.status === 'processing').length;
            return (
              <HubTile key={z}
                icon={meta.Icon}
                label={meta.label}
                count={list.length}
                caption={z === 'trash' ? 'restaurables' : waiting > 0 ? `${waiting} à traiter` : 'à jour'}
                urgent={waiting > 0}
                danger={meta.danger}
                delay={0.05 + i * 0.05}
                onClick={() => setZone(z)}
              />
            );
          })}
        </TileGrid>
      </div>

      {/* Outils */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
        <button onClick={() => exportOrdersCSV(orders)} style={toolBtn}><Download size={14} /> CSV</button>
        <button onClick={() => exportOrdersPDF(orders)} style={toolBtn}><Download size={14} /> PDF</button>
        <button onClick={() => refreshOrders?.()} style={toolBtn}><RefreshCw size={14} /> Actualiser</button>
        {isAdmin() && (
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
        )}
      </div>
    </div>
  );
}
