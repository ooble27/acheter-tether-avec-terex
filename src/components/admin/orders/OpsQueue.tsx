import { useEffect, useMemo, useState } from 'react';
import { UnifiedOrder } from '@/hooks/useOrders';
import { useOrdersData } from '@/components/admin/OrdersDataProvider';
import { useOrderOps } from '@/hooks/useOrderOps';
import { useClientInfos } from '@/hooks/useClientInfos';
import { OrderDetailsPage } from './OrderDetailsPage';
import { Coins, HandCoins, Send, Clock, Hand, User, RefreshCw, Inbox, CheckCircle2 } from 'lucide-react';
import { PageHeader, Tabs, StatusText, Avatar, drillStyles } from '@/components/admin/AdminDrill';

const BORDER = 'rgba(255,255,255,0.07)';

const TYPE_META: Record<string, { label: string; Icon: any }> = {
  buy: { label: 'Achat', Icon: Coins },
  sell: { label: 'Vente', Icon: HandCoins },
  transfer: { label: 'Virement', Icon: Send },
};

// Ancienneté COURTE : « 16 min », « 3 h », « 16 j » (sans « il y a »).
function ageOf(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h} h`;
  return `${Math.floor(h / 24)} j`;
}

export function OpsQueue() {
  const { orders, loading, updateOrderStatus, refreshOrders, moveToTrash } = useOrdersData();
  const { claimOrder, releaseOrder, currentUserId } = useOrderOps();
  const [detailOrder, setDetailOrder] = useState<UnifiedOrder | null>(null);
  const [tab, setTab] = useState<'queue' | 'mine' | 'others'>('queue');

  // Rafraîchissement automatique — les prises en charge des collègues
  // apparaissent sans recharger la page.
  useEffect(() => {
    const t = setInterval(() => { refreshOrders?.(); }, 15000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = useMemo(
    () => (orders || [])
      .filter(o => !o.is_deleted && (o.status === 'pending' || o.status === 'processing'))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [orders]
  );

  const mine = active.filter(o => o.assigned_to && o.assigned_to === currentUserId);
  const unassigned = active.filter(o => !o.assigned_to);
  const others = active.filter(o => o.assigned_to && o.assigned_to !== currentUserId);

  // Noms : clients + opérateurs (même fonction admin get-client-infos)
  const nameIds = useMemo(() => {
    const ids = new Set<string>();
    for (const o of active) { ids.add(o.user_id); if (o.assigned_to) ids.add(o.assigned_to); }
    return Array.from(ids);
  }, [active]);
  const infos = useClientInfos(nameIds);
  const nameOf = (id?: string | null) => (id && infos[id]?.full_name) || null;

  if (detailOrder) {
    return (
      <OrderDetailsPage
        order={orders.find(o => o.id === detailOrder.id) || detailOrder}
        onBack={() => { setDetailOrder(null); refreshOrders?.(); }}
        onStatusUpdate={updateOrderStatus}
        onArchive={(id) => moveToTrash(id)}
      />
    );
  }

  const TABS = {
    queue:  { items: unassigned, empty: "File vide — toutes les commandes actives sont prises en charge." },
    mine:   { items: mine,       empty: "Aucune commande en charge — prenez-en une dans la file d'attente." },
    others: { items: others,     empty: "Aucune commande traitée par un autre membre." },
  } as const;
  const list = TABS[tab].items;

  // ── Ligne de table ──────────────────────────────────────────────────────────
  const OrderRow = ({ o }: { o: UnifiedOrder }) => {
    const t = TYPE_META[o.type] || TYPE_META.buy;
    const age = ageOf(o.created_at);
    const client = nameOf(o.user_id) || 'Client';
    const owner = nameOf(o.assigned_to);

    return (
      <div className="crm-row cols-orders">
        {/* Client — nom seul (mobile : rien d'autre) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <Avatar name={client} />
          <div style={{ minWidth: 0 }}>
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{client}</p>
            {/* Référence : desktop/tablette seulement */}
            <p className="only-d" style={{ color: '#6b7280', fontSize: 11, margin: '1px 0 0', fontFamily: 'ui-monospace,Menlo,monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              TEREX-{o.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Type (desktop) */}
        <div className="only-d" style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <t.Icon size={13} color="rgba(255,255,255,0.45)" />
          <span style={{ color: '#9ca3af', fontSize: 12.5, whiteSpace: 'nowrap' }}>{t.label}</span>
        </div>

        {/* Montant (desktop) / Ancienneté (mobile) — même emplacement */}
        <div style={{ minWidth: 0, textAlign: 'right' }}>
          <div className="only-d">
            <p style={{ color: '#fff', fontSize: 13, fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>{Number(o.amount).toLocaleString('fr-FR')} {o.currency}</p>
            <p style={{ color: '#6b7280', fontSize: 11, margin: '1px 0 0', whiteSpace: 'nowrap' }}>{Number(o.usdt_amount || 0).toLocaleString('fr-FR')} USDT</p>
          </div>
          <span className="only-m" style={{ display: 'inline-flex', gap: 5, alignItems: 'center', justifyContent: 'flex-end', fontSize: 12.5, color: '#9ca3af', whiteSpace: 'nowrap' }}>
            <Clock size={12} color="rgba(255,255,255,0.4)" /> {age}
          </span>
        </div>

        {/* Âge / propriétaire (desktop) */}
        <div className="only-d" style={{ minWidth: 0 }}>
          {tab === 'others' && owner ? (
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>
              <User size={12} color="rgba(255,255,255,0.4)" /> {owner}
            </span>
          ) : (
            <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontSize: 12, color: '#6b7280', whiteSpace: 'nowrap' }}>
              <Clock size={12} /> {age}
            </span>
          )}
        </div>

        {/* État de la commande (desktop) */}
        <div className="only-d" style={{ minWidth: 0 }}>
          <StatusText status={o.status} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'flex-end' }}>
          {tab === 'queue' && (
            <button onClick={async () => { if (await claimOrder(o.id, o.type)) refreshOrders?.(); }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#141414', border: 'none', borderRadius: 9, padding: '7px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              <Hand size={13} /> Prendre
            </button>
          )}
          {tab === 'mine' && (
            <>
              <button className="only-d" onClick={async () => { if (await releaseOrder(o.id, o.type)) refreshOrders?.(); }}
                style={{ background: '#2d2d2d', color: '#9ca3af', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 11px', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Libérer
              </button>
              <button onClick={() => setDetailOrder(o)}
                style={{ background: '#fff', color: '#141414', border: 'none', borderRadius: 9, padding: '7px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Traiter
              </button>
            </>
          )}
          {tab === 'others' && (
            <button onClick={() => setDetailOrder(o)}
              style={{ background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 9, padding: '7px 12px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Ouvrir
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>

      <PageHeader
        title="File de traitement"
        sub="Prenez une commande en charge avant de la traiter — elle se verrouille pour l'équipe."
        right={
          <button className="ghost-btn" onClick={() => refreshOrders?.()} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        }
      />

      {/* Onglets — mise à jour en temps réel, les compteurs suffisent */}
      <Tabs
        tabs={[
          { id: 'queue', label: "File d'attente", count: unassigned.length },
          { id: 'mine', label: 'Mes commandes', count: mine.length },
          { id: 'others', label: "Par l'équipe", count: others.length },
        ]}
        active={tab}
        onChange={(id) => setTab(id as typeof tab)}
      />

      {/* Table */}
      <div className="crm-table crm-fade">
        <div className="crm-thead cols-orders">
          <span className="crm-th">Client</span>
          <span className="crm-th">Type</span>
          <span className="crm-th" style={{ textAlign: 'right' }}>Montant</span>
          <span className="crm-th">{tab === 'others' ? 'Traitée par' : 'Ancienneté'}</span>
          <span className="crm-th">État</span>
          <span className="crm-th" />
        </div>
        {list.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            {tab === 'queue'
              ? <CheckCircle2 size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
              : tab === 'mine'
                ? <Inbox size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />
                : <User size={24} color="#4b5563" style={{ margin: '0 auto 10px' }} />}
            <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{TABS[tab].empty}</p>
          </div>
        ) : (
          list.map(o => <OrderRow key={o.id} o={o} />)
        )}
      </div>
    </div>
  );
}
