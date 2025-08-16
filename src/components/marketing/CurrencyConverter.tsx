
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

  // Logique pour calculer le montant converti
  const getConvertedAmount = () => {
    if (mode === 'buy') {
      // Mode achat : client paie en CFA/CAD, reçoit USDT
      const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
      return amount ? formatAmount(parseFloat(amount) / exchangeRate) : '0';
    } else {
      // Mode vente : client vend USDT, reçoit CFA/CAD
      // 1 USDT = terexBuyRateCfa CFA (ou terexBuyRateCad CAD)
      const exchangeRate = currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad;
      return amount ? formatAmount(parseFloat(amount) * exchangeRate) : '0';
    }
  };

  // Calculer le montant USDT basé sur le montant fiat saisi dans "Je reçois"
  const getUSDTFromFiat = () => {
    if (mode === 'buy') {
      // Mode achat : calcul inverse - USDT vers CFA/CAD
      const exchangeRate = currency === 'CFA' ? terexRateCfa : terexRateCad;
      return usdtAmount ? formatAmount(parseFloat(usdtAmount) * exchangeRate) : '0';
    } else {
      // Mode vente : calcul inverse - CFA/CAD vers USDT
      // Si client veut recevoir X CFA, il doit vendre X/taux USDT
      const exchangeRate = currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad;
      return usdtAmount ? formatAmount(parseFloat(usdtAmount) / exchangeRate) : '0';
    }
  };

  const handleFiatAmountChange = (value: string) => {
    if (mode === 'sell') {
      // En mode vente, si on change "Je reçois", on calcule "Je vends"
      setUsdtAmount(value);
      setAmount(''); // Réinitialiser l'USDT
    } else {
      // En mode achat, comportement normal
      setAmount(value);
      setUsdtAmount(''); // Réinitialiser l'USDT quand on change le fiat
    }
  };

  const handleUSDTAmountChange = (value: string) => {
    if (mode === 'sell') {
      // En mode vente, si on change "Je vends", on calcule "Je reçois"
      setAmount(value);
      setUsdtAmount(''); // Réinitialiser le fiat
    } else {
      // En mode achat, comportement normal
      setUsdtAmount(value);
      setAmount(''); // Réinitialiser le fiat quand on change l'USDT
    }
  };

  // Déterminer quel montant afficher
  const displayedFiatAmount = mode === 'buy' 
    ? (amount || (usdtAmount ? getUSDTFromFiat() : ''))
    : (usdtAmount || (amount ? getConvertedAmount() : ''));
    
  const displayedUSDTAmount = mode === 'buy'
    ? (usdtAmount || (amount ? getConvertedAmount() : ''))
    : (amount || (usdtAmount ? getUSDTFromFiat() : ''));

  const handleStartTrading = () => {
    navigate('/auth');
  };

  const inputClasses = "bg-terex-gray border-terex-gray-light text-white h-12 focus:bg-terex-gray focus:border-terex-gray-light focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-transparent focus:shadow-none";
  const inputStyle = { 
    boxShadow: 'none',
    outline: 'none',
    border: '1px solid #3A3A3A'
  };

  const selectTriggerClasses = "bg-terex-gray-light border-0 text-terex-accent focus:ring-0 focus:ring-offset-0 focus:outline-none focus:ring-transparent focus-visible:ring-0 focus-visible:ring-offset-0 focus:shadow-none";

  return (
    <Card className="bg-terex-darker/80 border-terex-accent/30 backdrop-blur-sm mx-1 md:mx-0">
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
          {mode === 'buy' ? (
            // Mode Achat : Je paie en CFA/CAD, je reçois USDT
            <>
              <div className="space-y-2">
                <Label className="text-white text-sm">Je paie</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedFiatAmount}
                    onChange={(e) => handleFiatAmountChange(e.target.value)}
                    className={`${inputClasses} pr-20`}
                    style={inputStyle}
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className={`absolute right-1 top-1 w-16 h-10 ${selectTriggerClasses}`} style={inputStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-gray border-terex-gray-light">
                      <SelectItem value="CFA" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light focus:text-white focus:outline-none focus:ring-0">CFA</SelectItem>
                      <SelectItem value="CAD" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light focus:text-white focus:outline-none focus:ring-0">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Je reçois</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedUSDTAmount}
                    onChange={(e) => handleUSDTAmountChange(e.target.value)}
                    className={`${inputClasses} pr-24`}
                    style={inputStyle}
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
            </>
          ) : (
            // Mode Vente : Je vends USDT, je reçois CFA/CAD
            <>
              <div className="space-y-2">
                <Label className="text-white text-sm">Je vends</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedUSDTAmount}
                    onChange={(e) => handleUSDTAmountChange(e.target.value)}
                    className={`${inputClasses} pr-24`}
                    style={inputStyle}
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

              <div className="flex items-center justify-center">
                <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
              </div>

              <div className="space-y-2">
                <Label className="text-white text-sm">Je reçois</Label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={displayedFiatAmount}
                    onChange={(e) => handleFiatAmountChange(e.target.value)}
                    className={`${inputClasses} pr-20`}
                    style={inputStyle}
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className={`absolute right-1 top-1 w-16 h-10 ${selectTriggerClasses}`} style={inputStyle}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-gray border-terex-gray-light">
                      <SelectItem value="CFA" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light focus:text-white focus:outline-none focus:ring-0">CFA</SelectItem>
                      <SelectItem value="CAD" className="text-white hover:bg-terex-gray-light focus:bg-terex-gray-light focus:text-white focus:outline-none focus:ring-0">CAD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-terex-gray rounded-lg p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">
              Taux TEREX ({mode === 'buy' ? 'achat' : 'vente'})
            </span>
            <span className="text-white">
              1 USDT = {mode === 'buy' 
                ? (currency === 'CFA' ? terexRateCfa : terexRateCad)
                : (currency === 'CFA' ? terexBuyRateCfa : terexBuyRateCad)
              } {currency}
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
