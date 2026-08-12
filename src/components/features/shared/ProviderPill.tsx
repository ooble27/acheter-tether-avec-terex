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
 * Pastille prestataire Mobile Money — même style que NetworkPill
 * (rounded-[10px], py-2 pl-2 pr-3.5, gap 2.5, logo h-7 w-7).
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
        borderRadius: '10px',
        border: `1px solid ${selected ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.10)'}`,
        background: selected ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
        outline: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'all 0.15s',
        color: '#fff',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: 1,
        whiteSpace: 'nowrap',
      }}
    >
      <img
        src={p.logo}
        alt=""
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
        style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'contain', background: '#fff', flexShrink: 0 }}
      />
      <span>{p.label}</span>
    </button>
  );
}
