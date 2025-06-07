
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
      {/* Message de confirmation */}
      <Section style={confirmationSection}>
        <div style={successBadge}>
          <span style={successIcon}>🌍</span>
          <Text style={successText}>Transfert confirmé !</Text>
        </div>
        <Text style={confirmationMessage}>
          Parfait ! Votre demande de transfert international a été enregistrée avec succès.
        </Text>
        <Text style={subMessage}>
          Nous allons maintenant traiter votre transfert vers {getCountryName(transferData.recipient_country)}.
        </Text>
      </Section>

      {/* Résumé du transfert */}
      <Section style={transferSummarySection}>
        <Text style={sectionTitle}>💸 Résumé de votre transfert</Text>
        
        <div style={summaryCard}>
          <div style={summaryHeader}>
            <Text style={transferNumber}>Transfert #TEREX-{transferData.id?.slice(-8)}</Text>
            <Text style={transferDate}>{new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')}</Text>
          </div>
          
          <div style={summaryContent}>
            <div style={amountFlow}>
              <div style={fromAmount}>
                <Text style={amountLabel}>Vous envoyez</Text>
                <Text style={amountValue}>
                  {transferData.amount} {transferData.from_currency}
                </Text>
                <Text style={methodText}>{getPaymentMethodName()}</Text>
              </div>
              
              <div style={exchangeIndicator}>
                <span style={exchangeArrow}>→</span>
                <Text style={exchangeRate}>
                  1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}
                </Text>
              </div>
              
              <div style={toAmount}>
                <Text style={amountLabel}>Destinataire reçoit</Text>
                <Text style={finalAmountValue}>
                  {transferData.total_amount} {transferData.to_currency}
                </Text>
                <Text style={methodText}>
                  {getReceiveMethodName()} {getProviderName() && `(${getProviderName()})`}
                </Text>
              </div>
            </div>
            
            <div style={feesRow}>
              <Text style={feesLabel}>Frais de transfert</Text>
              <Text style={feesValue}>{transferData.fees} {transferData.from_currency}</Text>
            </div>
          </div>
        </div>
      </Section>

      {/* Informations du destinataire */}
      <Section style={recipientSection}>
        <Text style={sectionTitle}>👤 Informations du destinataire</Text>
        
        <div style={recipientCard}>
          <div style={recipientDetails}>
            <div style={recipientField}>
              <Text style={fieldLabel}>Nom complet</Text>
              <Text style={fieldValue}>{transferData.recipient_name}</Text>
            </div>
            
            <div style={recipientField}>
              <Text style={fieldLabel}>Pays de destination</Text>
              <Text style={fieldValue}>{getCountryName(transferData.recipient_country)}</Text>
            </div>
            
            {transferData.recipient_phone && (
              <div style={recipientField}>
                <Text style={fieldLabel}>Téléphone</Text>
                <Text style={fieldValue}>{transferData.recipient_phone}</Text>
              </div>
            )}
            
            {transferData.recipient_account && (
              <div style={recipientField}>
                <Text style={fieldLabel}>Numéro de compte/téléphone</Text>
                <Text style={accountValue}>{transferData.recipient_account}</Text>
              </div>
            )}
            
            {transferData.recipient_bank && (
              <div style={recipientField}>
                <Text style={fieldLabel}>Institution financière</Text>
                <Text style={fieldValue}>{transferData.recipient_bank}</Text>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Étapes du processus */}
      <Section style={processSection}>
        <Text style={sectionTitle}>📋 Processus de transfert</Text>
        
        <div style={stepsContainer}>
          <div style={stepCompleted}>
            <span style={stepNumber}>1</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Demande confirmée</Text>
              <Text style={stepDescription}>Votre transfert a été enregistré avec succès</Text>
            </div>
            <span style={stepStatusCompleted}>✅</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>2</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Instructions de paiement</Text>
              <Text style={stepDescription}>Vous allez recevoir les détails pour effectuer votre paiement</Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>3</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Vérification du paiement</Text>
              <Text style={stepDescription}>Confirmation de la réception de votre paiement</Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>4</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Traitement du transfert</Text>
              <Text style={stepDescription}>Initiation du transfert vers {getCountryName(transferData.recipient_country)}</Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>5</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Réception confirmée</Text>
              <Text style={stepDescription}>{transferData.recipient_name} reçoit {transferData.total_amount} {transferData.to_currency}</Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>
        </div>
      </Section>

      {/* Délais et informations */}
      <Section style={timingSection}>
        <Text style={sectionTitle}>⏰ Délais de traitement</Text>
        
        <div style={timingGrid}>
          <div style={timingCard}>
            <span style={timingIcon}>💳</span>
            <Text style={timingTitle}>Paiement</Text>
            <Text style={timingValue}>Immédiat</Text>
            <Text style={timingDescription}>Après réception des instructions</Text>
          </div>
          
          <div style={timingCard}>
            <span style={timingIcon}>🔍</span>
            <Text style={timingTitle}>Vérification</Text>
            <Text style={timingValue}>1-2 heures</Text>
            <Text style={timingDescription}>Validation de votre paiement</Text>
          </div>
          
          <div style={timingCard}>
            <span style={timingIcon}>🚀</span>
            <Text style={timingTitle}>Transfert</Text>
            <Text style={timingValue}>2-6 heures</Text>
            <Text style={timingDescription}>Envoi vers {getCountryName(transferData.recipient_country)}</Text>
          </div>
          
          <div style={timingCard}>
            <span style={timingIcon}>✅</span>
            <Text style={timingTitle}>Réception</Text>
            <Text style={timingValue}>Immédiate</Text>
            <Text style={timingDescription}>Après traitement complet</Text>
          </div>
        </div>
      </Section>

      {/* Sécurité et garanties */}
      <Section style={securitySection}>
        <Text style={sectionTitle}>🔒 Sécurité et garanties</Text>
        
        <div style={securityGrid}>
          <div style={securityFeature}>
            <span style={securityIcon}>🛡️</span>
            <div style={securityContent}>
              <Text style={securityTitle}>Transfert sécurisé</Text>
              <Text style={securityDescription}>Cryptage SSL 256-bit et protocoles bancaires</Text>
            </div>
          </div>
          
          <div style={securityFeature}>
            <span style={securityIcon}>👥</span>
            <div style={securityContent}>
              <Text style={securityTitle}>Vérification manuelle</Text>
              <Text style={securityDescription}>Chaque transfert vérifié par notre équipe</Text>
            </div>
          </div>
          
          <div style={securityFeature}>
            <span style={securityIcon}>📱</span>
            <div style={securityContent}>
              <Text style={securityTitle}>Notifications en temps réel</Text>
              <Text style={securityDescription}>Suivi complet à chaque étape</Text>
            </div>
          </div>
          
          <div style={securityFeature}>
            <span style={securityIcon}>💼</span>
            <div style={securityContent}>
              <Text style={securityTitle}>Conformité réglementaire</Text>
              <Text style={securityDescription}>Respect des lois de transfert d'argent</Text>
            </div>
          </div>
        </div>
      </Section>

      {/* Message de remerciement */}
      <Section style={thankYouSection}>
        <Text style={thankYouMessage}>
          🙏 Merci de faire confiance à Terex pour vos transferts internationaux !
        </Text>
        <Text style={teamMessage}>
          Vous recevrez une notification à chaque étape du processus.
        </Text>
        <Text style={teamSignature}>
          L'équipe Terex
        </Text>
      </Section>
    </BaseEmail>
  );
};

// Styles optimisés pour le transfert international
const confirmationSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '32px',
  backgroundColor: '#21262d',
  borderRadius: '12px',
  border: '2px solid #3B968F',
};

const successBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#3B968F',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '25px',
  marginBottom: '20px',
};

const successIcon = {
  fontSize: '24px',
};

const successText = {
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const confirmationMessage = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 12px 0',
  lineHeight: '1.4',
};

const subMessage = {
  color: '#8b949e',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const transferSummarySection = {
  marginBottom: '32px',
};

const sectionTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #3B968F',
  paddingBottom: '8px',
  display: 'inline-block',
};

const summaryCard = {
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '12px',
  overflow: 'hidden',
};

const summaryHeader = {
  backgroundColor: '#3B968F',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const transferNumber = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  fontFamily: 'monospace',
};

const transferDate = {
  color: '#ffffff',
  fontSize: '12px',
  margin: '0',
  opacity: '0.9',
};

const summaryContent = {
  padding: '24px',
};

const amountFlow = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
  gap: '16px',
};

const fromAmount = {
  flex: '1',
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#0d1117',
  borderRadius: '8px',
  border: '1px solid #30363d',
};

const toAmount = {
  flex: '1',
  textAlign: 'center' as const,
  padding: '16px',
  backgroundColor: '#0d1117',
  borderRadius: '8px',
  border: '1px solid #3B968F',
};

const exchangeIndicator = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  gap: '4px',
};

const exchangeArrow = {
  fontSize: '24px',
  color: '#3B968F',
  fontWeight: 'bold',
};

const exchangeRate = {
  color: '#8b949e',
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
  fontWeight: '500',
};

const amountLabel = {
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
};

const amountValue = {
  color: '#ffa657',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const finalAmountValue = {
  color: '#4BA89F',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const methodText = {
  color: '#ffffff',
  fontSize: '12px',
  margin: '0',
  fontWeight: '500',
};

const feesRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px',
  backgroundColor: '#0d1117',
  borderRadius: '8px',
  border: '1px solid #30363d',
};

const feesLabel = {
  color: '#8b949e',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const feesValue = {
  color: '#f85149',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const recipientSection = {
  marginBottom: '32px',
};

const recipientCard = {
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '12px',
  padding: '24px',
};

const recipientDetails = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const recipientField = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '6px',
};

const fieldLabel = {
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const fieldValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const accountValue = {
  color: '#58a6ff',
  fontSize: '14px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0',
};

const processSection = {
  marginBottom: '32px',
};

const stepsContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
};

const stepCompleted = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#21262d',
  border: '1px solid #238636',
  borderRadius: '8px',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '8px',
  opacity: '0.7',
};

const stepNumber = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#3B968F',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
};

const stepContent = {
  flex: '1',
};

const stepTitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const stepDescription = {
  color: '#8b949e',
  fontSize: '12px',
  margin: '0',
  lineHeight: '1.4',
};

const stepStatusCompleted = {
  fontSize: '20px',
  flexShrink: '0',
};

const stepStatusPending = {
  fontSize: '20px',
  flexShrink: '0',
  opacity: '0.5',
};

const timingSection = {
  marginBottom: '32px',
};

const timingGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr 1fr',
  gap: '16px',
};

const timingCard = {
  textAlign: 'center' as const,
  padding: '20px 12px',
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '8px',
};

const timingIcon = {
  fontSize: '24px',
  marginBottom: '8px',
  display: 'block',
};

const timingTitle = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
};

const timingValue = {
  color: '#4BA89F',
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 4px 0',
};

const timingDescription = {
  color: '#8b949e',
  fontSize: '10px',
  margin: '0',
  lineHeight: '1.3',
};

const securitySection = {
  marginBottom: '32px',
};

const securityGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const securityFeature = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '8px',
};

const securityIcon = {
  fontSize: '20px',
  flexShrink: '0',
  marginTop: '2px',
};

const securityContent = {
  flex: '1',
};

const securityTitle = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const securityDescription = {
  color: '#8b949e',
  fontSize: '11px',
  margin: '0',
  lineHeight: '1.4',
};

const thankYouSection = {
  textAlign: 'center' as const,
  marginTop: '40px',
  padding: '24px',
  backgroundColor: '#21262d',
  borderRadius: '12px',
  border: '1px solid #3B968F',
};

const thankYouMessage = {
  color: '#4BA89F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const teamMessage = {
  color: '#8b949e',
  fontSize: '14px',
  margin: '0 0 8px 0',
  fontStyle: 'italic',
};

const teamSignature = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  fontWeight: '500',
};
