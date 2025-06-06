
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
  const title = transactionType === 'buy' ? 'Achat USDT confirmé' : 'Vente USDT confirmée';
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

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName = provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : 'Mobile Money';
  
  return (
    <BaseEmail preview={preview} title={title}>
      <Text style={greeting}>
        🎉 Félicitations ! Votre commande a été confirmée
      </Text>
      
      <Section style={orderCard}>
        <Text style={cardTitle}>📋 Détails de votre commande</Text>
        
        <div style={detailRow}>
          <span style={label}>Numéro :</span>
          <span style={value}>#TEREX-{orderData.id?.slice(-8) || 'N/A'}</span>
        </div>
        
        <div style={detailRow}>
          <span style={label}>Type :</span>
          <span style={highlight}>
            {transactionType === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
          </span>
        </div>
        
        {transactionType === 'buy' ? (
          <>
            <div style={detailRow}>
              <span style={label}>Montant payé :</span>
              <span style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</span>
            </div>
            <div style={detailRow}>
              <span style={label}>USDT reçu :</span>
              <span style={highlight}>{orderData.usdt_amount || 0} USDT</span>
            </div>
            <div style={detailRow}>
              <span style={label}>Adresse :</span>
              <span style={address}>{orderData.wallet_address || 'N/A'}</span>
            </div>
          </>
        ) : (
          <>
            <div style={detailRow}>
              <span style={label}>USDT vendu :</span>
              <span style={highlight}>{orderData.usdt_amount || 0} USDT</span>
            </div>
            <div style={detailRow}>
              <span style={label}>Montant à recevoir :</span>
              <span style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</span>
            </div>
            <div style={detailRow}>
              <span style={label}>Téléphone :</span>
              <span style={value}>{phoneNumber}</span>
            </div>
            <div style={detailRow}>
              <span style={label}>Service :</span>
              <span style={value}>{providerName}</span>
            </div>
          </>
        )}
        
        <div style={detailRow}>
          <span style={label}>Taux :</span>
          <span style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</span>
        </div>
        
        <div style={detailRow}>
          <span style={label}>Date :</span>
          <span style={value}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</span>
        </div>
      </Section>
      
      <Section style={instructionCard}>
        <Text style={instructionTitle}>📋 Prochaines étapes</Text>
        <Text style={instructionText}>
          {transactionType === 'buy' 
            ? `• Vous recevrez les instructions de paiement\n• Effectuez le paiement de ${orderData.amount || 0} ${orderData.currency || 'CFA'}\n• Recevez vos ${orderData.usdt_amount || 0} USDT` 
            : `• Envoyez ${orderData.usdt_amount || 0} USDT à l'adresse fournie\n• Recevez ${orderData.amount || 0} ${orderData.currency || 'CFA'} sur ${providerName}\n• Délai maximum : 30 minutes`
          }
        </Text>
      </Section>
      
      <Section style={contactCard}>
        <Text style={contactTitle}>📞 Support</Text>
        <Text style={contactText}>
          Email : terangaexchange@gmail.com{'\n'}
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

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const orderCard = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const cardTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid #333333',
  marginBottom: '8px',
};

const label = {
  color: '#94a3b8',
  fontSize: '14px',
  fontWeight: '500',
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
};

const highlight = {
  color: '#3B968F',
  fontSize: '14px',
  fontWeight: '700',
};

const address = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
};

const instructionCard = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const instructionTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const instructionText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
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
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};
