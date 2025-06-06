
import {
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const title = 'Transfert international confirmé ✅';
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
      case 'card': return '💳 Carte bancaire';
      case 'bank': return '🏦 Virement bancaire';
      case 'interac': return '💸 Interac E-Transfer';
      default: return transferData.payment_method || 'À définir';
    }
  };

  const getReceiveMethodName = () => {
    switch (transferData.receive_method) {
      case 'mobile': return '📱 Mobile Money';
      case 'bank_transfer': return '🏦 Virement bancaire';
      case 'cash_pickup': return '💰 Retrait en espèces';
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
      <div style={successContainer}>
        <div style={successIcon}>🎉</div>
        <Text style={successMessage}>
          Excellent ! Votre transfert international est confirmé
        </Text>
        <Text style={subMessage}>
          Nous avons enregistré votre demande avec succès. Voici tous les détails :
        </Text>
      </div>
      
      <Section style={primaryCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            💸 Détails du transfert
          </Text>
          <div style={transferNumber}>
            #TEREX-{transferData.id?.slice(-8)}
          </div>
        </div>
        
        <div style={cardContent}>
          <div style={amountSection}>
            <div style={amountRow}>
              <span style={amountLabel}>Vous envoyez</span>
              <span style={amountValue}>
                {transferData.amount} {transferData.from_currency}
              </span>
            </div>
            <div style={exchangeRow}>
              <span style={exchangeIcon}>⇄</span>
              <span style={exchangeText}>
                1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}
              </span>
            </div>
            <div style={amountRow}>
              <span style={amountLabel}>Destinataire reçoit</span>
              <span style={finalAmount}>
                {transferData.total_amount} {transferData.to_currency}
              </span>
            </div>
          </div>
          
          <div style={feeSection}>
            <div style={feeRow}>
              <span style={feeLabel}>Frais de transfert</span>
              <span style={feeValue}>{transferData.fees} {transferData.from_currency}</span>
            </div>
          </div>
        </div>
      </Section>
      
      <Section style={recipientCard}>
        <div style={cardHeaderSecondary}>
          <Text style={cardTitleSecondary}>
            👤 Destinataire
          </Text>
        </div>
        
        <div style={cardContent}>
          <div style={recipientInfo}>
            <div style={infoRow}>
              <span style={infoIcon}>👤</span>
              <div style={infoContent}>
                <span style={infoLabel}>Nom complet</span>
                <span style={infoValue}>{transferData.recipient_name}</span>
              </div>
            </div>
            <div style={infoRow}>
              <span style={infoIcon}>🌍</span>
              <div style={infoContent}>
                <span style={infoLabel}>Destination</span>
                <span style={infoValue}>{getCountryName(transferData.recipient_country)}</span>
              </div>
            </div>
            {transferData.recipient_phone && (
              <div style={infoRow}>
                <span style={infoIcon}>📱</span>
                <div style={infoContent}>
                  <span style={infoLabel}>Téléphone</span>
                  <span style={infoValue}>{transferData.recipient_phone}</span>
                </div>
              </div>
            )}
            {transferData.recipient_account && (
              <div style={infoRow}>
                <span style={infoIcon}>💳</span>
                <div style={infoContent}>
                  <span style={infoLabel}>Compte</span>
                  <span style={accountNumber}>{transferData.recipient_account}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>

      <Section style={methodCard}>
        <div style={cardHeaderTertiary}>
          <Text style={cardTitleTertiary}>
            🔄 Méthodes de paiement
          </Text>
        </div>
        
        <div style={cardContent}>
          <div style={methodRow}>
            <div style={methodItem}>
              <span style={methodLabel}>Vous payez par</span>
              <span style={methodValue}>{getPaymentMethodName()}</span>
            </div>
            <div style={methodArrow}>→</div>
            <div style={methodItem}>
              <span style={methodLabel}>Destinataire reçoit par</span>
              <span style={methodValue}>
                {getReceiveMethodName()}
                {transferData.provider && getProviderName() && (
                  <span style={providerBadge}>{getProviderName()}</span>
                )}
              </span>
            </div>
          </div>
        </div>
      </Section>
      
      <Section style={statusCard}>
        <div style={statusHeader}>
          <Text style={statusTitle}>
            📋 Prochaines étapes
          </Text>
        </div>
        <div style={stepsContainer}>
          <div style={stepCompleted}>
            <span style={stepIcon}>✅</span>
            <span style={stepText}>Demande confirmée et enregistrée</span>
          </div>
          <div style={stepPending}>
            <span style={stepIcon}>⏳</span>
            <span style={stepText}>Instructions de paiement en cours d'envoi</span>
          </div>
          <div style={stepPending}>
            <span style={stepIcon}>💰</span>
            <span style={stepText}>En attente de votre paiement</span>
          </div>
          <div style={stepPending}>
            <span style={stepIcon}>🚀</span>
            <span style={stepText}>Traitement et envoi des fonds</span>
          </div>
          <div style={stepPending}>
            <span style={stepIcon}>🎯</span>
            <span style={stepText}>Confirmation de réception</span>
          </div>
        </div>
      </Section>

      <Section style={timelineCard}>
        <Text style={timelineTitle}>
          ⏰ Délais de traitement
        </Text>
        <Text style={timelineText}>
          • Validation du paiement : <strong>1-2 heures</strong><br/>
          • Traitement du transfert : <strong>2-6 heures</strong><br/>
          • Réception par le destinataire : <strong>Immédiate après traitement</strong>
        </Text>
      </Section>
      
      <Text style={finalMessage}>
        Vous recevrez les instructions de paiement dans quelques instants. 
        Notre équipe traitera votre transfert dès réception de votre paiement.
      </Text>
      
      <div style={ctaContainer}>
        <Text style={ctaText}>
          💫 Merci de faire confiance à Terex pour vos transferts internationaux !
        </Text>
      </div>
    </BaseEmail>
  );
};

// Styles modernes avec design sombre
const successContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '24px',
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(59, 150, 143, 0.2)',
};

const successIcon = {
  fontSize: '48px',
  marginBottom: '16px',
};

const successMessage = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '700',
  margin: '0 0 12px',
  textAlign: 'center' as const,
};

const subMessage = {
  color: '#cccccc',
  fontSize: '16px',
  margin: '0',
  textAlign: 'center' as const,
  lineHeight: '1.5',
};

const primaryCard = {
  backgroundColor: '#252525',
  border: '1px solid #3B968F',
  borderRadius: '16px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
};

const cardHeader = {
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  padding: '20px 24px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const cardTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const transferNumber = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  padding: '4px 12px',
  borderRadius: '20px',
  fontFamily: 'monospace',
};

const cardContent = {
  padding: '24px',
  backgroundColor: '#252525',
};

const amountSection = {
  marginBottom: '24px',
};

const amountRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
  padding: '12px 16px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
};

const amountLabel = {
  color: '#999999',
  fontSize: '14px',
  fontWeight: '500',
};

const amountValue = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
};

const exchangeRow = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '16px 0',
  padding: '8px',
};

const exchangeIcon = {
  color: '#3B968F',
  fontSize: '18px',
  marginRight: '8px',
};

const exchangeText = {
  color: '#cccccc',
  fontSize: '14px',
  fontWeight: '500',
};

const finalAmount = {
  color: '#4BA89F',
  fontSize: '18px',
  fontWeight: '900',
};

const feeSection = {
  borderTop: '1px solid #333333',
  paddingTop: '16px',
};

const feeRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const feeLabel = {
  color: '#999999',
  fontSize: '14px',
};

const feeValue = {
  color: '#ffb84d',
  fontSize: '14px',
  fontWeight: '600',
};

const recipientCard = {
  backgroundColor: '#252525',
  border: '1px solid #444444',
  borderRadius: '16px',
  overflow: 'hidden',
  margin: '24px 0',
};

const cardHeaderSecondary = {
  backgroundColor: '#333333',
  padding: '16px 24px',
};

const cardTitleSecondary = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const recipientInfo = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
};

const infoRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 0',
  borderBottom: '1px solid #333333',
};

const infoIcon = {
  fontSize: '20px',
  width: '24px',
  textAlign: 'center' as const,
};

const infoContent = {
  display: 'flex',
  flexDirection: 'column' as const,
  flex: '1',
};

const infoLabel = {
  color: '#999999',
  fontSize: '12px',
  fontWeight: '500',
  marginBottom: '4px',
};

const infoValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
};

const accountNumber = {
  color: '#4BA89F',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'monospace',
};

const methodCard = {
  backgroundColor: '#252525',
  border: '1px solid #444444',
  borderRadius: '16px',
  overflow: 'hidden',
  margin: '24px 0',
};

const cardHeaderTertiary = {
  backgroundColor: '#2d4a47',
  padding: '16px 24px',
};

const cardTitleTertiary = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const methodRow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '16px',
};

const methodItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  flex: '1',
  textAlign: 'center' as const,
};

const methodLabel = {
  color: '#999999',
  fontSize: '12px',
  marginBottom: '8px',
};

const methodValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
};

const methodArrow = {
  color: '#3B968F',
  fontSize: '20px',
  fontWeight: 'bold',
};

const providerBadge = {
  display: 'block',
  color: '#4BA89F',
  fontSize: '12px',
  marginTop: '4px',
};

const statusCard = {
  backgroundColor: '#1a2e2a',
  border: '1px solid #3B968F',
  borderRadius: '16px',
  margin: '24px 0',
  overflow: 'hidden',
};

const statusHeader = {
  backgroundColor: '#3B968F',
  padding: '16px 24px',
};

const statusTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const stepsContainer = {
  padding: '20px 24px',
};

const stepCompleted = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  padding: '8px 0',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '12px',
  padding: '8px 0',
  opacity: '0.6',
};

const stepIcon = {
  fontSize: '16px',
  width: '20px',
};

const stepText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
};

const timelineCard = {
  backgroundColor: '#2a2a2a',
  border: '1px solid #444444',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const timelineTitle = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const timelineText = {
  color: '#cccccc',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
};

const finalMessage = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '24px 0',
  textAlign: 'center' as const,
  padding: '20px',
  backgroundColor: '#2a2a2a',
  borderRadius: '12px',
};

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '32px 0 0',
  padding: '24px',
  background: 'linear-gradient(135deg, rgba(59, 150, 143, 0.1) 0%, rgba(75, 168, 159, 0.1) 100%)',
  borderRadius: '12px',
  border: '1px solid rgba(59, 150, 143, 0.2)',
};

const ctaText = {
  color: '#4BA89F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
};
