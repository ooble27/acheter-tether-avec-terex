import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Zap } from 'lucide-react';
import { BuyAmountInput } from '@/components/features/buy-usdt/BuyAmountInput';
import { WalletAddressInput } from '@/components/features/buy-usdt/WalletAddressInput';
import { NetworkSelector } from '@/components/features/buy-usdt/NetworkSelector';
import { PaymentMethodForm } from '@/components/features/buy-usdt/PaymentMethodForm';
import { TradingSidebar } from '@/components/features/buy-usdt/TradingSidebar';
import { OrderConfirmation } from '@/components/features/OrderConfirmation';
import { PaymentPage } from '@/components/features/PaymentPage';
import { PaymentPending } from '@/components/features/PaymentPending';
import { PaymentSuccess } from '@/components/features/PaymentSuccess';
import { QuickAmounts } from '@/components/features/buy-usdt/QuickAmounts';
import { LimitsValidator } from '@/components/features/buy-usdt/LimitsValidator';
import { DestinationSelector } from '@/components/features/buy-usdt/DestinationSelector';
import { BinanceEmailInput } from '@/components/features/buy-usdt/BinanceEmailInput';
import { KYCProtection } from '@/components/features/KYCProtection';
import { useScrollToTop } from '@/components/ScrollToTop';

interface OrderData {
  amount: string;
  currency: string;
  usdtAmount: string;
  network: string;
  walletAddress: string;
  paymentMethod: 'card' | 'mobile' | 'binance';
  binanceEmail?: string;
  exchangeRate: number;
  paymentLink?: string;
}

export function BuyUSDT() {
  const scrollToTop = useScrollToTop();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    amount: '',
    currency: 'EUR',
    usdtAmount: '',
    network: 'TRC20',
    walletAddress: '',
    paymentMethod: 'card',
    exchangeRate: 0,
    paymentLink: '',
  });
  const [orderId, setOrderId] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [transactionHash, setTransactionHash] = useState<string | undefined>(undefined);
  const [limitsError, setLimitsError] = useState<string | null>(null);
  const [destination, setDestination] = useState<'wallet' | 'binance'>('wallet');
  const [isBinanceEmailValid, setIsBinanceEmailValid] = useState(false);

  const handleAmountChange = (amount: string) => {
    setOrderData(prev => ({ ...prev, amount }));
  };

  const handleCurrencyChange = (currency: string) => {
    setOrderData(prev => ({ ...prev, currency }));
  };

  const handleNetworkChange = (network: string) => {
    setOrderData(prev => ({ ...prev, network }));
  };

  const handleWalletAddressChange = (walletAddress: string) => {
    setOrderData(prev => ({ ...prev, walletAddress }));
  };

  const handlePaymentMethodChange = (paymentMethod: 'card' | 'mobile' | 'binance') => {
    setOrderData(prev => ({ ...prev, paymentMethod }));
  };

  const handleBinanceEmailChange = (binanceEmail: string) => {
    setOrderData(prev => ({ ...prev, binanceEmail }));
  };

  const handleUSDTAmountChange = (usdtAmount: string) => {
    setOrderData(prev => ({ ...prev, usdtAmount }));
  };

  const handleExchangeRateChange = (exchangeRate: number) => {
    setOrderData(prev => ({ ...prev, exchangeRate }));
  };

  const handleDestinationChange = (destination: 'wallet' | 'binance') => {
    setDestination(destination);
    // Reset wallet address when switching to Binance
    if (destination === 'binance') {
      setOrderData(prev => ({ ...prev, walletAddress: '' }));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleConfirm = async () => {
    setCurrentStep(4);
  };

  const handlePayment = (url: string, orderId: string) => {
    setPaymentUrl(url);
    setOrderId(orderId);
    setCurrentStep(5);
  };

  const handlePaymentSuccess = (txHash: string | undefined) => {
    setTransactionHash(txHash);
    setCurrentStep(6);
  };

  const handlePaymentPending = (orderId: string) => {
    setOrderId(orderId);
    setCurrentStep(7);
  };

  const handlePaymentError = () => {
    setCurrentStep(1);
  };

  const handleBuyMore = () => {
    // Reset order data and go back to step 1
    setOrderData({
      amount: '',
      currency: 'EUR',
      usdtAmount: '',
      network: 'TRC20',
      walletAddress: '',
      paymentMethod: 'card',
      exchangeRate: 0,
      paymentLink: '',
    });
    setCurrentStep(1);
  };

  const handleLimitsError = (error: string | null) => {
    setLimitsError(error);
  };

  const handleBinanceEmailValidation = (isValid: boolean) => {
    setIsBinanceEmailValid(isValid);
  };

  // Effet pour scroll to top à chaque changement d'étape
  useEffect(() => {
    scrollToTop();
  }, [currentStep, scrollToTop]);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <LimitsValidator
              amount={orderData.amount}
              currency={orderData.currency}
              network={orderData.network}
              paymentMethod={orderData.paymentMethod}
              onLimitsError={handleLimitsError}
              onExchangeRateChange={handleExchangeRateChange}
              onUSDTAmountChange={handleUSDTAmountChange}
            />
            <DestinationSelector
              destination={destination}
              onDestinationChange={handleDestinationChange}
            />
            {destination === 'wallet' ? (
              <WalletAddressInput
                walletAddress={orderData.walletAddress}
                onWalletAddressChange={handleWalletAddressChange}
                network={orderData.network}
              />
            ) : (
              <BinanceEmailInput
                binanceEmail={orderData.binanceEmail || ''}
                onBinanceEmailChange={handleBinanceEmailChange}
                onValidation={handleBinanceEmailValidation}
              />
            )}
            <NetworkSelector
              network={orderData.network}
              onNetworkChange={handleNetworkChange}
            />
            <BuyAmountInput
              amount={orderData.amount}
              currency={orderData.currency}
              onAmountChange={handleAmountChange}
              onCurrencyChange={handleCurrencyChange}
              usdtAmount={orderData.usdtAmount}
              exchangeRate={orderData.exchangeRate}
            />
            <QuickAmounts
              onAmountChange={handleAmountChange}
              currency={orderData.currency}
            />
            <PaymentMethodForm
              paymentMethod={orderData.paymentMethod}
              onPaymentMethodChange={handlePaymentMethodChange}
            />
          </>
        );
      case 2:
        return (
          <OrderConfirmation
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              paymentMethod: orderData.paymentMethod as 'card' | 'mobile',
              exchangeRate: orderData.exchangeRate
            }}
            onBack={handleBack}
            onConfirm={handleConfirm}
          />
        );
      case 3:
        return (
          <PaymentPage
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              paymentMethod: orderData.paymentMethod as 'card' | 'mobile',
              exchangeRate: orderData.exchangeRate,
              paymentLink: orderData.paymentLink || ''
            }}
            orderId={orderId}
            onBack={handleBack}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
          />
        );
      case 4:
        return (
          <PaymentPending
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              paymentMethod: orderData.paymentMethod as 'card' | 'mobile',
              exchangeRate: orderData.exchangeRate
            }}
            orderId={orderId}
            onBackToHome={handleBuyMore}
          />
        );
      case 5:
        return (
          <PaymentSuccess
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              exchangeRate: orderData.exchangeRate
            }}
            orderId={orderId}
            txHash={transactionHash}
            onBackToHome={handleBuyMore}
            onBuyMore={handleBuyMore}
          />
        );
      case 6:
        return (
          <PaymentPending
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              paymentMethod: orderData.paymentMethod as 'card' | 'mobile',
              exchangeRate: orderData.exchangeRate
            }}
            orderId={orderId}
            onBackToHome={handleBuyMore}
          />
        );
      case 7:
        return (
          <PaymentSuccess
            orderData={{
              amount: orderData.amount,
              currency: orderData.currency,
              usdtAmount: orderData.usdtAmount,
              network: orderData.network,
              walletAddress: orderData.walletAddress,
              exchangeRate: orderData.exchangeRate
            }}
            orderId={orderId}
            txHash={transactionHash}
            onBackToHome={handleBuyMore}
            onBuyMore={handleBuyMore}
          />
        );
      default:
        return null;
    }
  };

  const isNextButtonDisabled = () => {
    if (currentStep === 1) {
      if (limitsError) {
        return true;
      }
      if (destination === 'wallet') {
        return !orderData.amount || !orderData.walletAddress;
      } else {
        return !orderData.amount || !orderData.binanceEmail || !isBinanceEmailValid;
      }
    }
    return false;
  };

  return (
    <div className="flex min-h-screen bg-terex-dark">
      <TradingSidebar
        exchangeRates={{ CFA: 650, CAD: 1.35 }}
        marketRates={{ CFA: 637, CAD: 1.32 }}
        ratesLoading={false}
        ratesError={null}
        lastUpdated={new Date()}
        refreshRates={() => {}}
        currency={orderData.currency}
        onAmountChange={handleAmountChange}
      />

      <main className="flex-1 p-4 md:p-6">
        {currentStep > 1 && (
          <Button
            variant="ghost"
            className="mb-4 text-white hover:bg-terex-gray"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        )}

        {renderStepContent()}

        {currentStep < 2 && (
          <Button
            className="w-full gradient-button mt-6"
            onClick={() => setCurrentStep(2)}
            disabled={isNextButtonDisabled()}
          >
            Continuer
          </Button>
        )}

        <KYCProtection onKYCRequired={() => {}}>
          <div />
        </KYCProtection>
      </main>
    </div>
  );
}
