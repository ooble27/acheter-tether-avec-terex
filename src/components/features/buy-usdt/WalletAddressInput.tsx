
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WalletAddressInputProps {
  walletAddress: string;
  setWalletAddress: (address: string) => void;
  network: string;
}

export function WalletAddressInput({ walletAddress, setWalletAddress, network }: WalletAddressInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-white text-sm font-medium">Votre adresse de réception {network}</Label>
      <Input
        type="text"
        placeholder={`Votre adresse ${network} pour recevoir les USDT`}
        value={walletAddress}
        onChange={(e) => setWalletAddress(e.target.value)}
        className="bg-terex-gray border-terex-gray-light text-white h-12 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-transparent focus:shadow-none"
        style={{ 
          boxShadow: 'none',
          outline: 'none',
          border: '1px solid #3A3A3A'
        }}
      />
      <p className="text-gray-400 text-xs">
        Entrez l'adresse de votre portefeuille {network} où vous souhaitez recevoir vos USDT
      </p>
    </div>
  );
}
