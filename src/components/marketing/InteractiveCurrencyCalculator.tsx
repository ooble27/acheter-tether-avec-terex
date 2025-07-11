
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
  country: string;
}

const africanCurrencies: CurrencyOption[] = [
  { code: 'XOF', name: 'Franc CFA', flag: '🇸🇳', country: 'Sénégal' },
  { code: 'XAF', name: 'Franc CFA Central', flag: '🇨🇲', country: 'Cameroun' },
  { code: 'NGN', name: 'Naira', flag: '🇳🇬', country: 'Nigeria' },
  { code: 'KES', name: 'Shilling', flag: '🇰🇪', country: 'Kenya' },
  { code: 'GHS', name: 'Cedi', flag: '🇬🇭', country: 'Ghana' },
  { code: 'MAD', name: 'Dirham', flag: '🇲🇦', country: 'Maroc' }
];

export function InteractiveCurrencyCalculator() {
  const [usdtAmount, setUsdtAmount] = useState('100');
  const [selectedCurrency, setSelectedCurrency] = useState(africanCurrencies[0]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [previousRate, setPreviousRate] = useState<number | null>(null);
  
  const { 
    terexRateCfa, 
    marketRateCfa, 
    loading, 
    error,
    lastUpdated,
    refresh
  } = useTerexRates(2);

  // Simulation des taux pour les autres devises (en production, ces données viendraient d'une API)
  const getRateForCurrency = (currencyCode: string) => {
    const baseRate = terexRateCfa;
    const rates: { [key: string]: number } = {
      'XOF': baseRate,
      'XAF': baseRate * 1.1,
      'NGN': baseRate * 0.7,
      'KES': baseRate * 0.008,
      'GHS': baseRate * 0.1,
      'MAD': baseRate * 0.06
    };
    return rates[currencyCode] || baseRate;
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
    ? (parseFloat(usdtAmount || '0') / currentRate).toFixed(6)
    : (parseFloat(usdtAmount || '0') * currentRate).toFixed(2);

  const isRateIncreasing = previousRate ? currentRate > previousRate : null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setUsdtAmount(convertedAmount);
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
                Calculateur USDT
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
              Devise africaine
            </label>
            <div className="grid grid-cols-2 gap-2">
              {africanCurrencies.slice(0, 6).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => setSelectedCurrency(currency)}
                  className={`p-2 rounded-lg text-left transition-all ${
                    selectedCurrency.code === currency.code
                      ? 'bg-terex-accent text-black'
                      : 'bg-terex-gray hover:bg-terex-gray-light text-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{currency.flag}</span>
                    <div>
                      <div className="text-xs font-medium">{currency.code}</div>
                      <div className="text-xs opacity-70">{currency.country}</div>
                    </div>
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
                {isFlipped ? selectedCurrency.name : 'USDT Tether'}
              </label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={usdtAmount}
                  onChange={(e) => setUsdtAmount(e.target.value)}
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
                    <>
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                        alt="USDT" 
                        className="w-5 h-5"
                      />
                      <span className="text-terex-accent font-medium text-sm">USDT</span>
                    </>
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
                {isFlipped ? 'USDT Tether' : selectedCurrency.name}
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
                    <>
                      <img 
                        src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                        alt="USDT" 
                        className="w-5 h-5"
                      />
                      <span className="text-terex-accent font-medium text-sm">USDT</span>
                    </>
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
                Taux TEREX
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
                  1 USDT = {formatNumber(currentRate.toString())} {selectedCurrency.code}
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
            {['50', '100', '500'].map((amount) => (
              <Button
                key={amount}
                onClick={() => setUsdtAmount(amount)}
                variant="outline"
                size="sm"
                className="border-terex-gray-light text-gray-300 hover:bg-terex-accent hover:text-black"
              >
                {amount} {isFlipped ? selectedCurrency.code : 'USDT'}
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
