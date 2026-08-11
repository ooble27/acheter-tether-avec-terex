import { Check } from 'lucide-react';

export type ProviderId = 'wave' | 'orange';

export const PROVIDERS: Record<ProviderId, { label: string; sub: string; logo: string }> = {
  wave:   { label: 'Wave',         sub: 'Paiement instantané',          logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png' },
  orange: { label: 'Orange Money', sub: 'Toute l\'Afrique de l\'Ouest', logo: '/payment-methods/orange-money-logo.png' },
};

interface ProviderPillProps {
  provider: ProviderId;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Pastille prestataire Mobile Money — même style que NetworkPill :
 * capsule compacte 999px, une seule ligne, logo + nom, coche mini.
 */
export function ProviderPill({ provider, selected, onSelect }: ProviderPillProps) {
  const p = PROVIDERS[provider];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 14px 8px 8px',
        borderRadius: '999px',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'}`,
        background: selected ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 0.15s',
        color: selected ? '#fff' : 'rgba(255,255,255,0.85)',
        fontSize: '14px',
        fontWeight: selected ? 600 : 500,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <img src={p.logo} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }} />
      <span>{p.label}</span>
      {selected && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <Check size={11} color="#111" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
