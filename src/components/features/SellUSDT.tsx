import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function SellUSDT() {
  const [usdtAmount, setUsdtAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const exchangeRate = 615; // 1 USDT = 615 CFA
  const cfaAmount = usdtAmount ? (parseFloat(usdtAmount) * exchangeRate).toFixed(0) : '0';

  const handleSell = () => {
    if (!usdtAmount || !network || !paymentMethod || !recipientPhone || !recipientName) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    console.log('Redirection vers le paiement pour la vente...');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Vendre USDT</h1>
        <p className="text-gray-400">
          Convertissez vos USDT en francs CFA et recevez votre argent instantanément
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Détails de la vente</CardTitle>
            <CardDescription className="text-gray-400">
              Configurez votre vente d'USDT
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">Montant USDT à vendre</Label>
              <Input
                type="number"
                placeholder="Montant en USDT"
                value={usdtAmount}
                onChange={(e) => setUsdtAmount(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Réseau d'envoi</Label>
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
              <Label className="text-white">Méthode de réception</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white">
                  <SelectValue placeholder="Choisissez une méthode" />
                </SelectTrigger>
                <SelectContent className="bg-terex-gray border-terex-gray-light">
                  <SelectItem value="orange">Orange Money</SelectItem>
                  <SelectItem value="wave">Wave</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Nom du bénéficiaire</Label>
              <Input
                type="text"
                placeholder="Nom complet"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Numéro de téléphone</Label>
              <Input
                type="tel"
                placeholder="+221 XX XXX XX XX"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
              />
            </div>

            <Button 
              onClick={handleSell}
              disabled={!usdtAmount || !network || !paymentMethod || !recipientPhone || !recipientName}
              className="w-full gradient-button text-white font-medium disabled:opacity-50"
            >
              Vendre USDT
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Récapitulatif</CardTitle>
            <CardDescription className="text-gray-400">
              Vérifiez les détails de votre vente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-terex-gray rounded-lg space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Vous vendez</span>
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-5 h-5"
                  />
                  <span className="text-white font-medium">
                    {usdtAmount || '0'} USDT
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Taux de change</span>
                <span className="text-terex-accent">
                  1 USDT = {exchangeRate} CFA
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Vous recevrez</span>
                <span className="text-terex-accent font-bold text-lg">
                  {cfaAmount} CFA
                </span>
              </div>
              {paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Via</span>
                  <span className="text-white capitalize">{paymentMethod === 'orange' ? 'Orange Money' : 'Wave'}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-medium">Informations importantes</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Réception sous 5 minutes</li>
                <li>• Vérifiez le numéro de téléphone</li>
                <li>• Minimum 10 USDT</li>
                <li>• Frais de transaction inclus</li>
              </ul>
            </div>

            {paymentMethod && (
              <div className="p-3 bg-terex-accent/10 border border-terex-accent/20 rounded-lg">
                <p className="text-terex-accent text-sm">
                  {paymentMethod === 'orange' ? '📱 Orange Money' : '💳 Wave'} - Réception instantanée
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-terex-darker border-terex-gray">
          <DialogHeader>
            <DialogTitle className="text-white">Confirmer la vente</DialogTitle>
            <DialogDescription className="text-gray-400">
              Vérifiez les informations avant de procéder à la vente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="p-4 bg-terex-gray rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">USDT à vendre:</span>
                <div className="flex items-center space-x-2">
                  <img 
                    src="https://s2.coinmarketcap.com/static/img/coins/64x64/825.png" 
                    alt="USDT" 
                    className="w-4 h-4"
                  />
                  <span className="text-white">{usdtAmount} USDT</span>
                </div>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Réseau d'envoi:</span>
                <span className="text-white">{network}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Montant à recevoir:</span>
                <span className="text-terex-accent">{cfaAmount} CFA</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Méthode de réception:</span>
                <span className="text-white">{paymentMethod === 'orange' ? 'Orange Money' : 'Wave'}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Bénéficiaire:</span>
                <span className="text-white">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Numéro de réception:</span>
                <span className="text-white">{recipientPhone}</span>
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
              Confirmer la vente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
