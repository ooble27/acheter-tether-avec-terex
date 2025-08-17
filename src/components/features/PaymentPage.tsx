
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { PaymentInstructions } from '@/components/features/PaymentInstructions';
import { useScrollToTop } from '@/components/ScrollToTop';

interface PaymentPageProps {
  orderData: {
    amount: string;
    currency: string;
    usdtAmount: string;
    network: string;
    walletAddress: string;
    paymentMethod: 'card' | 'mobile';
    exchangeRate: number;
    paymentLink: string;
  };
  orderId: string;
  onBack: () => void;
  onPaymentSuccess: (txHash?: string) => void;
  onPaymentError: () => void;
}

export function PaymentPage({ 
  orderData, 
  orderId, 
  onBack, 
  onPaymentSuccess, 
  onPaymentError 
}: PaymentPageProps) {
  const scrollToTop = useScrollToTop();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending');

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  const handlePaymentConfirmed = () => {
    setPaymentStatus('success');
    onPaymentSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <Button
        variant="ghost"
        className="mb-4 text-white hover:bg-terex-gray"
        onClick={onBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <PaymentInstructions 
        orderData={orderData}
        orderId={orderId}
        onBack={onBack}
        onPaymentConfirmed={handlePaymentConfirmed}
      />
    </div>
  );
}
