
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, Clock, CreditCard } from 'lucide-react';

export function BuyUSDT() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CFA');
  const [network, setNetwork] = useState('TRC20');

  const exchangeRates = {
    CFA: 615,
    CAD: 1.35
  };

  const usdtAmount = amount ? (parseFloat(amount) / exchangeRates[currency as keyof typeof exchangeRates]).toFixed(6) : '0';

  const paymentMethods = [
    { id: 'card', name: 'Carte bancaire', icon: '💳', fee: '0%', time: 'Instantané' },
    { id: 'transfer', name: 'Virement bancaire', icon: '🏦', fee: '0%', time: '1-3 jours' },
    { id: 'mobile', name: 'Mobile Money', icon: '📱', fee: '0%', time: 'Instantané' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Acheter USDT</h1>
          <p className="text-gray-400">Achetez des USDT facilement et en toute sécurité</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">Acheter USDT</CardTitle>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Taux en temps réel
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-3 bg-terex-gray">
                    {paymentMethods.map((method) => (
                      <TabsTrigger 
                        key={method.id} 
                        value={method.id}
                        className="data-[state=active]:bg-terex-accent data-[state=active]:text-white"
                      >
                        <span className="mr-2">{method.icon}</span>
                        {method.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {paymentMethods.map((method) => (
                    <TabsContent key={method.id} value={method.id} className="space-y-6">
                      {/* Amount Input Section */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Je paie</Label>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
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
                          
                          <div className="space-y-2">
                            <Label className="text-white text-sm font-medium">Je reçois</Label>
                            <div className="relative">
                              <Input
                                type="text"
                                value={usdtAmount}
                                readOnly
                                className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-20"
                              />
                              <div className="absolute right-2 top-2 flex items-center space-x-1 bg-terex-gray-light rounded px-2 py-1">
                                <img 
                                  src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                                  alt="USDT" 
                                  className="w-6 h-6"
                                />
                                <span className="text-terex-accent font-medium">USDT</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                        </div>

                        <div className="bg-terex-gray rounded-lg p-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Taux de change</span>
                            <span className="text-white">1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">Frais</span>
                            <span className="text-terex-accent">{method.fee}</span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span className="text-gray-400">Temps de traitement</span>
                            <span className="text-terex-accent">{method.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Network Selection */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Réseau de réception</Label>
                        <Select value={network} onValueChange={setNetwork}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TRC20">
                              <div className="flex items-center space-x-2">
                                <span>TRC20 (Tron)</span>
                                <Badge variant="secondary" className="text-xs">Recommandé</Badge>
                              </div>
                            </SelectItem>
                            <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                            <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                            <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                            <SelectItem value="Polygon">Polygon</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Wallet Address */}
                      <div className="space-y-2">
                        <Label className="text-white text-sm font-medium">Adresse de réception</Label>
                        <Input
                          type="text"
                          placeholder="Votre adresse USDT"
                          className="bg-terex-gray border-terex-gray-light text-white h-12"
                        />
                      </div>

                      {/* Buy Button */}
                      <Button 
                        size="lg"
                        className="w-full gradient-button text-white font-semibold h-12 text-lg"
                        disabled={!amount}
                      >
                        Acheter USDT
                      </Button>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Info */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Prix du marché</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">USDT/USD</span>
                  <span className="text-terex-accent font-bold">$1.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">USDT/CFA</span>
                  <span className="text-white font-bold">615 CFA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">USDT/CAD</span>
                  <span className="text-white font-bold">1.35 CAD</span>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-terex-accent" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Cryptage SSL 256-bit</p>
                    <p className="text-gray-400 text-xs">Vos données sont protégées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Fonds sécurisés</p>
                    <p className="text-gray-400 text-xs">Portefeuilles multi-signatures</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Support 24/7</p>
                    <p className="text-gray-400 text-xs">Aide disponible en permanence</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Montants rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {['50', '100', '500', '1000'].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(value)}
                      className="border-terex-gray text-gray-300 hover:bg-terex-gray"
                    >
                      {value} {currency}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
