
import {
  Text,
  Section,
  Row,
  Column,
  Img,
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
      <div style={logoContainer}>
        <Img
          src="https://mwwjrrduavfcwjiyniuy.supabase.co/storage/v1/object/public/avatars/terex-logo.png"
          width="120"
          height="40"
          alt="Terex"
          style={logo}
        />
      </div>
      
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
        Voici les détails complets de votre transaction :
      </Text>
      
      <Section style={orderCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            📋 Détails complets de la commande
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Numéro de commande :</Column>
            <Column style={value}>#{orderData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Type de transaction :</Column>
            <Column style={valueHighlight}>
              {transactionType === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant payé :</Column>
            <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Quantité USDT :</Column>
            <Column style={valueHighlight}>{orderData.usdt_amount || 0} USDT</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Taux de change :</Column>
            <Column style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Réseau blockchain :</Column>
            <Column style={value}>{orderData.network || 'TRC20'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Adresse de réception :</Column>
            <Column style={addressValue}>{orderData.wallet_address || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Méthode de paiement :</Column>
            <Column style={value}>
              {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
               orderData.payment_method === 'wave' ? '📱 Wave' :
               orderData.payment_method === 'orange' ? '🟠 Orange Money' : 'Mobile Money'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Date de création :</Column>
            <Column style={value}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Statut actuel :</Column>
            <Column style={statusPending}>⏳ En attente de paiement</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Frais de transaction :</Column>
            <Column style={value}>Gratuit (0%)</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={instructionCard}>
        <Text style={instructionTitle}>
          📋 Prochaines étapes détaillées
        </Text>
        <Text style={instructionText}>
          {transactionType === 'buy' 
            ? `1. Vous allez recevoir les instructions de paiement pour le service de paiement choisi
            
2. Effectuez le paiement de ${orderData.amount || 0} ${orderData.currency || 'CFA'}

3. Votre paiement sera vérifié automatiquement

4. Vous recevrez vos ${orderData.usdt_amount || 0} USDT sur l'adresse : ${orderData.wallet_address || 'votre adresse'}

5. Un email de confirmation vous sera envoyé une fois le transfert effectué` 
            : `1. Préparez vos ${orderData.usdt_amount || 0} USDT pour le transfert

2. Envoyez vos USDT à l'adresse qui vous sera communiquée

3. Une fois vos USDT reçus et vérifiés, nous procéderons au paiement

4. Vous recevrez ${orderData.amount || 0} ${orderData.currency || 'CFA'} via le service de paiement choisi

5. Un email de confirmation vous sera envoyé une fois le paiement effectué`
          }
        </Text>
      </Section>
      
      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Informations de contact
        </Text>
        <Text style={contactText}>
          • Support client : support@terex.com
          • Téléphone : +221 77 123 45 67
          • WhatsApp : +33 6 12 34 56 78
          • Horaires : 24h/7j
          • Temps de réponse moyen : 15 minutes
        </Text>
      </Section>
      
      <Text style={text}>
        Vous recevrez une notification immédiate dès que votre commande sera traitée par notre équipe.
      </Text>
      
      <Text style={thankYou}>
        🙏 Merci de faire confiance à Terex pour vos échanges USDT !
      </Text>
    </BaseEmail>
  );
};

// Styles améliorés avec logo
const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
  paddingTop: '20px',
};

const logo = {
  margin: '0 auto',
};

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

const addressValue = {
  color: '#2d3748',
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  wordBreak: 'break-all' as const,
  fontFamily: 'monospace',
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
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#f0fff4',
  border: '1px solid #9ae6b4',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#22543d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const contactText = {
  color: '#22543d',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const thankYou = {
  color: '#48bb78',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
