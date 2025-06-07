
import {
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const title = 'Transfert international confirmé';
  const preview = `Votre transfert #TEREX-${transferData.id?.slice(-8)} a été confirmé avec succès`;
  
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

  const getPaymentMethodName = () => {
    switch (transferData.payment_method) {
      case 'card': return 'Carte bancaire';
      case 'bank': return 'Virement bancaire';
      case 'interac': return 'Interac E-Transfer';
      default: return transferData.payment_method || 'À définir';
    }
  };

  const getReceiveMethodName = () => {
    switch (transferData.receive_method) {
      case 'mobile': return 'Mobile Money';
      case 'bank_transfer': return 'Virement bancaire';
      case 'cash_pickup': return 'Retrait en espèces';
      default: return transferData.receive_method || 'À définir';
    }
  };

  const getProviderName = () => {
    if (transferData.provider === 'wave') return 'Wave';
    if (transferData.provider === 'orange') return 'Orange Money';
    return '';
  };
  
  return (
    <BaseEmail preview={preview} title={title}>
      <Text style={confirmationText}>
        🌍 Parfait ! Votre demande de transfert international a été enregistrée avec succès.
      </Text>

      <Text style={subText}>
        Nous allons maintenant traiter votre transfert vers {getCountryName(transferData.recipient_country)}.
      </Text>

      <Text style={sectionTitle}>RÉSUMÉ DE VOTRE TRANSFERT</Text>
      
      <Text style={detailText}>
        <strong>Numéro de transfert :</strong> #TEREX-{transferData.id?.slice(-8)}
      </Text>
      
      <Text style={detailText}>
        <strong>Date :</strong> {new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')}
      </Text>

      <Text style={detailText}>
        <strong>Vous envoyez :</strong> {transferData.amount} {transferData.from_currency}
      </Text>
      
      <Text style={detailText}>
        <strong>Méthode de paiement :</strong> {getPaymentMethodName()}
      </Text>

      <Text style={detailText}>
        <strong>Destinataire reçoit :</strong> {transferData.total_amount} {transferData.to_currency}
      </Text>
      
      <Text style={detailText}>
        <strong>Méthode de réception :</strong> {getReceiveMethodName()} {getProviderName() && `(${getProviderName()})`}
      </Text>

      <Text style={detailText}>
        <strong>Taux de change :</strong> 1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}
      </Text>
      
      <Text style={detailText}>
        <strong>Frais de transfert :</strong> {transferData.fees} {transferData.from_currency}
      </Text>

      <Text style={sectionTitle}>INFORMATIONS DU DESTINATAIRE</Text>
      
      <Text style={detailText}>
        <strong>Nom complet :</strong> {transferData.recipient_name}
      </Text>
      
      <Text style={detailText}>
        <strong>Pays de destination :</strong> {getCountryName(transferData.recipient_country)}
      </Text>
      
      {transferData.recipient_phone && (
        <Text style={detailText}>
          <strong>Téléphone :</strong> {transferData.recipient_phone}
        </Text>
      )}
      
      {transferData.recipient_account && (
        <Text style={detailText}>
          <strong>Numéro de compte/téléphone :</strong> {transferData.recipient_account}
        </Text>
      )}
      
      {transferData.recipient_bank && (
        <Text style={detailText}>
          <strong>Institution financière :</strong> {transferData.recipient_bank}
        </Text>
      )}

      <Text style={sectionTitle}>PROCESSUS DE TRANSFERT</Text>
      
      <Text style={stepText}>1. ✅ Demande confirmée</Text>
      <Text style={stepText}>2. ⏳ Instructions de paiement</Text>
      <Text style={stepText}>3. ⏳ Vérification du paiement</Text>
      <Text style={stepText}>4. ⏳ Traitement du transfert</Text>
      <Text style={stepText}>5. ⏳ Réception confirmée</Text>

      <Text style={sectionTitle}>DÉLAIS DE TRAITEMENT</Text>
      
      <Text style={timingText}>
        <strong>Paiement :</strong> Immédiat
      </Text>
      <Text style={timingText}>
        <strong>Vérification :</strong> 1-2 heures
      </Text>
      <Text style={timingText}>
        <strong>Transfert :</strong> 2-6 heures
      </Text>
      <Text style={timingText}>
        <strong>Réception :</strong> Immédiate
      </Text>

      <Text style={thankYouText}>
        🙏 Merci de faire confiance à Terex pour vos transferts internationaux !
      </Text>
      <Text style={teamText}>
        Vous recevrez une notification à chaque étape du processus.
      </Text>
      <Text style={teamSignature}>
        L'équipe Terex
      </Text>
    </BaseEmail>
  );
};

// Styles simples et lisibles
const confirmationText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const subText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 30px 0',
  lineHeight: '1.5',
};

const sectionTitle = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '700',
  margin: '30px 0 15px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailText = {
  color: '#333333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
};

const stepText = {
  color: '#333333',
  fontSize: '14px',
  margin: '6px 0',
  lineHeight: '1.5',
};

const timingText = {
  color: '#333333',
  fontSize: '14px',
  margin: '4px 0',
  lineHeight: '1.5',
};

const thankYouText = {
  color: '#2563eb',
  fontSize: '18px',
  fontWeight: '600',
  margin: '30px 0 8px 0',
  textAlign: 'center' as const,
};

const teamText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontStyle: 'italic',
  textAlign: 'center' as const,
};

const teamSignature = {
  color: '#333333',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
  textAlign: 'center' as const,
};
