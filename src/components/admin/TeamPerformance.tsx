import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Trophy, RefreshCw, Users, CheckCircle2, Coins, TrendingUp } from 'lucide-react';
import { StatStrip, SectionLabel, drillStyles } from '@/components/admin/AdminDrill';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

type Period = 'today' | '7d' | '30d' | 'all';

const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: 'all', label: 'Tout' },
];

interface CompletedEvent {
  order_id: string;
  actor_id: string | null;
  actor_name: string | null;
  action: string;
  created_at: string;
}

interface OrderLite {
  id: string;
  amount: number;
  currency: string;
  usdt_amount: number;
  type: string;
}

interface OperatorStats {
  actorId: string;
  name: string;
  completed: number;
  claims: number;
  volumeCfa: number;
  volumeUsdt: number;
}

function periodStart(p: Period): number {
  const now = new Date();
  if (p === 'today') { now.setHours(0, 0, 0, 0); return now.getTime(); }
  if (p === '7d') return Date.now() - 7 * 24 * 3600 * 1000;
  if (p === '30d') return Date.now() - 30 * 24 * 3600 * 1000;
  return 0;
}

/**
 * Performance de l'équipe — réservé à l'administrateur complet (owner).
 * Source de vérité : le journal d'activité (order_events). Chaque commande
 * « Terminée » est attribuée à l'opérateur qui a effectué l'action, avec le
 * volume correspondant. Base des primes / dividendes / suivi de performance.
 */
export function TeamPerformance() {
  const [period, setPeriod] = useState<Period>('30d');
  const [events, setEvents] = useState<CompletedEvent[]>([]);
  const [ordersById, setOrdersById] = useState<Map<string, OrderLite>>(new Map());
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data: ev } = await (supabase as any)
        .from('order_events')
        .select('order_id, actor_id, actor_name, action, created_at')
        .in('action', ['status_completed', 'claimed'])
        .order('created_at', { ascending: false })
        .limit(5000);
      setEvents((ev as CompletedEvent[]) || []);

      const ids = Array.from(new Set(((ev as CompletedEvent[]) || []).map(e => e.order_id)));
      const map = new Map<string, OrderLite>();
      // Récupération par lots (le .in() a une limite raisonnable)
      for (let i = 0; i < ids.length; i += 200) {
        const batch = ids.slice(i, i + 200);
        const { data: ords } = await supabase
          .from('orders')
          .select('id, amount, currency, usdt_amount, type')
          .in('id', batch);
        for (const o of ords || []) {
          map.set((o as any).id, {
            id: (o as any).id,
            amount: Number((o as any).amount || 0),
            currency: (o as any).currency || 'CFA',
            usdt_amount: Number((o as any).usdt_amount || 0),
            type: (o as any).type,
          });
        }
      }
      setOrdersById(map);
    } catch (e) {
      console.error('TeamPerformance load:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const { stats, totals } = useMemo(() => {
    const start = periodStart(period);
    const byActor = new Map<string, OperatorStats>();
    // Une commande ne compte qu'une fois même si le statut a été rejoué
    const countedCompleted = new Set<string>();

    for (const ev of events) {
      if (new Date(ev.created_at).getTime() < start) continue;
      const actorId = ev.actor_id || 'inconnu';
      let s = byActor.get(actorId);
      if (!s) {
        s = { actorId, name: ev.actor_name || 'Opérateur', completed: 0, claims: 0, volumeCfa: 0, volumeUsdt: 0 };
        byActor.set(actorId, s);
      }
      if (ev.action === 'claimed') s.claims++;
      if (ev.action === 'status_completed' && !countedCompleted.has(ev.order_id)) {
        countedCompleted.add(ev.order_id);
        s.completed++;
        const o = ordersById.get(ev.order_id);
        if (o) { s.volumeCfa += o.amount; s.volumeUsdt += o.usdt_amount; }
      }
    }

    const list = Array.from(byActor.values())
      .filter(s => s.completed > 0 || s.claims > 0)
      .sort((a, b) => b.completed - a.completed || b.volumeCfa - a.volumeCfa);

    const totals = {
      completed: list.reduce((n, s) => n + s.completed, 0),
      volumeCfa: list.reduce((n, s) => n + s.volumeCfa, 0),
      volumeUsdt: list.reduce((n, s) => n + s.volumeUsdt, 0),
      members: list.length,
    };
    return { stats: list, totals };
  }, [events, ordersById, period]);

  const fmt = (n: number) => n.toLocaleString('fr-FR');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Période + rafraîchir */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4 }}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              style={{
                padding: '7px 14px', borderRadius: 9, cursor: 'pointer', fontSize: 12.5, fontWeight: 600,
                background: period === p.id ? '#fff' : 'transparent',
                color: period === p.id ? '#141414' : '#9ca3af', border: 'none', transition: 'all 0.15s ease',
              }}>
              {p.label}
            </button>
          ))}
        </div>
        <button onClick={load} disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#2d2d2d', color: '#fff', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
        </button>
      </div>

      {/* Totaux de la période — une seule bande de chiffres */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <style>{drillStyles}</style>
        <SectionLabel>Totaux de la période</SectionLabel>
        <StatStrip items={[
          { label: 'Commandes terminées', value: fmt(totals.completed) },
          { label: 'Volume traité', value: `${fmt(totals.volumeCfa)} CFA` },
          { label: 'USDT échangés', value: `${fmt(Math.round(totals.volumeUsdt))} USDT` },
          { label: 'Membres actifs', value: fmt(totals.members) },
        ]} />
      </div>

      {/* Classement par opérateur */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 18px', borderBottom: `1px solid ${BORDER}` }}>
          <Trophy size={16} color="rgba(255,255,255,0.7)" />
          <p style={{ color: '#fff', fontSize: 14, fontWeight: 700, margin: 0 }}>Classement de l'équipe</p>
          <span style={{ color: '#6b7280', fontSize: 12 }}>par commandes terminées</span>
        </div>

        {loading ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 18px', margin: 0 }}>Chargement…</p>
        ) : stats.length === 0 ? (
          <div style={{ padding: '24px 18px' }}>
            <p style={{ color: '#9ca3af', fontSize: 13.5, margin: '0 0 4px' }}>Aucune activité sur cette période.</p>
            <p style={{ color: '#6b7280', fontSize: 12, margin: 0 }}>
              Les statistiques se construisent à partir du journal d'activité : chaque commande terminée est attribuée au membre qui l'a traitée.
            </p>
          </div>
        ) : (
          <div>
            {stats.map((s, i) => {
              const share = totals.completed > 0 ? Math.round((s.completed / totals.completed) * 100) : 0;
              const metric = (value: string, label: string, dim = false) => (
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: dim ? '#9ca3af' : '#fff', fontSize: 14, fontWeight: 700, margin: 0, whiteSpace: 'nowrap' }}>{value}</p>
                  <p style={{ color: '#6b7280', fontSize: 10.5, margin: '1px 0 0' }}>{label}</p>
                </div>
              );
              return (
                <div key={s.actorId} style={{ padding: '14px 16px', borderBottom: i < stats.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                  {/* Ligne identité : rang + avatar + nom + part */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ width: 20, textAlign: 'center', color: i === 0 ? '#fff' : '#6b7280', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2d2d2d', border: `1px solid rgba(255,255,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                      {(s.name || 'O').slice(0, 1).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</p>
                        {i === 0 && stats.length > 1 && <Trophy size={13} color="rgba(255,255,255,0.6)" style={{ flexShrink: 0 }} />}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 5 }}>
                        <div style={{ flex: 1, maxWidth: 240, height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${share}%`, height: '100%', background: 'rgba(255,255,255,0.55)', borderRadius: 2 }} />
                        </div>
                        <span style={{ color: '#6b7280', fontSize: 11, flexShrink: 0 }}>{share}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Chiffres : grille régulière (2 col mobile, 4 col desktop), alignée sous le nom */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: '10px 16px', marginTop: 12, paddingLeft: 46 }}>
                    {metric(fmt(s.completed), 'terminées')}
                    {metric(`${fmt(s.volumeCfa)}`, 'volume CFA')}
                    {metric(fmt(Math.round(s.volumeUsdt)), 'USDT')}
                    {metric(fmt(s.claims), 'prises en charge', true)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p style={{ color: '#4b5563', fontSize: 11.5, margin: 0 }}>
        Les données proviennent du journal d'activité (infalsifiable) et commencent à la mise en place du système de prise en charge.
        Une commande terminée est attribuée au membre qui a effectué l'action « Marquée Terminée ».
      </p>
    </div>
  );
}
