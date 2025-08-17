
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
    recipientName: '',
    recipientCountry: '',
    recipientBank: '',
    recipientAccount: '',
    transferAmount: '',
    transferCurrency: 'USD',
    paymentMethod: 'bank',
    termsAccepted: false,
  });

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransferData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setTransferData(prevData => ({
      ...prevData,
      [name]: checked
    }));
  };

  const handleSubmit = () => {
    nextStep();
  };

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <TransferForm 
            sendAmount=""
            setSendAmount={() => {}}
            receiveAmount=""
            recipientCountry=""
            setRecipientCountry={() => {}}
            recipientFirstName=""
            setRecipientFirstName={() => {}}
            recipientLastName=""
            setRecipientLastName={() => {}}
            paymentMethod=""
            setPaymentMethod={() => {}}
            termsAccepted={false}
            setTermsAccepted={() => {}}
            onSubmit={handleSubmit}
          />
        );
      case 2:
        return (
          <TransferConfirmation
            transferData={{
              sendAmount: transferData.transferAmount,
              receiveAmount: transferData.transferAmount,
              receiveMethod: 'bank',
              recipientFirstName: transferData.recipientName.split(' ')[0] || '',
              recipientLastName: transferData.recipientName.split(' ').slice(1).join(' ') || '',
              recipientCountry: transferData.recipientCountry,
              recipientBank: transferData.recipientBank,
              recipientAccount: transferData.recipientAccount,
              paymentMethod: transferData.paymentMethod,
              termsAccepted: transferData.termsAccepted,
            }}
            onBack={prevStep}
            onContinue={nextStep}
          />
        );
      case 3:
        return (
          <TransferPending
            transferData={{
              ...transferData,
              amount: transferData.transferAmount,
              total_amount: transferData.transferAmount,
              recipient_name: transferData.recipientName,
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
            sendAmount=""
            setSendAmount={() => {}}
            receiveAmount=""
            recipientCountry=""
            setRecipientCountry={() => {}}
            recipientFirstName=""
            setRecipientFirstName={() => {}}
            recipientLastName=""
            setRecipientLastName={() => {}}
            paymentMethod=""
            setPaymentMethod={() => {}}
            termsAccepted={false}
            setTermsAccepted={() => {}}
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
          lastUpdated={new Date().toISOString()}
          sendAmount="0"
          receiveAmount="0"
        />
      </div>
    </div>
  );
}
