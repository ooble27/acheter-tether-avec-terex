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
 * Pastille réseau — copiée à l'identique du code source Ooble
 * (src/pages/app/AppVendre.tsx, step "network") :
 *   rounded-[10px] border py-2 pl-2 pr-3.5 gap-2.5
 *   logo h-7 w-7 rounded-full
 *   text-sm
 *   sélectionné = border-foreground + bg-secondary
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
        src={logo}
        alt=""
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
        style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0 }}
      />
      <span>{name}</span>
    </button>
  );
}
