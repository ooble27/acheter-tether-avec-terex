
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface DestinationSelectorProps {
  destination: 'wallet' | 'binance';
  setDestination: (destination: 'wallet' | 'binance') => void;
}

export function DestinationSelector({ destination, setDestination }: DestinationSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-white text-sm font-medium">Où souhaitez-vous recevoir vos USDT ?</Label>
      <RadioGroup value={destination} onValueChange={(value) => setDestination(value as 'wallet' | 'binance')} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border border-terex-gray-light rounded-lg hover:border-terex-accent/50 transition-colors">
          <RadioGroupItem value="wallet" id="wallet" className="text-terex-accent" />
          <div className="flex items-center space-x-2 flex-1">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1168/1168610.png" 
              alt="Wallet" 
              className="w-6 h-6"
            />
            <div>
              <Label htmlFor="wallet" className="text-white font-medium cursor-pointer">
                Mon portefeuille personnel
              </Label>
              <p className="text-gray-400 text-xs">
                Recevez directement dans votre portefeuille crypto
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border border-terex-gray-light rounded-lg hover:border-terex-accent/50 transition-colors">
          <RadioGroupItem value="binance" id="binance" className="text-terex-accent" />
          <div className="flex items-center space-x-2 flex-1">
            <img 
              src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
              alt="Binance" 
              className="w-6 h-6 rounded-md"
            />
            <div>
              <Label htmlFor="binance" className="text-white font-medium cursor-pointer">
                Mon compte Binance
              </Label>
              <p className="text-gray-400 text-xs">
                Transfert direct vers votre compte Binance (Plus rapide)
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
