
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Info } from 'lucide-react';

interface BinancePayOptionProps {
  binancePay: boolean;
  binanceEmail: string;
  onBinancePayChange: (enabled: boolean) => void;
  onBinanceEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function BinancePayOption({ 
  binancePay, 
  binanceEmail, 
  onBinancePayChange, 
  onBinanceEmailChange 
}: BinancePayOptionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="bg-terex-gray border-terex-gray-light">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {!imageError ? (
              <img 
                src="/lovable-uploads/72ce0703-a66b-4a87-869b-8e9b7a022eb4.png" 
                alt="Binance" 
                className="w-6 h-6 rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded flex items-center justify-center">
                <span className="text-black font-bold text-xs">B</span>
              </div>
            )}
            <div>
              <Label className="text-white font-medium">Envoyer via Binance Pay</Label>
              <p className="text-gray-400 text-sm">Transfert direct sans frais réseau</p>
            </div>
          </div>
          <Switch
            checked={binancePay}
            onCheckedChange={onBinancePayChange}
            className="data-[state=checked]:bg-terex-accent data-[state=unchecked]:bg-gray-600 border-2 border-gray-500 data-[state=checked]:border-terex-accent shadow-lg"
          />
        </div>
        
        {binancePay && (
          <>
            <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-blue-200 text-sm font-medium">Avantages Binance Pay</p>
                  <ul className="text-blue-100 text-xs mt-1 space-y-1">
                    <li>• Transfert instantané sans frais</li>
                    <li>• Sécurisé par Binance</li>
                    <li>• Pas besoin de choisir un réseau</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <Label className="text-white text-sm font-medium">Email Binance</Label>
              <Input
                type="email"
                placeholder="votre.email@exemple.com"
                value={binanceEmail}
                onChange={onBinanceEmailChange}
                className="bg-terex-gray border-terex-gray-light text-white h-10"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
