
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useNavigate } from 'react-router-dom';

export function InternationalTransferConverter() {
  const [amount, setAmount] = useState('100');
  const [service, setService] = useState('wave');
  const navigate = useNavigate();

  const { 
    usdtToCfa, 
    usdtToCad, 
    loading: ratesLoading, 
    lastUpdated,
    refresh: refreshRates
  } = useCryptoRates();

  // Calcul du taux CAD vers CFA via USD
  const cadToUsd = usdtToCad ? (1 / usdtToCad) : 0.74;
  const usdToCfa = usdtToCfa || 600;
  const exchangeRate = Math.round(cadToUsd * usdToCfa * 100) / 100;

  // Frais selon le service
  const serviceFees = {
    wave: { percentage: 1, name: 'Wave', logo: '/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png' },
    orange: { percentage: 0.8, name: 'Orange Money', logo: '/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png' }
  };

  // Calcul du montant reçu avec déduction des frais
  const calculateReceiveAmount = () => {
    if (!amount) return '0';
    
    const baseAmount = parseFloat(amount) * exchangeRate;
    const feePercentage = serviceFees[service as keyof typeof serviceFees].percentage;
    const amountAfterFees = baseAmount * (1 - feePercentage / 100);
    
    return Math.round(amountAfterFees).toString();
  };

  const receiveAmount = calculateReceiveAmount();
  const selectedService = serviceFees[service as keyof typeof serviceFees];

  const handleStartTransfer = () => {
    navigate('/auth');
  };

  return (
    <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-sm mx-1 md:mx-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <img 
              src="/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png" 
              alt="Virement International" 
              className="w-5 h-5 mr-2"
            />
            Virement International
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={refreshRates}
            disabled={ratesLoading}
            className="h-8 w-8 p-0 text-terex-accent hover:bg-terex-accent/10"
          >
            <RefreshCw className={`w-4 h-4 ${ratesLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-400">
            Mis à jour: {lastUpdated.toLocaleTimeString('fr-FR')}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white text-sm">J'envoie</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20"
              />
              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                <span className="text-terex-accent font-medium text-sm">CAD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Le destinataire reçoit</Label>
            <div className="relative">
              <Input
                type="text"
                value={receiveAmount}
                readOnly
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20"
              />
              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                <span className="text-terex-accent font-medium text-sm">CFA</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Service de paiement</Label>
            <Select value={service} onValueChange={setService}>
              <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wave">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={serviceFees.wave.logo} 
                      alt="Wave" 
                      className="w-4 h-4"
                    />
                    <span>Wave ({serviceFees.wave.percentage}% frais)</span>
                  </div>
                </SelectItem>
                <SelectItem value="orange">
                  <div className="flex items-center space-x-2">
                    <img 
                      src={serviceFees.orange.logo} 
                      alt="Orange Money" 
                      className="w-4 h-4"
                    />
                    <span>Orange Money ({serviceFees.orange.percentage}% frais)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-terex-gray rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Taux de change</span>
            <span className="text-white">1 CAD = {exchangeRate} CFA</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Frais {selectedService.name}</span>
            <span className="text-terex-accent">{selectedService.percentage}%</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Temps de traitement</span>
            <span className="text-terex-accent">5-15 minutes</span>
          </div>
        </div>

        <Button 
          onClick={handleStartTransfer}
          className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold h-12"
        >
          Commencer le virement
        </Button>
      </CardContent>
    </Card>
  );
}
