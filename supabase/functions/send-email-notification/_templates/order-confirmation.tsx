
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
      <Text style={confirmationText}>
        ✅ Excellente nouvelle ! Nous avons bien reçu votre demande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT.
      </Text>

      <Text style={sectionTitle}>DÉTAILS DE VOTRE COMMANDE</Text>
      
      <Text style={detailText}>
        <strong>Numéro de commande :</strong> #TEREX-{orderData.id?.slice(-8) || 'N/A'}
      </Text>
      
      <Text style={detailText}>
        <strong>Date :</strong> {new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}
      </Text>
      
      <Text style={detailText}>
        <strong>Type de transaction :</strong> {transactionType === 'buy' ? 'Achat USDT' : 'Vente USDT'}
      </Text>

      {transactionType === 'buy' ? (
        <>
          <Text style={detailText}>
            <strong>Montant à payer :</strong> {orderData.amount || 0} {orderData.currency || 'CFA'}
          </Text>
          <Text style={detailText}>
            <strong>USDT à recevoir :</strong> {orderData.usdt_amount || 0} USDT
          </Text>
          <Text style={detailText}>
            <strong>Réseau blockchain :</strong> {orderData.network || 'TRC20'}
          </Text>
          <Text style={detailText}>
            <strong>Adresse de réception :</strong> {orderData.wallet_address || 'N/A'}
          </Text>
        </>
      ) : (
        <>
          <Text style={detailText}>
            <strong>USDT à vendre :</strong> {orderData.usdt_amount || 0} USDT
          </Text>
          <Text style={detailText}>
            <strong>Montant à recevoir :</strong> {orderData.amount || 0} {orderData.currency || 'CFA'}
          </Text>
          <Text style={detailText}>
            <strong>Compte de réception :</strong> {phoneNumber}
          </Text>
          <Text style={detailText}>
            <strong>Service de paiement :</strong> {provider === 'bank' ? 'Virement bancaire' : providerName}
          </Text>
        </>
      )}
      
      <Text style={detailText}>
        <strong>Taux de change :</strong> {orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT
      </Text>

      <Text style={sectionTitle}>PROCHAINES ÉTAPES</Text>
      
      <Text style={stepText}>
        1. ✅ Demande reçue et confirmée
      </Text>
      <Text style={stepText}>
        2. ⏳ {transactionType === 'buy' ? 'Instructions de paiement' : 'Instructions d\'envoi USDT'}
      </Text>
      <Text style={stepText}>
        3. ⏳ Traitement de la transaction
      </Text>
      <Text style={stepText}>
        4. ⏳ {transactionType === 'buy' 
          ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre portefeuille`
          : `Envoi de ${orderData.amount || 0} ${orderData.currency || 'CFA'} vers votre compte`
        }
      </Text>

      <Text style={sectionTitle}>INFORMATIONS IMPORTANTES</Text>
      
      <Text style={infoText}>
        <strong>Délai de traitement :</strong> 5-30 minutes après confirmation du paiement
      </Text>
      <Text style={infoText}>
        <strong>Support disponible :</strong> Notre équipe est disponible 24h/7j
      </Text>
      <Text style={infoText}>
        <strong>Sécurité :</strong> Toutes les transactions sont sécurisées et surveillées
      </Text>
      <Text style={infoText}>
        <strong>Suivi :</strong> Vous pouvez suivre l'état sur la plateforme Terex
      </Text>

      <Text style={thankYouText}>
        🙏 Merci de faire confiance à Terex pour vos échanges USDT !
      </Text>
      <Text style={teamText}>
        L'équipe Terex
      </Text>
    </BaseEmail>
  );
};

// Styles simples et lisibles
const confirmationText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 30px 0',
  lineHeight: '1.4',
};

const sectionTitle = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '700',
  margin: '30px 0 15px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailText = {
  color: '#333333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
};

const stepText = {
  color: '#333333',
  fontSize: '14px',
  margin: '6px 0',
  lineHeight: '1.5',
};

const infoText = {
  color: '#333333',
  fontSize: '14px',
  margin: '6px 0',
  lineHeight: '1.5',
};

const thankYouText = {
  color: '#2563eb',
  fontSize: '18px',
  fontWeight: '600',
  margin: '30px 0 8px 0',
  textAlign: 'center' as const,
};

const teamText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
  textAlign: 'center' as const,
};
