import { Check } from 'lucide-react';

/**
 * Source unique de vérité pour la liste des réseaux blockchain.
 * L'ID (TRC20, BEP20…) est ce qui est envoyé au backend et conservé pour
 * compatibilité avec l'historique de commandes ; le NOM affiché suit la
 * convention Ooble (Tron, BNB Chain…).
 */
export const NETWORK_LOGOS: Record<string, string> = {
  TRC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png',
  BEP20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
  ERC20:   'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png',
  Solana:  'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
  Aptos:   'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png',
  BINANCE: 'https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png',
};

const NETWORK_NAMES: Record<string, string> = {
  TRC20:   'Tron',
  BEP20:   'BNB Chain',
  ERC20:   'Ethereum',
  Polygon: 'Polygon',
  Solana:  'Solana',
  Aptos:   'Aptos',
  BINANCE: 'Binance',
};

interface NetworkPillProps {
  network: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Pastille de réseau — style Ooble : capsule compacte, une seule ligne,
 * logo rond + nom du réseau. Sélection = fond blanc translucide + check.
 * S'insère dans un layout "flex wrap" (pas de grille).
 */
export function NetworkPill({ network, selected, onSelect }: NetworkPillProps) {
  const logo = NETWORK_LOGOS[network];
  const name = NETWORK_NAMES[network] || network;
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
      <img src={logo} alt="" style={{ width: '26px', height: '26px', borderRadius: '50%', flexShrink: 0 }} />
      <span>{name}</span>
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
