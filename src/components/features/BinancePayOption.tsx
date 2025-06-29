
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Informations Binance Pay de TEREX - À configurer selon vos vraies informations
const TEREX_BINANCE_INFO = {
  email: 'terex.payments@binance.com', // Remplacez par votre vrai email Binance
  binanceId: '123456789', // Remplacez par votre vrai Binance ID
  displayName: 'TEREX Payments'
};

interface BinancePayOptionProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  usdtAmount: string;
}

export function BinancePayOption({ enabled, onToggle, usdtAmount }: BinancePayOptionProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copié !",
      description: `${field} copié dans le presse-papiers`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Toggle pour activer Binance Pay */}
      <div className="flex items-center justify-between p-4 bg-terex-gray/30 rounded-lg">
        <div className="flex items-center space-x-3">
          <img 
            src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
            alt="Binance" 
            className="w-6 h-6 rounded"
          />
          <div>
            <Label className="text-white font-medium">Payer via Binance Pay</Label>
            <p className="text-gray-400 text-xs">Envoyez vos USDT directement depuis Binance</p>
          </div>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-terex-accent"
        />
      </div>

      {/* Informations Binance Pay de TEREX */}
      {enabled && (
        <Card className="bg-terex-gray/30 border-terex-accent/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-lg flex items-center">
              <img 
                src="https://s2.coinmarketcap.com/static/img/exchanges/64x64/270.png" 
                alt="Binance" 
                className="w-5 h-5 mr-2 rounded"
              />
              Envoyer via Binance Pay
            </CardTitle>
            <Badge variant="outline" className="text-terex-accent border-terex-accent w-fit">
              Méthode rapide et sécurisée
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-terex-accent/10 border border-terex-accent/30 rounded-lg p-4">
              <h4 className="text-white font-medium mb-3">Informations de réception TEREX</h4>
              
              <div className="space-y-3">
                {/* Email Binance */}
                <div>
                  <Label className="text-gray-400 text-sm">Email Binance</Label>
                  <div className="flex items-center justify-between bg-terex-gray/50 p-3 rounded mt-1">
                    <span className="text-white font-mono text-sm">{TEREX_BINANCE_INFO.email}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.email, 'Email')}
                      className="h-8 w-8 p-0 border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                    >
                      {copiedField === 'Email' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {/* ID Binance */}
                <div>
                  <Label className="text-gray-400 text-sm">ID Binance</Label>
                  <div className="flex items-center justify-between bg-terex-gray/50 p-3 rounded mt-1">
                    <span className="text-white font-mono text-sm">{TEREX_BINANCE_INFO.binanceId}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.binanceId, 'ID Binance')}
                      className="h-8 w-8 p-0 border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                    >
                      {copiedField === 'ID Binance' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>

                {/* Nom d'affichage */}
                <div>
                  <Label className="text-gray-400 text-sm">Nom du destinataire</Label>
                  <div className="flex items-center justify-between bg-terex-gray/50 p-3 rounded mt-1">
                    <span className="text-white font-medium text-sm">{TEREX_BINANCE_INFO.displayName}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.displayName, 'Nom')}
                      className="h-8 w-8 p-0 border-terex-accent/50 text-terex-accent hover:bg-terex-accent hover:text-white"
                    >
                      {copiedField === 'Nom' ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h4 className="text-blue-200 font-medium mb-2">Instructions d'envoi</h4>
              <ul className="text-blue-100 text-sm space-y-1">
                <li>• Ouvrez votre application Binance</li>
                <li>• Allez dans "Pay" puis "Envoyer"</li>
                <li>• Utilisez l'email ou l'ID ci-dessus</li>
                <li>• Montant: {usdtAmount || '0'} USDT</li>
                <li>• Confirmez l'envoi</li>
              </ul>
            </div>

            {/* Avertissement */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
              <p className="text-amber-200 text-xs">
                ⚠️ Assurez-vous d'envoyer exactement <strong>{usdtAmount || '0'} USDT</strong> via Binance Pay. 
                Les envois incorrects peuvent retarder le traitement.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
