
import { useTransactionAuthorization } from '@/hooks/useTransactionAuthorization';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';

interface KYCProtectionProps {
  children: React.ReactNode;
  onKYCRequired: () => void;
}

export function KYCProtection({ children, onKYCRequired }: KYCProtectionProps) {
  const { isAuthorized, loading, kycStatus } = useTransactionAuthorization();

  // Si en cours de chargement, ne pas afficher de message, juste ne rien rendre
  if (loading) {
    return null;
  }

  if (!isAuthorized) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-l-4 border-l-red-500">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Vérification d'identité requise
          </AlertTitle>
          <AlertDescription className="mt-2">
            {kycStatus === 'pending' && 
              'Vous devez vérifier votre identité avant d\'effectuer des transactions. Ce processus ne prend que quelques minutes.'
            }
            {kycStatus === 'submitted' && 
              'Vos documents sont en cours d\'examen. Vous pourrez effectuer des transactions une fois la vérification approuvée.'
            }
            {kycStatus === 'rejected' && 
              'Votre vérification d\'identité a été rejetée. Veuillez soumettre de nouveaux documents conformes.'
            }
            {!kycStatus && 
              'Une vérification d\'identité est requise pour accéder à ce service.'
            }
            <div className="mt-4">
              <Button 
                onClick={onKYCRequired}
                className="bg-terex-accent hover:bg-terex-accent/90"
              >
                {kycStatus === 'rejected' ? 'Soumettre à nouveau' : 'Commencer la vérification'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
