
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useTerexRates } from '@/hooks/useTerexRates';

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  fee: number; // Pourcentage de frais
}

const paymentProviders: PaymentProvider[] = [
  {
    id: 'terex',
    name: 'Terex',
    logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png',
    fee: 0
  },
  {
    id: 'wave',
    name: 'Wave',
    logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png',
    fee: 0.8
  },
  {
    id: 'orange',
    name: 'Orange Money',
    logo: '/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png',
    fee: 1
  }
];

export function InteractiveCurrencyCalculator() {
  const [amount, setAmount] = useState('100');
  const [selectedProvider, setSelectedProvider] = useState(paymentProviders[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  
  const { 
    terexRateCfa, 
    terexRateCad,
    marketRateCfa,
    marketRateCad,
    loading, 
    error,
    lastUpdated,
    refresh
  } = useTerexRates(2);

  // Utiliser les vrais taux de marché comme dans TransferSidebar
  const exchangeRate = marketRateCfa / marketRateCad; // CAD vers CFA
  
  useEffect(() => {
    if (previousRate === null) {
      setPreviousRate(exchangeRate);
    } else if (Math.abs(exchangeRate - previousRate) > 0.01) {
      setPreviousRate(exchangeRate);
    }
  }, [exchangeRate, previousRate]);

  const calculateConversion = () => {
    const sendAmount = parseFloat(amount || '0');
    const convertedAmount = sendAmount * exchangeRate;
    const providerFee = convertedAmount * (selectedProvider.fee / 100);
    const finalAmount = convertedAmount - providerFee;
    
    return {
      converted: convertedAmount,
      fee: providerFee,
      final: finalAmount
    };
  };

  const { converted, fee, final } = calculateConversion();

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (isFlipped) {
      setAmount((final / exchangeRate).toFixed(2));
    } else {
      setAmount((final * exchangeRate).toFixed(2));
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const isRateIncreasing = previousRate ? exchangeRate > previousRate : null;

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-terex-darker/90 border-terex-accent/30 backdrop-blur-lg shadow-2xl">
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                Calculateur de transfert
              </h3>
              <p className="text-xs text-gray-400">
                Taux en temps réel
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
              disabled={loading}
              className="h-6 w-6 p-0 text-terex-accent hover:bg-terex-accent/10"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Service de réception */}
          <div className="mb-4">
            <label className="text-xs text-gray-400 mb-2 block">
              Service de réception
            </label>
            <div className="grid grid-cols-3 gap-1">
              {paymentProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-2 rounded-lg text-left transition-all ${
                    selectedProvider.id === provider.id
                      ? 'bg-terex-accent text-black'
                      : 'bg-terex-gray hover:bg-terex-gray-light text-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-1">
                    <img 
                      src={provider.logo} 
                      alt={provider.name} 
                      className="w-4 h-4 rounded object-contain"
                    />
                    <div className="text-xs font-medium text-center">{provider.name}</div>
                    <div className="text-xs opacity-70">{provider.fee}%</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Interface */}
          <div className="space-y-3">
            {/* From CAD */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">
                Vous envoyez
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white text-sm h-10 pr-16"
                />
                <div className="absolute right-3 top-2.5 text-terex-accent font-medium text-xs">
                  CAD
                </div>
              </div>
            </div>

            {/* Flip Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleFlip}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-terex-accent/10 hover:bg-terex-accent/20 text-terex-accent"
              >
                <ArrowUpDown className="w-3 h-3" />
              </Button>
            </div>

            {/* To CFA */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">
                Il/Elle reçoit
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={formatNumber(final)}
                  readOnly
                  className="bg-terex-gray border-terex-gray-light text-white text-sm h-10 pr-16"
                />
                <div className="absolute right-3 top-2.5 text-terex-accent font-medium text-xs">
                  CFA
                </div>
              </div>
            </div>
          </div>

          {/* Rate Information */}
          <div className="mt-4 p-3 bg-terex-gray rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">
                Taux via {selectedProvider.name}
              </span>
              <div className="flex items-center space-x-1">
                {isRateIncreasing !== null && (
                  <>
                    {isRateIncreasing ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                  </>
                )}
                <span className="text-white text-xs">
                  1 CAD = {formatNumber(exchangeRate)} CFA
                </span>
              </div>
            </div>
            
            {selectedProvider.fee > 0 && (
              <div className="text-xs text-gray-500 mb-1">
                Frais {selectedProvider.name}: {formatNumber(fee)} CFA ({selectedProvider.fee}%)
              </div>
            )}
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                MAJ: {lastUpdated ? lastUpdated.toLocaleTimeString('fr-FR') : 'N/A'}
              </span>
              {selectedProvider.fee === 0 && (
                <span className="text-terex-accent">
                  Sans frais
                </span>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-xs">
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
