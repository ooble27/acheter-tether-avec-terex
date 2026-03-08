
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Logos des réseaux blockchain
const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', // Tron
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', // BSC/BNB
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', // Polygon
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', // Solana
  Arbitrum: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png', // Arbitrum
  Base: 'https://s2.coinmarketcap.com/static/img/coins/64x64/27716.png', // Base
};

const NETWORKS = [
  { id: 'TRC20', label: 'TRC20 (Tron)', fee: '~1 USDT' },
  { id: 'BEP20', label: 'BEP20 (BSC)', fee: '~0.29 USDT' },
  { id: 'Polygon', label: 'Polygon', fee: '~0.1 USDT' },
  { id: 'Arbitrum', label: 'Arbitrum', fee: '~0.1 USDT' },
  { id: 'Solana', label: 'Solana', fee: '~1 USDT' },
  { id: 'Base', label: 'Base', fee: '~0.1 USDT' },
];

interface NetworkSelectorProps {
  network: string;
  setNetwork: (network: string) => void;
}

export function NetworkSelector({ network, setNetwork }: NetworkSelectorProps) {
  const selectedNetwork = NETWORKS.find(n => n.id === network);

  return (
    <div className="space-y-2">
      <Label className="text-white text-sm font-medium">Réseau de réception</Label>
      <Select value={network} onValueChange={setNetwork}>
        <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
          <div className="flex items-center space-x-3">
            <img 
              src={NETWORK_LOGOS[network as keyof typeof NETWORK_LOGOS]} 
              alt={network} 
              className="w-5 h-5 rounded-full" 
            />
            <span>{selectedNetwork?.label || network}</span>
          </div>
        </SelectTrigger>
        <SelectContent className="bg-terex-darker border-terex-gray">
          {NETWORKS.map((net) => (
            <SelectItem key={net.id} value={net.id}>
              <div className="flex items-center justify-between w-full space-x-3">
                <div className="flex items-center space-x-3">
                  <img src={NETWORK_LOGOS[net.id as keyof typeof NETWORK_LOGOS]} alt={net.label} className="w-5 h-5 rounded-full" />
                  <span>{net.label}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
