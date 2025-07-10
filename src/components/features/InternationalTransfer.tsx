
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternationalTransfers } from '@/hooks/useInternationalTransfers';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useCryptoRates } from '@/hooks/useCryptoRates';
import { FavoriteRecipient } from '@/hooks/useFavoriteRecipients';

// Importer les nouveaux composants
import { TransferConfirmation } from './international-transfer/TransferConfirmation';
import { PaymentInstructions } from './international-transfer/PaymentInstructions';
import { TransferPending } from './international-transfer/TransferPending';
import { MobileMoneySelector } from './international-transfer/MobileMoneySelector';
import { RecipientSelector } from './international-transfer/RecipientSelector';
import { KYCProtection } from './KYCProtection';
import { KYCPage } from './KYCPage';
import { TransferForm } from './international-transfer/TransferForm';
import { RecipientForm } from './international-transfer/RecipientForm';
import { TransferSidebar } from './international-transfer/TransferSidebar';

export function InternationalTransfer() {
  const [showKYCPage, setShowKYCPage] = useState(false);
  const [currentStep, setCurrentStep] = useState('recipient-select');
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
  const [selectedRecipient, setSelectedRecipient] = useState<FavoriteRecipient | null>(null);
  const [isNewRecipient, setIsNewRecipient] = useState(false);
  const [editingRecipient, setEditingRecipient] = useState<FavoriteRecipient | null>(null);
  
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

  const handleRecipientSelect = (recipient: FavoriteRecipient | null) => {
    setSelectedRecipient(recipient);
    
    if (recipient) {
      // Pré-remplir les données du destinataire sélectionné
      const names = recipient.recipient_name.split(' ');
      setRecipientFirstName(names[0] || '');
      setRecipientLastName(names.slice(1).join(' ') || '');
      setRecipientEmail(recipient.recipient_email || '');
      setRecipientPhone(recipient.recipient_phone || '');
      setRecipientAccount(recipient.recipient_account || '');
      setRecipientBank(recipient.recipient_bank || '');
      setRecipientCountry(recipient.recipient_country);
      setReceiveMethod(recipient.receive_method);
      setProvider(recipient.provider || '');
      
      // Suggérer le dernier montant envoyé
      if (recipient.last_amount) {
        setSendAmount(recipient.last_amount.toString());
      }
    } else {
      // Réinitialiser le formulaire pour un nouveau destinataire
      setRecipientFirstName('');
      setRecipientLastName('');
      setRecipientEmail('');
      setRecipientPhone('');
      setRecipientAccount('');
      setRecipientBank('');
      setRecipientCountry('');
      setReceiveMethod('');
      setProvider('');
      setSendAmount('');
    }
  };

  const handleEditRecipient = (recipient: FavoriteRecipient) => {
    setEditingRecipient(recipient);
    setSelectedRecipient(null);
    setIsNewRecipient(false);
    
    // Pré-remplir les données du destinataire à éditer
    const names = recipient.recipient_name.split(' ');
    setRecipientFirstName(names[0] || '');
    setRecipientLastName(names.slice(1).join(' ') || '');
    setRecipientEmail(recipient.recipient_email || '');
    setRecipientPhone(recipient.recipient_phone || '');
    setRecipientAccount(recipient.recipient_account || '');
    setRecipientBank(recipient.recipient_bank || '');
    setRecipientCountry(recipient.recipient_country);
    setReceiveMethod(recipient.receive_method);
    setProvider(recipient.provider || '');
    
    // Suggérer le dernier montant envoyé
    if (recipient.last_amount) {
      setSendAmount(recipient.last_amount.toString());
    }
    
    setCurrentStep('form');
  };

  const handleRecipientContinue = () => {
    if (selectedRecipient) {
      // Si un destinataire favori est sélectionné, aller directement à la confirmation
      setCurrentStep('confirmation');
    } else {
      // Si c'est un nouveau destinataire, aller au formulaire
      setCurrentStep('form');
    }
  };

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
    setCurrentStep('recipient-select');
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
    setSelectedRecipient(null);
    setIsNewRecipient(false);
    setEditingRecipient(null);
  };

  // Rendu conditionnel selon l'étape
  if (showKYCPage) {
    return <KYCPage onBack={() => setShowKYCPage(false)} />;
  }

  // Étape de sélection du destinataire
  if (currentStep === 'recipient-select') {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <div className="min-h-screen bg-terex-dark p-2 md:p-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Virement international</h1>
              <p className="text-gray-400">Sélectionnez un destinataire ou ajoutez-en un nouveau</p>
            </div>

            <RecipientSelector
              onSelectRecipient={handleRecipientSelect}
              onContinue={handleRecipientContinue}
              onEditRecipient={handleEditRecipient}
              selectedRecipient={selectedRecipient}
              isNewRecipient={isNewRecipient}
              setIsNewRecipient={setIsNewRecipient}
            />
          </div>
        </div>
      </KYCProtection>
    );
  }

  if (currentStep === 'mobile-money') {
    return (
      <KYCProtection onKYCRequired={handleKYCRequired}>
        <MobileMoneySelector
          onComplete={handleMobileMoneyComplete}
          onBack={() => setCurrentStep(selectedRecipient ? 'recipient-select' : 'form')}
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
          onBack={() => setCurrentStep(receiveMethod === 'mobile' ? 'mobile-money' : (selectedRecipient ? 'recipient-select' : 'form'))}
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

  // Formulaire principal (pour les nouveaux destinataires ou l'édition)
  return (
    <KYCProtection onKYCRequired={handleKYCRequired}>
      <div className="min-h-screen bg-terex-dark p-2 md:p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {editingRecipient ? 'Modifier le destinataire' : 'Nouveau destinataire'}
            </h1>
            <p className="text-gray-400">
              {editingRecipient ? 'Modifiez les informations du destinataire' : 'Remplissez les informations du nouveau destinataire'}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-terex-darker border-terex-gray shadow-2xl">
                <CardHeader className="border-b border-terex-gray p-4 md:p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg md:text-xl">
                      {editingRecipient ? 'Modifier le transfert' : 'Nouveau transfert'}
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('recipient-select')}
                      className="text-terex-accent border-terex-accent hover:bg-terex-accent hover:text-white"
                    >
                      Retour aux destinataires
                    </Button>
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
                    recipientCountry={recipientCountry}
                    setRecipientCountry={setRecipientCountry}
                    receiveMethod={receiveMethod}
                    setReceiveMethod={setReceiveMethod}
                    provider={provider}
                    setProvider={setProvider}
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
    </KYCProtection>
  );
}
