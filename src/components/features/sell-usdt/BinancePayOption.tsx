
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Info } from 'lucide-react';

interface BinancePayOptionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

export function BinancePayOption({ enabled, onToggle }: BinancePayOptionProps) {
  return (
    <Card className="bg-terex-gray border-terex-gray-light">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://cryptologos.cc/logos/binance-coin-bnb-logo.png" 
              alt="Binance" 
              className="w-6 h-6"
            />
            <div>
              <Label className="text-white font-medium">Envoyer via Binance Pay</Label>
              <p className="text-gray-400 text-sm">Transfert direct sans frais réseau</p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-terex-accent"
          />
        </div>
        
        {enabled && (
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
        )}
      </CardContent>
    </Card>
  );
}
