import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useClientInfos } from '@/hooks/useClientInfos';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import { RefreshCw, Clock, Info, Download } from 'lucide-react';
import { PageHeader, StatStrip, Avatar, drillStyles } from '@/components/admin/AdminDrill';
import type { Shift } from '@/hooks/useStaffShifts';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

type Period = 'today' | '7d' | '30d' | '90d';
const PERIODS: { id: Period; label: string }[] = [
  { id: 'today', label: "Aujourd'hui" },
  { id: '7d', label: '7 jours' },
  { id: '30d', label: '30 jours' },
  { id: '90d', label: '3 mois' },
];

function periodStart(p: Period): number {
  const d = new Date();
  if (p === 'today') { d.setHours(0, 0, 0, 0); return d.getTime(); }
  if (p === '7d') return Date.now() - 7 * 864e5;
  if (p === '30d') return Date.now() - 30 * 864e5;
  return Date.now() - 90 * 864e5;
}

function minutesOf(s: Shift): number {
  const end = s.clock_out ? new Date(s.clock_out).getTime() : Date.now();
  return Math.max(0, Math.floor((end - new Date(s.clock_in).getTime()) / 60000));
}
function fmtMins(m: number): string {
  const h = Math.floor(m / 60);
  return h > 0 ? `${h} h ${m % 60} min` : `${m} min`;
}
// Heures DÉCIMALES pour la paie : 90 min → « 1,50 h » (taux horaire × heures).
function decimalHours(m: number): string {
  return (m / 60).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
// Semaine calendaire lundi → dimanche (norme paie).
function weekInfo(iso: string): { key: string; label: string; start: number } {
  const d = new Date(iso);
  const ws = startOfWeek(d, { weekStartsOn: 1 });
  const we = endOfWeek(d, { weekStartsOn: 1 });
  return {
    key: format(ws, 'yyyy-MM-dd'),
    label: `Semaine du ${format(ws, 'd MMM', { locale: fr })} au ${format(we, 'd MMM', { locale: fr })}`,
    start: ws.getTime(),
  };
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

  type Week = { key: string; label: string; start: number; minutes: number; count: number; shifts: Shift[] };
  type UserAgg = { userId: string; name: string; minutes: number; count: number; shifts: Shift[]; weeks: Week[] };

  const byUser = useMemo<UserAgg[]>(() => {
    const map = new Map<string, UserAgg & { weekMap: Map<string, Week> }>();
    for (const s of shifts) {
      const key = s.user_id;
      const cur = map.get(key) || { userId: key, name: nameOf(s), minutes: 0, count: 0, shifts: [], weeks: [], weekMap: new Map<string, Week>() };
      const m = minutesOf(s);
      cur.minutes += m;
      cur.count += 1;
      cur.name = nameOf(s);
      cur.shifts.push(s);
      // Ventilation par semaine calendaire.
      const wi = weekInfo(s.clock_in);
      const w = cur.weekMap.get(wi.key) || { key: wi.key, label: wi.label, start: wi.start, minutes: 0, count: 0, shifts: [] };
      w.minutes += m;
      w.count += 1;
      w.shifts.push(s);
      cur.weekMap.set(wi.key, w);
      map.set(key, cur);
    }
    return Array.from(map.values())
      .map(u => ({ userId: u.userId, name: u.name, minutes: u.minutes, count: u.count, shifts: u.shifts, weeks: Array.from(u.weekMap.values()).sort((a, b) => b.start - a.start) }))
      .sort((a, b) => b.minutes - a.minutes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shifts, infos]);

  const totalMinutes = byUser.reduce((s, u) => s + u.minutes, 0);

  // Total de la semaine EN COURS (lundi → aujourd'hui) — repère paie.
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 }).getTime();
  const thisWeekMinutes = useMemo(
    () => shifts.filter(s => weekInfo(s.clock_in).start === thisWeekStart).reduce((sum, s) => sum + minutesOf(s), 0),
    [shifts, thisWeekStart]
  );

  // Export CSV pour la paie : une ligne par membre × semaine, heures en décimal.
  const exportCsv = () => {
    const header = ['Membre', 'Semaine (début)', 'Semaine (fin)', 'Heures (décimal)', 'Heures (h min)', 'Pointages'];
    const lines = [header];
    for (const u of byUser) {
      for (const w of u.weeks) {
        const ws = new Date(w.start);
        const we = endOfWeek(ws, { weekStartsOn: 1 });
        lines.push([
          u.name,
          format(ws, 'yyyy-MM-dd'),
          format(we, 'yyyy-MM-dd'),
          decimalHours(w.minutes),
          fmtMins(w.minutes),
          String(w.count),
        ]);
      }
    }
    const csv = lines.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\r\n');
    // BOM ﻿ : accents corrects à l'ouverture dans Excel.
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `presences-paie-${period}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="ghost-btn" onClick={exportCsv} disabled={loading || shifts.length === 0}>
              <Download size={13} /> Exporter (paie)
            </button>
            <button className="ghost-btn" onClick={load} disabled={loading}>
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Actualiser
            </button>
          </div>
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
        { label: 'En service', value: online.length },
        { label: 'Cette semaine', value: `${decimalHours(thisWeekMinutes)} h` },
        { label: 'Total pointé', value: `${decimalHours(totalMinutes)} h` },
        { label: 'Membres actifs', value: byUser.length },
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

      {/* Heures par membre — avec ventilation hebdomadaire pour la paie */}
      <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
        <div style={{ padding: '13px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#fff', fontSize: 13.5, fontWeight: 700, margin: 0 }}>Heures par membre</p>
          <span style={{ color: '#6b7280', fontSize: 11.5 }}>Toucher un membre pour le détail par semaine</span>
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
                  <p style={{ color: '#6b7280', fontSize: 12, margin: '1px 0 0' }}>{u.count} pointage(s) · {u.weeks.length} semaine(s)</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: '#fff', fontSize: 15, fontWeight: 700, margin: 0 }}>{decimalHours(u.minutes)} h</p>
                  <p style={{ color: '#6b7280', fontSize: 11.5, margin: '1px 0 0' }}>{fmtMins(u.minutes)}</p>
                </div>
              </summary>
              <div style={{ padding: '0 16px 12px' }}>
                {u.weeks.map(w => (
                  <div key={w.key} style={{ marginTop: 10 }}>
                    {/* Bandeau semaine + sous-total */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '7px 12px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${BORDER}`, borderRadius: 9 }}>
                      <span style={{ color: '#d1d5db', fontSize: 12.5, fontWeight: 600 }}>{w.label}</span>
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{decimalHours(w.minutes)} h <span style={{ color: '#6b7280', fontWeight: 500 }}>· {fmtMins(w.minutes)}</span></span>
                    </div>
                    {/* Pointages de la semaine */}
                    <div style={{ padding: '0 4px 0 12px' }}>
                      {w.shifts.map(s => (
                        <div key={s.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '8px 0', borderBottom: `1px solid ${BORDER}` }}>
                          <span style={{ color: '#9ca3af', fontSize: 12.5 }}>
                            {format(new Date(s.clock_in), 'EEE d MMM', { locale: fr })}
                            <span style={{ color: '#6b7280' }}> · {format(new Date(s.clock_in), 'HH:mm')} → {s.clock_out ? format(new Date(s.clock_out), 'HH:mm') : '…'}</span>
                          </span>
                          <span style={{ color: s.clock_out ? '#fff' : '#4ade80', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{fmtMins(minutesOf(s))}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </details>
          ))
        )}
      </div>

      <p style={{ color: '#4b5563', fontSize: 11.5, margin: 0, lineHeight: 1.6 }}>
        Heures calculées automatiquement depuis les pointages arrivée/sortie. Semaines lundi → dimanche.
        Les heures décimales (ex. 1,50 h = 1 h 30) se multiplient directement par le taux horaire.
        « Exporter (paie) » télécharge un fichier CSV (membre × semaine) prêt pour ton tableur. Un pointage encore ouvert compte jusqu'à maintenant.
      </p>
    </div>
  );
}
