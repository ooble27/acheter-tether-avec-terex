
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SellOrderConfirmation } from './SellOrderConfirmation';
import { USDTSendingInstructions } from './USDTSendingInstructions';
import { USDTSentConfirmation } from './USDTSentConfirmation';
import { useOrders } from '@/hooks/useOrders';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { useTerexRates } from '@/hooks/useTerexRates';
import { SellNetworkSelector } from './sell-usdt/SellNetworkSelector';

export function SellUSDT() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [usdtAmount, setUsdtAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSentConfirmation, setShowSentConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState('');

  const { createOrder } = useOrders();
  const { user } = useAuth();
  const { toast } = useToast();

  const { 
    terexRateCfa, 
    terexRateCad, 
    marketRateCfa, 
    marketRateCad, 
    loading: ratesLoading, 
    error: ratesError,
    lastUpdated,
    refresh: refreshRates
  } = useTerexRates(2);

  const exchangeRates = {
    CFA: terexRateCfa,
    CAD: terexRateCad
  };

  const marketRates = {
    CFA: marketRateCfa,
    CAD: marketRateCad
  };

  const formatAmount = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    if (isNaN(num)) return '0';
    
    if (num === Math.floor(num)) {
      return num.toString();
    }
    
    return parseFloat(num.toFixed(2)).toString();
  };

  const fiatAmount = usdtAmount ? formatAmount(parseFloat(usdtAmount) * exchangeRates[currency as keyof typeof exchangeRates]) : '0';

  const handleSellClick = () => {
    if (!usdtAmount) {
      toast({
        title: "Montant requis",
        description: "Veuillez entrer le montant d'USDT à vendre",
        variant: "destructive",
      });
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    if (!user) return;
    
    setLoading(true);
    
    const orderData = {
      user_id: user.id,
      type: 'sell' as const,
      amount: parseFloat(fiatAmount),
      currency,
      usdt_amount: parseFloat(usdtAmount),
      exchange_rate: exchangeRates[currency as keyof typeof exchangeRates],
      payment_method: 'crypto',
      network,
      status: 'pending' as const,
      payment_status: 'pending'
    };

    const result = await createOrder(orderData);
    
    if (result) {
      setCurrentOrderId(result.id);
      setShowConfirmation(false);
      setShowInstructions(true);
    }
    
    setLoading(false);
  };

  const handleUSDTSent = () => {
    setShowInstructions(false);
    setShowSentConfirmation(true);
  };

  const handleBackToHome = () => {
    setUsdtAmount('');
    setShowSentConfirmation(false);
    setCurrentOrderId('');
  };

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  if (showSentConfirmation) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <USDTSentConfirmation
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
          }}
          orderId={currentOrderId}
          onBackToHome={handleBackToHome}
        />
      </KYCProtection>
    );
  }

  if (showInstructions) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <USDTSendingInstructions
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
          }}
          orderId={currentOrderId}
          onBack={() => setShowInstructions(false)}
          onUSDTSent={handleUSDTSent}
        />
      </KYCProtection>
    );
  }

  if (showConfirmation) {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <SellOrderConfirmation
          orderData={{
            amount: fiatAmount,
            currency,
            usdtAmount,
            network,
            exchangeRate: exchangeRates[currency as keyof typeof exchangeRates]
          }}
          onConfirm={handleConfirmOrder}
          onBack={() => setShowConfirmation(false)}
          loading={loading}
        />
      </KYCProtection>
    );
  }

  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-terex-dark p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Vendre USDT</h1>
            <p className="text-gray-400">Vendez vos USDT contre de l'argent fiat</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-terex-darker border-terex-gray shadow-2xl">
                <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg md:text-xl">Vendre USDT</CardTitle>
                    <Badge variant="outline" className="text-terex-accent border-terex-accent">
                      Taux en temps réel
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  {/* Amount Input Section */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Montant USDT</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={usdtAmount}
                            onChange={(e) => setUsdtAmount(e.target.value)}
                            className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                          />
                          <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-24 flex items-center justify-center rounded">
                            USDT
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Vous recevez</Label>
                        <div className="flex space-x-2">
                          <Input
                            type="text"
                            value={fiatAmount}
                            readOnly
                            className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                          />
                          <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12 w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="CFA">CFA</SelectItem>
                              <SelectItem value="CAD">CAD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <ArrowUpDown className="w-5 h-5 text-terex-accent" />
                    </div>

                    <div className="bg-terex-gray rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Taux de vente</span>
                          <span className="text-white">1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frais de transaction</span>
                          <span className="text-green-500 font-medium">GRATUIT</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Délai de traitement</span>
                          <span className="text-terex-accent">2-5 min</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Méthode de réception</span>
                          <span className="text-white">Virement bancaire</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Network Selection */}
                  <SellNetworkSelector
                    network={network}
                    setNetwork={setNetwork}
                  />

                  {/* Sell Button */}
                  <Button 
                    size="lg"
                    className="w-full gradient-button text-white font-semibold h-12 text-lg"
                    disabled={!usdtAmount}
                    onClick={handleSellClick}
                  >
                    Continuer la vente
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 md:space-y-6">
              <Card className="bg-terex-darker border-terex-gray">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-white text-base md:text-lg flex items-center">
                    <DollarSign className="mr-2 w-5 h-5 text-terex-accent" />
                    Taux de change
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-terex-gray rounded-lg">
                      <span className="text-gray-400 text-sm">USDT → CFA</span>
                      <span className="text-white font-semibold">{terexRateCfa}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-terex-gray rounded-lg">
                      <span className="text-gray-400 text-sm">USDT → CAD</span>
                      <span className="text-white font-semibold">{terexRateCad}</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 text-center">
                    {lastUpdated && `Dernière mise à jour: ${new Date(lastUpdated).toLocaleTimeString()}`}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-terex-accent text-terex-accent hover:bg-terex-accent/10"
                    onClick={refreshRates}
                    disabled={ratesLoading}
                  >
                    {ratesLoading ? 'Actualisation...' : 'Actualiser les taux'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
