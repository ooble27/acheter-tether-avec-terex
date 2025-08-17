
import { useState, useEffect } from 'react';
import { TransferForm } from '@/components/features/international-transfer/TransferForm';
import { TransferConfirmation } from '@/components/features/international-transfer/TransferConfirmation';
import { TransferPending } from '@/components/features/international-transfer/TransferPending';
import { TransferSidebar } from '@/components/features/international-transfer/TransferSidebar';
import { KYCProtection } from '@/components/features/KYCProtection';
import { useScrollToTop } from '@/components/ScrollToTop';

export function InternationalTransfer() {
  const scrollToTop = useScrollToTop();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [transferData, setTransferData] = useState({
    sendAmount: '',
    receiveAmount: '',
    recipientCountry: '',
    recipientFirstName: '',
    recipientLastName: '',
    paymentMethod: '',
    termsAccepted: false,
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    nextStep();
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TransferForm 
            sendAmount={transferData.sendAmount}
            setSendAmount={(amount: string) => setTransferData(prev => ({ ...prev, sendAmount: amount }))}
            receiveAmount={transferData.receiveAmount}
            recipientCountry={transferData.recipientCountry}
            setRecipientCountry={(country: string) => setTransferData(prev => ({ ...prev, recipientCountry: country }))}
            recipientFirstName={transferData.recipientFirstName}
            setRecipientFirstName={(name: string) => setTransferData(prev => ({ ...prev, recipientFirstName: name }))}
            recipientLastName={transferData.recipientLastName}
            setRecipientLastName={(name: string) => setTransferData(prev => ({ ...prev, recipientLastName: name }))}
            paymentMethod={transferData.paymentMethod}
            setPaymentMethod={(method: string) => setTransferData(prev => ({ ...prev, paymentMethod: method }))}
            termsAccepted={transferData.termsAccepted}
            setTermsAccepted={(accepted: boolean) => setTransferData(prev => ({ ...prev, termsAccepted: accepted }))}
            onSubmit={handleSubmit}
          />
        );
      case 2:
        return (
          <TransferConfirmation
            transferData={{
              sendAmount: transferData.sendAmount,
              receiveAmount: transferData.receiveAmount,
              receiveMethod: 'bank',
              recipientFirstName: transferData.recipientFirstName,
              recipientLastName: transferData.recipientLastName,
              recipientCountry: transferData.recipientCountry,
              recipientBank: '',
              recipientAccount: '',
              paymentMethod: transferData.paymentMethod,
            }}
            onBack={prevStep}
            onContinue={nextStep}
          />
        );
      case 3:
        return (
          <TransferPending
            transferData={{
              amount: transferData.sendAmount,
              total_amount: transferData.sendAmount,
              recipient_name: `${transferData.recipientFirstName} ${transferData.recipientLastName}`,
              recipient_phone: '',
              recipient_country: transferData.recipientCountry,
              id: Math.random().toString(36)
            }}
            onBackToDashboard={() => setCurrentStep(1)}
          />
        );
      default:
        return (
          <TransferForm 
            sendAmount={transferData.sendAmount}
            setSendAmount={(amount: string) => setTransferData(prev => ({ ...prev, sendAmount: amount }))}
            receiveAmount={transferData.receiveAmount}
            recipientCountry={transferData.recipientCountry}
            setRecipientCountry={(country: string) => setTransferData(prev => ({ ...prev, recipientCountry: country }))}
            recipientFirstName={transferData.recipientFirstName}
            setRecipientFirstName={(name: string) => setTransferData(prev => ({ ...prev, recipientFirstName: name }))}
            recipientLastName={transferData.recipientLastName}
            setRecipientLastName={(name: string) => setTransferData(prev => ({ ...prev, recipientLastName: name }))}
            paymentMethod={transferData.paymentMethod}
            setPaymentMethod={(method: string) => setTransferData(prev => ({ ...prev, paymentMethod: method }))}
            termsAccepted={transferData.termsAccepted}
            setTermsAccepted={(accepted: boolean) => setTransferData(prev => ({ ...prev, termsAccepted: accepted }))}
            onSubmit={handleSubmit}
          />
        );
    }
  };

  // Effet pour scroll to top à chaque changement d'étape
  useEffect(() => {
    scrollToTop();
  }, [currentStep, scrollToTop]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Contenu principal */}
      <div className="lg:col-span-3">
        <KYCProtection onKYCRequired={() => {}}>
          {renderContent()}
        </KYCProtection>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <TransferSidebar 
          exchangeRate={1.0}
          ratesLoading={false}
          ratesError={null}
          lastUpdated={new Date()}
          sendAmount={transferData.sendAmount}
          receiveAmount={transferData.receiveAmount}
        />
      </div>
    </div>
  );
}
