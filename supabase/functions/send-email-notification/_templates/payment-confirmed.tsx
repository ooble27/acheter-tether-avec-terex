
import {
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
}

export const PaymentConfirmedEmail = ({ orderData, transactionType }: PaymentConfirmedProps) => {
  const title = transactionType === 'transfer' 
    ? 'Paiement confirmé - Transfert en cours' 
    : 'Paiement confirmé - Transaction en cours';
  const preview = 'Votre paiement a été confirmé avec succès';
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Message de confirmation */}
      <Section style={confirmationSection}>
        <div style={successBadge}>
          <span style={successIcon}>🎉</span>
          <Text style={successText}>Paiement confirmé !</Text>
        </div>
        <Text style={confirmationMessage}>
          Excellente nouvelle ! Nous avons confirmé la réception de votre paiement.
        </Text>
        <Text style={subMessage}>
          Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} est maintenant en cours de traitement final.
        </Text>
      </Section>

      {/* Détails de la transaction */}
      <Section style={transactionSection}>
        <Text style={sectionTitle}>💰 Détails du paiement confirmé</Text>
        
        <div style={transactionCard}>
          <div style={transactionHeader}>
            <Text style={transactionNumber}>
              {transactionType === 'transfer' ? 'Transfert' : 'Commande'} #TEREX-{orderData.id?.slice(-8) || 'N/A'}
            </Text>
            <div style={statusBadge}>
              <span style={statusText}>Paiement confirmé</span>
            </div>
          </div>
          
          <div style={transactionContent}>
            <div style={summaryGrid}>
              <div style={summaryItem}>
                <Text style={summaryLabel}>Date de confirmation</Text>
                <Text style={summaryValue}>
                  {new Date(orderData.payment_confirmed_at || Date.now()).toLocaleString('fr-FR')}
                </Text>
              </div>

              {transactionType !== 'transfer' && (
                <>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Type</Text>
                    <Text style={summaryValue}>
                      {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                    </Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Montant payé</Text>
                    <Text style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>USDT à recevoir</Text>
                    <Text style={usdtValue}>{orderData.usdt_amount || 0} USDT</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Réseau</Text>
                    <Text style={summaryValue}>{orderData.network || 'TRC20'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Adresse de réception</Text>
                    <Text style={addressValue}>{orderData.wallet_address || 'N/A'}</Text>
                  </div>
                </>
              )}
              
              {transactionType === 'transfer' && (
                <>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Montant envoyé</Text>
                    <Text style={amountValue}>{orderData.amount || 0} {orderData.from_currency || 'USDT'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Destinataire</Text>
                    <Text style={summaryValue}>{orderData.recipient_name || 'N/A'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Pays</Text>
                    <Text style={summaryValue}>{orderData.recipient_country || 'N/A'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Montant à recevoir</Text>
                    <Text style={usdtValue}>{orderData.total_amount || 0} {orderData.to_currency || 'N/A'}</Text>
                  </div>
                  <div style={summaryItem}>
                    <Text style={summaryLabel}>Frais</Text>
                    <Text style={summaryValue}>{orderData.fees || 0} {orderData.from_currency || 'USDT'}</Text>
                  </div>
                </>
              )}
              
              <div style={summaryItem}>
                <Text style={summaryLabel}>Méthode de paiement</Text>
                <Text style={summaryValue}>
                  {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
                   orderData.payment_method === 'wave' ? '📱 Wave' :
                   orderData.payment_method === 'orange' ? '🟠 Orange Money' : 
                   orderData.payment_method || 'N/A'}
                </Text>
              </div>
              <div style={summaryItem}>
                <Text style={summaryLabel}>Référence</Text>
                <Text style={summaryValue}>{orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}</Text>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Progression */}
      <Section style={progressSection}>
        <Text style={sectionTitle}>🚀 Progression de votre transaction</Text>
        
        <div style={progressContainer}>
          <div style={progressTrack}>
            <div style={progressFill}></div>
          </div>
          <Text style={progressText}>Traitement en cours - 85% terminé</Text>
        </div>

        <div style={timelineContainer}>
          <div style={timelineItem}>
            <span style={timelineIconCompleted}>✅</span>
            <div style={timelineContent}>
              <Text style={timelineTitle}>Demande reçue</Text>
              <Text style={timelineDescription}>Votre demande a été enregistrée</Text>
            </div>
          </div>
          
          <div style={timelineItem}>
            <span style={timelineIconCompleted}>✅</span>
            <div style={timelineContent}>
              <Text style={timelineTitle}>Paiement confirmé</Text>
              <Text style={timelineDescription}>Nous avons vérifié votre paiement</Text>
            </div>
          </div>
          
          <div style={timelineItem}>
            <span style={timelineIconCurrent}>🔄</span>
            <div style={timelineContent}>
              <Text style={timelineTitle}>Traitement final</Text>
              <Text style={timelineDescription}>
                {transactionType === 'transfer' 
                  ? 'Initiation du transfert international'
                  : `Préparation de l'envoi USDT vers votre portefeuille`
                }
              </Text>
            </div>
          </div>
          
          <div style={timelineItem}>
            <span style={timelineIconPending}>⏳</span>
            <div style={timelineContent}>
              <Text style={timelineTitle}>Finalisation</Text>
              <Text style={timelineDescription}>
                {transactionType === 'transfer' 
                  ? 'Réception par le destinataire'
                  : 'USDT envoyés à votre adresse'
                }
              </Text>
            </div>
          </div>
        </div>
      </Section>

      {/* Temps estimé */}
      <Section style={timingSection}>
        <div style={timingCard}>
          <Text style={timingTitle}>⏰ Délai estimé restant</Text>
          <Text style={timingValue}>
            {transactionType === 'transfer' ? '12-48 heures' : '5-15 minutes'}
          </Text>
          <Text style={timingDescription}>
            {transactionType === 'transfer' 
              ? 'Les transferts internationaux nécessitent des vérifications supplémentaires'
              : 'Délai habituel pour les transactions USDT après confirmation du paiement'
            }
          </Text>
        </div>
      </Section>

      {/* Sécurité */}
      <Section style={securitySection}>
        <Text style={sectionTitle}>🔒 Garanties de sécurité</Text>
        
        <div style={securityGrid}>
          <div style={securityItem}>
            <span style={securityIcon}>🛡️</span>
            <Text style={securityText}>Transaction sécurisée SSL 256-bit</Text>
          </div>
          <div style={securityItem}>
            <span style={securityIcon}>👥</span>
            <Text style={securityText}>Vérification manuelle par notre équipe</Text>
          </div>
          <div style={securityItem}>
            <span style={securityIcon}>📊</span>
            <Text style={securityText}>Surveillance 24h/7j des opérations</Text>
          </div>
          <div style={securityItem}>
            <span style={securityIcon}>💎</span>
            <Text style={securityText}>Fonds protégés en portefeuilles sécurisés</Text>
          </div>
        </div>
      </Section>

      {/* Message de remerciement */}
      <Section style={thankYouSection}>
        <Text style={thankYouMessage}>
          🌟 Merci de faire confiance à Terex !
        </Text>
        <Text style={teamMessage}>
          Vous recevrez une notification immédiate dès que votre {transactionType === 'transfer' ? 'transfert sera terminé' : 'USDT sera envoyé'}.
        </Text>
      </Section>
    </BaseEmail>
  );
};

// Styles optimisés
const confirmationSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '32px',
  backgroundColor: '#21262d',
  borderRadius: '12px',
  border: '2px solid #238636',
};

const successBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#238636',
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

const transactionSection = {
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

const transactionCard = {
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '12px',
  overflow: 'hidden',
};

const transactionHeader = {
  backgroundColor: '#3B968F',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const transactionNumber = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  fontFamily: 'monospace',
};

const statusBadge = {
  backgroundColor: '#238636',
  padding: '6px 12px',
  borderRadius: '6px',
};

const statusText = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const transactionContent = {
  padding: '24px',
};

const summaryGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const summaryItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '6px',
};

const summaryLabel = {
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const summaryValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  wordBreak: 'break-word' as const,
};

const amountValue = {
  color: '#ffa657',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const usdtValue = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const addressValue = {
  color: '#58a6ff',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0',
  wordBreak: 'break-all' as const,
};

const progressSection = {
  marginBottom: '32px',
};

const progressContainer = {
  marginBottom: '24px',
};

const progressTrack = {
  width: '100%',
  height: '8px',
  backgroundColor: '#30363d',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '8px',
};

const progressFill = {
  width: '85%',
  height: '100%',
  background: 'linear-gradient(90deg, #3B968F 0%, #4BA89F 100%)',
  borderRadius: '4px',
};

const progressText = {
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'center' as const,
};

const timelineContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
};

const timelineItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px',
  backgroundColor: '#21262d',
  borderRadius: '8px',
  border: '1px solid #30363d',
};

const timelineIconCompleted = {
  fontSize: '20px',
  width: '32px',
  textAlign: 'center' as const,
  flexShrink: '0',
};

const timelineIconCurrent = {
  fontSize: '20px',
  width: '32px',
  textAlign: 'center' as const,
  flexShrink: '0',
  animation: 'spin 2s linear infinite',
};

const timelineIconPending = {
  fontSize: '20px',
  width: '32px',
  textAlign: 'center' as const,
  flexShrink: '0',
  opacity: '0.5',
};

const timelineContent = {
  flex: '1',
};

const timelineTitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 4px 0',
};

const timelineDescription = {
  color: '#8b949e',
  fontSize: '12px',
  margin: '0',
  lineHeight: '1.4',
};

const timingSection = {
  marginBottom: '32px',
};

const timingCard = {
  backgroundColor: '#0d1117',
  border: '1px solid #3B968F',
  borderRadius: '12px',
  padding: '24px',
  textAlign: 'center' as const,
};

const timingTitle = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const timingValue = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 8px 0',
};

const timingDescription = {
  color: '#8b949e',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.5',
};

const securitySection = {
  marginBottom: '32px',
};

const securityGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
};

const securityItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  backgroundColor: '#21262d',
  borderRadius: '8px',
  border: '1px solid #30363d',
};

const securityIcon = {
  fontSize: '20px',
  flexShrink: '0',
};

const securityText = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '500',
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
  margin: '0 0 8px 0',
};

const teamMessage = {
  color: '#8b949e',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
  lineHeight: '1.5',
};
