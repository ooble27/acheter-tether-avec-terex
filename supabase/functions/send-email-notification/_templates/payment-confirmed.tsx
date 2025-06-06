
import {
  Text,
  Section,
  Row,
  Column,
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
      <div style={iconContainer}>
        <div style={successIcon}>✅</div>
      </div>
      
      <Text style={greeting}>
        Fantastique !
      </Text>
      
      <Text style={text}>
        Excellente nouvelle ! Nous avons confirmé la réception de votre paiement.
      </Text>
      
      <Section style={confirmationBanner}>
        <div style={bannerContent}>
          <div style={checkmark}>✅</div>
          <Text style={bannerText}>
            Paiement confirmé avec succès
          </Text>
        </div>
      </Section>
      
      <Section style={orderCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            📋 Détails de la transaction
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>
              {transactionType === 'transfer' ? 'Numéro de transfert :' : 'Numéro de commande :'}
            </Column>
            <Column style={value}>
              #TEREX-{orderData.id?.slice(-8) || 'N/A'}
            </Column>
          </Row>
          
          {transactionType !== 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Type :</Column>
                <Column style={valueHighlight}>
                  {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant reçu :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>USDT à recevoir :</Column>
                <Column style={usdtAmount}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
            </>
          )}
          
          {transactionType === 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Montant :</Column>
                <Column style={valueHighlight}>
                  {orderData.amount || 0} {orderData.from_currency || 'USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Destinataire :</Column>
                <Column style={value}>{orderData.recipient_name || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Pays de destination :</Column>
                <Column style={countryValue}>{orderData.recipient_country || 'N/A'}</Column>
              </Row>
            </>
          )}
        </div>
      </Section>
      
      <Section style={progressCard}>
        <Text style={progressTitle}>
          🚀 Étape suivante
        </Text>
        <Text style={progressText}>
          {transactionType === 'transfer' 
            ? 'Votre transfert international est maintenant en cours de traitement. Nous procédons à l\'envoi des fonds vers le destinataire.'
            : 'Votre transaction est maintenant en cours de finalisation. Nous procédons au transfert des USDT vers votre portefeuille.'
          }
        </Text>
        
        <div style={progressBar}>
          <div style={progressFill}></div>
        </div>
        
        <Text style={progressLabel}>
          Traitement en cours...
        </Text>
      </Section>
      
      <Text style={text}>
        Vous recevrez une notification dès que la transaction sera terminée.
      </Text>
      
      <Text style={thankYou}>
        🌟 Merci de faire confiance à Terex pour vos {transactionType === 'transfer' ? 'transferts internationaux' : 'échanges USDT'} !
      </Text>
    </BaseEmail>
  );
};

// Styles améliorés
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const successIcon = {
  fontSize: '64px',
};

const greeting = {
  color: '#1a202c',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const confirmationBanner = {
  backgroundColor: '#f0fff4',
  border: '2px solid #9ae6b4',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const bannerContent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
};

const checkmark = {
  fontSize: '24px',
};

const bannerText = {
  color: '#22543d',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
};

const orderCard = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const cardHeader = {
  backgroundColor: '#667eea',
  padding: '16px 20px',
};

const cardTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const cardContent = {
  padding: '20px',
};

const row = {
  marginBottom: '12px',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '8px',
};

const label = {
  color: '#718096',
  fontSize: '14px',
  width: '40%',
  verticalAlign: 'top' as const,
  fontWeight: '500',
};

const value = {
  color: '#2d3748',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const valueHighlight = {
  color: '#667eea',
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const usdtAmount = {
  color: '#48bb78',
  fontSize: '16px',
  fontWeight: '700',
  width: '60%',
};

const countryValue = {
  color: '#4299e1',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const progressCard = {
  backgroundColor: '#edf2f7',
  border: '1px solid #cbd5e0',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const progressTitle = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const progressText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 16px',
};

const progressBar = {
  width: '100%',
  height: '8px',
  backgroundColor: '#e2e8f0',
  borderRadius: '4px',
  overflow: 'hidden',
  margin: '16px 0 8px',
};

const progressFill = {
  width: '75%',
  height: '100%',
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '4px',
  animation: 'pulse 2s infinite',
};

const progressLabel = {
  color: '#718096',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'center' as const,
};

const thankYou = {
  color: '#48bb78',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
