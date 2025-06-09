
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

  const exchangeRates = {
    CFA: mode === 'buy' ? terexRateCfa : terexBuyRateCfa,
    CAD: mode === 'buy' ? terexRateCad : terexBuyRateCad
  };

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const usdtAmount = amount ? formatAmount(parseFloat(amount) / exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const handleStartTrading = () => {
    navigate('/auth');
  };

  return (
    <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-lg flex items-center">
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
        {/* Mode sélection */}
        <div className="flex rounded-lg bg-terex-gray p-1">
          <button
            onClick={() => setMode('buy')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === 'buy' 
                ? 'bg-terex-accent text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Acheter USDT
          </button>
          <button
            onClick={() => setMode('sell')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              mode === 'sell' 
                ? 'bg-terex-accent text-black' 
                : 'text-gray-300 hover:text-white'
            }`}
          >
            Vendre USDT
          </button>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-white text-sm">
              {mode === 'buy' ? 'Je paie' : 'Je reçois'}
            </Label>
            <div className="relative">
              <Input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-20"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="absolute right-1 top-1 w-16 h-10 bg-terex-gray-light border-0 text-terex-accent">
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
            <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
          </div>

          <div className="space-y-2">
            <Label className="text-white text-sm">
              {mode === 'buy' ? 'Je reçois' : 'J\'envoie'}
            </Label>
            <div className="relative">
              <Input
                type="text"
                value={usdtAmount}
                readOnly
                className="bg-terex-gray border-terex-gray-light text-white h-12 pr-24"
              />
              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                <img 
                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                  alt="USDT" 
                  className="w-5 h-5"
                />
                <span className="text-terex-accent font-medium text-sm">USDT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-terex-gray rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Taux TEREX ({mode === 'buy' ? 'achat' : 'vente'})
            </span>
            <span className="text-white">
              1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">Commission</span>
            <span className="text-terex-accent">
              {mode === 'buy' ? '+2%' : 'Optimisée'}
            </span>
          </div>
        </div>

        <Button 
          onClick={handleStartTrading}
          className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-black font-bold h-12"
        >
          Commencer à trader
        </Button>
      </CardContent>
    </Card>
  );
}
