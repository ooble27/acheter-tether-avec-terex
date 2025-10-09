import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { InteracForm } from './InteracForm';

interface InteracData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface PaymentMethodStepProps {
  paymentMethod: 'interac' | 'mobile';
  interacData: InteracData;
  setInteracData: (data: InteracData) => void;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export function PaymentMethodStep({
  paymentMethod,
  interacData,
  setInteracData,
  onBack,
  onConfirm,
  loading
}: PaymentMethodStepProps) {
  const isFormValid = () => {
    if (paymentMethod === 'interac') {
      return interacData.email && interacData.firstName && interacData.lastName;
    }
    return true;
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      {paymentMethod === 'interac' && (
        <Card className="bg-card border-border/50">
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">Paiement Interac</h3>
              <p className="text-sm text-muted-foreground font-light">
                Remplissez vos informations pour recevoir votre virement Interac
              </p>
            </div>
            
            <InteracForm 
              interacData={interacData}
              setInteracData={setInteracData}
            />
          </CardContent>
        </Card>
      )}

      <Button
        onClick={onConfirm}
        disabled={!isFormValid() || loading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-base rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Traitement...' : 'Confirmer la commande'}
      </Button>
    </div>
  );
}
