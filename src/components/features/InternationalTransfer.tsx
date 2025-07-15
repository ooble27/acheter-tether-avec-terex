import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCryptoRates } from '@/hooks/useCryptoRates';

// Importer les nouveaux composants
import { TransferConfirmation } from './international-transfer/TransferConfirmation';
import { PaymentInstructions } from './international-transfer/PaymentInstructions';
import { TransferPending } from './international-transfer/TransferPending';
import { MobileMoneySelector } from './international-transfer/MobileMoneySelector';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { TransferForm } from './international-transfer/TransferForm';
import { RecipientForm } from './international-transfer/RecipientForm';
import { TransferSidebar } from './international-transfer/TransferSidebar';

export function InternationalTransfer() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [currentStep, setCurrentStep] = useState('form');
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
  
  const { createTransfer, loading } = useInternationalTransfers();
  const { user } = useAuth();
  const { toast } = useToast();
  const { usdtToCfa, usdtToCad, loading: ratesLoading, error: ratesError, lastUpdated, refresh } = useCryptoRates();

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
        // Déduction de 1% pour Wave
        return (baseAmount * 0.99).toFixed(2);
      } else if (provider === 'orange') {
        // Déduction de 0.8% pour Orange Money
        return (baseAmount * 0.992).toFixed(2);
      }
    }
    
    return baseAmount.toFixed(2);
  };
  
  const receiveAmount = calculateReceiveAmount();
  const fees = '0.00'; // Gratuit avec TRX

  const handleMobileMoneyComplete = (selectedProvider: string, phoneNumber: string) => {
    setProvider(selectedProvider);
    setRecipientPhone(phoneNumber);
    setCurrentStep('confirmation');
  };

  const handleKYCRequired = () => {
    setShowKYCPage(true);
  };

  const handleFormSubmit = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour effectuer un transfert",
        variant: "destructive",
      });
      return;
    }

    if (!sendAmount || !paymentMethod || !receiveMethod || !recipientCountry || 
        !recipientFirstName || !recipientLastName) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    // Si c'est Mobile Money, aller à la sélection du service
    if (receiveMethod === 'mobile') {
      setCurrentStep('mobile-money');
      return;
    }

    // Sinon, aller directement à la confirmation
    setCurrentStep('confirmation');
  };

  const handleTransferConfirm = async () => {
    const transferData = {
      amount: parseFloat(sendAmount),
      from_currency: 'CAD',
      to_currency: 'CFA',
      exchange_rate: exchangeRate,
      fees: 0, // Gratuit
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
    if (result) {
      setCreatedTransfer(result);
      setCurrentStep('payment');
    }
  };

  const handlePaymentSent = () => {
    setCurrentStep('pending');
  };

  const handleBackToDashboard = () => {
    setCurrentStep('form');
    // Reset form
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

  // Rendu conditionnel selon l'étape
  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  if (currentStep === 'mobile-money') {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <MobileMoneySelector
          onComplete={handleMobileMoneyComplete}
          onBack={() => setCurrentStep('form')}
          recipientCountry={recipientCountry}
        />
      </KYCProtection>
    );
  }

  if (currentStep === 'confirmation') {
    const transferData = {
      sendAmount,
      receiveAmount,
      recipientCountry,
      paymentMethod,
      receiveMethod,
      recipientFirstName,
      recipientLastName,
      recipientPhone,
      recipientEmail,
      recipientAccount,
      recipientBank,
      provider,
      exchangeRate,
      fees
    };

    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <TransferConfirmation
          transferData={transferData}
          onConfirm={handleTransferConfirm}
          onBack={() => setCurrentStep(receiveMethod === 'mobile' ? 'mobile-money' : 'form')}
          loading={loading}
        />
      </KYCProtection>
    );
  }

  if (currentStep === 'payment') {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <PaymentInstructions
          transferData={createdTransfer}
          onPaymentSent={handlePaymentSent}
          onBack={() => setCurrentStep('confirmation')}
        />
      </KYCProtection>
    );
  }

  if (currentStep === 'pending') {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <TransferPending
          transferData={createdTransfer}
          onBackToDashboard={handleBackToDashboard}
        />
      </KYCProtection>
    );
  }

  // Formulaire principal
  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-terex-dark p-0">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 px-4 md:px-0">
            <h1 className="text-3xl font-bold text-white mb-2">Virement international</h1>
            <p className="text-gray-400">Envoyer de l'argent rapidement à vos proches</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-0 md:gap-6 px-2 lg:px-0">
            <div className="lg:col-span-2">
              <Card className="bg-terex-darker border-terex-gray shadow-2xl">
                <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg md:text-xl">Nouveau transfert</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 md:p-6 space-y-6">
                  <TransferForm
                    sendAmount={sendAmount}
                    setSendAmount={setSendAmount}
                    receiveAmount={receiveAmount}
                    recipientCountry={recipientCountry}
                    setRecipientCountry={setRecipientCountry}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                    receiveMethod={receiveMethod}
                    setReceiveMethod={setReceiveMethod}
                    exchangeRate={exchangeRate}
                    fees={fees}
                    provider={provider}
                    setProvider={setProvider}
                  />

                  <RecipientForm
                    recipientFirstName={recipientFirstName}
                    setRecipientFirstName={setRecipientFirstName}
                    recipientLastName={recipientLastName}
                    setRecipientLastName={setRecipientLastName}
                    recipientEmail={recipientEmail}
                    setRecipientEmail={setRecipientEmail}
                    recipientPhone={recipientPhone}
                    setRecipientPhone={setRecipientPhone}
                    recipientAccount={recipientAccount}
                    setRecipientAccount={setRecipientAccount}
                    recipientBank={recipientBank}
                    setRecipientBank={setRecipientBank}
                    receiveMethod={receiveMethod}
                  />

                  <Button 
                    size="lg"
                    className="w-full gradient-button text-white font-semibold h-12 text-lg"
                    disabled={!sendAmount || !paymentMethod || !receiveMethod || !recipientCountry || !recipientFirstName || !recipientLastName || (receiveMethod !== 'mobile' && !recipientPhone) || loading || (receiveMethod === 'mobile' && !provider)}
                    onClick={handleFormSubmit}
                  >
                    {loading ? 'Traitement...' : 'Continuer le transfert'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="px-2 lg:px-0 mt-4 lg:mt-0">
              <TransferSidebar
                exchangeRate={exchangeRate}
                ratesLoading={ratesLoading}
                ratesError={ratesError}
                lastUpdated={lastUpdated}
                refresh={refresh}
                setSendAmount={setSendAmount}
              />
            </div>
          </div>
        </div>
      </div>
    </KYCProtection>
  );
}
