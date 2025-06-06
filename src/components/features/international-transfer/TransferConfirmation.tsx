
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, Clock, Globe } from 'lucide-react';

interface TransferData {
  sendAmount: string;
  receiveAmount: string;
  recipientCountry: string;
  paymentMethod: string;
  receiveMethod: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  recipientEmail?: string;
  recipientAccount?: string;
  recipientBank?: string;
  provider?: string;
  exchangeRate: number;
  fees: string;
}

interface TransferConfirmationProps {
  transferData: TransferData;
  onConfirm: () => void;
  onBack: () => void;
  loading?: boolean;
}

export function TransferConfirmation({ transferData, onConfirm, onBack, loading }: TransferConfirmationProps) {
  const getPaymentMethodName = () => {
    switch (transferData.paymentMethod) {
      case 'card': return 'Carte bancaire';
      case 'bank': return 'Virement bancaire';
      case 'interac': return 'Interac E-Transfer';
      default: return transferData.paymentMethod;
    }
  };

  const getReceiveMethodName = () => {
    switch (transferData.receiveMethod) {
      case 'mobile': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash_pickup': return 'Retrait en espèces';
      default: return transferData.receiveMethod;
    }
  };

  const getProviderName = () => {
    return transferData.provider === 'wave' ? 'Wave' : 
           transferData.provider === 'orange' ? 'Orange Money' : 'N/A';
  };

  const getCountryName = (code: string) => {
    const countries = {
      'SN': 'Sénégal',
      'CI': 'Côte d\'Ivoire',
      'ML': 'Mali',
      'BF': 'Burkina Faso',
      'NG': 'Nigeria',
      'BJ': 'Bénin'
    };
    return countries[code as keyof typeof countries] || code;
  };

  return (
    <div className="min-h-screen bg-terex-dark p-2 md:p-4">
      <div className="w-full max-w-4xl mx-auto px-2 md:px-0">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Confirmation du transfert</h1>
          <p className="text-gray-400 text-sm md:text-base">Vérifiez les détails de votre transfert avant de confirmer</p>
        </div>

        <Card className="bg-terex-darker border-terex-gray w-full">
          <CardHeader className="pb-4 p-4 md:p-6">
            <CardTitle className="text-white flex items-center text-lg md:text-xl">
              <Globe className="w-5 h-5 mr-2 text-terex-accent" />
              Récapitulatif du transfert
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-4 md:p-6">
            {/* Montants */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-gray-400 text-sm">Vous envoyez</span>
                  <div className="text-white font-bold text-lg">
                    {transferData.sendAmount} CAD
                  </div>
                </div>
                
                <div className="space-y-2">
                  <span className="text-gray-400 text-sm">Destinataire reçoit</span>
                  <div className="text-terex-accent font-bold text-lg">
                    {transferData.receiveAmount} CFA
                  </div>
                </div>
              </div>
              
              <Separator className="bg-terex-gray" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Taux de change</span>
                  <span className="text-white">1 CAD = {transferData.exchangeRate} CFA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Frais</span>
                  <span className="text-white">{transferData.fees} CAD</span>
                </div>
              </div>
            </div>

            {/* Destinataire */}
            <div className="space-y-4">
              <h3 className="text-white font-medium">Destinataire</h3>
              <div className="bg-terex-gray rounded-lg p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Nom complet</span>
                  <span className="text-white font-medium">{transferData.recipientFirstName} {transferData.recipientLastName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Pays</span>
                  <span className="text-white font-medium">{getCountryName(transferData.recipientCountry)}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span className="text-gray-400 text-sm">Téléphone</span>
                  <span className="text-white font-medium">{transferData.recipientPhone}</span>
                </div>
              </div>
            </div>

            {/* Méthodes de paiement et réception */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-white font-medium">Méthode de paiement</h3>
                <div className="bg-terex-gray rounded-lg p-4">
                  <span className="text-white font-medium">{getPaymentMethodName()}</span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-white font-medium">Méthode de réception</h3>
                <div className="bg-terex-gray rounded-lg p-4 space-y-2">
                  <span className="text-white font-medium">{getReceiveMethodName()}</span>
                  {transferData.receiveMethod === 'mobile' && transferData.provider && (
                    <div className="text-sm text-gray-400">
                      via {getProviderName()}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Délai */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-blue-200 font-medium">Délai de traitement</p>
                  <p className="text-blue-100 text-sm">
                    Votre transfert sera traité dans un délai de 24-48h ouvrables après réception du paiement.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton de confirmation */}
            <Button
              onClick={onConfirm}
              disabled={loading}
              size="lg"
              className="w-full gradient-button text-white font-semibold h-12 text-lg"
            >
              {loading ? 'Création en cours...' : 'Confirmer le transfert'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
