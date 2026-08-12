import { useState, useEffect } from 'react';
import { Check, Trash2, Plus, ChevronDown } from 'lucide-react';
import { useSavedPhones } from '@/hooks/useSavedPhones';
import { PROVIDERS, type ProviderId } from './ProviderPill';
import { BottomSheet } from './BottomSheet';

interface PhoneBookProps {
  provider: ProviderId;
  value: string;
  onChange: (v: string) => void;
  saveToBook: boolean;
  onToggleSave: (v: boolean) => void;
  label: string;
  onLabelChange: (v: string) => void;
}

const CARD_BG = '#1f1f1f';
const CARD_HOVER = '#252525';
const CARD_BORDER = 'rgba(255,255,255,0.10)';
const CARD_BORDER_SEL = 'rgba(255,255,255,0.55)';

/**
 * Sélecteur de numéro Mobile Money — même approche dropdown que AddressBook :
 * une carte "sélection actuelle" en haut qui déroule la liste complète.
 */
export function PhoneBook({
  provider, value, onChange, saveToBook, onToggleSave, label, onLabelChange,
}: PhoneBookProps) {
  const { phones, remove } = useSavedPhones(provider);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');
  const [open, setOpen] = useState(false);

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

  const p = PROVIDERS[provider];
  const selected = phones.find(ph => ph.phone === value) || phones[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {phones.length > 0 && mode === 'saved' && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', borderRadius: '14px',
              border: `1px solid ${CARD_BORDER}`,
              background: CARD_BG, cursor: 'pointer', outline: 'none',
              WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s',
              textAlign: 'left',
            }}
          >
            <img src={p.logo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
            <div style={{ minWidth: 0, flex: 1 }}>
              {selected?.label && (
                <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
            <ChevronDown size={16} color="rgba(255,255,255,0.55)" style={{ flexShrink: 0 }} />
          </button>

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
            <Plus size={14} /> Nouveau numéro
          </button>

          <BottomSheet open={open} onClose={() => setOpen(false)} title="Mes numéros">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {phones.map(ph => {
                const sel = ph.phone === value;
                return (
                  <div key={ph.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '14px', borderRadius: '12px',
                    background: sel ? '#2a2a2a' : '#181818',
                    border: `1px solid ${sel ? CARD_BORDER_SEL : CARD_BORDER}`,
                  }}>
                    <button
                      type="button"
                      onClick={() => { onChange(ph.phone); setOpen(false); }}
                      style={{
                        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '12px',
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        textAlign: 'left', outline: 'none', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <img src={p.logo} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {ph.label && (
                          <div style={{ color: '#fff', fontSize: '14px', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {ph.label}
                          </div>
                        )}
                        <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
                          {ph.phone}
                        </div>
                      </div>
                      {sel && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', flexShrink: 0 }}>
                          <Check size={12} color="#111" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); if (confirm('Supprimer ce numéro ?')) remove(ph.id); }}
                      title="Supprimer"
                      style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '8px', flexShrink: 0 }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                );
              })}
            </div>
          </BottomSheet>
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

          <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: CARD_BG }}>
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
            <div style={{ overflow: 'hidden', borderRadius: '14px', border: `1px solid ${CARD_BORDER}`, background: CARD_BG }}>
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
