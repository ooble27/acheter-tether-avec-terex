
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function BuyUSDT() {
  const [currency, setCurrency] = useState('CFA');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const exchangeRates = {
    CFA: 615, // 1 USDT = 615 CFA
    CAD: 1.35  // 1 USDT = 1.35 CAD
  };

  const usdtAmount = amount ? (parseFloat(amount) / exchangeRates[currency as keyof typeof exchangeRates]).toFixed(6) : '0';

  const handleBuy = () => {
    if (!amount || !network || !address) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    // Redirection vers la page de paiement
    console.log('Redirection vers le paiement...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Acheter USDT</h1>
        <p className="text-gray-400">
          Achetez des USDT avec vos francs CFA ou dollars canadiens
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Détails de la transaction</CardTitle>
            <CardDescription className="text-gray-400">
              Configurez votre achat d'USDT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">Devise de paiement</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-terex-gray border-terex-gray-light">
                  <SelectItem value="CFA">Franc CFA (XOF)</SelectItem>
                  <SelectItem value="CAD">Dollar Canadien (CAD)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Montant à investir</Label>
              <Input
                type="number"
                placeholder={`Montant en ${currency}`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Réseau de réception</Label>
              <Select value={network} onValueChange={setNetwork}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                  <SelectValue placeholder="Choisissez un réseau" />
                </SelectTrigger>
                <SelectContent className="bg-terex-gray border-terex-gray-light">
                  <SelectItem value="TRC20">TRC20 (Tron)</SelectItem>
                  <SelectItem value="BEP20">BEP20 (BSC)</SelectItem>
                  <SelectItem value="ERC20">ERC20 (Ethereum)</SelectItem>
                  <SelectItem value="Arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="Polygon">Polygon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Adresse USDT de réception</Label>
              <Input
                type="text"
                placeholder="Votre adresse USDT"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
              />
            </div>

            <Button 
              onClick={handleBuy}
              disabled={!amount || !network || !address}
              className="w-full gradient-button text-white font-medium disabled:opacity-50"
            >
              Acheter USDT
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Récapitulatif</CardTitle>
            <CardDescription className="text-gray-400">
              Vérifiez les détails de votre transaction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-terex-gray rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Vous payez</span>
                <span className="text-white font-medium">
                  {amount || '0'} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Taux de change</span>
                <span className="text-terex-accent">
                  1 USDT = {exchangeRates[currency as keyof typeof exchangeRates]} {currency}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Vous recevrez</span>
                <span className="text-terex-accent font-bold text-lg">
                  {usdtAmount} USDT
                </span>
              </div>
              {network && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Réseau</span>
                  <span className="text-white">{network}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-medium">Informations importantes</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Les transactions sont traitées sous 15 minutes</li>
                <li>• Vérifiez bien votre adresse de réception</li>
                <li>• Les frais de réseau sont inclus</li>
                <li>• Minimum 10,000 CFA ou 15 CAD</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-terex-darker border-terex-gray">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmer la transaction</DialogTitle>
            <DialogDescription className="text-gray-400">
              Vous allez être redirigé vers la page de paiement pour finaliser votre achat.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 bg-terex-gray rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Montant:</span>
                <span className="text-white">{amount} {currency}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">USDT à recevoir:</span>
                <span className="text-terex-accent">{usdtAmount} USDT</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Réseau:</span>
                <span className="text-white">{network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Adresse de réception:</span>
                <span className="text-white text-sm break-all">{address}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              className="border-terex-gray text-gray-300"
            >
              Annuler
            </Button>
            <Button 
              onClick={handleConfirm}
              className="gradient-button text-white"
            >
              Confirmer et payer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
