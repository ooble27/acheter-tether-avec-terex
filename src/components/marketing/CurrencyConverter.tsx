import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw } from 'lucide-react';
import { useTerexRates } from '@/hooks/useTerexRates';
import { useNavigate } from 'react-router-dom';

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [usdtAmount, setUsdtAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [mode, setMode] = useState<'buy' | 'sell'>('buy');
  const navigate = useNavigate();

  const { 
    terexRateCfa, 
    terexRateCad, 
    terexBuyRateCfa, 
    terexBuyRateCad,
    loading: ratesLoading, 
    lastUpdated,
    refresh: refreshRates
  } = useTerexRates(2);

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const getConvertedAmount = () => {
    if (mode === 'buy') {
      const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
      return amount ? formatAmount(parseFloat(amount) / exchangeRate) : '0';
    } else {
      const exchangeRate = currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad;
      return amount ? formatAmount(parseFloat(amount) * exchangeRate) : '0';
    }
  };

  const getUSDTFromFiat = () => {
    if (mode === 'buy') {
      const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
      return usdtAmount ? formatAmount(parseFloat(usdtAmount) * exchangeRate) : '0';
    } else {
      const exchangeRate = currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad;
      return usdtAmount ? formatAmount(parseFloat(usdtAmount) / exchangeRate) : '0';
    }
  };

  const handleFiatAmountChange = (value: string) => {
    if (mode === 'sell') {
      setUsdtAmount(value);
      setAmount('');
    } else {
      setAmount(value);
      setUsdtAmount('');
    }
  };

  const handleUSDTAmountChange = (value: string) => {
    if (mode === 'sell') {
      setAmount(value);
      setUsdtAmount('');
    } else {
      setUsdtAmount(value);
      setAmount('');
    }
  };

  const displayedFiatAmount = mode === 'buy' 
    ? (amount || (usdtAmount ? getUSDTFromFiat() : ''))
    : (usdtAmount || (amount ? getConvertedAmount() : ''));
    
  const displayedUSDTAmount = mode === 'buy'
    ? (usdtAmount || (amount ? getConvertedAmount() : ''))
    : (amount || (usdtAmount ? getUSDTFromFiat() : ''));

  const handleStartTrading = () => {
    navigate('/auth');
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-lg rounded-xl mx-1 md:mx-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-900 text-lg flex items-center font-medium">
            <img 
              src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
              alt="USDT" 
              className="w-5 h-5 mr-2"
            />
            Convertisseur USDT
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
        {/* Mode sélection - Attio style */}
        <div className="flex rounded-xl bg-gray-50 p-1">
          <button
            onClick={() => setMode('buy')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === 'buy' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Acheter USDT
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${
              mode === 'sell' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Vendre USDT
          </button>
        </div>

        <div className="space-y-3">
          {mode === 'buy' ? (
            <>
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Je paie</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedFiatAmount}
                    onChange={(e) => handleFiatAmountChange(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-12 pr-20 focus:border-terex-accent focus:ring-terex-accent/20"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-white border-gray-200 text-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CFA">CFA</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="p-2 rounded-full bg-gray-50">
                  <ArrowRightLeft className="w-4 h-4 text-terex-accent" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Je reçois</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedUSDTAmount}
                    onChange={(e) => handleUSDTAmountChange(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-12 pr-24 focus:border-terex-accent focus:ring-terex-accent/20"
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-2 py-1">
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                      alt="USDT" 
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium text-sm">USDT</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Je vends</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedUSDTAmount}
                    onChange={(e) => handleUSDTAmountChange(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-12 pr-24 focus:border-terex-accent focus:ring-terex-accent/20"
                  />
                  <div className="absolute right-2 top-2 flex items-center space-x-1 bg-white border border-gray-200 rounded-lg px-2 py-1">
                    <img 
                      src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                      alt="USDT" 
                      className="w-5 h-5"
                    />
                    <span className="text-gray-700 font-medium text-sm">USDT</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="p-2 rounded-full bg-gray-50">
                  <ArrowRightLeft className="w-4 h-4 text-terex-accent" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 text-sm font-medium">Je reçois</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedFiatAmount}
                    onChange={(e) => handleFiatAmountChange(e.target.value)}
                    className="bg-gray-50 border-gray-200 text-gray-900 h-12 pr-20 focus:border-terex-accent focus:ring-terex-accent/20"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-white border-gray-200 text-gray-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CFA">CFA</SelectItem>
                      <SelectItem value="CAD">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">
              Taux TEREX ({mode === 'buy' ? 'achat' : 'vente'})
            </span>
            <span className="text-gray-900 font-medium">
              1 USDT = {mode === 'buy' 
                ? (currency === 'CFA' ? terexRateCfa : terexRateCad)
                : (currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad)
              } {currency}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">Commission</span>
            <span className="text-terex-accent font-medium">
              {mode === 'buy' ? '+2%' : 'Optimisée'}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleStartTrading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium h-12 rounded-xl"
        >
          Commencer à trader
        </Button>
      </CardContent>
    </Card>
  );
}
