
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, AlertTriangle, CheckCircle, Clock, XCircle, Trash2 } from 'lucide-react';
import { KYCData } from '@/hooks/useKYC';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { toast } from 'sonner';

interface SecuritySettingsCardProps {
  onStartKYC: () => void;
  kycData: KYCData | null;
  isKYCVerified: boolean;
}

export function SecuritySettingsCard({ onStartKYC, kycData, isKYCVerified }: SecuritySettingsCardProps) {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAllOrders = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      "⚠️ ATTENTION : Cette action supprimera TOUTES vos commandes (achats, ventes et transferts). Cette action est irréversible. Voulez-vous vraiment continuer ?"
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      // Supprimer toutes les commandes (orders)
      const { error: ordersError } = await supabase
        .from('orders')
        .delete()
        .eq('user_id', user.id);

      if (ordersError) throw ordersError;

      // Supprimer tous les transferts internationaux
      const { error: transfersError } = await supabase
        .from('international_transfers')
        .delete()
        .eq('user_id', user.id);

      if (transfersError) throw transfersError;

      toast.success('Toutes vos commandes ont été supprimées avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression des commandes:', error);
      toast.error('Impossible de supprimer les commandes');
    } finally {
      setIsDeleting(false);
    }
  };

  const getKYCStatusDisplay = () => {
    if (isKYCVerified) {
      return {
        icon: CheckCircle,
        title: 'Vérification KYC approuvée',
        description: 'Votre identité a été vérifiée avec succès. Vous pouvez effectuer toutes les transactions.',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-500/20',
        iconColor: 'text-green-400',
        showButton: false
      };
    }

    switch (kycData?.status) {
      case 'submitted':
      case 'under_review':
        return {
          icon: Clock,
          title: 'Vérification en cours de traitement',
          description: 'Votre demande de vérification a été soumise avec succès. Nous examinerons vos documents sous 1-3 jours ouvrables.',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/20',
          iconColor: 'text-yellow-400',
          showButton: false
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Vérification rejetée',
          description: 'Vos documents n\'ont pas pu être validés. Veuillez soumettre de nouveaux documents conformes.',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/20',
          iconColor: 'text-red-400',
          showButton: true,
          buttonText: 'Soumettre à nouveau'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Vérification KYC requise',
          description: 'Complétez votre vérification d\'identité pour débloquer toutes les fonctionnalités de Terex',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/20',
          iconColor: 'text-orange-400',
          showButton: true,
          buttonText: 'Commencer la vérification'
        };
    }
  };

  const kycStatus = getKYCStatusDisplay();
  const Icon = kycStatus.icon;

  return (
    <Card className="bg-gradient-to-br from-terex-darker to-terex-dark border border-terex-gray/30 shadow-2xl backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-terex-accent/10 to-transparent border-b border-terex-gray/30 rounded-t-xl">
        <CardTitle className="text-white flex items-center">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-terex-accent to-terex-accent/70 rounded-xl flex items-center justify-center mr-3">
            <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </div>
          <div>
            <div className="text-white">Sécurité & Vérification</div>
            <CardDescription className="text-gray-400">
              Protégez votre compte avec nos mesures de sécurité
            </CardDescription>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-6">
        {/* KYC Status */}
        <div className={`p-4 ${kycStatus.bgColor} border ${kycStatus.borderColor} rounded-xl`}>
          <div className="flex items-start space-x-3">
            <Icon className={`w-5 h-5 ${kycStatus.iconColor} mt-1 flex-shrink-0`} />
            <div className="flex-1">
              <h4 className="text-white font-medium mb-1">{kycStatus.title}</h4>
              <p className="text-gray-400 text-sm mb-3">
                {kycStatus.description}
              </p>
              {kycStatus.showButton && (
                <Button
                  onClick={onStartKYC}
                  size="sm"
                  className="bg-terex-accent hover:bg-terex-accent/80 text-white"
                >
                  {kycStatus.buttonText}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-terex-darker/50 rounded-lg border border-terex-gray/20">
            <div className="flex items-center space-x-3">
              <Lock className="w-4 h-4 text-green-400" />
              <span className="text-white text-sm">Authentification par email</span>
            </div>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          
          <div className="flex items-center justify-between p-3 bg-terex-darker/50 rounded-lg border border-terex-gray/20">
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

        {/* Zone de danger */}
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <h4 className="text-white font-medium mb-2 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2 text-red-400" />
            Zone de danger
          </h4>
          <p className="text-gray-400 text-sm mb-3">
            Actions irréversibles affectant votre compte
          </p>
          <Button
            onClick={handleDeleteAllOrders}
            disabled={isDeleting}
            variant="destructive"
            size="sm"
            className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isDeleting ? 'Suppression...' : 'Supprimer toutes mes commandes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
