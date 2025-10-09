
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useKYC } from '@/hooks/useKYC';
import { KYCForm } from './KYCForm';
import { ArrowLeft, CheckCircle, Clock, XCircle, AlertTriangle } from 'lucide-react';

interface KYCPageProps {
  onBack: () => void;
}

export function KYCPage({ onBack }: KYCPageProps) {
  const { kycData, loading } = useKYC();
  const [showForm, setShowForm] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  const getStatusDisplay = () => {
    switch (kycData?.status) {
      case 'submitted':
      case 'under_review':
        return {
          icon: Clock,
          title: 'Vérification en cours',
          description: 'Vos documents sont en cours d\'examen. Nous vous contacterons sous 1-3 jours ouvrables.',
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10'
        };
      case 'approved':
        return {
          icon: CheckCircle,
          title: 'Vérification approuvée',
          description: 'Votre identité a été vérifiée avec succès. Vous pouvez maintenant effectuer toutes les transactions.',
          color: 'text-green-500',
          bgColor: 'bg-green-500/10'
        };
      case 'rejected':
        return {
          icon: XCircle,
          title: 'Vérification rejetée',
          description: 'Vos documents n\'ont pas pu être validés. Veuillez soumettre de nouveaux documents.',
          color: 'text-red-500',
          bgColor: 'bg-red-500/10'
        };
      default:
        return {
          icon: AlertTriangle,
          title: 'Vérification requise',
          description: 'Vous devez vérifier votre identité pour effectuer des transactions.',
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/10'
        };
    }
  };

  const status = getStatusDisplay();
  const Icon = status.icon;
  const canSubmit = !kycData?.status || kycData?.status === 'pending' || kycData?.status === 'rejected';

  if (showForm && canSubmit) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="border-terex-gray text-gray-300 hover:bg-terex-gray"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-light text-white">Vérification d'identité</h1>
            <p className="text-gray-400">Soumettez vos documents pour la vérification</p>
          </div>
        </div>
        
        <KYCForm onComplete={() => setShowForm(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="border-terex-gray text-gray-300 hover:bg-terex-gray"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au profil
        </Button>
        <div>
          <h1 className="text-3xl font-light text-white">Vérification d'identité</h1>
          <p className="text-gray-400">Gérez votre statut de vérification KYC</p>
        </div>
      </div>

      <Card className={`${status.bgColor} border-terex-gray`}>
        <CardHeader>
          <CardTitle className={`${status.color} flex items-center text-xl`}>
            <Icon className="w-6 h-6 mr-3" />
            {status.title}
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            {status.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canSubmit && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-terex-accent hover:bg-terex-accent/90 text-white"
            >
              {kycData?.status === 'rejected' ? 'Soumettre à nouveau' : 'Commencer la vérification'}
            </Button>
          )}
          
          {kycData?.status === 'rejected' && kycData?.rejection_reason && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 font-medium">Raison du rejet :</p>
              <p className="text-gray-300 mt-1">{kycData.rejection_reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {kycData?.submitted_at && (
        <Card className="bg-terex-darker border-terex-gray">
          <CardHeader>
            <CardTitle className="text-white">Informations de soumission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-gray-400">Date de soumission :</span>
              <span className="text-white ml-2">
                {new Date(kycData.submitted_at).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {kycData.reviewed_at && (
              <div>
                <span className="text-gray-400">Date de révision :</span>
                <span className="text-white ml-2">
                  {new Date(kycData.reviewed_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
