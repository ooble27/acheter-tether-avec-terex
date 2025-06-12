
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

// Logos des réseaux blockchain
const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', // Tron
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', // BSC/BNB
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', // Ethereum
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', // Arbitrum
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', // Polygon
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png' // Solana
};

// Adresses de réception par réseau
const NETWORK_ADDRESSES = {
  TRC20: 'TGzz8gjYiYRqpfmDwnLxfgPuLVNmpCswVp',
  BEP20: '0x742Db8cCd3e67890e6fcA0e2E2C8E29e5Aa1DE5d',
  ERC20: '0x742Db8cCd3e67890e6fcA0e2E2C8E29e5Aa1DE5d',
  Arbitrum: '0x742Db8cCd3e67890e6fcA0e2E2C8E29e5Aa1DE5d',
  Polygon: '0x742Db8cCd3e67890e6fcA0e2E2C8E29e5Aa1DE5d',
  Solana: '8ES2hxsfqZVX3cjxWLBJ8jCdzSu9hTBYELSkX82UdnhN'
};

interface SellNetworkSelectorProps {
  network: string;
  setNetwork: (network: string) => void;
}

export function SellNetworkSelector({ network, setNetwork }: SellNetworkSelectorProps) {
  const getNetworkAddress = (networkName: string) => {
    return NETWORK_ADDRESSES[networkName as keyof typeof NETWORK_ADDRESSES] || '';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-white text-sm font-medium">Réseau de votre USDT</Label>
        <Select value={network} onValueChange={setNetwork}>
          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
            <div className="flex items-center space-x-3">
              <img 
                src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} 
                alt={network} 
                className="w-5 h-5 rounded-full" 
              />
              <span>{network} ({network === 'TRC20' ? 'Tron' : network === 'BEP20' ? 'BSC' : network === 'ERC20' ? 'Ethereum' : network === 'Solana' ? 'Solana' : network})</span>
            </div>
          </SelectTrigger>
          <SelectContent className="bg-terex-darker border-terex-gray">
            <SelectItem value="TRC20">
              <div className="flex items-center space-x-3 w-full">
                <img src={NETWORK_LOGOS.TRC20} alt="Tron" className="w-5 h-5 rounded-full" />
                <span>TRC20 (Tron)</span>
              </div>
            </SelectItem>
            <SelectItem value="BEP20">
              <div className="flex items-center space-x-3">
                <img src={NETWORK_LOGOS.BEP20} alt="BSC" className="w-5 h-5 rounded-full" />
                <span>BEP20 (BSC)</span>
              </div>
            </SelectItem>
            <SelectItem value="ERC20">
              <div className="flex items-center space-x-3">
                <img src={NETWORK_LOGOS.ERC20} alt="Ethereum" className="w-5 h-5 rounded-full" />
                <span>ERC20 (Ethereum)</span>
              </div>
            </SelectItem>
            <SelectItem value="Arbitrum">
              <div className="flex items-center space-x-3">
                <img src={NETWORK_LOGOS.Arbitrum} alt="Arbitrum" className="w-5 h-5 rounded-full" />
                <span>Arbitrum</span>
              </div>
            </SelectItem>
            <SelectItem value="Polygon">
              <div className="flex items-center space-x-3">
                <img src={NETWORK_LOGOS.Polygon} alt="Polygon" className="w-5 h-5 rounded-full" />
                <span>Polygon</span>
              </div>
            </SelectItem>
            <SelectItem value="Solana">
              <div className="flex items-center space-x-3">
                <img src={NETWORK_LOGOS.Solana} alt="Solana" className="w-5 h-5 rounded-full" />
                <span>Solana</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {network && (
        <div className="bg-terex-gray rounded-lg p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-gray-400 text-sm">Adresse de réception {network}</Label>
              <Badge variant="outline" className="text-terex-accent border-terex-accent">
                {network}
              </Badge>
            </div>
            <div className="bg-terex-darker rounded p-3">
              <p className="text-white font-mono text-sm break-all">
                {getNetworkAddress(network)}
              </p>
            </div>
            <p className="text-gray-400 text-xs">
              Envoyez vos USDT uniquement sur le réseau {network} à cette adresse
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
