
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BinanceEmailInputProps {
  email: string;
  setEmail: (email: string) => void;
}

export function BinanceEmailInput({ email, setEmail }: BinanceEmailInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-white text-sm font-medium flex items-center space-x-2">
        <img 
          src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
          alt="Binance" 
          className="w-4 h-4 rounded"
        />
        <span>Email de votre compte Binance</span>
      </Label>
      <Input
        type="email"
        placeholder="votre-email@exemple.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="bg-terex-gray border-terex-gray-light text-white h-12"
      />
      <p className="text-gray-400 text-xs">
        Entrez l'email associé à votre compte Binance pour recevoir vos USDT directement
      </p>
    </div>
  );
}
