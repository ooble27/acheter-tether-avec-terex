
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { useTerexRates } from '@/hooks/useTerexRates';

interface CurrencyOption {
  code: string;
  name: string;
  flag: string;
}

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
}

const currencies: CurrencyOption[] = [
  { code: 'XOF', name: 'Franc CFA', flag: '🇸🇳' },
  { code: 'CAD', name: 'Dollar Canadien', flag: '🇨🇦' }
];

const paymentProviders: PaymentProvider[] = [
  {
    id: 'wave',
    name: 'Wave',
    logo: '/lovable-uploads/6263aec7-9ad9-482d-89be-e5cac3c36ed4.png'
  },
  {
    id: 'orange',
    name: 'Orange Money',
    logo: '/lovable-uploads/86b4b50f-9595-46c2-8cce-30343f23454a.png'
  }
];

export function InteractiveCurrencyCalculator() {
  const [amount, setAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [selectedProvider, setSelectedProvider] = useState(paymentProviders[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  
  const { 
    terexRateCfa, 
    terexRateCad,
    loading, 
    error,
    lastUpdated,
    refresh
  } = useTerexRates(2);

  const getRateForCurrency = (currencyCode: string) => {
    return currencyCode === 'CAD' ? terexRateCad : terexRateCfa;
  };

  const currentRate = getRateForCurrency(selectedCurrency.code);
  
  useEffect(() => {
    if (previousRate === null) {
      setPreviousRate(currentRate);
    } else if (Math.abs(currentRate - previousRate) > 0.01) {
      setPreviousRate(currentRate);
    }
  }, [currentRate, previousRate]);

  const convertedAmount = isFlipped 
    ? (parseFloat(amount || '0') / currentRate).toFixed(6)
    : (parseFloat(amount || '0') * currentRate).toFixed(2);

  const isRateIncreasing = previousRate ? currentRate > previousRate : null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setAmount(convertedAmount);
  };

  const formatNumber = (num: string) => {
    const number = parseFloat(num);
    if (isNaN(number)) return '0';
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: isFlipped ? 6 : 2,
      maximumFractionDigits: isFlipped ? 6 : 2
    }).format(number);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Card className="bg-terex-darker/90 border-terex-accent/30 backdrop-blur-lg shadow-2xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                Calculateur de transfert
              </h3>
              <p className="text-sm text-gray-400">
                Taux en temps réel
              </p>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={refresh}
              disabled={loading}
              className="h-8 w-8 p-0 text-terex-accent hover:bg-terex-accent/10"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Currency Selector */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Devise de destination
            </label>
            <div className="grid grid-cols-2 gap-2">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedCurrency.code === currency.code
                      ? 'bg-terex-accent text-black'
                      : 'bg-terex-gray hover:bg-terex-gray-light text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <div className="text-sm font-medium">{currency.code}</div>
                      <div className="text-xs opacity-70">{currency.name}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Payment Provider Selector */}
          <div className="mb-4">
            <label className="text-sm text-gray-400 mb-2 block">
              Service de paiement
            </label>
            <div className="grid grid-cols-2 gap-2">
              {paymentProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelectedProvider(provider)}
                  className={`p-3 rounded-lg text-left transition-all ${
                    selectedProvider.id === provider.id
                      ? 'bg-terex-accent text-black'
                      : 'bg-terex-gray hover:bg-terex-gray-light text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <img 
                      src={provider.logo} 
                      alt={provider.name} 
                      className="w-6 h-6 rounded object-contain"
                    />
                    <div className="text-sm font-medium">{provider.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Interface */}
          <div className="space-y-4">
            {/* From */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {isFlipped ? selectedCurrency.name : 'Transfert d\'argent'}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
                />
                <div className="absolute right-3 top-3 flex items-center space-x-1">
                  {isFlipped ? (
                    <>
                      <span className="text-lg">{selectedCurrency.flag}</span>
                      <span className="text-terex-accent font-medium text-sm">
                        {selectedCurrency.code}
                      </span>
                    </>
                  ) : (
                    <span className="text-terex-accent font-medium text-sm">
                      EUR/USD
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Flip Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleFlip}
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full bg-terex-accent/10 hover:bg-terex-accent/20 text-terex-accent"
              >
                <ArrowUpDown className="w-4 h-4" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400">
                {isFlipped ? 'Transfert d\'argent' : selectedCurrency.name}
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={formatNumber(convertedAmount)}
                  readOnly
                  className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
                />
                <div className="absolute right-3 top-3 flex items-center space-x-1">
                  {isFlipped ? (
                    <span className="text-terex-accent font-medium text-sm">
                      EUR/USD
                    </span>
                  ) : (
                    <>
                      <span className="text-lg">{selectedCurrency.flag}</span>
                      <span className="text-terex-accent font-medium text-sm">
                        {selectedCurrency.code}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Rate Information */}
          <div className="mt-6 p-4 bg-terex-gray rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Taux TEREX via {selectedProvider.name}
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
                <span className="text-white text-sm">
                  1 EUR = {formatNumber(currentRate.toString())} {selectedCurrency.code}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">
                Dernière MAJ: {lastUpdated ? lastUpdated.toLocaleTimeString('fr-FR') : 'N/A'}
              </span>
              <span className="text-terex-accent">
                Commission: +2%
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            {['50', '100', '500'].map((quickAmount) => (
              <Button
                key={quickAmount}
                onClick={() => setAmount(quickAmount)}
                variant="outline"
                size="sm"
                className="border-terex-gray-light text-gray-300 hover:bg-terex-accent hover:text-black"
              >
                {quickAmount} {isFlipped ? selectedCurrency.code : 'EUR'}
              </Button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm">
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
