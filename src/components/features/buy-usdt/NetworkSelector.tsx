
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Logos des réseaux blockchain
const NETWORK_LOGOS = {
  TRC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png', // Tron
  BEP20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png', // BSC/BNB
  ERC20: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png', // Ethereum
  Polygon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png', // Polygon
  Solana: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png', // Solana
  Aptos: 'https://s2.coinmarketcap.com/static/img/coins/64x64/21794.png' // Aptos
};

interface NetworkSelectorProps {
  network: string;
  setNetwork: (network: string) => void;
}

export function NetworkSelector({ network, setNetwork }: NetworkSelectorProps) {
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
            <span>{network} ({network === 'TRC20' ? 'Tron' : network === 'BEP20' ? 'BSC' : network === 'ERC20' ? 'Ethereum' : network})</span>
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
          <SelectItem value="Aptos">
            <div className="flex items-center space-x-3">
              <img src={NETWORK_LOGOS.Aptos} alt="Aptos" className="w-5 h-5 rounded-full" />
              <span>Aptos</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
