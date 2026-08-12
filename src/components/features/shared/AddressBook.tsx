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

const CARD_BORDER = 'rgba(255,255,255,0.10)';
const short = (v: string) => (v.length > 22 ? `${v.slice(0, 10)}…${v.slice(-8)}` : v);

/**
 * Sélecteur d'adresse USDT — petit dropdown compact.
 * La carte principale affiche l'adresse sélectionnée avec un bouton
 * chevron discret à droite. Le menu s'ouvre VERS LE HAUT (pas vers le
 * bas, pour ne pas être caché par la barre de navigation mobile).
 */
export function AddressBook({
  network, value, onChange, saveToBook, onToggleSave, label, onLabelChange, placeholder,
}: AddressBookProps) {
  const { wallets, remove } = useSavedWallets(network);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const logo = NETWORK_LOGOS[network];
  const selected = wallets.find(w => w.address === value) || wallets[0];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
      {wallets.length > 0 && mode === 'saved' && (
        <>
          {/* Rangée sélection actuelle + chevron à droite */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 8px 12px 14px', borderRadius: '14px',
            border: `1px solid ${CARD_BORDER}`,
            background: 'rgba(255,255,255,0.03)',
          }}>
            <img src={logo} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {selected?.label && (
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selected.label}
                </div>
              )}
              <div style={{
                color: selected?.label ? 'rgba(255,255,255,0.55)' : '#fff',
                fontSize: '12px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {selected ? short(selected.address) : ''}
              </div>
            </div>
            {/* Petit bouton chevron à droite qui ouvre le menu */}
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-label="Choisir une autre adresse"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: open ? 'rgba(255,255,255,0.10)' : 'transparent',
                border: 'none', cursor: 'pointer', outline: 'none',
                WebkitTapHighlightColor: 'transparent', transition: 'background 0.15s',
                flexShrink: 0, color: 'rgba(255,255,255,0.75)',
              }}
            >
              <ChevronDown size={16} strokeWidth={2} style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>

          {/* Menu qui s'ouvre VERS LE HAUT — au-dessus de la carte, pas caché par la nav */}
          {open && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)', // Au-dessus, pas en dessous
              right: 0,
              minWidth: '260px', maxWidth: 'calc(100vw - 40px)',
              zIndex: 30,
              background: '#1f1f1f',
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.45)',
              maxHeight: '260px', overflowY: 'auto',
            }}>
              {wallets.map(w => {
                const sel = w.address === value;
                return (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px',
                    background: sel ? 'rgba(255,255,255,0.08)' : 'transparent',
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
                      <img src={logo} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {w.label && (
                          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                        <Check size={14} color="#fff" strokeWidth={3} style={{ flexShrink: 0 }} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (confirm('Supprimer cette adresse ?')) remove(w.id); }}
                      title="Supprimer"
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', flexShrink: 0 }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bouton "Nouvelle adresse" discret sous la carte */}
          <button
            type="button"
            onClick={() => { setMode('new'); onChange(''); }}
            style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '8px 12px', borderRadius: '10px',
              border: `1px dashed ${CARD_BORDER}`, background: 'transparent',
              color: 'rgba(255,255,255,0.75)', fontSize: '13px', fontWeight: 500,
              cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Plus size={14} /> Nouvelle adresse
          </button>
        </>
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

          <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
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
            <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
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
