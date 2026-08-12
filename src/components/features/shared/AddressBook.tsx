import { useState, useEffect, useRef } from 'react';
import { Check, Trash2, Plus, ChevronDown } from 'lucide-react';
import { useSavedWallets } from '@/hooks/useSavedWallets';
import { NETWORK_LOGOS } from './NetworkPill';

interface AddressBookProps {
  network: string;
  value: string;
  onChange: (v: string) => void;
  saveToBook: boolean;
  onToggleSave: (v: boolean) => void;
  label: string;
  onLabelChange: (v: string) => void;
  placeholder?: string;
}

// Palette : cartes VRAIMENT visibles (comme Ooble bg-card), pas quasi-transparentes.
const CARD_BG = '#1f1f1f';
const CARD_HOVER = '#252525';
const CARD_BORDER = 'rgba(255,255,255,0.10)';
const CARD_BORDER_SEL = 'rgba(255,255,255,0.55)';

const short = (v: string) => (v.length > 22 ? `${v.slice(0, 10)}…${v.slice(-8)}` : v);

/**
 * Sélecteur d'adresse USDT — style Ooble avec un dropdown scalable :
 * une carte "sélection actuelle" en haut qui, cliquée, déroule la liste
 * complète des adresses enregistrées (scrollable). Un bouton "+ Nouvelle
 * adresse" bascule vers la saisie d'une adresse à retenir.
 */
export function AddressBook({
  network, value, onChange, saveToBook, onToggleSave, label, onLabelChange, placeholder,
}: AddressBookProps) {
  const { wallets, remove } = useSavedWallets(network);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // À chaque changement de réseau, on reset + préselectionne le défaut du nouveau réseau.
  useEffect(() => {
    if (wallets.length === 0) {
      onChange('');
      setMode('new');
    } else {
      const def = wallets.find(w => w.is_default) || wallets[0];
      onChange(def.address);
      setMode('saved');
    }
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, wallets.length]);

  // Ferme le dropdown au clic hors du composant.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const logo = NETWORK_LOGOS[network];
  const selected = wallets.find(w => w.address === value) || wallets[0];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {wallets.length > 0 && mode === 'saved' && (
        <div style={{ position: 'relative' }}>
          {/* Carte "sélection actuelle" — cliquable pour dérouler */}
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '14px',
              border: `1px solid ${open ? CARD_BORDER_SEL : CARD_BORDER}`,
              background: CARD_BG, cursor: 'pointer', outline: 'none',
              WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s',
              textAlign: 'left',
            }}
          >
            <img src={logo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {selected?.label && (
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selected.label}
                </div>
              )}
              <div style={{
                color: selected?.label ? 'rgba(255,255,255,0.55)' : '#fff',
                fontSize: selected?.label ? '11px' : '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {selected ? short(selected.address) : ''}
              </div>
            </div>
            <ChevronDown size={16} color="rgba(255,255,255,0.55)" style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
          </button>

          {/* Menu déroulant */}
          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
              zIndex: 20, background: CARD_BG, border: `1px solid ${CARD_BORDER}`,
              borderRadius: '14px', overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              maxHeight: '280px', overflowY: 'auto',
            }}>
              {wallets.map(w => {
                const sel = w.address === value;
                return (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px',
                    background: sel ? CARD_HOVER : 'transparent',
                    borderBottom: `1px solid ${CARD_BORDER}`,
                  }}>
                    <button
                      type="button"
                      onClick={() => { onChange(w.address); setOpen(false); }}
                      style={{
                        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        textAlign: 'left', outline: 'none', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <img src={logo} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {w.label && (
                          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {w.label}
                          </div>
                        )}
                        <div style={{
                          color: 'rgba(255,255,255,0.6)', fontSize: '11px',
                          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {short(w.address)}
                        </div>
                      </div>
                      {sel && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', flexShrink: 0 }}>
                          <Check size={11} color="#111" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (confirm('Supprimer cette adresse ?')) remove(w.id); }}
                      title="Supprimer"
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '6px', flexShrink: 0 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bouton "Nouvelle adresse" sous la carte */}
          <button
            type="button"
            onClick={() => { setMode('new'); setOpen(false); onChange(''); }}
            style={{
              marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px', borderRadius: '10px',
              border: `1px dashed ${CARD_BORDER}`, background: 'transparent',
              color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Plus size={14} /> Nouvelle adresse
          </button>
        </div>
      )}

      {(mode === 'new' || wallets.length === 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {wallets.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('saved')}
              style={{
                alignSelf: 'flex-start', background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer',
                padding: '2px 0', textDecoration: 'underline',
              }}
            >
              ← Utiliser une adresse enregistrée
            </button>
          )}

          <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: CARD_BG }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${CARD_BORDER}`, padding: '10px 16px' }}>
              <img src={logo} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{network}</span>
            </div>
            <input
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              placeholder={placeholder || `Votre adresse ${network}`}
              value={value}
              onChange={e => onChange(e.target.value.trim())}
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#fff', fontSize: '15px', outline: 'none', boxSizing: 'border-box', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.75)', fontSize: '13px', userSelect: 'none', padding: '2px' }}>
            <input
              type="checkbox"
              checked={saveToBook}
              onChange={e => onToggleSave(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#fff', cursor: 'pointer' }}
            />
            Enregistrer cette adresse pour la prochaine fois
          </label>

          {saveToBook && (
            <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: CARD_BG }}>
              <input
                type="text"
                placeholder="Nom (optionnel) — ex : Trust Wallet"
                value={label}
                onChange={e => onLabelChange(e.target.value)}
                style={{ width: '100%', background: 'transparent', border: 'none', padding: '14px 16px', color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
