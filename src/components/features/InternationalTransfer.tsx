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
            transferData={transferData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            nextStep={nextStep}
            onSubmit={handleSubmit}
          />
        );
      case 2:
        return (
          <TransferConfirmation
            transferData={transferData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        );
      case 3:
        return (
          <TransferPending
            transferData={transferData}
            onBackToHome={() => setCurrentStep(1)}
          />
        );
      default:
        return (
          <TransferForm
            transferData={transferData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            nextStep={nextStep}
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
        <KYCProtection>
          {renderContent()}
        </KYCProtection>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <TransferSidebar />
      </div>
    </div>
  );
}
