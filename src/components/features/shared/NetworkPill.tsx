import { Check } from 'lucide-react';

export const NETWORK_LOGOS: Record<string, string> = {
  TRC20:    'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:    'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  Polygon:  'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana:   'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
  Base:     'https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png',
};

const NETWORK_TAGS: Record<string, string> = {
  TRC20:    'Tron · TRC-20',
  BEP20:    'BNB Smart Chain',
  Polygon:  'Polygon POS',
  Solana:   'Solana',
  Arbitrum: 'Arbitrum One',
  Base:     'Base',
};

interface NetworkPillProps {
  network: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Pastille de réseau — style Ooble : rectangle arrondi (16px) avec logo,
 * nom du réseau en gras et tag descriptif dessous. Coche à droite quand
 * sélectionné. Prévu pour être posé dans une grille à 2 colonnes.
 */
export function NetworkPill({ network, selected, onSelect }: NetworkPillProps) {
  const logo = NETWORK_LOGOS[network];
  const tag = NETWORK_TAGS[network] || network;
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
      <img src={logo} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0 }} />
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
          {network}
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
          {tag}
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
