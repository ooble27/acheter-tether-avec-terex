import { useEffect, useMemo, useState } from 'react';
import { useOrders, UnifiedOrder } from '@/hooks/useOrders';
import { useOrderOps } from '@/hooks/useOrderOps';
import { useClientInfos } from '@/hooks/useClientInfos';
import { OrderDetailsPage } from './OrderDetailsPage';
import { Coins, HandCoins, Send, Clock, Hand, User, RefreshCw, Inbox, CheckCircle2 } from 'lucide-react';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

const TYPE_META: Record<string, { label: string; Icon: any }> = {
  buy: { label: 'Achat', Icon: Coins },
  sell: { label: 'Vente', Icon: HandCoins },
  transfer: { label: 'Virement', Icon: Send },
};

function ageOf(iso: string): { text: string; urgent: boolean } {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return { text: `il y a ${mins} min`, urgent: mins >= 30 };
  const h = Math.floor(mins / 60);
  if (h < 24) return { text: `il y a ${h} h ${mins % 60} min`, urgent: true };
  return { text: `il y a ${Math.floor(h / 24)} j`, urgent: true };
}

const STATUS_PILL: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: 'En attente', color: '#fbbf24', bg: 'rgba(251,191,36,0.08)' },
  processing: { label: 'En traitement', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
};

export function OpsQueue() {
  const { orders, loading, updateOrderStatus, refreshOrders } = useOrders();
  const { claimOrder, releaseOrder, currentUserId } = useOrderOps();
  const [detailOrder, setDetailOrder] = useState<UnifiedOrder | null>(null);

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

  // KPIs du jour
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const completedToday = (orders || []).filter(o =>
    !o.is_deleted && o.status === 'completed' &&
    new Date(o.processed_at || o.updated_at).getTime() >= todayStart.getTime()
  ).length;
  const oldest = unassigned[0] ? ageOf(unassigned[0].created_at) : null;

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
      />
    );
  }

  const OrderCard = ({ o, zone }: { o: UnifiedOrder; zone: 'mine' | 'queue' | 'others' }) => {
    const t = TYPE_META[o.type] || TYPE_META.buy;
    const age = ageOf(o.created_at);
    const pill = STATUS_PILL[o.status] || STATUS_PILL.pending;
    const ref = `TEREX-${o.id.slice(-8).toUpperCase()}`;
    const client = nameOf(o.user_id) || 'Client';
    const owner = nameOf(o.assigned_to);

    return (
      <div style={{ background: CARD, border: `1px solid ${zone === 'mine' ? 'rgba(255,255,255,0.18)' : BORDER}`, borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <t.Icon size={18} color="rgba(255,255,255,0.75)" />
        </div>

        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{t.label}</span>
            <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 11, color: '#6b7280' }}>{ref}</span>
            <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: pill.bg, color: pill.color }}>{pill.label}</span>
          </div>
          <p style={{ color: '#9ca3af', fontSize: 12.5, margin: '3px 0 0' }}>
            {Number(o.amount).toLocaleString('fr-FR')} {o.currency} → {Number(o.usdt_amount || 0).toLocaleString('fr-FR')} USDT
            <span style={{ color: '#4b5563' }}> · </span>{client}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: age.urgent ? '#f87171' : '#6b7280', flexShrink: 0 }}>
          <Clock size={13} /> {age.text}
        </div>

        {/* Propriétaire / action */}
        {zone === 'others' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, color: '#fbbf24', background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 999, padding: '5px 12px', flexShrink: 0 }}>
            <User size={12} /> {owner || 'Un collègue'}
          </span>
        )}
        {zone === 'queue' && (
          <button onClick={async () => { if (await claimOrder(o.id, o.type)) refreshOrders?.(); }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            <Hand size={14} /> Prendre en charge
          </button>
        )}
        {zone === 'mine' && (
          <button onClick={async () => { if (await releaseOrder(o.id, o.type)) refreshOrders?.(); }}
            style={{ background: '#2d2d2d', color: '#9ca3af', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            Libérer
          </button>
        )}
        <button onClick={() => setDetailOrder(o)}
          style={{ background: zone === 'mine' ? '#fff' : '#2d2d2d', color: zone === 'mine' ? '#141414' : '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
          {zone === 'mine' ? 'Traiter' : 'Ouvrir'}
        </button>
      </div>
    );
  };

  const Section = ({ title, sub, items, zone, emptyText }: { title: string; sub?: string; items: UnifiedOrder[]; zone: 'mine' | 'queue' | 'others'; emptyText: string }) => (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, margin: '0 0 10px 2px' }}>
        <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{title}</p>
        <span style={{ fontSize: 12, color: '#6b7280' }}>{items.length}{sub ? ` · ${sub}` : ''}</span>
      </div>
      {items.length === 0 ? (
        <div style={{ border: `1px dashed ${BORDER}`, borderRadius: 14, padding: '18px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <CheckCircle2 size={16} color="#4b5563" />
          <span style={{ color: '#6b7280', fontSize: 13 }}>{emptyText}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(o => <OrderCard key={o.id} o={o} zone={zone} />)}
        </div>
      )}
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Inbox size={18} color="rgba(255,255,255,0.75)" />
          </div>
          <div>
            <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>File d'attente des opérations</p>
            <p style={{ color: '#6b7280', fontSize: 12.5, margin: 0 }}>Prenez une commande en charge avant de la traiter — elle se verrouille pour le reste de l'équipe.</p>
          </div>
        </div>
        <button onClick={() => refreshOrders?.()} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* KPIs — l'état des opérations en un coup d'œil */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        {[
          { label: 'À traiter', value: unassigned.length, accent: unassigned.length > 0 },
          { label: 'Mes commandes', value: mine.length, accent: false },
          { label: "Par l'équipe", value: others.length, accent: false },
          { label: "Terminées aujourd'hui", value: completedToday, accent: false },
        ].map(k => (
          <div key={k.label} style={{ background: CARD, border: `1px solid ${k.accent ? 'rgba(251,191,36,0.3)' : BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>{k.label}</p>
            <p style={{ color: k.accent ? '#fbbf24' : '#fff', fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1 }}>{k.value}</p>
          </div>
        ))}
        {oldest && (
          <div style={{ background: CARD, border: `1px solid ${oldest.urgent ? 'rgba(248,113,113,0.3)' : BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
            <p style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Plus ancienne en file</p>
            <p style={{ color: oldest.urgent ? '#f87171' : '#fff', fontSize: 16, fontWeight: 700, margin: 0, lineHeight: 1.2 }}>{oldest.text}</p>
          </div>
        )}
      </div>

      <Section title="Mes commandes" sub="je les traite" items={mine} zone="mine"
        emptyText="Aucune commande en charge — prenez-en une dans la file d'attente." />
      <Section title="File d'attente" sub="libres, du plus ancien au plus récent" items={unassigned} zone="queue"
        emptyText="File vide — toutes les commandes actives sont prises en charge. 🎉" />
      <Section title="En cours par l'équipe" items={others} zone="others"
        emptyText="Aucune commande traitée par un autre membre." />
    </div>
  );
}
