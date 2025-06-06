import {
  Text,
  Section,
  Row,
  Column,
  Img,
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
        <div style={successIcon}>✅</div>
      </div>
      
      <Text style={greeting}>
        Fantastique !
      </Text>
      
      <Text style={text}>
        Excellente nouvelle ! Nous avons confirmé la réception de votre paiement.
        Voici tous les détails de votre transaction :
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
            📋 Détails complets de la transaction
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
          
          <Row style={row}>
            <Column style={label}>Date et heure du paiement :</Column>
            <Column style={value}>{new Date(orderData.payment_confirmed_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          
          {transactionType !== 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Type de transaction :</Column>
                <Column style={valueHighlight}>
                  {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant payé :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Quantité USDT à recevoir :</Column>
                <Column style={usdtAmount}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Réseau de réception :</Column>
                <Column style={value}>{orderData.network || 'TRC20'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Adresse de réception :</Column>
                <Column style={addressValue}>{orderData.wallet_address || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Taux de change appliqué :</Column>
                <Column style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Column>
              </Row>
            </>
          )}
          
          {transactionType === 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Montant envoyé :</Column>
                <Column style={valueHighlight}>
                  {orderData.amount || 0} {orderData.from_currency || 'USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Nom du destinataire :</Column>
                <Column style={value}>{orderData.recipient_name || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Compte destinataire :</Column>
                <Column style={accountValue}>{orderData.recipient_account || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Banque destinataire :</Column>
                <Column style={value}>{orderData.recipient_bank || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Pays de destination :</Column>
                <Column style={countryValue}>{orderData.recipient_country || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant à recevoir :</Column>
                <Column style={usdtAmount}>{orderData.total_amount || 0} {orderData.to_currency || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Frais de transfert :</Column>
                <Column style={value}>{orderData.fees || 0} {orderData.from_currency || 'USDT'}</Column>
              </Row>
            </>
          )}
          
          <Row style={row}>
            <Column style={label}>Méthode de paiement :</Column>
            <Column style={value}>
              {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
               orderData.payment_method === 'wave' ? '📱 Wave' :
               orderData.payment_method === 'orange' ? '🟠 Orange Money' : 
               orderData.payment_method || 'N/A'}
            </Column>
          </Row>
          
          <Row style={row}>
            <Column style={label}>Référence de paiement :</Column>
            <Column style={value}>{orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={progressCard}>
        <Text style={progressTitle}>
          🚀 Étape suivante
        </Text>
        <Text style={progressText}>
          {transactionType === 'transfer' 
            ? `Votre transfert international est maintenant en cours de traitement. 

• Vérification des informations du destinataire ✅
• Traitement du paiement ✅  
• Initiation du transfert 🔄 EN COURS
• Réception par le destinataire ⏳ En attente

Délai estimé : 24-48h ouvrables

Le destinataire sera notifié dès réception des fonds.`
            : `Votre transaction USDT est maintenant en cours de finalisation.

• Réception du paiement ✅
• Vérification du paiement ✅
• Préparation du transfert USDT 🔄 EN COURS  
• Envoi vers votre portefeuille ⏳ En attente

Délai estimé : 5-15 minutes

Vos USDT seront envoyés à : ${orderData.wallet_address || 'votre adresse'}`
          }
        </Text>
        
        <div style={progressBar}>
          <div style={progressFill}></div>
        </div>
        
        <Text style={progressLabel}>
          Traitement en cours - 75% complété
        </Text>
      </Section>

      <Section style={securityCard}>
        <Text style={securityTitle}>
          🔒 Informations de sécurité
        </Text>
        <Text style={securityText}>
          • Transaction sécurisée par cryptage SSL 256-bit
          • Vérification automatique des paiements
          • Fonds protégés par portefeuilles multi-signatures
          • Surveillance 24h/7j de toutes les transactions
          • Support client disponible à tout moment
        </Text>
      </Section>

      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Besoin d'aide ?
        </Text>
        <Text style={contactText}>
          • Support client : support@terex.com
          • Téléphone Sénégal : +221 77 397 27 49
          • WhatsApp : +1 4182619091
          • Horaires : 24h/7j
          • Référence à mentionner : #TEREX-{orderData.id?.slice(-8) || 'N/A'}
        </Text>
      </Section>
      
      <Text style={text}>
        Vous recevrez une notification immédiate dès que la transaction sera terminée.
      </Text>
      
      <Text style={thankYou}>
        🌟 Merci de faire confiance à Terex pour vos {transactionType === 'transfer' ? 'transferts internationaux' : 'échanges USDT'} !
      </Text>
    </BaseEmail>
  );
};

// Styles avec logo et numéros de téléphone corrigés
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

const addressValue = {
  color: '#2d3748',
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  wordBreak: 'break-all' as const,
  fontFamily: 'monospace',
};

const accountValue = {
  color: '#2d3748',
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  fontFamily: 'monospace',
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
  lineHeight: '1.6',
  margin: '0 0 16px',
  whiteSpace: 'pre-line' as const,
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

const securityCard = {
  backgroundColor: '#fef5e7',
  border: '1px solid #f6e05e',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const securityTitle = {
  color: '#744210',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const securityText = {
  color: '#975a16',
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
