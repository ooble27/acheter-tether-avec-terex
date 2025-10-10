import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { ArrowRight, ArrowLeft, Check, Send, User, CreditCard, Smartphone, Wallet, Building2, Globe } from 'lucide-react';
import { TransferPending } from './TransferPending';

const PAYMENT_LOGOS = {
  interac: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Interac_logo.svg/2560px-Interac_logo.svg.png',
  wave: 'https://play-lh.googleusercontent.com/SJJC8sL9FXgC-4P1sL8CvRzL8GVHJ7kzQQD8HEihRQUqfDAKZrYMMWR7DQdQD6D1ow',
  orange: '/payment-methods/orange-money-logo.png'
};

export function MobileInternationalTransfer() {
  const [step, setStep] = useState<'amount' | 'recipient' | 'method' | 'confirm'>('amount');
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
  const [provider, setProvider] = useState('');
  const [createdTransfer, setCreatedTransfer] = useState<any>(null);
  const [showPending, setShowPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const { createTransfer } = useInternationalTransfers();
  const { user } = useAuth();
  const { toast } = useToast();
  const { usdtToCfa, usdtToCad } = useCryptoRates();

  // Calcul du taux CAD vers CFA via USD
  const cadToUsd = usdtToCad ? (1 / usdtToCad) : 0.74;
  const usdToCfa = usdtToCfa || 600;
  const exchangeRate = Math.round(cadToUsd * usdToCfa * 100) / 100;

  // Calcul du montant à recevoir avec déduction automatique des frais
  const calculateReceiveAmount = () => {
    if (!sendAmount) return '0.00';
    
    const baseAmount = parseFloat(sendAmount) * exchangeRate;
    
    if (receiveMethod === 'mobile') {
      if (provider === 'wave') {
        return (baseAmount * 0.99).toFixed(2);
      } else if (provider === 'orange') {
        return (baseAmount * 0.992).toFixed(2);
      }
    }
    
    return baseAmount.toFixed(2);
  };

  const receiveAmount = calculateReceiveAmount();

  const handleContinueToRecipient = () => {
    if (!sendAmount || !recipientCountry) {
      toast({ title: "Erreur", description: "Veuillez remplir tous les champs", variant: "destructive" });
      return;
    }
    setStep('recipient');
  };

  const handleContinueToMethod = () => {
    if (!recipientFirstName || !recipientLastName || !recipientPhone) {
      toast({ title: "Erreur", description: "Veuillez remplir les informations du bénéficiaire", variant: "destructive" });
      return;
    }
    setStep('method');
  };

  const handleContinueToConfirm = () => {
    if (!paymentMethod || !receiveMethod) {
      toast({ title: "Erreur", description: "Veuillez sélectionner les méthodes de paiement", variant: "destructive" });
      return;
    }
    if (receiveMethod === 'mobile' && !provider) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un service Mobile Money", variant: "destructive" });
      return;
    }
    if (receiveMethod === 'bank' && (!recipientAccount || !recipientBank)) {
      toast({ title: "Erreur", description: "Veuillez remplir les informations bancaires", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    
    const transferData = {
      amount: parseFloat(sendAmount),
      from_currency: 'CAD',
      to_currency: 'CFA',
      exchange_rate: exchangeRate,
      fees: 0,
      total_amount: parseFloat(receiveAmount),
      recipient_name: `${recipientFirstName} ${recipientLastName}`,
      recipient_account: recipientAccount || recipientPhone,
      recipient_bank: recipientBank,
      recipient_country: recipientCountry,
      recipient_phone: recipientPhone,
      recipient_email: recipientEmail,
      payment_method: paymentMethod,
      receive_method: receiveMethod,
      provider: provider,
      status: 'pending'
    };

    const result = await createTransfer(transferData);
    setLoading(false);
    
    if (result) {
      setCreatedTransfer(result);
      setShowPending(true);
    }
  };

  const handleBackToDashboard = () => {
    setShowPending(false);
    setStep('amount');
    setSendAmount('');
    setRecipientCountry('');
    setPaymentMethod('');
    setReceiveMethod('');
    setRecipientFirstName('');
    setRecipientLastName('');
    setRecipientEmail('');
    setRecipientPhone('');
    setRecipientAccount('');
    setRecipientBank('');
    setProvider('');
    setCreatedTransfer(null);
  };

  if (showPending && createdTransfer) {
    return (
      <TransferPending
        transferData={createdTransfer}
        onBackToDashboard={handleBackToDashboard}
      />
    );
  }

  const countries = [
    { code: 'SN', name: 'Sénégal', flag: '🇸🇳' },
    { code: 'ML', name: 'Mali', flag: '🇲🇱' },
    { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫' },
    { code: 'CI', name: 'Côte d\'Ivoire', flag: '🇨🇮' },
    { code: 'CM', name: 'Cameroun', flag: '🇨🇲' },
    { code: 'NE', name: 'Niger', flag: '🇳🇪' }
  ];

  const progressPercent = 
    step === 'amount' ? 25 :
    step === 'recipient' ? 50 :
    step === 'method' ? 75 : 100;

  return (
    <div className="min-h-screen bg-terex-dark">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-terex-darker border-b border-terex-gray px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-terex-accent" />
            <div>
              <h1 className="text-lg font-light text-white">Virement international</h1>
              <p className="text-xs text-gray-400">
                Étape {step === 'amount' ? '1' : step === 'recipient' ? '2' : step === 'method' ? '3' : '4'} sur 4
              </p>
            </div>
          </div>
          {step !== 'amount' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep(
                step === 'recipient' ? 'amount' :
                step === 'method' ? 'recipient' : 'method'
              )}
              className="text-terex-accent"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        {/* Progress bar */}
        <div className="w-full bg-terex-gray rounded-full h-1.5">
          <div 
            className="bg-terex-accent h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Content - Scrollable avec padding pour éviter le débordement */}
      <div className="px-4 py-6 overflow-y-auto pb-24" style={{ maxHeight: 'calc(100vh - 100px)' }}>
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <Card className="bg-terex-darker border-terex-gray">
            <CardContent className="p-6 space-y-6">
              <div className="text-center mb-4">
                <Globe className="w-12 h-12 text-terex-accent mx-auto mb-3" />
                <h2 className="text-xl font-light text-white mb-2">Montant à envoyer</h2>
                <p className="text-sm text-gray-400">Combien souhaitez-vous envoyer ?</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Montant (CAD)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 100"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white text-lg h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Pays de destination</Label>
                  <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                    <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-14">
                      <SelectValue placeholder="Sélectionner un pays" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      {countries.map(country => (
                        <SelectItem key={country.code} value={country.code} className="text-white">
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {sendAmount && (
                  <div className="bg-terex-accent/10 border border-terex-accent/30 rounded-lg p-4 mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400 text-sm">Le bénéficiaire recevra</span>
                      <span className="text-2xl font-light text-terex-accent">{receiveAmount} CFA</span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Taux: 1 CAD = {exchangeRate} CFA
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleContinueToRecipient}
                  className="w-full gradient-button text-white h-14 text-lg mt-6"
                  disabled={!sendAmount || !recipientCountry}
                >
                  Continuer <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Étape 2: Bénéficiaire */}
        {step === 'recipient' && (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <User className="w-5 h-5" /> Informations du bénéficiaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Prénom *</Label>
                  <Input
                    value={recipientFirstName}
                    onChange={(e) => setRecipientFirstName(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Nom *</Label>
                  <Input
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Téléphone *</Label>
                <Input
                  type="tel"
                  placeholder="+221 XX XXX XX XX"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Email (optionnel)</Label>
                <Input
                  type="email"
                  placeholder="email@exemple.com"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="bg-terex-dark border-terex-gray text-white h-12"
                />
              </div>

              <Button
                onClick={handleContinueToMethod}
                className="w-full gradient-button text-white h-14 text-lg mt-4"
                disabled={!recipientFirstName || !recipientLastName || !recipientPhone}
              >
                Continuer <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 3: Méthode */}
        {step === 'method' && (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5" /> Méthodes de paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Vous payez avec</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-14">
                    <SelectValue placeholder="Choisir une méthode" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="interac" className="text-white">
                      <div className="flex items-center gap-3">
                        <img src={PAYMENT_LOGOS.interac} alt="Interac" className="w-8 h-8 object-contain" />
                        <span>Interac e-Transfer</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank" className="text-white">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5" />
                        <span>Virement bancaire</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Le bénéficiaire reçoit via</Label>
                <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                  <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-14">
                    <SelectValue placeholder="Choisir une méthode" />
                  </SelectTrigger>
                  <SelectContent className="bg-terex-darker border-terex-gray">
                    <SelectItem value="mobile" className="text-white">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5" />
                        <span>Mobile Money</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank" className="text-white">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5" />
                        <span>Compte bancaire</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {receiveMethod === 'mobile' && (
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Service Mobile Money</Label>
                  <Select value={provider} onValueChange={setProvider}>
                    <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-14">
                      <SelectValue placeholder="Sélectionner un service" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="orange" className="text-white">
                        <div className="flex items-center gap-3">
                          <img src={PAYMENT_LOGOS.orange} alt="Orange Money" className="w-8 h-8 object-contain" />
                          <span>Orange Money (0.8% frais)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="wave" className="text-white">
                        <div className="flex items-center gap-3">
                          <img src={PAYMENT_LOGOS.wave} alt="Wave" className="w-8 h-8 object-contain rounded" />
                          <span>Wave (1% frais)</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="free" className="text-white">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-blue-400" />
                          <span>Free Money</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {receiveMethod === 'bank' && (
                <>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Nom de la banque</Label>
                    <Input
                      value={recipientBank}
                      onChange={(e) => setRecipientBank(e.target.value)}
                      placeholder="Ex: Ecobank"
                      className="bg-terex-dark border-terex-gray text-white h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300 text-sm">Numéro de compte</Label>
                    <Input
                      value={recipientAccount}
                      onChange={(e) => setRecipientAccount(e.target.value)}
                      placeholder="Numéro de compte bancaire"
                      className="bg-terex-dark border-terex-gray text-white h-12"
                    />
                  </div>
                </>
              )}

              <Button
                onClick={handleContinueToConfirm}
                className="w-full gradient-button text-white h-14 text-lg mt-4"
                disabled={!paymentMethod || !receiveMethod || (receiveMethod === 'mobile' && !provider) || (receiveMethod === 'bank' && (!recipientAccount || !recipientBank))}
              >
                Continuer <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Étape 4: Confirmation */}
        {step === 'confirm' && (
          <Card className="bg-terex-darker border-terex-gray">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-2 text-lg">
                <Check className="w-5 h-5 text-green-400" /> Confirmation du transfert
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-terex-dark rounded-lg p-4 space-y-3">
                <h3 className="text-white font-light text-sm mb-3">Détails du transfert</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Montant envoyé</span>
                  <span className="text-white font-light">{sendAmount} CAD</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Montant reçu</span>
                  <span className="text-terex-accent text-lg font-light">{receiveAmount} CFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Taux de change</span>
                  <span className="text-white font-light">1 CAD = {exchangeRate} CFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Frais Terex</span>
                  <span className="text-green-400 font-light">Gratuit 🎉</span>
                </div>
              </div>

              <div className="bg-terex-dark rounded-lg p-4 space-y-3">
                <h3 className="text-white font-light text-sm mb-3">Bénéficiaire</h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Nom</span>
                  <span className="text-white font-light">{recipientFirstName} {recipientLastName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Téléphone</span>
                  <span className="text-white font-light">{recipientPhone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pays</span>
                  <span className="text-white font-light">{countries.find(c => c.code === recipientCountry)?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Méthode de réception</span>
                  <span className="text-white font-light">
                    {receiveMethod === 'mobile' ? `${provider.charAt(0).toUpperCase() + provider.slice(1)} Money` : 'Virement bancaire'}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleConfirm}
                className="w-full gradient-button text-white h-14 text-lg mt-4"
                disabled={loading}
              >
                {loading ? 'Traitement...' : 'Confirmer le transfert'} <Check className="ml-2 w-5 h-5" />
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
