import { useState, useEffect } from 'react';
import { Check, Trash2, Plus } from 'lucide-react';
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

/**
 * Étape « Adresse USDT » pour le flow d'achat.
 * Liste les adresses enregistrées pour le réseau sélectionné (sélection en
 * un clic), + saisie d'une nouvelle adresse avec case à cocher pour
 * l'ajouter au carnet.
 */
export function AddressBook({
  network, value, onChange, saveToBook, onToggleSave, label, onLabelChange, placeholder,
}: AddressBookProps) {
  const { wallets, remove, setDefault } = useSavedWallets(network);
  const [mode, setMode] = useState<'saved' | 'new'>('saved');

  // Si le client n'a aucune adresse enregistrée pour ce réseau, on force le
  // mode « nouvelle » — sinon on préselectionne l'adresse par défaut.
  useEffect(() => {
    if (wallets.length === 0) {
      setMode('new');
    } else if (!value) {
      const def = wallets.find(w => w.is_default) || wallets[0];
      onChange(def.address);
      setMode('saved');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wallets.length, network]);

  const logo = NETWORK_LOGOS[network];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {wallets.length > 0 && (
        <div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <TabBtn active={mode === 'saved'} onClick={() => setMode('saved')} label={`Mes adresses (${wallets.length})`} />
            <TabBtn active={mode === 'new'} onClick={() => { setMode('new'); onChange(''); }} label="Nouvelle adresse" icon={<Plus size={13} />} />
          </div>

          {mode === 'saved' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {wallets.map(w => {
                const sel = value === w.address;
                return (
                  <div key={w.id} style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '12px 14px', borderRadius: '14px',
                    border: `1px solid ${sel ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'}`,
                    background: sel ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
                    transition: 'all 0.15s',
                  }}>
                    <button
                      type="button"
                      onClick={() => onChange(w.address)}
                      style={{
                        flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '10px',
                        background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
                        textAlign: 'left', color: 'inherit', outline: 'none', WebkitTapHighlightColor: 'transparent',
                      }}
                    >
                      <img src={logo} alt="" style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        {w.label && (
                          <div style={{ color: '#fff', fontSize: '13px', fontWeight: 600, marginBottom: '2px' }}>
                            {w.label}
                            {w.is_default && <span style={{ marginLeft: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '10px', fontWeight: 500 }}>· par défaut</span>}
                          </div>
                        )}
                        <div style={{
                          color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {w.address}
                        </div>
                      </div>
                      {sel && (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', flexShrink: 0 }}>
                          <Check size={12} color="#111" strokeWidth={3} />
                        </span>
                      )}
                    </button>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {!w.is_default && (
                        <button
                          type="button"
                          onClick={() => setDefault(w.id, network)}
                          title="Définir par défaut"
                          style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', fontSize: '10px' }}
                        >
                          ★
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => { if (confirm('Supprimer cette adresse ?')) remove(w.id); }}
                        title="Supprimer"
                        style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {(mode === 'new' || wallets.length === 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Style Ooble AppAcheter step address : card rounded-[14px] avec
              header (logo + nom réseau + tag) séparé par un border-bottom. */}
          <div style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 16px' }}>
              <img src={logo} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%' }} />
              <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)' }}>{network}</span>
            </div>
            <input
              type="text"
              spellCheck={false}
              autoCapitalize="none"
              placeholder={placeholder || `Votre adresse ${network}`}
              value={value}
              onChange={e => onChange(e.target.value.trim())}
              style={{ width: '100%', background: 'transparent', border: 'none', padding: '16px', color: '#fff', fontSize: '15px', outline: 'none', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: 1.5, boxSizing: 'border-box' }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'rgba(255,255,255,0.65)', fontSize: '13px', userSelect: 'none', padding: '2px' }}>
            <input
              type="checkbox"
              checked={saveToBook}
              onChange={e => onToggleSave(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#fff', cursor: 'pointer' }}
            />
            Enregistrer cette adresse pour la prochaine fois
          </label>

          {saveToBook && (
            <div style={{ overflow: 'hidden', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.10)', background: 'rgba(255,255,255,0.02)' }}>
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

function TabBtn({ active, onClick, label, icon }: { active: boolean; onClick: () => void; label: string; icon?: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '6px',
        padding: '7px 12px', borderRadius: '10px',
        border: `1px solid ${active ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'}`,
        background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
        color: active ? '#fff' : 'rgba(255,255,255,0.55)',
        fontSize: '12px', fontWeight: 500, cursor: 'pointer', outline: 'none',
        WebkitTapHighlightColor: 'transparent', transition: 'all 0.15s',
      }}
    >
      {icon}
      {label}
    </button>
  );
}
