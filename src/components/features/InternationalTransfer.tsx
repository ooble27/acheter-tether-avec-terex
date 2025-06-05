
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Shield, Clock, Globe, CreditCard, Smartphone, MapPin, Phone } from 'lucide-react';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export function InternationalTransfer() {
  const [sendAmount, setSendAmount] = useState('');
  const [recipientCountry, setRecipientCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [receiveMethod, setReceiveMethod] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientAccount, setRecipientAccount] = useState('');
  const [recipientBank, setRecipientBank] = useState('');
  
  const { createTransfer, loading } = useInternationalTransfers();
  const { user } = useAuth();
  const { toast } = useToast();

  // Taux de change fixe CAD vers CFA
  const exchangeRate = 445.50;
  const receiveAmount = sendAmount ? (parseFloat(sendAmount) * exchangeRate).toFixed(2) : '0.00';
  const fees = sendAmount ? (parseFloat(sendAmount) * 0.02).toFixed(2) : '0.00';

  // Pays disponibles (limités aux 6 demandés)
  const availableCountries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
    { code: 'BJ', name: 'Bénin', flag: '🇧🇯' }
  ];

  const handleCreateTransfer = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer un transfert",
        variant: "destructive",
      });
      return;
    }

    if (!sendAmount || !paymentMethod || !receiveMethod || !recipientCountry || 
        !recipientFirstName || !recipientLastName || !recipientPhone) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    const transferData = {
      amount: parseFloat(sendAmount),
      from_currency: 'CAD',
      to_currency: 'CFA',
      exchange_rate: exchangeRate,
      fees: parseFloat(fees),
      total_amount: parseFloat(receiveAmount),
      recipient_name: `${recipientFirstName} ${recipientLastName}`,
      recipient_account: recipientAccount || recipientPhone,
      recipient_bank: recipientBank,
      recipient_country: recipientCountry,
      status: 'pending'
    };

    await createTransfer(transferData);
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Virement international</h1>
          <p className="text-gray-400">Envoyer de l'argent rapidement à vos proches</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-terex-darker border-terex-gray shadow-2xl">
              <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-lg md:text-xl">Nouveau transfert</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 md:p-6 space-y-6">
                {/* Montant et devises */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Vous envoyez</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sendAmount}
                          onChange={(e) => setSendAmount(e.target.value)}
                          className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                        />
                        <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-24 flex items-center justify-center rounded">
                          CAD
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-white text-sm font-medium">Destinataire</Label>
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          value={receiveAmount}
                          readOnly
                          className="bg-terex-gray border-terex-gray-light text-white text-lg h-12 flex-1"
                        />
                        <div className="bg-terex-gray border border-terex-gray-light text-white h-12 w-24 flex items-center justify-center rounded">
                          CFA
                        </div>
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
                        <span className="text-white">1 CAD = {exchangeRate} CFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Frais</span>
                        <span className="text-terex-accent">{fees} CAD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Délai</span>
                        <span className="text-terex-accent">5 minutes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total à payer</span>
                        <span className="text-white font-semibold">{sendAmount ? (parseFloat(sendAmount) + parseFloat(fees)).toFixed(2) : '0.00'} CAD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pays de destination */}
                <div className="space-y-2">
                  <Label className="text-white text-sm font-medium">Pays de destination</Label>
                  <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                    <SelectTrigger className="bg-terex-gray border-terex-gray-light text-white h-12">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCountries.map((country) => (
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
                  <Label className="text-white text-sm font-medium">Comment payez-vous ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'card', label: 'Carte bancaire', icon: CreditCard, desc: 'Visa, Mastercard' },
                      { id: 'bank', label: 'Virement bancaire', icon: MapPin, desc: 'Depuis votre banque' },
                      { id: 'interac', label: 'Interac E-Transfer', icon: Smartphone, desc: 'Interac' }
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
                  <Label className="text-white text-sm font-medium">Comment le destinataire reçoit-il l'argent ?</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: 'mobile', label: 'Mobile Money', icon: Smartphone, desc: 'Orange Money, Wave' },
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
                      value={recipientFirstName}
                      onChange={(e) => setRecipientFirstName(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Nom de famille"
                      value={recipientLastName}
                      onChange={(e) => setRecipientLastName(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Email (optionnel)"
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                    <Input
                      placeholder="Téléphone"
                      type="tel"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      className="bg-terex-gray border-terex-gray-light text-white h-12"
                    />
                  </div>
                  
                  {receiveMethod === 'bank_transfer' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        placeholder="IBAN / Numéro de compte"
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white h-12"
                      />
                      <Input
                        placeholder="Nom de la banque"
                        value={recipientBank}
                        onChange={(e) => setRecipientBank(e.target.value)}
                        className="bg-terex-gray border-terex-gray-light text-white h-12"
                      />
                    </div>
                  )}
                </div>

                <Button 
                  size="lg"
                  className="w-full gradient-button text-white font-semibold h-12 text-lg"
                  disabled={!sendAmount || !paymentMethod || !receiveMethod || !recipientCountry || !recipientFirstName || !recipientLastName || !recipientPhone || loading}
                  onClick={handleCreateTransfer}
                >
                  {loading ? 'Traitement...' : 'Continuer le transfert'}
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
                  Transfert international
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Pays disponibles</span>
                  <span className="text-terex-accent font-bold">6</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Devises supportées</span>
                  <span className="text-terex-accent font-bold">2</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Points de retrait</span>
                  <span className="text-terex-accent font-bold">5k+</span>
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
                    <p className="text-white text-sm font-medium">Régulé au Sénégal</p>
                    <p className="text-gray-400 text-xs">Conforme aux normes locales</p>
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
                  <span className="text-gray-400 text-sm">Tous les pays</span>
                  <Badge variant="outline" className="text-green-500 border-green-500 text-xs">
                    5 minutes
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
