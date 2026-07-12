import { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useStaffShifts } from '@/hooks/useStaffShifts';

const BORDER = 'rgba(255,255,255,0.07)';

function durationSince(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  return h > 0 ? `${h} h ${mins % 60} min` : `${mins} min`;
}

/**
 * Bouton de pointage (arrivée / sortie) affiché dans la barre du back-office.
 * Masqué tant que la table `staff_shifts` n'est pas déployée.
 */
export function StaffPunch() {
  const { available, current, busy, clockIn, clockOut } = useStaffShifts();
  const [, tick] = useState(0);

  // Rafraîchit la durée affichée chaque minute.
  useEffect(() => {
    if (!current) return;
    const t = setInterval(() => tick(n => n + 1), 30000);
    return () => clearInterval(t);
  }, [current]);

  if (!available) return null;

  if (current) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.05)', border: `1px solid ${BORDER}`, borderRadius: 999, padding: '6px 12px' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.15)' }} />
          <span style={{ color: '#fff', fontSize: 11.5, fontWeight: 600 }}>En service · {durationSince(current.clock_in)}</span>
        </span>
        <button onClick={clockOut} disabled={busy}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#e07a7a', border: `1px solid rgba(255,255,255,0.12)`, borderRadius: 999, padding: '6px 12px', fontSize: 11.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
          <LogOut size={13} /> Sortie
        </button>
      </div>
    );
  }

  return (
    <button onClick={() => clockIn()} disabled={busy}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 999, padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
      <LogIn size={14} /> Pointer l'arrivée
    </button>
  );
}
