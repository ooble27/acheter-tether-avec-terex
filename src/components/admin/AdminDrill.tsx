import { ArrowLeft, ChevronRight } from 'lucide-react';

/**
 * Navigation « par pages » du back-office :
 * - HubCard  : grande carte cliquable sur la page d'accueil d'une section
 *              (icône, titre, description, compteur, chevron) → on ENTRE
 *              dans une sous-page au lieu de tout empiler sur un seul écran.
 * - DrillPage: sous-page avec en-tête (bouton retour, titre, sous-titre,
 *              actions à droite) et animation d'entrée.
 */

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export const drillStyles = `
  @keyframes drill-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes hub-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .drill-page { animation: drill-in 0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .hub-card { animation: hub-in 0.35s cubic-bezier(0.22,1,0.36,1) both; transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease; }
  .hub-card:hover { border-color: rgba(255,255,255,0.18) !important; background: #232323 !important; transform: translateY(-2px); }
  .hub-card:active { transform: scale(0.99); }
  .drill-row { transition: background 0.15s ease, border-color 0.15s ease; }
  .drill-row:hover { background: rgba(255,255,255,0.03); }
`;

interface HubCardProps {
  icon: any;
  title: string;
  desc: string;
  count?: number | string;
  countLabel?: string;
  danger?: boolean;
  accent?: boolean;
  delay?: number;
  onClick: () => void;
}

export function HubCard({ icon: Icon, title, desc, count, countLabel, danger, accent, delay = 0, onClick }: HubCardProps) {
  return (
    <button className="hub-card" onClick={onClick}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left',
        background: CARD, border: `1px solid ${accent ? 'rgba(255,255,255,0.16)' : BORDER}`,
        borderRadius: 18, padding: '18px 18px', cursor: 'pointer',
        animationDelay: `${delay}s`,
      }}>
      <div style={{ width: 46, height: 46, borderRadius: 14, background: danger ? 'rgba(239,68,68,0.10)' : ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={20} color={danger ? '#f87171' : 'rgba(255,255,255,0.8)'} strokeWidth={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: danger ? '#f87171' : '#fff', fontSize: 15, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</p>
        <p style={{ color: '#6b7280', fontSize: 12.5, margin: '3px 0 0', lineHeight: 1.5 }}>{desc}</p>
      </div>
      {count !== undefined && (
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <p style={{ color: danger ? '#f87171' : '#fff', fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1 }}>{count}</p>
          {countLabel && <p style={{ color: '#4b5563', fontSize: 10.5, margin: '3px 0 0' }}>{countLabel}</p>}
        </div>
      )}
      <ChevronRight size={17} color="rgba(255,255,255,0.25)" style={{ flexShrink: 0 }} />
    </button>
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
