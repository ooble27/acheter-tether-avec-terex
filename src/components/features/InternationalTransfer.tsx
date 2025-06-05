
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, Clock, Globe, CreditCard, Smartphone, MapPin, Phone } from 'lucide-react';

export function InternationalTransfer() {
  const [sendAmount, setSendAmount] = useState('');
  const [sendCurrency, setSendCurrency] = useState('CAD');
  const [receiveCurrency, setReceiveCurrency] = useState('CFA');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiveMethod, setReceiveMethod] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');

  // Taux de change simulés (CAD vers devises africaines)
  const exchangeRates = {
    'CAD-CFA': 445.50,
    'CAD-USD': 0.74,
    'CAD-EUR': 0.68,
    'CFA-CAD': 0.00224,
    'USD-CAD': 1.35,
    'EUR-CAD': 1.47
  };

  const getExchangeRate = () => {
    const key = `${sendCurrency}-${receiveCurrency}`;
    return exchangeRates[key as keyof typeof exchangeRates] || 1;
  };

  const receiveAmount = sendAmount ? (parseFloat(sendAmount) * getExchangeRate()).toFixed(2) : '0.00';
  const fees = sendAmount ? (parseFloat(sendAmount) * 0.02).toFixed(2) : '0.00';

  // Pays africains disponibles
  const africanCountries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'TG', name: 'Togo', flag: '🇹🇬' },
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'MA', name: 'Maroc', flag: '🇲🇦' },
    { code: 'TN', name: 'Tunisie', flag: '🇹🇳' },
    { code: 'DZ', name: 'Algérie', flag: '🇩🇿' }
  ];

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transfert Canada vers Afrique</h1>
          <p className="text-gray-400">Envoyez de l'argent rapidement du Canada vers l'Afrique</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg md:text-xl">Nouveau transfert</CardTitle>
                  <Badge variant="outline" className="text-terex-accent border-terex-accent">
                    Canada → Afrique
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                {/* Montant et devises */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Vous envoyez (Canada)</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                        />
                        <Select value={sendCurrency} onValueChange={setSendCurrency}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Destinataire reçoit (Afrique)</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={receiveAmount}
                          readOnly
                          className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                        />
                        <Select value={receiveCurrency} onValueChange={setReceiveCurrency}>
                          <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12 w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="CFA">CFA</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <ArrowRightLeft className="w-5 h-5 text-terex-accent" />
                  </div>

                  <div className="bg-terex-gray rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Taux de change</span>
                        <span className="text-white">1 {sendCurrency} = {getExchangeRate()} {receiveCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frais</span>
                        <span className="text-terex-accent">{fees} {sendCurrency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Délai</span>
                        <span className="text-terex-accent">Quelques minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total à payer</span>
                        <span className="text-white font-semibold">{sendAmount ? (parseFloat(sendAmount) + parseFloat(fees)).toFixed(2) : '0.00'} {sendCurrency}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pays de destination (Afrique uniquement) */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Pays de destination en Afrique</Label>
                  <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                      <SelectValue placeholder="Sélectionner un pays africain" />
                    </SelectTrigger>
                    <SelectContent>
                      {africanCountries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          <div className="flex items-center space-x-2">
                            <span>{country.flag}</span>
                            <span>{country.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Méthode de paiement */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Comment payez-vous au Canada ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Carte bancaire', icon: CreditCard, desc: 'Visa, Mastercard' },
                      { id: 'bank', label: 'Virement bancaire', icon: MapPin, desc: 'Depuis votre banque' },
                      { id: 'interac', label: 'E-Transfer', icon: Smartphone, desc: 'Interac' }
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          paymentMethod === method.id
                            ? 'border-terex-accent bg-terex-accent/10'
                            : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon className="w-5 h-5 text-terex-accent" />
                          <div>
                            <p className="text-white font-medium text-sm">{method.label}</p>
                            <p className="text-gray-400 text-xs">{method.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Méthode de réception */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Comment le destinataire reçoit-il l'argent en Afrique ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'mobile', label: 'Mobile Money', icon: Smartphone, desc: 'Orange, Wave, MTN' },
                      { id: 'bank_transfer', label: 'Virement bancaire', icon: MapPin, desc: 'Directement sur le compte' },
                      { id: 'cash_pickup', label: 'Retrait en espèces', icon: Phone, desc: 'Points de retrait' }
                    ].map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setReceiveMethod(method.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          receiveMethod === method.id
                            ? 'border-terex-accent bg-terex-accent/10'
                            : 'border-terex-gray-light bg-terex-gray hover:border-terex-accent/50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <method.icon className="w-5 h-5 text-terex-accent" />
                          <div>
                            <p className="text-white font-medium text-sm">{method.label}</p>
                            <p className="text-gray-400 text-xs">{method.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations du destinataire */}
                <div className="space-y-4">
                  <Label className="text-white text-sm font-medium">Informations du destinataire</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Prénom"
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Nom de famille"
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Email (optionnel)"
                      type="email"
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Téléphone"
                      type="tel"
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                  </div>
                  
                  {receiveMethod === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        placeholder="IBAN / Numéro de compte"
                        className="bg-terex-gray border-terex-gray-light text-white h-12"
                      />
                      <Input
                        placeholder="Nom de la banque"
                        className="bg-terex-gray border-terex-gray-light text-white h-12"
                      />
                    </div>
                  )}
                </div>

                <Button 
                  size="lg"
                  className="w-full gradient-button text-white font-semibold h-12 text-lg"
                  disabled={!sendAmount || !paymentMethod || !receiveMethod || !recipientCountry}
                >
                  Continuer le transfert
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 md:space-y-6">
            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg flex items-center">
                  <Globe className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
                  Canada vers Afrique
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Pays africains</span>
                  <span className="text-terex-accent font-bold">12+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Devises supportées</span>
                  <span className="text-terex-accent font-bold">5+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Points de retrait</span>
                  <span className="text-terex-accent font-bold">50k+</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg">Montants rapides (CAD)</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {['100', '250', '500', '1000'].map((value) => (
                    <Button
                      key={value}
                      variant="outline"
                      size="sm"
                      onClick={() => setSendAmount(value)}
                      className="border-terex-gray text-gray-300 hover:bg-terex-gray text-xs"
                    >
                      {value} CAD
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg flex items-center">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
                  Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Chiffrement 256-bit</p>
                    <p className="text-gray-400 text-xs">Vos données sont protégées</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Régulé au Canada</p>
                    <p className="text-gray-400 text-xs">Conforme aux normes canadiennes</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-white text-sm font-medium">Suivi en temps réel</p>
                    <p className="text-gray-400 text-xs">Suivez votre transfert à tout moment</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-terex-darker border-terex-gray">
              <CardHeader className="p-4">
                <CardTitle className="text-white text-base md:text-lg flex items-center">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 mr-2 text-terex-accent" />
                  Délais de transfert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Afrique de l'Ouest</span>
                  <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
                    Instantané
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Afrique du Nord</span>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500 text-xs">
                    &lt; 1h
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Autres pays africains</span>
                  <Badge variant="outline" className="text-blue-500 border-blue-500 text-xs">
                    1-2 heures
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
