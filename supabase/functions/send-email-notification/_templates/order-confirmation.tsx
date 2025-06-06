
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
  
  // Parser les notes pour récupérer les informations du client
  let clientInfo = null;
  try {
    if (orderData.notes) {
      clientInfo = JSON.parse(orderData.notes);
    }
  } catch (e) {
    console.log('Impossible de parser les notes:', e);
  }

  const phoneNumber = clientInfo?.phoneNumber || 'N/A';
  const provider = clientInfo?.provider || 'Mobile Money';
  const providerName = provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : 'Mobile Money';
  
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
          
          {transactionType === 'buy' ? (
            <>
              <Row style={row}>
                <Column style={label}>Montant payé :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>USDT reçu :</Column>
                <Column style={valueHighlight}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Adresse :</Column>
                <Column style={addressValue}>{orderData.wallet_address || 'N/A'}</Column>
              </Row>
            </>
          ) : (
            <>
              <Row style={row}>
                <Column style={label}>USDT vendu :</Column>
                <Column style={valueHighlight}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant à recevoir :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Numéro de téléphone :</Column>
                <Column style={value}>{phoneNumber}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Service de paiement :</Column>
                <Column style={value}>
                  {provider === 'wave' ? '📱 Wave' :
                   provider === 'orange' ? '🟠 Orange Money' : 
                   orderData.payment_method === 'card' ? '💳 Virement bancaire' : providerName}
                </Column>
              </Row>
            </>
          )}
          
          <Row style={row}>
            <Column style={label}>Taux :</Column>
            <Column style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Date :</Column>
            <Column style={value}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Statut :</Column>
            <Column style={statusPending}>⏳ En attente</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={instructionCard}>
        <Text style={instructionTitle}>
          📋 Prochaines étapes
        </Text>
        <Text style={instructionText}>
          {transactionType === 'buy' 
            ? `• Vous recevrez les instructions de paiement\n• Effectuez le paiement de ${orderData.amount || 0} ${orderData.currency || 'CFA'}\n• Recevez vos ${orderData.usdt_amount || 0} USDT` 
            : `• Envoyez ${orderData.usdt_amount || 0} USDT à l'adresse fournie\n• Recevez ${orderData.amount || 0} ${orderData.currency || 'CFA'} sur ${providerName}\n• Délai : maximum 30 minutes`
          }
        </Text>
      </Section>
      
      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Contact
        </Text>
        <Text style={contactText}>
          Support : terangaexchange@gmail.com{'\n'}
          Téléphone : +221 77 397 27 49{'\n'}
          WhatsApp : +1 4182619091
        </Text>
      </Section>
      
      <Text style={thankYou}>
        🙏 Merci de faire confiance à Terex !
      </Text>
    </BaseEmail>
  );
};

// Styles avec fond noir complet
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const successIcon = {
  fontSize: '48px',
  color: '#3B968F',
};

const greeting = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const orderCard = {
  backgroundColor: '#000000',
  border: '1px solid #3B968F',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
};

const cardHeader = {
  backgroundColor: '#3B968F',
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
  backgroundColor: '#000000',
};

const row = {
  marginBottom: '12px',
  borderBottom: '1px solid #333333',
  paddingBottom: '8px',
};

const label = {
  color: '#94a3b8',
  fontSize: '14px',
  width: '40%',
  verticalAlign: 'top' as const,
  fontWeight: '500',
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const valueHighlight = {
  color: '#3B968F',
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const addressValue = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  wordBreak: 'break-all' as const,
  fontFamily: 'monospace',
};

const statusPending = {
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const instructionCard = {
  backgroundColor: '#000000',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const instructionTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const instructionText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#000000',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const contactText = {
  color: '#ffffff',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const thankYou = {
  color: '#3B968F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
