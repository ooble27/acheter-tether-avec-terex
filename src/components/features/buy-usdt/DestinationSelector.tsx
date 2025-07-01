
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
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
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
