import { Check } from 'lucide-react';

export type ProviderId = 'wave' | 'orange';

export const PROVIDERS: Record<ProviderId, { label: string; sub: string; logo: string }> = {
  wave:   { label: 'Wave',         sub: 'Paiement instantané',  logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png' },
  orange: { label: 'Orange Money', sub: 'Toute l\'Afrique de l\'Ouest', logo: '/payment-methods/orange-money-logo.png' },
};

interface ProviderPillProps {
  provider: ProviderId;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Pastille de prestataire Mobile Money — style Ooble : rectangle arrondi
 * horizontal avec logo, nom + tag, coche à droite si sélectionné.
 * Prévue pour une grille à 2 colonnes.
 */
export function ProviderPill({ provider, selected, onSelect }: ProviderPillProps) {
  const p = PROVIDERS[provider];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 14px',
        borderRadius: '16px',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'}`,
        background: selected ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.04)',
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        textAlign: 'left',
        transition: 'all 0.15s',
        width: '100%',
        minWidth: 0,
      }}
    >
      <img src={p.logo} alt="" style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '8px', flexShrink: 0 }} />
      <span style={{ minWidth: 0, flex: 1 }}>
        <span
          style={{
            display: 'block',
            color: selected ? '#fff' : 'rgba(255,255,255,0.85)',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: 1.2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {p.label}
        </span>
        <span
          style={{
            display: 'block',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '11px',
            marginTop: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {p.sub}
        </span>
      </span>
      {selected && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <Check size={12} color="#111" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
