
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Clock, XCircle } from 'lucide-react';

interface KYCAlertProps {
  status: string;
  onStartKYC: () => void;
}

export function KYCAlert({ status, onStartKYC }: KYCAlertProps) {
  const getAlertContent = () => {
    switch (status) {
      case 'pending':
        return {
          icon: AlertTriangle,
          title: 'Vérification d\'identité requise',
          description: 'Vous devez vérifier votre identité pour effectuer des transactions. Ce processus ne prend que quelques minutes.',
          buttonText: 'Commencer la vérification',
          variant: 'default' as const,
          showButton: true
        };
      case 'submitted':
      case 'under_review':
        return {
          icon: Clock,
          title: 'Vérification en cours',
          description: 'Vos documents sont en cours d\'examen. Nous vous contacterons sous 1-3 jours ouvrables une fois la vérification terminée.',
          buttonText: '',
          variant: 'default' as const,
          showButton: false
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Vérification rejetée',
          description: 'Vos documents n\'ont pas pu être validés. Veuillez soumettre de nouveaux documents conformes.',
          buttonText: 'Soumettre à nouveau',
          variant: 'destructive' as const,
          showButton: true
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Vérification requise',
          description: 'Une vérification d\'identité est nécessaire pour utiliser ce service.',
          buttonText: 'Commencer la vérification',
          variant: 'default' as const,
          showButton: true
        };
    }
  };

  const { icon: Icon, title, description, buttonText, variant, showButton } = getAlertContent();

  return (
    <Alert variant={variant} className="border-l-4 border-l-yellow-500">
      <Icon className="h-4 w-4" />
      <AlertTitle className="flex items-center">
        <Shield className="w-4 h-4 mr-2" />
        {title}
      </AlertTitle>
      <AlertDescription className="mt-2">
        {description}
        {showButton && (
          <div className="mt-4">
            <Button 
              onClick={onStartKYC}
              variant={variant === 'destructive' ? 'outline' : 'default'}
              className={
                variant === 'destructive' 
                  ? 'border-red-500 text-red-500 hover:bg-red-500/10' 
                  : 'bg-terex-accent hover:bg-terex-accent/90'
              }
            >
              {buttonText}
            </Button>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
}
