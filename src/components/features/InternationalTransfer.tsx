import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, Clock, Shield, Star, Globe, CreditCard, Smartphone, Building } from 'lucide-react';

export function InternationalTransfer() {
  const [cadAmount, setCadAmount] = useState('');
  const [country, setCountry] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [recipientMethod, setRecipientMethod] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deliverySpeed, setDeliverySpeed] = useState('instant');

  const exchangeRates = {
    senegal: 456,
    'cote-ivoire': 456,
    mali: 456,
    burkina: 456,
    niger: 456,
  };

  const countries = [
    { code: 'senegal', name: 'Sénégal', flag: '🇸🇳', currency: 'CFA' },
    { code: 'cote-ivoire', name: 'Côte d\'Ivoire', flag: '🇨🇮', currency: 'CFA' },
    { code: 'mali', name: 'Mali', flag: '🇲🇱', currency: 'CFA' },
    { code: 'burkina', name: 'Burkina Faso', flag: '🇧🇫', currency: 'CFA' },
    { code: 'niger', name: 'Niger', flag: '🇳🇪', currency: 'CFA' },
  ];

  const deliveryOptions = [
    { value: 'instant', label: 'Instantané', time: '0-15 min', fee: 0, icon: <Clock className="w-4 h-4" /> },
    { value: 'fast', label: 'Rapide', time: '1-2 heures', fee: -5, icon: <ArrowRight className="w-4 h-4" /> },
    { value: 'economy', label: 'Économique', time: '1-3 jours', fee: -10, icon: <Globe className="w-4 h-4" /> },
  ];

  const paymentMethods = [
    { value: 'card', label: 'Carte bancaire', icon: <CreditCard className="w-5 h-5" />, fee: 2.99 },
    { value: 'interac', label: 'Interac e-Transfer', icon: <img src="/lovable-uploads/bc1a1cb4-cd89-4200-bed4-5090b6e10d48.png" alt="Interac" className="w-5 h-5 object-contain" />, fee: 0 },
    { value: 'bank', label: 'Virement bancaire', icon: <Building className="w-5 h-5" />, fee: 0 },
  ];

  const receiveMethods = [
    { value: 'orange', label: 'Orange Money', icon: <img src="/lovable-uploads/109de98a-a26f-4bbf-b8f0-8f33c50d1a7a.png" alt="Orange Money" className="w-5 h-5 object-contain" /> },
    { value: 'wave', label: 'Wave', icon: <img src="/lovable-uploads/e4d24098-9cf3-4dcb-a9fb-57e6c263dc64.png" alt="Wave" className="w-5 h-5 object-contain" /> },
    { value: 'bank', label: 'Compte bancaire', icon: <Building className="w-5 h-5" /> },
    { value: 'cash', label: 'Retrait en espèces', icon: <Smartphone className="w-5 h-5" /> },
  ];

  const selectedCountry = countries.find(c => c.code === country);
  const selectedPaymentMethod = paymentMethods.find(p => p.value === paymentMethod);
  const selectedDeliveryOption = deliveryOptions.find(d => d.value === deliverySpeed);

  const calculateFees = () => {
    const amount = parseFloat(cadAmount) || 0;
    const paymentFee = selectedPaymentMethod?.fee || 0;
    const deliveryFee = selectedDeliveryOption?.fee || 0;
    const totalFees = paymentFee + deliveryFee;
    return { paymentFee, deliveryFee, totalFees };
  };

  const { paymentFee, deliveryFee, totalFees } = calculateFees();
  const totalToSend = (parseFloat(cadAmount) || 0) + totalFees;
  const rate = selectedCountry ? exchangeRates[country as keyof typeof exchangeRates] : 0;
  const cfaAmount = cadAmount && rate ? ((parseFloat(cadAmount) || 0) * rate).toFixed(0) : '0';

  const handleTransfer = () => {
    if (!cadAmount || !country || !recipientName || !recipientPhone || !paymentMethod || !recipientMethod) return;
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    setShowConfirmation(false);
    console.log('Redirection vers le paiement pour le virement...');
  };

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-terex-accent to-terex-accent-light text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Envoyez de l'argent vers l'Afrique
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white/90">
              Transferts rapides, sécurisés et aux meilleurs taux
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                <span>100% sécurisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>Transfert en 15 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span>+50,000 clients satisfaits</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Transfer Form */}
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-white">
                  Nouveau transfert
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configurez votre transfert international en quelques clics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Amount and Country Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-gray-300 font-medium">Vous envoyez</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={cadAmount}
                        onChange={(e) => setCadAmount(e.target.value)}
                        className="text-2xl font-bold pr-16 h-14 bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <Badge variant="secondary" className="font-medium bg-terex-accent text-white">CAD</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300 font-medium">Vers</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="h-14 bg-terex-gray border-terex-gray-light text-white">
                        <SelectValue placeholder="Choisissez un pays" />
                      </SelectTrigger>
                      <SelectContent className="bg-terex-darker border-terex-gray">
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.code} className="text-white hover:bg-terex-gray">
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{country.flag}</span>
                              <span>{country.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Exchange Rate Display */}
                {selectedCountry && (
                  <div className="bg-terex-gray p-4 rounded-lg border border-terex-gray-light">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">Taux de change</p>
                        <p className="font-bold text-lg text-white">1 CAD = {rate} {selectedCountry.currency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Le destinataire recevra</p>
                        <p className="font-bold text-2xl text-terex-accent">{cfaAmount} {selectedCountry.currency}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Delivery Speed */}
                <div className="space-y-3">
                  <Label className="text-gray-300 font-medium">Vitesse de livraison</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {deliveryOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setDeliverySpeed(option.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          deliverySpeed === option.value
                            ? 'border-terex-accent bg-terex-accent/20'
                            : 'border-terex-gray-light hover:border-terex-accent/50 bg-terex-gray'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {option.icon}
                          <span className="font-medium text-white">{option.label}</span>
                        </div>
                        <p className="text-sm text-gray-400">{option.time}</p>
                        <p className="text-sm font-medium text-terex-accent">
                          {option.fee === 0 ? 'Gratuit' : `${option.fee > 0 ? '+' : ''}${option.fee} CAD`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label className="text-gray-300 font-medium">Comment payez-vous ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setPaymentMethod(method.value)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          paymentMethod === method.value
                            ? 'border-terex-accent bg-terex-accent/20'
                            : 'border-terex-gray-light hover:border-terex-accent/50 bg-terex-gray'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {method.icon}
                          <span className="font-medium text-white">{method.label}</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          {method.fee === 0 ? 'Gratuit' : `${method.fee} CAD de frais`}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Receive Method */}
                <div className="space-y-3">
                  <Label className="text-gray-300 font-medium">Comment le destinataire recevra-t-il l'argent ?</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {receiveMethods.map((method) => (
                      <button
                        key={method.value}
                        onClick={() => setRecipientMethod(method.value)}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${
                          recipientMethod === method.value
                            ? 'border-terex-accent bg-terex-accent/20'
                            : 'border-terex-gray-light hover:border-terex-accent/50 bg-terex-gray'
                        }`}
                      >
                        <div className="flex justify-center mb-2">
                          {method.icon}
                        </div>
                        <p className="text-sm font-medium text-white">{method.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-terex-gray-light" />

                {/* Recipient Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Informations du destinataire</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-gray-300">Nom complet</Label>
                      <Input
                        type="text"
                        placeholder="Nom du destinataire"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">
                        {recipientMethod === 'bank' ? 'Numéro de compte' : 'Numéro de téléphone'}
                      </Label>
                      <Input
                        type="tel"
                        placeholder={recipientMethod === 'bank' ? 'Numéro de compte' : '+221 XX XXX XX XX'}
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Transfer Summary */}
            <Card className="bg-terex-darker border-terex-gray shadow-lg sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Résumé du transfert</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant envoyé</span>
                    <span className="font-medium text-white">{cadAmount || '0'} CAD</span>
                  </div>
                  
                  {paymentFee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frais de paiement</span>
                      <span className="font-medium text-white">{paymentFee} CAD</span>
                    </div>
                  )}
                  
                  {deliveryFee !== 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Frais de livraison</span>
                      <span className="font-medium text-green-400">
                        {deliveryFee > 0 ? `+${deliveryFee}` : deliveryFee} CAD
                      </span>
                    </div>
                  )}
                  
                  <Separator className="bg-terex-gray-light" />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">Total à payer</span>
                    <span className="text-white">{totalToSend.toFixed(2)} CAD</span>
                  </div>
                  
                  <div className="bg-terex-accent/20 p-3 rounded-lg border border-terex-accent/30">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Le destinataire recevra</span>
                      <span className="font-bold text-terex-accent text-xl">
                        {cfaAmount} {selectedCountry?.currency || 'CFA'}
                      </span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleTransfer}
                  disabled={!cadAmount || !country || !recipientName || !recipientPhone || !paymentMethod || !recipientMethod}
                  className="w-full bg-terex-accent hover:bg-terex-accent-light text-white font-medium h-12 text-lg disabled:opacity-50"
                >
                  Continuer le transfert
                </Button>

                <div className="text-center text-sm text-gray-400">
                  <Shield className="w-4 h-4 inline mr-1" />
                  Sécurisé par un cryptage 256-bit
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="bg-terex-darker border-terex-gray shadow-lg">
              <CardContent className="p-6">
                <h3 className="font-semibold text-white mb-4">Pourquoi nous faire confiance ?</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-terex-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-white">Sécurité garantie</p>
                      <p className="text-xs text-gray-400">Agréé et réglementé</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-terex-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-white">Transfert rapide</p>
                      <p className="text-xs text-gray-400">En quelques minutes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-terex-accent mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-white">Excellent service</p>
                      <p className="text-xs text-gray-400">Support 24/7</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-2xl bg-terex-darker border-terex-gray">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-white">Confirmer votre transfert</DialogTitle>
              <DialogDescription className="text-gray-400">
                Vérifiez attentivement les informations avant de finaliser le transfert.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Transfer Details */}
              <div className="bg-terex-gray p-6 rounded-lg space-y-4 border border-terex-gray-light">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Vous envoyez</p>
                    <p className="text-2xl font-bold text-white">{cadAmount} CAD</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Destinataire recevra</p>
                    <p className="text-2xl font-bold text-terex-accent">{cfaAmount} {selectedCountry?.currency}</p>
                  </div>
                </div>
                
                <Separator className="bg-terex-gray-light" />
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400">Pays de destination</p>
                    <p className="font-medium text-white">{selectedCountry?.flag} {selectedCountry?.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Vitesse de livraison</p>
                    <p className="font-medium text-white">{selectedDeliveryOption?.label} ({selectedDeliveryOption?.time})</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Méthode de paiement</p>
                    <p className="font-medium text-white">{selectedPaymentMethod?.label}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Méthode de réception</p>
                    <p className="font-medium text-white">{receiveMethods.find(m => m.value === recipientMethod)?.label}</p>
                  </div>
                </div>
              </div>

              {/* Recipient Details */}
              <div className="space-y-3">
                <h4 className="font-semibold text-white">Informations du destinataire</h4>
                <div className="bg-terex-gray p-4 rounded-lg border border-terex-gray-light">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400">Nom complet</p>
                      <p className="font-medium text-white">{recipientName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">
                        {recipientMethod === 'bank' ? 'Numéro de compte' : 'Téléphone'}
                      </p>
                      <p className="font-medium text-white">{recipientPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Cost */}
              <div className="bg-terex-accent/20 p-4 rounded-lg border border-terex-accent/30">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-white">Total à payer</span>
                  <span className="text-2xl font-bold text-terex-accent">{totalToSend.toFixed(2)} CAD</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="flex-1 border-terex-gray-light text-white hover:bg-terex-gray"
              >
                Modifier
              </Button>
              <Button 
                onClick={handleConfirm}
                className="flex-1 bg-terex-accent hover:bg-terex-accent-light text-white"
              >
                Confirmer et payer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
