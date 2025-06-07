
import {
  Text,
  Section,
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
      {/* Status confirmation */}
      <Section style={statusSection}>
        <div style={statusBadge}>
          <span style={statusIcon}>✅</span>
          <Text style={statusText}>Demande confirmée</Text>
        </div>
        <Text style={confirmationMessage}>
          Excellente nouvelle ! Nous avons bien reçu votre demande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT.
        </Text>
      </Section>

      {/* Détails de la commande */}
      <Section style={detailsSection}>
        <Text style={sectionTitle}>📋 Détails de votre commande</Text>
        
        <div style={orderCard}>
          <div style={orderHeader}>
            <Text style={orderNumber}>Commande #TEREX-{orderData.id?.slice(-8) || 'N/A'}</Text>
            <Text style={orderDate}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Text>
          </div>
          
          <div style={orderDetails}>
            <div style={detailRow}>
              <Text style={label}>Type de transaction</Text>
              <Text style={value}>
                {transactionType === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
              </Text>
            </div>

            {transactionType === 'buy' ? (
              <>
                <div style={detailRow}>
                  <Text style={label}>Montant à payer</Text>
                  <Text style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>USDT à recevoir</Text>
                  <Text style={usdtValue}>{orderData.usdt_amount || 0} USDT</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>Réseau blockchain</Text>
                  <Text style={value}>{orderData.network || 'TRC20'}</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>Adresse de réception</Text>
                  <Text style={addressValue}>{orderData.wallet_address || 'N/A'}</Text>
                </div>
              </>
            ) : (
              <>
                <div style={detailRow}>
                  <Text style={label}>USDT à vendre</Text>
                  <Text style={usdtValue}>{orderData.usdt_amount || 0} USDT</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>Montant à recevoir</Text>
                  <Text style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>Compte de réception</Text>
                  <Text style={value}>{phoneNumber}</Text>
                </div>
                <div style={detailRow}>
                  <Text style={label}>Service de paiement</Text>
                  <Text style={value}>{provider === 'bank' ? 'Virement bancaire' : providerName}</Text>
                </div>
              </>
            )}
            
            <div style={detailRow}>
              <Text style={label}>Taux de change</Text>
              <Text style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Text>
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
            <Text style={stepTitle}>Demande reçue et confirmée ✅</Text>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>2</span>
            <Text style={stepTitle}>
              {transactionType === 'buy' ? 'Instructions de paiement ⏳' : 'Instructions d\'envoi USDT ⏳'}
            </Text>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>3</span>
            <Text style={stepTitle}>Traitement de la transaction ⏳</Text>
          </div>

          <div style={stepPending}>
            <span style={stepNumber}>4</span>
            <Text style={stepTitle}>
              {transactionType === 'buy' 
                ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre portefeuille ⏳`
                : `Envoi de ${orderData.amount || 0} ${orderData.currency || 'CFA'} vers votre compte ⏳`
              }
            </Text>
          </div>
        </div>
      </Section>

      {/* Informations importantes */}
      <Section style={infoSection}>
        <Text style={sectionTitle}>ℹ️ Informations importantes</Text>
        
        <div style={infoCard}>
          <Text style={infoText}>
            <strong>Délai de traitement :</strong> 5-30 minutes après confirmation du paiement{'\n\n'}
            <strong>Support disponible :</strong> Notre équipe est disponible 24h/7j{'\n\n'}
            <strong>Sécurité :</strong> Toutes les transactions sont sécurisées et surveillées{'\n\n'}
            <strong>Suivi :</strong> Vous pouvez suivre l'état sur la plateforme Terex
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

// Styles avec couleurs Terex
const statusSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '24px',
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  borderRadius: '12px',
  border: '1px solid #3B968F',
};

const statusBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  backgroundColor: '#3B968F',
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

const confirmationMessage = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.4',
};

const detailsSection = {
  marginBottom: '32px',
};

const sectionTitle = {
  color: '#3B968F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #3B968F',
  paddingBottom: '8px',
  display: 'inline-block',
};

const orderCard = {
  backgroundColor: 'rgba(59, 150, 143, 0.05)',
  border: '1px solid rgba(59, 150, 143, 0.3)',
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

const orderDetails = {
  padding: '20px',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
  paddingBottom: '12px',
  borderBottom: '1px solid rgba(59, 150, 143, 0.2)',
};

const label = {
  color: '#b0b0b0',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'right' as const,
};

const amountValue = {
  color: '#ffa657',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const usdtValue = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
  textAlign: 'right' as const,
};

const addressValue = {
  color: '#58a6ff',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0',
  textAlign: 'right' as const,
  wordBreak: 'break-all' as const,
  maxWidth: '200px',
};

const stepsSection = {
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
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  border: '1px solid #3B968F',
  borderRadius: '8px',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  backgroundColor: 'rgba(59, 150, 143, 0.05)',
  border: '1px solid rgba(59, 150, 143, 0.3)',
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

const stepTitle = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
  flex: '1',
};

const infoSection = {
  marginBottom: '32px',
};

const infoCard = {
  backgroundColor: 'rgba(255, 166, 87, 0.1)',
  border: '1px solid rgba(255, 166, 87, 0.3)',
  borderRadius: '8px',
  padding: '20px',
};

const infoText = {
  color: '#ffffff',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const thankYouSection = {
  textAlign: 'center' as const,
  marginTop: '40px',
  padding: '24px',
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
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
  color: '#b0b0b0',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
};
