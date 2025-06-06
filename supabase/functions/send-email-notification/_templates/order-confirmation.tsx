
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
  const preview = `Votre demande #${orderData.id?.slice(-8)} a été reçue`;
  
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
        🎉 Félicitations ! Nous avons bien reçu votre demande
      </Text>
      
      <Section style={orderCard}>
        <Text style={cardTitle}>📋 Détails de votre demande</Text>
        
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
              <span style={label}>Montant à payer :</span>
              <span style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</span>
            </div>
            <div style={detailRow}>
              <span style={label}>USDT à recevoir :</span>
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
              <span style={label}>USDT à vendre :</span>
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
      
      <Section style={processCard}>
        <Text style={processTitle}>📋 Étapes du processus</Text>
        <Text style={processText}>
          {transactionType === 'buy' 
            ? `1. Votre demande d'achat est en cours de traitement\n2. Vous recevrez les instructions de paiement\n3. Effectuez le paiement de ${orderData.amount || 0} ${orderData.currency || 'CFA'}\n4. Recevez vos ${orderData.usdt_amount || 0} USDT sur votre portefeuille` 
            : `1. Votre demande de vente est en cours de traitement\n2. Envoyez ${orderData.usdt_amount || 0} USDT à l'adresse qui vous sera fournie\n3. Une fois les USDT reçus et confirmés, vous recevrez ${orderData.amount || 0} ${orderData.currency || 'CFA'} sur votre ${providerName} (${phoneNumber})\n4. Délai de traitement : maximum 30 minutes après réception des USDT`
          }
        </Text>
      </Section>
      
      <Section style={contactCard}>
        <Text style={contactTitle}>📞 Support client</Text>
        <Text style={contactText}>
          Email : terangaexchange@gmail.com{'\n'}
          Téléphone : +221 77 397 27 49{'\n'}
          WhatsApp : +1 4182619091
        </Text>
      </Section>
      
      <Section style={platformCard}>
        <Text style={platformTitle}>🔐 Accéder à votre compte</Text>
        <Text style={platformText}>
          Suivez l'état de votre transaction en temps réel sur votre espace client Terex.
        </Text>
        <Link href="https://terex.lovable.app" style={platformLink}>
          Accéder à la plateforme Terex
        </Link>
      </Section>
      
      <Text style={thankYou}>
        🙏 Merci de faire confiance à Terex pour vos échanges crypto !
      </Text>
    </BaseEmail>
  );
};

const greeting = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const orderCard = {
  backgroundColor: '#f9fafb',
  border: '2px solid #3B968F',
  borderRadius: '12px',
  padding: '24px',
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
  padding: '12px 0',
  borderBottom: '1px solid #e5e7eb',
  marginBottom: '8px',
};

const label = {
  color: '#6b7280',
  fontSize: '14px',
  fontWeight: '500',
};

const value = {
  color: '#1f2937',
  fontSize: '14px',
  fontWeight: '600',
};

const highlight = {
  color: '#3B968F',
  fontSize: '14px',
  fontWeight: '700',
};

const address = {
  color: '#1f2937',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
};

const processCard = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #3B968F',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const processTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const processText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#f9fafb',
  border: '2px solid #3B968F',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const contactText = {
  color: '#1f2937',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const platformCard = {
  backgroundColor: '#fef3c7',
  border: '2px solid #3B968F',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const platformTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const platformText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const platformLink = {
  color: '#ffffff',
  backgroundColor: '#3B968F',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  display: 'inline-block',
  margin: '0 auto',
};

const thankYou = {
  color: '#3B968F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0 0',
  textAlign: 'center' as const,
};
