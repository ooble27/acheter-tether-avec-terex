import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

/**
 * Langage visuel du back-office — sobre, dense, comme une vraie application :
 * - StatStrip  : UNE carte de chiffres, colonnes séparées par des filets fins
 *                (style tableau de bord bancaire) — jamais de grosses boîtes vides.
 * - HubTile    : tuile d'accès à un espace de travail (icône, grand chiffre,
 *                libellé) — en grille, comme l'écran d'accueil d'une app.
 * - SwitchPill : pilule de SÉLECTION uniquement (filtres, changement d'espace).
 * - SectionLabel : petit intitulé de section discret.
 * - DrillPage  : sous-page avec bouton retour, titre et actions.
 */

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export const drillStyles = `
  @keyframes drill-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes hub-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .drill-page { animation: drill-in 0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .hub-tile { animation: hub-in 0.35s cubic-bezier(0.22,1,0.36,1) both; transition: border-color 0.18s ease, background 0.18s ease, transform 0.18s ease; }
  .hub-tile:hover { border-color: rgba(255,255,255,0.22) !important; background: #232323 !important; transform: translateY(-2px); }
  .hub-tile:active { transform: scale(0.98); }
  .hub-tile:hover .tile-chev { opacity: 1; transform: translateX(0); }
  .tile-chev { opacity: 0.45; transform: translateX(-2px); transition: opacity 0.18s ease, transform 0.18s ease; }
  .stat-strip { animation: hub-in 0.35s cubic-bezier(0.22,1,0.36,1) both; }
  .drill-row { transition: background 0.15s ease, border-color 0.15s ease; }
  .drill-row:hover { background: rgba(255,255,255,0.03); }
`;

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#4b5563', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 0 2px' }}>
      {children}
    </p>
  );
}

export interface StatItem {
  label: string;
  value: string | number;
  /** 'urgent' teinte la valeur en rouge, 'warn' en ambre */
  tone?: 'default' | 'urgent' | 'warn';
}

/**
 * Bande de chiffres — une seule carte, des colonnes fines séparées par des
 * filets. Dense sur desktop (une ligne), passe à la ligne sur mobile.
 */
export function StatStrip({ items, delay = 0 }: { items: StatItem[]; delay?: number }) {
  return (
    <div className="stat-strip"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${items.length > 4 ? 120 : 140}px, 1fr))`,
        gap: 1, background: BORDER,
        border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden',
        animationDelay: `${delay}s`,
      }}>
      {items.map(it => {
        const color = it.tone === 'urgent' ? '#f87171' : it.tone === 'warn' ? '#fbbf24' : '#fff';
        return (
          <div key={it.label} style={{ background: CARD, padding: '13px 16px', minWidth: 0 }}>
            <p style={{ color: '#6b7280', fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {it.label}
            </p>
            <p style={{ color, fontSize: 19, fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {it.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}

interface HubTileProps {
  icon: any;
  label: string;
  count?: number | string;
  /** petite ligne sous le libellé — ex. « 4 à traiter » (ambre si urgent) */
  caption?: string;
  urgent?: boolean;
  danger?: boolean;
  delay?: number;
  onClick: () => void;
}

/**
 * Tuile d'espace de travail — grille compacte façon écran d'accueil d'app :
 * icône en haut, grand chiffre, libellé, chevron discret qui glisse au survol.
 */
export function HubTile({ icon: Icon, label, count, caption, urgent, danger, delay = 0, onClick }: HubTileProps) {
  return (
    <button className="hub-tile" onClick={onClick}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14,
        textAlign: 'left', position: 'relative', minHeight: 118,
        background: CARD, border: `1px solid ${danger ? 'rgba(239,68,68,0.18)' : BORDER}`,
        borderRadius: 18, padding: '15px 16px', cursor: 'pointer', outline: 'none',
        animationDelay: `${delay}s`,
        WebkitTapHighlightColor: 'transparent',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: danger ? 'rgba(239,68,68,0.10)' : ICON_BG, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} color={danger ? '#f87171' : 'rgba(255,255,255,0.85)'} strokeWidth={1.9} />
        </span>
        <ChevronRight className="tile-chev" size={15} color="rgba(255,255,255,0.5)" />
      </div>
      <div style={{ minWidth: 0, width: '100%' }}>
        {count !== undefined && (
          <p style={{ color: danger ? '#f87171' : '#fff', fontSize: 23, fontWeight: 700, margin: '0 0 2px', lineHeight: 1, letterSpacing: '-0.02em' }}>{count}</p>
        )}
        <p style={{ color: danger ? '#f87171' : count !== undefined ? '#9ca3af' : '#fff', fontSize: 13, fontWeight: 600, margin: 0, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {label}
        </p>
        {caption && (
          <p style={{ color: urgent ? '#fbbf24' : '#4b5563', fontSize: 11, fontWeight: urgent ? 700 : 500, margin: '3px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {caption}
          </p>
        )}
      </div>
    </button>
  );
}

/** Grille des tuiles — 2 par ligne sur mobile, davantage sur grand écran. */
export function TileGrid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
      {children}
    </div>
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

/** Pilule de sélection — réservée aux sélecteurs (même design que le choix du réseau / des rôles). */
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
