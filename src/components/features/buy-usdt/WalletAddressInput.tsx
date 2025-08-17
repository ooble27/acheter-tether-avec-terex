
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WalletAddressInputProps {
  walletAddress: string;
  onWalletAddressChange: (address: string) => void;
  network: string;
}

export function WalletAddressInput({ walletAddress, onWalletAddressChange, network }: WalletAddressInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-white text-sm font-medium">Votre adresse de réception {network}</Label>
      <Input
        type="text"
        placeholder={`Votre adresse ${network} pour recevoir les USDT`}
        value={walletAddress}
        onChange={(e) => onWalletAddressChange(e.target.value)}
        className="bg-terex-gray border-terex-gray-light text-white h-12"
      />
      <p className="text-gray-400 text-xs">
        Entrez l'adresse de votre portefeuille {network} où vous souhaitez recevoir vos USDT
      </p>
    </div>
  );
}
