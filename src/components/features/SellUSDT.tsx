
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Wallet, DollarSign } from 'lucide-react';
import { SellOrderConfirmation } from './SellOrderConfirmation';

export function SellUSDT() {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const networks = [
    { id: 'trc20', name: 'TRC20 (Tron)', fee: '1 USDT' },
    { id: 'bep20', name: 'BEP20 (BSC)', fee: '1 USDT' },
    { id: 'erc20', name: 'ERC20 (Ethereum)', fee: '15 USDT' },
    { id: 'arbitrum', name: 'Arbitrum', fee: '1 USDT' },
    { id: 'polygon', name: 'Polygon', fee: '1 USDT' }
  ];

  const exchangeRate = 655; // 1 USDT = 655 CFA
  const calculatedAmount = amount ? (parseFloat(amount) * exchangeRate).toLocaleString() : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount && network && paymentMethod && phoneNumber) {
      setShowConfirmation(true);
    }
  };

  const orderData = {
    amount: parseFloat(amount),
    network,
    paymentMethod,
    phoneNumber,
    cfaAmount: parseFloat(amount) * exchangeRate,
    exchangeRate
  };

  if (showConfirmation) {
    return (
      <SellOrderConfirmation 
        orderData={orderData}
        onBack={() => setShowConfirmation(false)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Vendre USDT</h1>
        <p className="text-gray-400">
          Vendez vos USDT et recevez votre argent en CFA sous 5 minutes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Wallet className="h-6 w-6 text-terex-accent" />
                Vendre USDT
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-300">Montant USDT à vendre</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                    min="10"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-gray-400">Minimum: 10 USDT</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="network" className="text-gray-300">Réseau d'envoi</Label>
                  <Select value={network} onValueChange={setNetwork} required>
                    <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                      <SelectValue placeholder="Sélectionnez un réseau" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      {networks.map((net) => (
                        <SelectItem key={net.id} value={net.id} className="text-white hover:bg-terex-gray">
                          {net.name} - Frais: {net.fee}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-400">Choisissez le réseau depuis lequel vous enverrez vos USDT</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method" className="text-gray-300">Méthode de réception</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                    <SelectTrigger className="bg-terex-gray border-terex-gray text-white">
                      <SelectValue placeholder="Choisissez votre méthode" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="orange-money" className="text-white hover:bg-terex-gray flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src="/lovable-uploads/dcdbab59-4f03-4bdc-b592-160b3d1f0aec.png" 
                            alt="Orange Money" 
                            className="w-5 h-5"
                          />
                          Orange Money
                        </div>
                      </SelectItem>
                      <SelectItem value="wave" className="text-white hover:bg-terex-gray flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <img 
                            src="/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png" 
                            alt="Wave" 
                            className="w-5 h-5"
                          />
                          Wave
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300">Numéro de téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Ex: +221 77 123 45 67"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-terex-gray border-terex-gray text-white"
                    required
                  />
                  <p className="text-sm text-gray-400">Numéro associé à votre compte {paymentMethod === 'orange-money' ? 'Orange Money' : 'Wave'}</p>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-terex-accent to-terex-accent/80 hover:from-terex-accent/90 hover:to-terex-accent/70 text-white font-semibold py-3 rounded-xl transition-all duration-200"
                  disabled={!amount || !network || !paymentMethod || !phoneNumber}
                >
                  Continuer
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-terex-accent" />
                Résumé de la vente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-300">Montant USDT:</span>
                <span className="text-white font-semibold">{amount || '0'} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Taux de change:</span>
                <span className="text-terex-accent font-semibold">1 USDT = {exchangeRate} CFA</span>
              </div>
              <div className="h-px bg-terex-gray"></div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-300">Vous recevrez:</span>
                <span className="text-terex-accent font-bold">{calculatedAmount} CFA</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader>
              <CardTitle className="text-white">Informations importantes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-300">
              <div className="p-3 bg-terex-gray rounded-lg">
                <p className="text-terex-accent font-medium mb-1">⚡ Traitement rapide</p>
                <p>Votre argent sera transféré sous 5 minutes après réception des USDT</p>
              </div>
              <div className="p-3 bg-terex-gray rounded-lg">
                <p className="text-terex-accent font-medium mb-1">🔒 Sécurisé</p>
                <p>Transaction protégée et vérifiée</p>
              </div>
              <div className="p-3 bg-terex-gray rounded-lg">
                <p className="text-terex-accent font-medium mb-1">📱 Support 24/7</p>
                <p>Notre équipe est disponible pour vous accompagner</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
