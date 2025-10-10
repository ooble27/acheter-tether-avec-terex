
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
            Identity Verification Required
          </AlertTitle>
          <AlertDescription className="mt-2">
            {kycStatus === 'pending' && 
              'You must verify your identity before making transactions. This process only takes a few minutes.'
            }
            {kycStatus === 'submitted' && 
              'Your documents are under review. You will be able to make transactions once verification is approved.'
            }
            {kycStatus === 'rejected' && 
              'Your identity verification has been rejected. Please submit new compliant documents.'
            }
            {!kycStatus && 
              'Identity verification is required to access this service.'
            }
            <div className="mt-4">
              <Button 
                onClick={onKYCRequired}
                className="bg-terex-accent hover:bg-terex-accent/90"
              >
                {kycStatus === 'rejected' ? 'Submit Again' : 'Start Verification'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
