
import {
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const title = transactionType === 'buy' ? 'Commande d\'achat confirmée' : 'Commande de vente confirmée';
  const preview = `Votre commande #${orderData.id?.slice(-8)} a été confirmée`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <div style={iconContainer}>
        <div style={successIcon}>
          {transactionType === 'buy' ? '💰' : '🚀'}
        </div>
      </div>
      
      <Text style={greeting}>
        Félicitations !
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre commande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT. 
        Voici les détails de votre transaction :
      </Text>
      
      <Section style={orderCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            📋 Détails de la commande
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Numéro de commande :</Column>
            <Column style={value}>#{orderData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Type :</Column>
            <Column style={valueHighlight}>
              {transactionType === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant :</Column>
            <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>USDT :</Column>
            <Column style={valueHighlight}>{orderData.usdt_amount || 0} USDT</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Taux de change :</Column>
            <Column style={value}>{orderData.exchange_rate || 0} CFA/USDT</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Statut :</Column>
            <Column style={statusPending}>⏳ En attente de traitement</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={instructionCard}>
        <Text style={instructionTitle}>
          📋 Prochaines étapes
        </Text>
        <Text style={instructionText}>
          {transactionType === 'buy' 
            ? 'Veuillez effectuer le paiement selon les instructions qui vous seront communiquées.' 
            : 'Veuillez préparer vos USDT pour le transfert selon les instructions qui vous seront communiquées.'
          }
        </Text>
      </Section>
      
      <Text style={text}>
        Vous recevrez une notification dès que votre commande sera traitée par notre équipe.
      </Text>
      
      <Text style={thankYou}>
        🙏 Merci de faire confiance à Terex !
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
  fontSize: '48px',
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
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

const statusPending = {
  color: '#d69e2e',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const instructionCard = {
  backgroundColor: '#edf2f7',
  border: '1px solid #cbd5e0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const instructionTitle = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const instructionText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const thankYou = {
  color: '#48bb78',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
