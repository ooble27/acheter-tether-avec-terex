
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Clock, AlertTriangle, LogOut, FileCheck } from 'lucide-react';
import type { KYCData } from '@/hooks/useKYC';

interface SecuritySettingsCardProps {
  onLogout: () => Promise<void>;
  onStartKYC: () => void;
  kycData: KYCData | null;
  isKYCVerified: boolean;
}

export function SecuritySettingsCard({ 
  onLogout, 
  onStartKYC, 
  kycData, 
  isKYCVerified 
}: SecuritySettingsCardProps) {
  const getKYCStatusBadge = () => {
    if (!kycData) {
      return (
        <Badge variant="secondary" className="bg-gray-600 text-gray-200">
          <Clock className="w-3 h-3 mr-1" />
          Non démarré
        </Badge>
      );
    }

    switch (kycData.status) {
      case 'pending':
      case 'submitted':
        return (
          <Badge variant="secondary" className="bg-yellow-600 text-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case 'under_review':
        return (
          <Badge variant="secondary" className="bg-blue-600 text-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            En cours de vérification
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="secondary" className="bg-green-600 text-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Vérifié
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-gray-600 text-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            Statut inconnu
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <div className="flex items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <CardTitle className="text-white">Sécurité</CardTitle>
            <CardDescription className="text-gray-400">
              Gérez la sécurité de votre compte
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Statut de vérification KYC */}
        <div className="flex items-center justify-between p-4 bg-terex-darker/50 rounded-xl border border-terex-gray/20">
          <div className="flex items-center space-x-3">
            <FileCheck className="w-5 h-5 text-terex-accent" />
            <div>
              <p className="text-white font-medium">Vérification d'identité (KYC)</p>
              <p className="text-gray-400 text-sm">Statut de vérification de votre compte</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {getKYCStatusBadge()}
            {!isKYCVerified && (
              <Button
                onClick={onStartKYC}
                size="sm"
                className="bg-terex-accent hover:bg-terex-accent/90 text-white"
              >
                Démarrer KYC
              </Button>
            )}
          </div>
        </div>

        {/* Actions de sécurité */}
        <div className="space-y-3">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start text-red-400 border-red-400/30 hover:bg-red-400/10 hover:border-red-400/50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
