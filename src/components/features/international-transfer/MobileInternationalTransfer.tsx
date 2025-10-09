import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from '@/components/ui/drawer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { ArrowRight, ArrowLeft, Check, Send, User, MapPin, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { TransferPending } from './TransferPending';

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
    <div className="min-h-screen bg-terex-dark pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-terex-darker border-b border-terex-gray px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Send className="w-6 h-6 text-terex-accent" />
            <div>
              <h1 className="text-lg font-light text-white">Virement international</h1>
              <p className="text-xs text-gray-400">
                {step === 'amount' && 'Montant à envoyer'}
                {step === 'recipient' && 'Informations du bénéficiaire'}
                {step === 'method' && 'Méthodes de paiement'}
                {step === 'confirm' && 'Confirmation'}
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

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Étape 1: Montant */}
        {step === 'amount' && (
          <Drawer open={true}>
            <DrawerContent className="bg-terex-darker border-terex-gray">
              <DrawerHeader>
                <DrawerTitle className="text-white">Montant à envoyer</DrawerTitle>
                <DrawerDescription className="text-gray-400">
                  Combien souhaitez-vous envoyer ?
                </DrawerDescription>
              </DrawerHeader>
              
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Montant (CAD)</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 100"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white text-lg h-14"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Pays de destination</Label>
                  <Select value={recipientCountry} onValueChange={setRecipientCountry}>
                    <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-14">
                      <SelectValue placeholder="Sélectionner" />
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
                  <div className="bg-terex-accent/10 border border-terex-accent/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Le bénéficiaire recevra</span>
                      <span className="text-2xl font-light text-terex-accent">{receiveAmount} CFA</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-2">
                      Taux: 1 CAD = {exchangeRate} CFA
                    </div>
                  </div>
                )}
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleContinueToRecipient}
                  className="w-full gradient-button text-white h-14 text-lg"
                  disabled={!sendAmount || !recipientCountry}
                >
                  Continuer <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}

        {/* Étape 2: Bénéficiaire */}
        {step === 'recipient' && (
          <Drawer open={true}>
            <DrawerContent className="bg-terex-darker border-terex-gray">
              <DrawerHeader>
                <DrawerTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" /> Informations du bénéficiaire
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-gray-300">Prénom *</Label>
                    <Input
                      value={recipientFirstName}
                      onChange={(e) => setRecipientFirstName(e.target.value)}
                      className="bg-terex-dark border-terex-gray text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-300">Nom *</Label>
                    <Input
                      value={recipientLastName}
                      onChange={(e) => setRecipientLastName(e.target.value)}
                      className="bg-terex-dark border-terex-gray text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Téléphone *</Label>
                  <Input
                    type="tel"
                    placeholder="+221 XX XXX XX XX"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Email (optionnel)</Label>
                  <Input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="bg-terex-dark border-terex-gray text-white"
                  />
                </div>
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleContinueToMethod}
                  className="w-full gradient-button text-white h-14 text-lg"
                  disabled={!recipientFirstName || !recipientLastName || !recipientPhone}
                >
                  Continuer <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}

        {/* Étape 3: Méthode */}
        {step === 'method' && (
          <Drawer open={true}>
            <DrawerContent className="bg-terex-darker border-terex-gray">
              <DrawerHeader>
                <DrawerTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Méthodes de paiement
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-2">
                  <Label className="text-gray-300">Vous payez avec</Label>
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-12">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="interac" className="text-white">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" /> Interac e-Transfer
                        </div>
                      </SelectItem>
                      <SelectItem value="bank" className="text-white">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" /> Virement bancaire
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Le bénéficiaire reçoit via</Label>
                  <Select value={receiveMethod} onValueChange={setReceiveMethod}>
                    <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-12">
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent className="bg-terex-darker border-terex-gray">
                      <SelectItem value="mobile" className="text-white">
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4" /> Mobile Money
                        </div>
                      </SelectItem>
                      <SelectItem value="bank" className="text-white">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-4 h-4" /> Compte bancaire
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {receiveMethod === 'mobile' && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Service Mobile Money</Label>
                    <Select value={provider} onValueChange={setProvider}>
                      <SelectTrigger className="bg-terex-dark border-terex-gray text-white h-12">
                        <SelectValue placeholder="Sélectionner" />
                      </SelectTrigger>
                      <SelectContent className="bg-terex-darker border-terex-gray">
                        <SelectItem value="orange" className="text-white">
                          🟠 Orange Money (0.8% frais)
                        </SelectItem>
                        <SelectItem value="wave" className="text-white">
                          🌊 Wave (1% frais)
                        </SelectItem>
                        <SelectItem value="free" className="text-white">
                          📱 Free Money
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {receiveMethod === 'bank' && (
                  <>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Nom de la banque</Label>
                      <Input
                        value={recipientBank}
                        onChange={(e) => setRecipientBank(e.target.value)}
                        placeholder="Ex: Ecobank"
                        className="bg-terex-dark border-terex-gray text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-gray-300">Numéro de compte</Label>
                      <Input
                        value={recipientAccount}
                        onChange={(e) => setRecipientAccount(e.target.value)}
                        className="bg-terex-dark border-terex-gray text-white"
                      />
                    </div>
                  </>
                )}
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleContinueToConfirm}
                  className="w-full gradient-button text-white h-14 text-lg"
                  disabled={!paymentMethod || !receiveMethod || (receiveMethod === 'mobile' && !provider) || (receiveMethod === 'bank' && (!recipientAccount || !recipientBank))}
                >
                  Continuer <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}

        {/* Étape 4: Confirmation */}
        {step === 'confirm' && (
          <Drawer open={true}>
            <DrawerContent className="bg-terex-darker border-terex-gray">
              <DrawerHeader>
                <DrawerTitle className="text-white flex items-center gap-2">
                  <Check className="w-5 h-5" /> Confirmation du transfert
                </DrawerTitle>
              </DrawerHeader>
              
              <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="bg-terex-dark rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant envoyé</span>
                    <span className="text-white font-light">{sendAmount} CAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Montant reçu</span>
                    <span className="text-terex-accent text-lg font-light">{receiveAmount} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Taux de change</span>
                    <span className="text-white font-light">1 CAD = {exchangeRate} CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Frais Terex</span>
                    <span className="text-green-400 font-light">Gratuit 🎉</span>
                  </div>
                </div>

                <div className="bg-terex-dark rounded-lg p-4 space-y-3">
                  <h3 className="text-white font-light mb-2">Bénéficiaire</h3>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Nom</span>
                    <span className="text-white font-light">{recipientFirstName} {recipientLastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Téléphone</span>
                    <span className="text-white font-light">{recipientPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pays</span>
                    <span className="text-white font-light">{countries.find(c => c.code === recipientCountry)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Méthode de réception</span>
                    <span className="text-white font-light">
                      {receiveMethod === 'mobile' ? `${provider.toUpperCase()} Money` : 'Virement bancaire'}
                    </span>
                  </div>
                </div>
              </div>

              <DrawerFooter>
                <Button
                  onClick={handleConfirm}
                  className="w-full gradient-button text-white h-14 text-lg"
                  disabled={loading}
                >
                  {loading ? 'Traitement...' : 'Confirmer le transfert'} <Check className="ml-2 w-5 h-5" />
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
