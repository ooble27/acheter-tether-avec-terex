
import {
  Text,
  Section,
  Link,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const title = transactionType === 'buy' ? 'Demande d\'achat USDT reçue' : 'Demande de vente USDT reçue';
  const preview = `Votre demande #TEREX-${orderData.id?.slice(-8)} a été reçue`;
  
  // Parser les notes pour récupérer les informations du client
  let clientInfo = null;
  try {
    if (orderData.notes) {
      clientInfo = JSON.parse(orderData.notes);
    }
  } catch (e) {
    console.log('Impossible de parser les notes:', e);
  }

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName = provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : 'Mobile Money';
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Message de bienvenue */}
      <Section style={welcomeSection}>
        <div style={statusBadge}>
          <span style={statusIcon}>✅</span>
          <Text style={statusText}>Demande confirmée</Text>
        </div>
        <Text style={welcomeMessage}>
          Excellente nouvelle ! Nous avons bien reçu votre demande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT.
        </Text>
        <Text style={subMessage}>
          Votre transaction est maintenant en cours de traitement par notre équipe.
        </Text>
      </Section>

      {/* Détails de la commande */}
      <Section style={orderDetailsSection}>
        <Text style={sectionTitle}>📋 Détails de votre commande</Text>
        
        <div style={orderCard}>
          <div style={orderHeader}>
            <Text style={orderNumber}>Commande #TEREX-{orderData.id?.slice(-8) || 'N/A'}</Text>
            <Text style={orderDate}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Text>
          </div>
          
          <div style={orderContent}>
            <div style={transactionTypeRow}>
              <span style={label}>Type de transaction</span>
              <span style={transactionTypeBadge}>
                {transactionType === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
              </span>
            </div>

            {transactionType === 'buy' ? (
              <>
                <div style={detailRow}>
                  <span style={label}>Montant à payer</span>
                  <span style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>USDT à recevoir</span>
                  <span style={usdtValue}>{orderData.usdt_amount || 0} USDT</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>Réseau blockchain</span>
                  <span style={value}>{orderData.network || 'TRC20'}</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>Adresse de réception</span>
                  <span style={addressValue}>{orderData.wallet_address || 'N/A'}</span>
                </div>
              </>
            ) : (
              <>
                <div style={detailRow}>
                  <span style={label}>USDT à vendre</span>
                  <span style={usdtValue}>{orderData.usdt_amount || 0} USDT</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>Montant à recevoir</span>
                  <span style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>Compte de réception</span>
                  <span style={value}>{phoneNumber}</span>
                </div>
                <div style={detailRow}>
                  <span style={label}>Service de paiement</span>
                  <span style={value}>{provider === 'bank' ? 'Virement bancaire' : providerName}</span>
                </div>
              </>
            )}
            
            <div style={detailRow}>
              <span style={label}>Taux de change</span>
              <span style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</span>
            </div>
          </div>
        </div>
      </Section>

      {/* Prochaines étapes */}
      <Section style={stepsSection}>
        <Text style={sectionTitle}>🚀 Prochaines étapes</Text>
        
        <div style={stepsContainer}>
          <div style={stepCompleted}>
            <span style={stepNumber}>1</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Demande reçue et confirmée</Text>
              <Text style={stepDescription}>Votre demande a été enregistrée avec succès</Text>
            </div>
            <span style={stepStatusCompleted}>✅</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>2</span>
            <div style={stepContent}>
              <Text style={stepTitle}>
                {transactionType === 'buy' ? 'Instructions de paiement' : 'Instructions d\'envoi USDT'}
              </Text>
              <Text style={stepDescription}>
                {transactionType === 'buy' 
                  ? 'Vous recevrez les détails pour effectuer votre paiement'
                  : 'Vous recevrez l\'adresse pour envoyer vos USDT'
                }
              </Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>3</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Traitement de la transaction</Text>
              <Text style={stepDescription}>
                Vérification et traitement de votre {transactionType === 'buy' ? 'paiement' : 'envoi USDT'}
              </Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>4</span>
            <div style={stepContent}>
              <Text style={stepTitle}>Finalisation</Text>
              <Text style={stepDescription}>
                {transactionType === 'buy' 
                  ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre portefeuille`
                  : `Envoi de ${orderData.amount || 0} ${orderData.currency || 'CFA'} vers votre compte`
                }
              </Text>
            </div>
            <span style={stepStatusPending}>⏳</span>
          </div>
        </div>
      </Section>

      {/* Informations importantes */}
      <Section style={infoSection}>
        <Text style={sectionTitle}>ℹ️ Informations importantes</Text>
        
        <div style={infoCard}>
          <Text style={infoText}>
            <strong>Délai de traitement :</strong> 5-30 minutes après confirmation du paiement{'\n\n'}
            <strong>Support disponible :</strong> Notre équipe est disponible 24h/7j pour vous accompagner{'\n\n'}
            <strong>Sécurité :</strong> Toutes les transactions sont sécurisées et surveillées{'\n\n'}
            <strong>Suivi :</strong> Vous pouvez suivre l'état de votre transaction sur la plateforme Terex
          </Text>
        </div>
      </Section>

      {/* Message de remerciement */}
      <Section style={thankYouSection}>
        <Text style={thankYouMessage}>
          🙏 Merci de faire confiance à Terex pour vos échanges USDT !
        </Text>
        <Text style={teamMessage}>
          L'équipe Terex
        </Text>
      </Section>
    </BaseEmail>
  );
};

// Styles optimisés pour la lisibilité et l'alignement
const welcomeSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '24px',
  backgroundColor: '#21262d',
  borderRadius: '12px',
  border: '1px solid #30363d',
};

const statusBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#238636',
  color: '#ffffff',
  padding: '8px 16px',
  borderRadius: '20px',
  marginBottom: '16px',
};

const statusIcon = {
  fontSize: '16px',
};

const statusText = {
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
};

const welcomeMessage = {
  color: '#ffffff',
  fontSize: '18px',
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

const orderDetailsSection = {
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

const orderCard = {
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
  borderRadius: '12px',
  overflow: 'hidden',
};

const orderHeader = {
  backgroundColor: '#3B968F',
  padding: '16px 20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const orderNumber = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  fontFamily: 'monospace',
};

const orderDate = {
  color: '#ffffff',
  fontSize: '12px',
  margin: '0',
  opacity: '0.9',
};

const orderContent = {
  padding: '20px',
};

const transactionTypeRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
  paddingBottom: '16px',
  borderBottom: '1px solid #30363d',
};

const transactionTypeBadge = {
  backgroundColor: '#3B968F',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '6px 12px',
  borderRadius: '6px',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  minHeight: '24px',
};

const label = {
  color: '#8b949e',
  fontSize: '14px',
  fontWeight: '500',
  flex: '1',
  textAlign: 'left' as const,
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'right' as const,
  flex: '1',
  wordBreak: 'break-word' as const,
};

const amountValue = {
  color: '#ffa657',
  fontSize: '16px',
  fontWeight: '700',
  textAlign: 'right' as const,
  flex: '1',
};

const usdtValue = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '700',
  textAlign: 'right' as const,
  flex: '1',
};

const addressValue = {
  color: '#58a6ff',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  textAlign: 'right' as const,
  flex: '1',
  wordBreak: 'break-all' as const,
  maxWidth: '200px',
};

const stepsSection = {
  marginBottom: '32px',
};

const stepsContainer = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '16px',
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
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
};

const stepTitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
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

const infoSection = {
  marginBottom: '32px',
};

const infoCard = {
  backgroundColor: '#0d1117',
  border: '1px solid #f85149',
  borderRadius: '8px',
  padding: '20px',
};

const infoText = {
  color: '#f0f6fc',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
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
};
