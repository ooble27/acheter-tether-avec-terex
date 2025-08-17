
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
    receiveMethod: '',
    provider: '',
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
            paymentMethod={transferData.paymentMethod}
            setPaymentMethod={(method: string) => setTransferData(prev => ({ ...prev, paymentMethod: method }))}
            receiveMethod={transferData.receiveMethod}
            setReceiveMethod={(method: string) => setTransferData(prev => ({ ...prev, receiveMethod: method }))}
            exchangeRate={650}
            fees="0"
            provider={transferData.provider}
            setProvider={(provider: string) => setTransferData(prev => ({ ...prev, provider }))}
            onSubmit={handleSubmit}
          />
        );
      case 2:
        return (
          <TransferConfirmation
            transferData={{
              sendAmount: transferData.sendAmount,
              receiveAmount: transferData.receiveAmount,
              receiveMethod: transferData.receiveMethod,
              recipientFirstName: transferData.recipientFirstName,
              recipientLastName: transferData.recipientLastName,
              recipientCountry: transferData.recipientCountry,
              recipientPhone: '',
              recipientBank: '',
              recipientAccount: '',
              paymentMethod: transferData.paymentMethod,
              exchangeRate: 650,
              fees: '0'
            }}
            onBack={prevStep}
            onConfirm={nextStep}
          />
        );
      case 3:
        return (
          <TransferPending
            transferData={{
              amount: transferData.sendAmount,
              total_amount: transferData.receiveAmount,
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
            paymentMethod={transferData.paymentMethod}
            setPaymentMethod={(method: string) => setTransferData(prev => ({ ...prev, paymentMethod: method }))}
            receiveMethod={transferData.receiveMethod}
            setReceiveMethod={(method: string) => setTransferData(prev => ({ ...prev, receiveMethod: method }))}
            exchangeRate={650}
            fees="0"
            provider={transferData.provider}
            setProvider={(provider: string) => setTransferData(prev => ({ ...prev, provider }))}
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
          exchangeRate={650}
          ratesLoading={false}
          ratesError={null}
          lastUpdated={new Date()}
          refresh={() => {}}
          setSendAmount={(amount: string) => setTransferData(prev => ({ ...prev, sendAmount: amount }))}
        />
      </div>
    </div>
  );
}
