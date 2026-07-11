import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

/**
 * Langage visuel du back-office — pilules compactes et arrondies,
 * le même design que le sélecteur de réseau et le choix des rôles :
 * - HubPill      : pilule de NAVIGATION (icône ronde, libellé, compteur,
 *                  chevron) → on entre dans une sous-page.
 * - SwitchPill   : pilule de SÉLECTION (état sélectionné avec coche) →
 *                  changer d'espace sans revenir en arrière.
 * - StatPill     : pilule de CHIFFRE (KPI compact, dimensionné à son
 *                  contenu — jamais de grand rectangle vide).
 * - SectionLabel : petit intitulé de section en majuscules.
 * - DrillPage    : sous-page avec bouton retour, titre et actions.
 */

const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export const drillStyles = `
  @keyframes drill-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes hub-in { from { opacity: 0; transform: translateY(8px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  .drill-page { animation: drill-in 0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .hub-pill { animation: hub-in 0.32s cubic-bezier(0.22,1,0.36,1) both; transition: border-color 0.16s ease, background 0.16s ease, transform 0.16s ease; }
  .hub-pill:hover { border-color: rgba(255,255,255,0.40) !important; background: rgba(255,255,255,0.13) !important; transform: translateY(-1px); }
  .hub-pill:active { transform: scale(0.97); }
  .stat-pill { animation: hub-in 0.32s cubic-bezier(0.22,1,0.36,1) both; }
  .drill-row { transition: background 0.15s ease, border-color 0.15s ease; }
  .drill-row:hover { background: rgba(255,255,255,0.03); }
`;

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#4b5563', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 0 4px' }}>
      {children}
    </p>
  );
}

interface HubPillProps {
  icon: any;
  label: string;
  count?: number | string;
  /** petit badge d'urgence (ambre) — ex. « 3 à traiter » */
  urgent?: number;
  urgentLabel?: string;
  danger?: boolean;
  accent?: boolean;
  delay?: number;
  onClick: () => void;
}

/** Pilule de navigation — on clique, on ENTRE dans l'espace. */
export function HubPill({ icon: Icon, label, count, urgent, urgentLabel = 'à traiter', danger, accent, delay = 0, onClick }: HubPillProps) {
  return (
    <button className="hub-pill" onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '9px 14px 9px 9px', borderRadius: 100, cursor: 'pointer', outline: 'none',
        border: `1px solid ${danger ? 'rgba(239,68,68,0.25)' : accent ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.16)'}`,
        background: accent ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)',
        animationDelay: `${delay}s`,
        WebkitTapHighlightColor: 'transparent',
      }}>
      <span style={{ width: 30, height: 30, borderRadius: '50%', background: danger ? 'rgba(239,68,68,0.10)' : ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color={danger ? '#f87171' : 'rgba(255,255,255,0.85)'} strokeWidth={1.9} />
      </span>
      <span style={{ color: danger ? '#f87171' : '#fff', fontSize: 13.5, fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
      {count !== undefined && (
        <span style={{ fontSize: 11.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: 'rgba(255,255,255,0.10)', color: danger ? '#f87171' : 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
          {count}
        </span>
      )}
      {!!urgent && (
        <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 9px', borderRadius: 999, background: 'rgba(251,191,36,0.10)', color: '#fbbf24', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {urgent} {urgentLabel}
        </span>
      )}
      <ChevronRight size={14} color="rgba(255,255,255,0.30)" style={{ flexShrink: 0 }} />
    </button>
  );
}

interface SwitchPillProps {
  icon?: any;
  label: string;
  count?: number | string;
  selected: boolean;
  danger?: boolean;
  onClick: () => void;
}

/** Pilule de sélection — même design que le choix du réseau / des rôles. */
export function SwitchPill({ icon: Icon, label, count, selected, danger, onClick }: SwitchPillProps) {
  const fg = danger && selected ? '#f87171' : selected ? '#fff' : 'rgba(255,255,255,0.55)';
  return (
    <button onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8, flexShrink: 0, whiteSpace: 'nowrap',
        padding: Icon ? '7px 14px 7px 8px' : '8px 14px', borderRadius: 100, cursor: 'pointer', outline: 'none',
        transition: 'all 0.15s',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.16)'}`,
        background: selected ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.07)',
        WebkitTapHighlightColor: 'transparent',
      }}>
      {Icon && (
        <span style={{ width: 26, height: 26, borderRadius: '50%', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon size={13} color={fg} />
        </span>
      )}
      <span style={{ color: fg, fontSize: 13, fontWeight: selected ? 600 : 400 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 10.5, color: fg, opacity: 0.7 }}>{count}</span>}
      {selected && <CheckCircle2 size={13} color="rgba(255,255,255,0.8)" />}
    </button>
  );
}

interface StatPillProps {
  icon: any;
  value: string | number;
  label: string;
  /** 'urgent' teinte la valeur en rouge, 'warn' en ambre */
  tone?: 'default' | 'urgent' | 'warn';
  delay?: number;
}

/** KPI compact — dimensionné à son contenu, dense même sur grand écran. */
export function StatPill({ icon: Icon, value, label, tone = 'default', delay = 0 }: StatPillProps) {
  const valueColor = tone === 'urgent' ? '#f87171' : tone === 'warn' ? '#fbbf24' : '#fff';
  return (
    <div className="stat-pill"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '7px 16px 7px 8px', borderRadius: 100,
        border: `1px solid rgba(255,255,255,0.10)`, background: 'rgba(255,255,255,0.045)',
        animationDelay: `${delay}s`,
      }}>
      <span style={{ width: 28, height: 28, borderRadius: '50%', background: ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={13} color="rgba(255,255,255,0.65)" strokeWidth={1.9} />
      </span>
      <span style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: valueColor, fontSize: 15, fontWeight: 700, lineHeight: 1.15, whiteSpace: 'nowrap' }}>{value}</span>
        <span style={{ color: '#6b7280', fontSize: 10.5, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{label}</span>
      </span>
    </div>
  );
}

interface DrillPageProps {
  title: string;
  sub?: string;
  onBack: () => void;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export function DrillPage({ title, sub, onBack, right, children }: DrillPageProps) {
  return (
    <div className="drill-page" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={onBack} aria-label="Retour"
          style={{ width: 38, height: 38, borderRadius: '50%', background: ICON_BG, border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={16} color="#fff" />
        </button>
        <div style={{ flex: 1, minWidth: 140 }}>
          <h3 style={{ color: '#fff', fontSize: 17, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</h3>
          {sub && <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>{sub}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
