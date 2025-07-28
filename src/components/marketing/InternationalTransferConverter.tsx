
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw, Send } from 'lucide-react';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { useNavigate } from 'react-router-dom';

export function InternationalTransferConverter() {
  const [amount, setAmount] = useState('100');
  const [recipientCountry, setRecipientCountry] = useState('SN');
  const [receiveMethod, setReceiveMethod] = useState('mobile');
  const [provider, setProvider] = useState('wave');
  const navigate = useNavigate();

  const { usdtToCfa, usdtToCad, loading: ratesLoading, lastUpdated, refresh: refreshRates } = useCryptoRates();

  const availableCountries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' }
  ];

  // Calcul du taux CAD vers CFA via USD
  const cadToUsd = usdtToCad ? (1 / usdtToCad) : 0.74;
  const usdToCfa = usdtToCfa || 600;
  const exchangeRate = Math.round(cadToUsd * usdToCfa * 100) / 100;

  // Calcul du montant à recevoir avec déduction des frais selon le service
  const calculateReceiveAmount = () => {
    if (!amount) return '0.00';
    
    const baseAmount = parseFloat(amount) * exchangeRate;
    
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') {
        // Déduction de 1% pour Wave
        return (baseAmount * 0.99).toFixed(2);
      } else if (provider === 'orange') {
        // Déduction de 0.8% pour Orange Money
        return (baseAmount * 0.992).toFixed(2);
      }
    }
    
    return baseAmount.toFixed(2);
  };

  const receiveAmount = calculateReceiveAmount();

  const handleStartTransfer = () => {
    navigate('/auth');
  };

  const getFees = () => {
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') return '1% Wave';
      if (provider === 'orange') return '0.8% Orange Money';
    }
    return 'Variable';
  };

  return (
    <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-sm mx-1 md:mx-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
            <Send className="w-5 h-5 mr-2 text-terex-accent" />
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
            <Label className="text-white text-sm">Vous envoyez</Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20"
              />
              <div className="absolute right-2 top-2 bg-terex-gray-light rounded px-2 py-1">
                <span className="text-terex-accent font-medium text-sm">CAD</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Destinataire reçoit</Label>
            <div className="relative">
              <Input
                type="text"
                value={receiveAmount}
                readOnly
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20"
              />
              <div className="absolute right-2 top-2 bg-terex-gray-light rounded px-2 py-1">
                <span className="text-terex-accent font-medium text-sm">CFA</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white text-sm">Pays de destination</Label>
            <Select value={recipientCountry} onValueChange={setRecipientCountry}>
              <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-10">
                <SelectValue placeholder="Sélectionner un pays" />
              </SelectTrigger>
              <SelectContent>
                {availableCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <div className="flex items-center space-x-2">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">Mode de réception</Label>
            <Select value={receiveMethod} onValueChange={setReceiveMethod}>
              <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobile">Mobile Money</SelectItem>
                <SelectItem value="bank">Virement bancaire</SelectItem>
                <SelectItem value="cash">Retrait en espèces</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {receiveMethod === 'mobile' && (
            <div className="space-y-2">
              <Label className="text-white text-sm">Service</Label>
              <Select value={provider} onValueChange={setProvider}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wave">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="/lovable-uploads/6399d0b4-abb9-4b62-97ad-516c0213a601.png" 
                        alt="Wave" 
                        className="w-4 h-4 rounded-full"
                      />
                      <span>Wave</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="orange">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="/lovable-uploads/49a20f85-382b-4dd2-aefe-98214bea6069.png" 
                        alt="Orange Money" 
                        className="w-4 h-4 rounded-full"
                      />
                      <span>Orange Money</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="bg-terex-gray rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Taux de change</span>
            <span className="text-white">1 CAD = {exchangeRate} CFA</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Frais Terex</span>
            <span className="text-green-500 font-medium">GRATUIT</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Frais du service</span>
            <span className="text-yellow-400">{getFees()}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Délai</span>
            <span className="text-terex-accent">3-5 min</span>
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
