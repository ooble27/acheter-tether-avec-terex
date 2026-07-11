import { useMemo, useState } from 'react';
import { useOrders, UnifiedOrder } from '@/hooks/useOrders';
import { format, subMonths, startOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  TrendingUp, Coins, CheckCircle2, Wallet, RefreshCw, Info,
  HandCoins, Send, BarChart3,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StatPill, SectionLabel, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

type Period = 'today' | '7d' | 'month' | 'all';
const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: '7d', label: '7 jours' },
  { id: 'month', label: 'Ce mois' },
  { id: 'all', label: 'Tout' },
];

function periodStart(p: Period): number {
  const now = new Date();
  if (p === 'today') { now.setHours(0, 0, 0, 0); return now.getTime(); }
  if (p === '7d') return Date.now() - 7 * 24 * 3600 * 1000;
  if (p === 'month') { return startOfMonth(new Date()).getTime(); }
  return 0;
}

/**
 * Revenu estimé par commande, selon les règles de prix de la plateforme :
 * - ACHAT  : le client paie au taux marché +2 %  → marge ≈ montant × 0,02 / 1,02
 * - VENTE  : Terex rachète à (marché − 10 CFA)   → marge ≈ USDT × 10 CFA
 * - VIREMENT : frais facturés sur le transfert
 */
function revenueOf(o: UnifiedOrder): number {
  if (o.type === 'buy') return Number(o.amount || 0) * (0.02 / 1.02);
  if (o.type === 'sell') return Number(o.usdt_amount || 0) * 10;
  return Number((o as any).fees || 0);
}

const TYPE_META: Record<string, { label: string; Icon: any }> = {
  buy: { label: 'Achat', Icon: Coins },
  sell: { label: 'Vente', Icon: HandCoins },
  transfer: { label: 'Virement', Icon: Send },
};

/**
 * Comptabilité — construite sur les VRAIES données de la plateforme
 * (commandes terminées). Plus aucune saisie manuelle : chaque chiffre
 * vient de la base, impossible à falsifier ou à oublier.
 */
export function AccountingAdmin() {
  const { orders, loading, refreshOrders } = useOrders();
  const [period, setPeriod] = useState<Period>('month');

  const completed = useMemo(
    () => (orders || []).filter(o => !o.is_deleted && o.status === 'completed'),
    [orders]
  );

  // — Période sélectionnée —
  const inPeriod = useMemo(() => {
    const start = periodStart(period);
    return completed.filter(o => new Date(o.processed_at || o.updated_at || o.created_at).getTime() >= start);
  }, [completed, period]);

  const kpis = useMemo(() => {
    const volume = inPeriod.reduce((s, o) => s + Number(o.amount || 0), 0);
    const revenue = inPeriod.reduce((s, o) => s + revenueOf(o), 0);
    const usdt = inPeriod.reduce((s, o) => s + Number(o.usdt_amount || 0), 0);
    return { volume, revenue, usdt, count: inPeriod.length };
  }, [inPeriod]);

  // — Répartition par type (période) —
  const byType = useMemo(() => (['buy', 'sell', 'transfer'] as const).map(t => {
    const rows = inPeriod.filter(o => o.type === t);
    return {
      type: t,
      count: rows.length,
      volume: rows.reduce((s, o) => s + Number(o.amount || 0), 0),
      revenue: rows.reduce((s, o) => s + revenueOf(o), 0),
    };
  }), [inPeriod]);

  // — 6 derniers mois (toutes commandes terminées, indépendant du filtre) —
  const monthly = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i);
      const key = format(d, 'yyyy-MM');
      const rows = completed.filter(o => format(new Date(o.processed_at || o.updated_at || o.created_at), 'yyyy-MM') === key);
      return {
        mois: format(d, 'MMM', { locale: fr }),
        Volume: Math.round(rows.reduce((s, o) => s + Number(o.amount || 0), 0)),
        Revenus: Math.round(rows.reduce((s, o) => s + revenueOf(o), 0)),
      };
    });
  }, [completed]);

  // — Dernières commandes terminées —
  const recent = useMemo(
    () => [...inPeriod]
      .sort((a, b) => new Date(b.processed_at || b.updated_at).getTime() - new Date(a.processed_at || a.updated_at).getTime())
      .slice(0, 15),
    [inPeriod]
  );

  const fmt = (n: number) => Math.round(n).toLocaleString('fr-FR');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Période + actualiser */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, overflowX: 'auto' }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              style={{
                padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
                background: period === p.id ? '#fff' : 'transparent',
                color: period === p.id ? '#141414' : '#9ca3af', border: 'none', transition: 'all 0.15s ease',
              }}>
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={() => refreshOrders?.()} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* KPIs réels — chiffres compacts, dimensionnés à leur contenu */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <style>{drillStyles}</style>
        <SectionLabel>Chiffres de la période</SectionLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <StatPill icon={TrendingUp} value={`${fmt(kpis.volume)} CFA`} label="volume traité" delay={0} />
          <StatPill icon={Wallet} value={`${fmt(kpis.revenue)} CFA`} label="revenus estimés" delay={0.04} />
          <StatPill icon={CheckCircle2} value={fmt(kpis.count)} label="commandes terminées" delay={0.08} />
          <StatPill icon={Coins} value={fmt(kpis.usdt)} label="USDT échangés" delay={0.12} />
        </div>
      </div>

      {/* Répartition par activité */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
        {byType.map(({ type, count, volume, revenue }) => {
          const meta = TYPE_META[type];
          return (
            <div key={type} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <meta.Icon size={18} color="rgba(255,255,255,0.75)" />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>{meta.label}s <span style={{ color: '#6b7280', fontWeight: 500 }}>· {count}</span></p>
                <p style={{ color: '#9ca3af', fontSize: 12, margin: '3px 0 0' }}>{fmt(volume)} CFA · <span style={{ color: '#fff' }}>{fmt(revenue)} CFA</span> de revenus</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Graphique 6 mois */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <BarChart3 size={16} color="rgba(255,255,255,0.7)" />
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Volume & revenus — 6 derniers mois</p>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={monthly} margin={{ top: 4, right: 8, left: -6, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="mois" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v: number) => (v >= 1000000 ? `${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
              <Tooltip
                contentStyle={{ background: '#1e1e1e', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 12, color: '#fff' }}
                formatter={(value: any, name: any) => [`${Number(value).toLocaleString('fr-FR')} CFA`, name]}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: '#9ca3af' }} />
              <Bar dataKey="Volume" fill="rgba(255,255,255,0.35)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="Revenus" fill="rgba(255,255,255,0.85)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dernières commandes terminées */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Dernières commandes terminées <span style={{ color: '#6b7280', fontWeight: 500 }}>· {recent.length}</span></p>
        </div>
        {recent.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Aucune commande terminée sur cette période.</p>
        ) : (
          recent.map((o, i) => {
            const meta = TYPE_META[o.type] || TYPE_META.buy;
            return (
              <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 18px', borderBottom: i < recent.length - 1 ? `1px solid ${BORDER}` : 'none', flexWrap: 'wrap' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <meta.Icon size={15} color="rgba(255,255,255,0.7)" />
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0 }}>
                    {meta.label} <span style={{ fontFamily: 'ui-monospace,Menlo,monospace', fontSize: 11, color: '#6b7280' }}>TEREX-{o.id.slice(-8).toUpperCase()}</span>
                  </p>
                  <p style={{ color: '#6b7280', fontSize: 11.5, margin: '2px 0 0' }}>
                    {format(new Date(o.processed_at || o.updated_at), "d MMM yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>{fmt(Number(o.amount || 0))} {o.currency}</p>
                  <p style={{ color: '#9ca3af', fontSize: 11, margin: '2px 0 0' }}>+{fmt(revenueOf(o))} CFA de marge</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Méthodologie */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px 16px' }}>
        <Info size={15} color="#6b7280" style={{ flexShrink: 0, marginTop: 1 }} />
        <p style={{ color: '#6b7280', fontSize: 12, margin: 0, lineHeight: 1.65 }}>
          Chiffres calculés en direct depuis les commandes terminées de la plateforme — aucune saisie manuelle.
          Revenus estimés selon vos règles de prix : achats ≈ 2 % de marge, ventes ≈ 10 CFA par USDT racheté, virements = frais facturés.
        </p>
      </div>
    </div>
  );
}
