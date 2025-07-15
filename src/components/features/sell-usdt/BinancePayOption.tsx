
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface BinancePayOptionProps {
  binancePayId: string;
  setBinancePayId: (id: string) => void;
}

export function BinancePayOption({ binancePayId, setBinancePayId }: BinancePayOptionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium">Binance Pay</h3>
      
      <div className="space-y-2">
        <Label className="text-white">Binance Pay ID</Label>
        <Input
          placeholder="Votre Binance Pay ID"
          value={binancePayId}
          onChange={(e) => setBinancePayId(e.target.value)}
          className="bg-terex-gray border-terex-gray-light text-white h-12"
        />
      </div>

      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <Info className="h-4 w-4 text-yellow-400" />
        <AlertDescription className="text-yellow-200">
          Assurez-vous que votre Binance Pay ID est correct pour recevoir le paiement.
        </AlertDescription>
      </Alert>

      <Card className="bg-terex-gray border-terex-gray-light">
        <CardContent className="p-4">
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
              <p className="text-white font-medium">Paiement Binance Pay</p>
              <p className="text-gray-400 text-sm">Transfert direct sans frais réseau</p>
            </div>
          </div>
          
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
        </CardContent>
      </Card>
    </div>
  );
}
