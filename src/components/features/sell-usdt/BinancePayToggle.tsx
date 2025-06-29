
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BinancePayToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

// Informations Binance de TEREX - À configurer avec vos vraies informations
const TEREX_BINANCE_INFO = {
  email: 'teranga.exchange@gmail.com', // Remplacez par votre email Binance
  id: 'TEREX123456', // Remplacez par votre ID Binance
  payId: 'TEREX_PAY_ID' // Remplacez par votre Binance Pay ID
};

export function BinancePayToggle({ enabled, onToggle }: BinancePayToggleProps) {
  const [redirecting, setRedirecting] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copié !",
      description: `${label} copié dans le presse-papiers`,
    });
  };

  const handleBinanceRedirect = () => {
    setRedirecting(true);
    // Redirection vers Binance Pay - vous pouvez personnaliser cette URL
    const binanceUrl = `https://www.binance.com/fr/pay/checkout`;
    window.open(binanceUrl, '_blank');
    
    setTimeout(() => {
      setRedirecting(false);
    }, 2000);
  };

  return (
    <Card className="bg-yellow-500/10 border-yellow-500/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/26b3437e-c333-4387-aeb9-731aa705f282.png" 
              alt="Binance Pay" 
              className="w-8 h-8"
            />
            <div>
              <Label className="text-white font-medium">Payer via Binance Pay</Label>
              <p className="text-xs text-gray-400">Transfert direct sans frais</p>
            </div>
          </div>
          <Switch
            checked={enabled}
            onCheckedChange={onToggle}
            className="data-[state=checked]:bg-yellow-500"
          />
        </div>

        {enabled && (
          <div className="space-y-3 mt-4">
            <div className="bg-terex-gray rounded-lg p-3 space-y-3">
              <h4 className="text-white font-medium text-sm">Nos informations Binance :</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Email Binance</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-mono">{TEREX_BINANCE_INFO.email}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.email, 'Email Binance')}
                      className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">ID Binance</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-mono">{TEREX_BINANCE_INFO.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.id, 'ID Binance')}
                      className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Pay ID</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white text-sm font-mono">{TEREX_BINANCE_INFO.payId}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(TEREX_BINANCE_INFO.payId, 'Pay ID')}
                      className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBinanceRedirect}
              disabled={redirecting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              {redirecting ? (
                <>Redirection vers Binance...</>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ouvrir Binance Pay
                </>
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center">
              Vous serez redirigé vers Binance pour effectuer le transfert USDT
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
