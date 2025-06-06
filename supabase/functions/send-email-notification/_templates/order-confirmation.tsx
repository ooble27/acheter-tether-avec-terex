
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
          
          {transactionType === 'buy' ? (
            <>
              <Row style={row}>
                <Column style={label}>Montant payé :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Quantité USDT reçue :</Column>
                <Column style={valueHighlight}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Adresse de réception :</Column>
                <Column style={addressValue}>{orderData.wallet_address || 'N/A'}</Column>
              </Row>
            </>
          ) : (
            <>
              <Row style={row}>
                <Column style={label}>Quantité USDT vendue :</Column>
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
            <Column style={label}>Taux de change :</Column>
            <Column style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Column>
          </Row>
          
          {transactionType === 'buy' && (
            <>
              <Row style={row}>
                <Column style={label}>Réseau blockchain :</Column>
                <Column style={value}>{orderData.network || 'TRC20'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Méthode de paiement :</Column>
                <Column style={value}>
                  {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
                   orderData.payment_method === 'wave' ? '📱 Wave' :
                   orderData.payment_method === 'orange' ? '🟠 Orange Money' : 'Mobile Money'}
                </Column>
              </Row>
            </>
          )}
          
          <Row style={row}>
            <Column style={label}>Date de création :</Column>
            <Column style={value}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Statut actuel :</Column>
            <Column style={statusPending}>⏳ En attente de traitement</Column>
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
            : `1. Envoyez vos ${orderData.usdt_amount || 0} USDT à l'adresse qui vous sera communiquée

2. Une fois vos USDT reçus et vérifiés, nous procéderons au paiement

3. Vous recevrez ${orderData.amount || 0} ${orderData.currency || 'CFA'} sur votre ${providerName} au numéro ${phoneNumber}

4. Un email de confirmation vous sera envoyé une fois le paiement effectué

5. Délai de traitement : maximum 30 minutes`
          }
        </Text>
      </Section>
      
      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Informations de contact
        </Text>
        <Text style={contactText}>
          • Support client : terangaexchange@gmail.com
          • Téléphone Sénégal : +221 77 397 27 49
          • WhatsApp : +1 4182619091
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

// Styles avec les couleurs Terex (fond sombre uniquement)
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const successIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
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
  backgroundColor: '#2A2A2A',
  border: '1px solid #3B968F',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
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
  backgroundColor: '#2A2A2A',
};

const row = {
  marginBottom: '12px',
  borderBottom: '1px solid #3A3A3A',
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
  backgroundColor: '#2A2A2A',
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
  backgroundColor: '#1e3a3a',
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
