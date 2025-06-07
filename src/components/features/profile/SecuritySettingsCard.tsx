
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecuritySettingsCardProps {
  onStartKYC: () => void;
}

export function SecuritySettingsCard({ onStartKYC }: SecuritySettingsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border-terex-gray shadow-2xl">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/50">
        <CardTitle className="text-white flex items-center">
          <Shield className="w-5 h-5 mr-2 text-terex-accent" />
          Sécurité & Vérification
        </CardTitle>
        <CardDescription className="text-gray-400">
          Protégez votre compte avec nos mesures de sécurité
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* KYC Status */}
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">Vérification KYC</h4>
              <p className="text-gray-400 text-sm mb-3">
                Complétez votre vérification d'identité pour débloquer toutes les fonctionnalités
              </p>
              <Button
                onClick={onStartKYC}
                size="sm"
                className="bg-terex-accent hover:bg-terex-accent/80 text-white"
              >
                Commencer la vérification
              </Button>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-terex-gray/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Authentification par email</span>
            </div>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-terex-gray/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-white text-sm">Surveillance des transactions</span>
            </div>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
        </div>

        {/* Tips de sécurité */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-blue-400" />
            Conseils de sécurité
          </h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Ne partagez jamais vos informations de connexion</li>
            <li>• Vérifiez toujours les adresses de portefeuille</li>
            <li>• Utilisez des réseaux sécurisés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
