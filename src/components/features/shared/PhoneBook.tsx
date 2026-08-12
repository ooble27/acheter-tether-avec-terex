import { useState, useEffect, useRef } from 'react';
import { Check, Trash2, Plus, ChevronDown } from 'lucide-react';
import { useSavedPhones } from '@/hooks/useSavedPhones';
import { PROVIDERS, type ProviderId } from './ProviderPill';

interface PhoneBookProps {
  provider: ProviderId;
  value: string;
  onChange: (v: string) => void;
  saveToBook: boolean;
  onToggleSave: (v: boolean) => void;
  label: string;
  onLabelChange: (v: string) => void;
}

const CARD_BORDER = 'rgba(255,255,255,0.10)';

/**
 * Sélecteur de numéro Mobile Money — même style que AddressBook :
 * petit bouton chevron à droite, menu qui s'ouvre VERS LE HAUT.
 */
export function PhoneBook({
  provider, value, onChange, saveToBook, onToggleSave, label, onLabelChange,
}: PhoneBookProps) {
  const { phones, remove } = useSavedPhones(provider);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (phones.length === 0) {
      onChange('');
      setMode('new');
    } else {
      const def = phones.find(p => p.is_default) || phones[0];
      onChange(def.phone);
      setMode('saved');
    }
    setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, phones.length]);

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

  const p = PROVIDERS[provider];
  const selected = phones.find(ph => ph.phone === value) || phones[0];

  return (
    <div ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
      {phones.length > 0 && mode === 'saved' && (
        <>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 8px 12px 14px', borderRadius: '14px',
            border: `1px solid ${CARD_BORDER}`,
            background: 'rgba(255,255,255,0.03)',
          }}>
            <img src={p.logo} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {selected?.label && (
                <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selected.label}
                </div>
              )}
              <div style={{
                color: selected?.label ? 'rgba(255,255,255,0.65)' : '#fff',
                fontSize: '13px',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}>
                {selected?.phone || ''}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              aria-label="Choisir un autre numéro"
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

          {open && (
            <div style={{
              position: 'absolute',
              bottom: 'calc(100% + 6px)', right: 0,
              minWidth: '240px', maxWidth: 'calc(100vw - 40px)',
              zIndex: 30,
              background: '#1f1f1f',
              border: `1px solid ${CARD_BORDER}`,
              borderRadius: '12px', overflow: 'hidden',
              boxShadow: '0 -8px 24px rgba(0,0,0,0.45)',
              maxHeight: '260px', overflowY: 'auto',
            }}>
              {phones.map(ph => {
                const sel = ph.phone === value;
                return (
                  <div key={ph.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px',
                    background: sel ? 'rgba(255,255,255,0.08)' : 'transparent',
                    borderBottom: `1px solid ${CARD_BORDER}`,
                  }}>
                    <button
                      type="button"
                      onClick={() => { onChange(ph.phone); setOpen(false); }}
                      style={{
                        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        textAlign: 'left', outline: 'none', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <img src={p.logo} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {ph.label && (
                          <div style={{ color: '#fff', fontSize: '12px', fontWeight: 600, marginBottom: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ph.label}
                          </div>
                        )}
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                          {ph.phone}
                        </div>
                      </div>
                      {sel && (
                        <Check size={14} color="#fff" strokeWidth={3} style={{ flexShrink: 0 }} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (confirm('Supprimer ce numéro ?')) remove(ph.id); }}
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

          <button
            type="button"
            onClick={() => { setMode('new'); onChange(''); }}
            style={{
              alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 10px', borderRadius: '8px',
              background: 'transparent', border: 'none',
              color: 'rgba(255,255,255,0.65)', fontSize: '12px', fontWeight: 500,
              cursor: 'pointer', outline: 'none', WebkitTapHighlightColor: 'transparent',
            }}
          >
            <Plus size={13} /> Nouveau numéro
          </button>
        </>
      )}

      {(mode === 'new' || phones.length === 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {phones.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('saved')}
              style={{
                alignSelf: 'flex-start', background: 'transparent', border: 'none',
                color: 'rgba(255,255,255,0.55)', fontSize: '12px', cursor: 'pointer',
                padding: '2px 0', textDecoration: 'underline',
              }}
            >
              ← Utiliser un numéro enregistré
            </button>
          )}

          <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: `1px solid ${CARD_BORDER}`, padding: '10px 16px' }}>
              <img src={p.logo} alt="" style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'contain', background: '#fff' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{p.label}</span>
            </div>
            <input
              type="tel"
              placeholder="+221 XX XXX XX XX"
              value={value}
              onChange={e => onChange(e.target.value)}
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#fff', fontSize: '16px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.75)', fontSize: '13px', userSelect: 'none', padding: '2px' }}>
            <input
              type="checkbox"
              checked={saveToBook}
              onChange={e => onToggleSave(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#fff', cursor: 'pointer' }}
            />
            Enregistrer ce numéro pour la prochaine fois
          </label>

          {saveToBook && (
            <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: 'rgba(255,255,255,0.03)' }}>
              <input
                type="text"
                placeholder="Nom (optionnel) — ex : Mon perso"
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
