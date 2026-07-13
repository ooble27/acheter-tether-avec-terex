import { useEffect, useState } from 'react';
import { LogIn, LogOut } from 'lucide-react';
import { useStaffShifts } from '@/hooks/useStaffShifts';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

function durationSince(iso: string): string {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  const h = Math.floor(mins / 60);
  return h > 0 ? `${h} h ${mins % 60} min` : `${mins} min`;
}

/**
 * Barre de pointage (arrivée / sortie) — affichée sur sa PROPRE ligne, pleine
 * largeur, sous l'en-tête du back-office. Ne surcharge plus la barre du haut
 * sur mobile. Masquée tant que la table `staff_shifts` n'est pas déployée.
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

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14,
      padding: '10px 14px', marginBottom: 16,
    }}>
      {current ? (
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 0 3px rgba(74,222,128,0.15)', flexShrink: 0 }} />
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              En service · {durationSince(current.clock_in)}
            </span>
          </span>
          <button onClick={clockOut} disabled={busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', color: '#e07a7a', border: `1px solid rgba(224,122,122,0.3)`, borderRadius: 10, padding: '8px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
            <LogOut size={14} /> Pointer la sortie
          </button>
        </>
      ) : (
        <>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#9ca3af', fontSize: 13, minWidth: 0 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#6b7280', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Hors service</span>
          </span>
          <button onClick={() => clockIn()} disabled={busy}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff', color: '#141414', border: 'none', borderRadius: 10, padding: '8px 16px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
            <LogIn size={14} /> Pointer l'arrivée
          </button>
        </>
      )}
    </div>
  );
}
