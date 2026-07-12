import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClientInfos } from '@/hooks/useClientInfos';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RefreshCw, Clock, Info } from 'lucide-react';
import { PageHeader, StatStrip, Avatar, drillStyles } from '@/components/admin/AdminDrill';
import type { Shift } from '@/hooks/useStaffShifts';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

type Period = 'today' | '7d' | '30d';
const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
];

function periodStart(p: Period): number {
  const d = new Date();
  if (p === 'today') { d.setHours(0, 0, 0, 0); return d.getTime(); }
  if (p === '7d') return Date.now() - 7 * 864e5;
  return Date.now() - 30 * 864e5;
}

function minutesOf(s: Shift): number {
  const end = s.clock_out ? new Date(s.clock_out).getTime() : Date.now();
  return Math.max(0, Math.floor((end - new Date(s.clock_in).getTime()) / 60000));
}
function fmtMins(m: number): string {
  const h = Math.floor(m / 60);
  return h > 0 ? `${h} h ${m % 60} min` : `${m} min`;
}

/**
 * Présences de l'équipe (owner only) : qui est en service, heures pointées
 * par membre sur la période — base de calcul pour la paie.
 */
export function StaffAttendance() {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('7d');

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('staff_shifts')
      .select('id, user_id, actor_name, clock_in, clock_out')
      .gte('clock_in', new Date(periodStart(period)).toISOString())
      .order('clock_in', { ascending: false });
    if (error) {
      const missing = error.code === '42P01' || (error.message || '').toLowerCase().includes('does not exist') || (error.message || '').toLowerCase().includes('schema cache');
      setAvailable(!missing);
      setShifts([]);
    } else {
      setAvailable(true);
      setShifts((data as Shift[]) || []);
    }
    setLoading(false);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [period]);

  const userIds = useMemo(() => Array.from(new Set(shifts.map(s => s.user_id))), [shifts]);
  const infos = useClientInfos(userIds);
  const nameOf = (s: Shift) => infos[s.user_id]?.full_name || s.actor_name || 'Membre';

  const online = shifts.filter(s => !s.clock_out);
  const byUser = useMemo(() => {
    const map = new Map<string, { userId: string; name: string; minutes: number; count: number; shifts: Shift[] }>();
    for (const s of shifts) {
      const key = s.user_id;
      const cur = map.get(key) || { userId: key, name: nameOf(s), minutes: 0, count: 0, shifts: [] };
      cur.minutes += minutesOf(s);
      cur.count += 1;
      cur.name = nameOf(s);
      cur.shifts.push(s);
      map.set(key, cur);
    }
    return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, infos]);

  const totalMinutes = byUser.reduce((s, u) => s + u.minutes, 0);

  if (available === false) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <style>{drillStyles}</style>
        <PageHeader title="Présences" sub="Pointage horaire de l'équipe" />
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px 18px' }}>
          <Info size={16} color="#6b7280" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: '0 0 4px' }}>Fonctionnalité à activer</p>
            <p style={{ color: '#9ca3af', fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
              Le pointage nécessite une table en base de données. Fais exécuter à Lovable la migration
              <span style={{ color: '#fff', fontFamily: 'ui-monospace,Menlo,monospace' }}> staff_shifts</span>, puis les boutons « Pointer l'arrivée / sortie » apparaîtront pour l'équipe et les heures s'afficheront ici.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <style>{drillStyles}</style>
      <PageHeader title="Présences" sub="Heures pointées par membre — base de calcul de la paie"
        right={
          <button className="ghost-btn" onClick={load} disabled={loading}>
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
          </button>
        }
      />

      {/* Sélecteur de période (segmenté) */}
      <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {PERIODS.map(p => {
          const sel = period === p.id;
          return (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              style={{ padding: '8px 16px', borderRadius: 9, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: sel ? 600 : 400, background: sel ? '#2d2d2d' : 'transparent', color: sel ? '#fff' : '#9ca3af', whiteSpace: 'nowrap' }}>
              {p.label}
            </button>
          );
        })}
      </div>

      <StatStrip items={[
        { label: 'En service', value: online.length, tone: online.length > 0 ? 'default' : 'default' },
        { label: 'Membres actifs', value: byUser.length },
        { label: 'Total pointé', value: fmtMins(totalMinutes) },
        { label: 'Pointages', value: shifts.length },
      ]} />

      {/* En service maintenant */}
      {online.length > 0 && (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '13px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80' }} />
            <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>En service maintenant <span style={{ color: '#6b7280', fontWeight: 500 }}>· {online.length}</span></p>
          </div>
          {online.map((s, i) => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < online.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <Avatar name={nameOf(s)} size={32} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 600, margin: 0 }}>{nameOf(s)}</p>
                <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0' }}>Arrivé à {format(new Date(s.clock_in), 'HH:mm', { locale: fr })}</p>
              </div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#4ade80', fontSize: 12.5, fontWeight: 600 }}>
                <Clock size={13} /> {fmtMins(minutesOf(s))}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Heures par membre */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: `1px solid ${BORDER}` }}>
          <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>Heures par membre</p>
        </div>
        {loading ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 16px', margin: 0 }}>Chargement…</p>
        ) : byUser.length === 0 ? (
          <p style={{ color: '#6b7280', fontSize: 13, padding: '20px 16px', margin: 0 }}>Aucun pointage sur cette période.</p>
        ) : (
          byUser.map((u, i) => (
            <details key={u.userId} style={{ borderBottom: i < byUser.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
              <summary style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', cursor: 'pointer', listStyle: 'none' }}>
                <Avatar name={u.name} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: '#fff', fontSize: 14, fontWeight: 600, margin: 0 }}>{u.name}</p>
                  <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0' }}>{u.count} pointage(s)</p>
                </div>
                <span style={{ color: '#fff', fontSize: 15, fontWeight: 700 }}>{fmtMins(u.minutes)}</span>
              </summary>
              <div style={{ padding: '0 16px 10px 62px' }}>
                {u.shifts.map(s => (
                  <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderTop: `1px solid ${BORDER}` }}>
                    <span style={{ color: '#9ca3af', fontSize: 12.5 }}>
                      {format(new Date(s.clock_in), 'EEE d MMM', { locale: fr })}
                      <span style={{ color: '#6b7280' }}> · {format(new Date(s.clock_in), 'HH:mm')} → {s.clock_out ? format(new Date(s.clock_out), 'HH:mm') : '…'}</span>
                    </span>
                    <span style={{ color: s.clock_out ? '#fff' : '#4ade80', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtMins(minutesOf(s))}</span>
                  </div>
                ))}
              </div>
            </details>
          ))
        )}
      </div>

      <p style={{ color: '#4b5563', fontSize: 11.5, margin: 0 }}>
        Les heures proviennent des pointages arrivée/sortie de chaque membre. Un pointage encore ouvert compte jusqu'à maintenant.
      </p>
    </div>
  );
}
