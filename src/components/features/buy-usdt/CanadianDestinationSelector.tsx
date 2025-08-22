
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';

interface CanadianDestinationSelectorProps {
  destination: 'wallet' | 'trust' | 'kraken';
  setDestination: (destination: 'wallet' | 'trust' | 'kraken') => void;
}

export function CanadianDestinationSelector({ destination, setDestination }: CanadianDestinationSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-white text-sm font-medium">Où souhaitez-vous recevoir vos USDT ?</Label>
      <RadioGroup value={destination} onValueChange={(value) => setDestination(value as 'wallet' | 'trust' | 'kraken')} className="space-y-3">
        <div className="flex items-center space-x-3 p-3 border border-terex-gray-light rounded-lg hover:border-terex-accent/50 transition-colors">
          <RadioGroupItem value="wallet" id="wallet" className="text-terex-accent" />
          <div className="flex items-center space-x-2 flex-1">
            <svg className="w-6 h-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="16" fill="#26A17B"/>
              <path d="M17.922 17.383v-.002c-.11.008-.677.042-1.942.042-1.01 0-1.721-.03-1.971-.042v.003c-3.888-.171-6.79-.848-6.79-1.658 0-.809 2.902-1.486 6.79-1.66v2.644c.254.018.982.061 1.988.061 1.207 0 1.812-.05 1.925-.06v-2.643c3.88.173 6.775.85 6.775 1.658 0 .81-2.895 1.485-6.775 1.657m0-3.59v-2.366h5.414V7.819H8.595v3.608h5.414v2.365c-4.4.202-7.709 1.074-7.709 2.148 0 1.074 3.309 1.945 7.709 2.147v7.582h3.913v-7.584c4.393-.202 7.694-1.073 7.694-2.147 0-1.073-3.301-1.944-7.694-2.145" fill="white"/>
            </svg>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <Label htmlFor="wallet" className="text-white font-medium cursor-pointer">
                  Portefeuille USDT
                </Label>
                <Badge variant="outline" className="text-terex-accent border-terex-accent text-xs">
                  Recommandé
                </Badge>
              </div>
              <p className="text-gray-400 text-xs">
                Votre portefeuille crypto personnel (MetaMask, etc.)
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 border border-terex-gray-light rounded-lg hover:border-terex-accent/50 transition-colors">
          <RadioGroupItem value="trust" id="trust" className="text-terex-accent" />
          <div className="flex items-center space-x-2 flex-1">
            <img 
              src="https://trustwallet.com/assets/images/media/assets/trust_platform.svg" 
              alt="Trust Wallet" 
              className="w-6 h-6 rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiMzMzc1QkIiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJMMTQgOEw4IDE0TDIgOEw4IDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
              }}
            />
            <div>
              <Label htmlFor="trust" className="text-white font-medium cursor-pointer">
                Trust Wallet
              </Label>
              <p className="text-gray-400 text-xs">
                Populaire au Canada, interface simple
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 border border-terex-gray-light rounded-lg hover:border-terex-accent/50 transition-colors">
          <RadioGroupItem value="kraken" id="kraken" className="text-terex-accent" />
          <div className="flex items-center space-x-2 flex-1">
            <img 
              src="https://assets.coingecko.com/exchanges_logo_thumb/kraken.jpg" 
              alt="Kraken" 
              className="w-6 h-6 rounded-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM1NzQxRkYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJMMTQgOEw4IDE0TDIgOEw4IDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4KPC9zdmc+';
              }}
            />
            <div>
              <Label htmlFor="kraken" className="text-white font-medium cursor-pointer">
                Kraken
              </Label>
              <p className="text-gray-400 text-xs">
                Autorisé au Canada, plateforme réglementée
              </p>
            </div>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
