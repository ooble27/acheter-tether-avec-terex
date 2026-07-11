import { Check, X, Bookmark } from 'lucide-react';

const CARD = '#1e1e1e';
const BORDER = 'rgba(255,255,255,0.07)';

export interface SavedItem {
  id: string;
  primary: string;     // ex. le numéro / l'adresse
  secondary?: string;  // ex. le prestataire / le réseau
}

/**
 * Liste d'entrées enregistrées (numéros Mobile Money, wallets…) présentées
 * en pilules sélectionnables. On tape → on choisit ; la croix → on supprime.
 */
export function SavedChips({ label, items, activeValue, onPick, onDelete }: {
  label?: string;
  items: SavedItem[];
  activeValue?: string;
  onPick: (item: SavedItem) => void;
  onDelete: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {label && (
        <p style={{ color: '#6b7280', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
      )}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {items.map(it => {
          const sel = activeValue !== undefined && activeValue === it.primary;
          return (
            <div key={it.id}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: sel ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${sel ? 'rgba(255,255,255,0.30)' : BORDER}`,
                borderRadius: '12px', padding: '8px 8px 8px 12px', transition: 'all 0.15s',
              }}>
              <button onClick={() => onPick(it)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, outline: 'none', minWidth: 0, WebkitTapHighlightColor: 'transparent' }}>
                <span style={{ color: '#fff', fontSize: '13.5px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{it.primary}</span>
                {it.secondary && <span style={{ color: '#6b7280', fontSize: '11px', marginTop: '1px' }}>{it.secondary}</span>}
              </button>
              {sel
                ? <Check size={14} color="rgba(255,255,255,0.85)" style={{ margin: '0 4px' }} />
                : (
                  <button onClick={() => onDelete(it.id)} aria-label="Supprimer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: 'none', cursor: 'pointer', flexShrink: 0, outline: 'none' }}>
                    <X size={12} color="#9ca3af" />
                  </button>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Case « Enregistrer » pour mémoriser l'entrée courante en un tap. */
export function SaveToggle({ checked, onToggle, label }: { checked: boolean; onToggle: () => void; label: string }) {
  return (
    <button onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
        background: checked ? 'rgba(255,255,255,0.06)' : CARD, border: `1px solid ${checked ? 'rgba(255,255,255,0.20)' : BORDER}`,
        borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', outline: 'none', textAlign: 'left', transition: 'all 0.15s', WebkitTapHighlightColor: 'transparent',
      }}>
      <span style={{ width: 20, height: 20, borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: checked ? '#fff' : 'rgba(255,255,255,0.06)', border: `1px solid ${checked ? '#fff' : BORDER}` }}>
        {checked && <Check size={13} color="#141414" strokeWidth={3} />}
      </span>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, color: checked ? '#fff' : '#9ca3af', fontSize: '13.5px', fontWeight: 500 }}>
        <Bookmark size={14} /> {label}
      </span>
    </button>
  );
}
