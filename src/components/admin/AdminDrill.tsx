import { ArrowLeft, CheckCircle2 } from 'lucide-react';

/**
 * Langage visuel du back-office — style CRM moderne (référence : Attio) :
 * - PageHeader : en-tête de page (titre, sous-titre, actions à droite).
 * - Tabs       : onglets soulignés avec compteurs — la navigation d'une vue.
 * - table CRM  : classes .crm-table / .crm-thead / .crm-row — données denses,
 *                colonnes, filets fins, survol discret.
 * - DotStatus  : statut « puce colorée + libellé », sans fond.
 * - Avatar     : initiale dans un rond.
 * - StatStrip  : rangée de métriques SANS boîtes — chiffre fort, libellé discret.
 * - SwitchPill : pilule réservée aux sélecteurs (filtres).
 * - DrillPage  : sous-page avec bouton retour (détails, formulaires).
 */

const BORDER = 'rgba(255,255,255,0.07)';
const ICON_BG = 'rgba(255,255,255,0.06)';

export const drillStyles = `
  @keyframes drill-in { from { opacity: 0; transform: translateX(14px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes crm-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
  .drill-page { animation: drill-in 0.28s cubic-bezier(0.22,1,0.36,1) both; }
  .crm-fade { animation: crm-in 0.3s cubic-bezier(0.22,1,0.36,1) both; }

  .crm-table { border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; overflow: hidden; background: #1c1c1c; }
  .crm-thead { display: grid; align-items: center; padding: 0 16px; height: 38px; background: rgba(255,255,255,0.025); border-bottom: 1px solid rgba(255,255,255,0.07); }
  .crm-th { color: #6b7280; font-size: 10.5px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .crm-row { display: grid; align-items: center; padding: 10px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.12s ease; }
  .crm-row:last-child { border-bottom: none; }
  .crm-row.clickable { cursor: pointer; }
  .crm-row.clickable:hover { background: rgba(255,255,255,0.03); }

  .cols-orders { grid-template-columns: minmax(150px, 2fr) minmax(84px, 0.9fr) minmax(120px, 1.3fr) minmax(128px, 1.2fr) minmax(84px, 0.8fr) 74px; column-gap: 22px; }
  .cols-team { grid-template-columns: minmax(180px, 2.2fr) minmax(130px, 1.2fr) minmax(90px, 0.9fr) 44px; column-gap: 18px; }
  .only-m { display: none !important; }
  @media (max-width: 760px) {
    .crm-thead { display: none; }
    .cols-orders { grid-template-columns: minmax(0, 1fr) auto auto; column-gap: 12px; }
    .cols-team { grid-template-columns: minmax(0, 1fr) auto 40px; column-gap: 10px; }
    .only-d { display: none !important; }
    .only-m { display: flex !important; }
  }

  .ghost-btn { display: inline-flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.10); color: #9ca3af; border-radius: 10px; padding: 7px 12px; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .ghost-btn:hover { color: #fff; border-color: rgba(255,255,255,0.22); background: rgba(255,255,255,0.04); }
  .ghost-btn:disabled { opacity: 0.55; cursor: default; }
  .crm-tab { transition: color 0.15s ease; }

  /* Filtres — format « pastille » sobre, même famille que les boutons CSV/PDF */
  .filter-chip { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; padding: 7px 13px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.10); background: transparent; color: #9ca3af; font-size: 12.5px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
  .filter-chip:hover { color: #fff; border-color: rgba(255,255,255,0.20); }
  .filter-chip.sel { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.24); color: #fff; }
  .filter-chip .chip-c { font-size: 11px; opacity: 0.6; }
`;

/**
 * Palette de statut — MONOCHROME (design système Terex). Aucun jaune, aucun
 * bleu : la hiérarchie se lit par la luminosité (actif = clair, terminé =
 * estompé). Le rouge est réservé aux états négatifs (annulée / rejetée) et,
 * ailleurs dans l'app, à l'ancienneté des commandes à prendre.
 */
export const RED = '#e07a7a';          // rouge propre, ni sombre ni criard
const ACTIVE = '#f2f2f2';              // en cours — ressort
const WAIT = '#9ca3af';                // en attente — neutre
const DONE = 'rgba(255,255,255,0.40)'; // terminé — estompé

export const STATUS_TONES: Record<string, { label: string; color: string }> = {
  pending:      { label: 'En attente',    color: WAIT },
  processing:   { label: 'En traitement', color: ACTIVE },
  completed:    { label: 'Terminée',      color: DONE },
  cancelled:    { label: 'Annulée',       color: RED },
  failed:       { label: 'Échouée',       color: RED },
  // KYC
  submitted:    { label: 'Soumis',        color: ACTIVE },
  under_review: { label: 'En révision',   color: WAIT },
  approved:     { label: 'Approuvé',      color: DONE },
  rejected:     { label: 'Rejeté',        color: RED },
  // Candidatures
  reviewing:    { label: 'En examen',     color: WAIT },
  interview:    { label: 'Entretien',     color: ACTIVE },
  accepted:     { label: 'Acceptée',      color: DONE },
};

export function StatusText({ status, label, size = 12.5 }: { status: string; label?: string; size?: number }) {
  const t = STATUS_TONES[status] || { label: status, color: 'rgba(255,255,255,0.55)' };
  return <span style={{ color: t.color, fontSize: size, fontWeight: 600, whiteSpace: 'nowrap' }}>{label || t.label}</span>;
}

export function FilterChip({ label, count, selected, onClick }: { label: string; count?: number | string; selected: boolean; onClick: () => void }) {
  return (
    <button className={`filter-chip${selected ? ' sel' : ''}`} onClick={onClick}>
      {label}{count !== undefined && <span className="chip-c">{count}</span>}
    </button>
  );
}

interface PageHeaderProps {
  title: string;
  sub?: React.ReactNode;
  right?: React.ReactNode;
}

export function PageHeader({ title, sub, right }: PageHeaderProps) {
  return (
    <div className="crm-fade" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
      <div style={{ minWidth: 160 }}>
        <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
        {sub && <div style={{ color: '#6b7280', fontSize: 12.5, margin: '3px 0 0' }}>{sub}</div>}
      </div>
      {right && <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>{right}</div>}
    </div>
  );
}

export interface TabDef {
  id: string;
  label: string;
  count?: number;
  danger?: boolean;
}

export function Tabs({ tabs, active, onChange }: { tabs: TabDef[]; active: string; onChange: (id: string) => void }) {
  return (
    <div className="crm-fade" style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${BORDER}`, overflowX: 'auto', scrollbarWidth: 'none' }}>
      {tabs.map(t => {
        const sel = active === t.id;
        const fg = sel ? (t.danger ? '#f87171' : '#fff') : '#6b7280';
        return (
          <button key={t.id} className="crm-tab" onClick={() => onChange(t.id)}
            style={{
              background: 'none', border: 'none',
              borderBottom: sel ? `2px solid ${t.danger ? '#f87171' : '#fff'}` : '2px solid transparent',
              padding: '9px 10px 11px', marginBottom: -1,
              color: fg, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
              display: 'inline-flex', gap: 7, alignItems: 'center',
              WebkitTapHighlightColor: 'transparent',
            }}>
            {t.label}
            {t.count !== undefined && (
              <span style={{ fontSize: 11, fontWeight: 600, color: sel ? '#9ca3af' : '#4b5563', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '1px 7px' }}>
                {t.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Avatar({ name, size = 28 }: { name?: string | null; size?: number }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%', background: '#2d2d2d', border: '1px solid rgba(255,255,255,0.10)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      color: '#d1d5db', fontSize: size * 0.42, fontWeight: 700, flexShrink: 0, textTransform: 'uppercase',
    }}>
      {(name || '?').trim().slice(0, 1)}
    </span>
  );
}

export interface StatItem {
  label: string;
  value: string | number;
  tone?: 'default' | 'urgent' | 'warn';
}

/** Métriques sans boîtes — chiffre fort, libellé discret, rangée aérée. */
export function StatStrip({ items, delay = 0 }: { items: StatItem[]; delay?: number }) {
  return (
    <div className="crm-fade" style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 40px', padding: '2px 2px', animationDelay: `${delay}s` }}>
      {items.map(it => {
        // Seul l'état « urgent » (ancienneté) se teinte, en rouge ; le reste est blanc neutre.
        const color = it.tone === 'urgent' ? RED : '#fff';
        return (
          <div key={it.label} style={{ minWidth: 0 }}>
            <p style={{ color: '#6b7280', fontSize: 11.5, fontWeight: 500, margin: '0 0 3px', whiteSpace: 'nowrap' }}>{it.label}</p>
            <p style={{ color, fontSize: 19, fontWeight: 700, margin: 0, lineHeight: 1.1, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>{it.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ color: '#4b5563', fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.09em', margin: '0 0 0 2px' }}>
      {children}
    </p>
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
