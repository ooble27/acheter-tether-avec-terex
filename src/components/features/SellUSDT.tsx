
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, TrendingUp, Copy } from 'lucide-react';

export function SellUSDT() {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('TRC20');
  const [paymentService, setPaymentService] = useState('');

  const exchangeRate = 615;
  const cfaAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(0) : '0';

  // Adresse de réception crypto fournie par Terex
  const getReceiveAddress = () => {
    const addresses = {
      TRC20: 'TXYZabc123...DefGhi456',
      BEP20: 'BNBxyz789...AbcDef123',
      ERC20: '0x1234...5678',
      Arbitrum: '0xAbcd...Efgh',
      Polygon: '0x9876...5432'
    };
    return addresses[network as keyof typeof addresses] || 'Adresse non disponible';
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(getReceiveAddress());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-terex-dark via-terex-darker to-terex-dark p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Vendre USDT</h1>
          <p className="text-gray-400">Convertissez vos USDT en francs CFA instantanément</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Trading Interface */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-xl">Vendre USDT</CardTitle>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Meilleur taux
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Amount Input Section */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Je vends</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
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
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Je reçois</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={cfaAmount}
                          readOnly
                          className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 pr-16"
                        />
                        <span className="absolute right-3 top-3 text-terex-accent font-medium">CFA</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                  </div>

                  <div className="bg-terex-gray rounded-lg p-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Taux de change</span>
                      <span className="text-white">1 USDT = {exchangeRate} CFA</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Frais</span>
                      <span className="text-terex-accent">0%</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-400">Temps de traitement</span>
                      <span className="text-terex-accent">< 5 min</span>
                    </div>
                  </div>
                </div>

                {/* Network Selection */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Réseau d'envoi</Label>
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRC20">
                        <div className="flex items-center space-x-2">
                          <span>TRC20 (Tron)</span>
                          <Badge variant="secondary" className="text-xs">Frais faibles</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                      <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                      <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                      <SelectItem value="Polygon">Polygon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Crypto Receive Address */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Adresse de réception (fournie par Terex)</Label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={getReceiveAddress()}
                      readOnly
                      className="bg-terex-gray border-terex-gray-light text-white h-12 pr-12"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAddress}
                      className="absolute right-1 top-1 h-10 w-10 p-0 text-terex-accent hover:bg-terex-gray-light"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400">Envoyez vos USDT à cette adresse via le réseau {network}</p>
                </div>

                {/* Payment Service Selection */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Où voulez-vous recevoir l'argent ?</Label>
                  <Select value={paymentService} onValueChange={setPaymentService}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                      <SelectValue placeholder="Choisir un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="orange">Orange Money</SelectItem>
                      <SelectItem value="wave">Wave</SelectItem>
                      <SelectItem value="free">Free Money</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Phone Number for Payment */}
                {paymentService && (
                  <div className="space-y-2">
                    <Label className="text-white text-sm font-medium">Numéro de réception</Label>
                    <Input
                      type="tel"
                      placeholder="+221 XX XXX XX XX"
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                  </div>
                )}

                {/* Sell Button */}
                <Button 
                  size="lg"
                  className="w-full gradient-button text-white font-semibold h-12 text-lg"
                  disabled={!amount || !paymentService}
                >
                  Vendre USDT
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Market Trends */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-terex-accent" />
                  Tendances du marché
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">USDT/CFA</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">615</span>
                    <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
                      +0.5%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Volume 24h</span>
                  <span className="text-terex-accent">2.5M CFA</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Sell Amounts */}
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader>
                <CardTitle className="text-white text-lg">Montants rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {['10', '50', '100', '500'].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(value)}
                      className="border-terex-gray text-gray-300 hover:bg-terex-gray"
                    >
                      {value} USDT
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Security Info */}
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
                    <p className="text-white text-sm font-medium">Transactions vérifiées</p>
                    <p className="text-gray-400 text-xs">Toutes les ventes sont sécurisées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Paiement garanti</p>
                    <p className="text-gray-400 text-xs">Réception sous 5 minutes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Pas de stockage crypto</p>
                    <p className="text-gray-400 text-xs">Terex ne stocke pas vos cryptos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
