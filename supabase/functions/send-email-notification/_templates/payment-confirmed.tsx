
import {
  Text,
  Section,
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
      <Text style={confirmationText}>
        🎉 Excellente nouvelle ! Nous avons confirmé la réception de votre paiement.
      </Text>

      <Text style={subText}>
        Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} est maintenant en cours de traitement final.
      </Text>

      <Text style={sectionTitle}>DÉTAILS DU PAIEMENT CONFIRMÉ</Text>
      
      <Text style={detailText}>
        <strong>Numéro :</strong> {transactionType === 'transfer' ? 'Transfert' : 'Commande'} #TEREX-{orderData.id?.slice(-8) || 'N/A'}
      </Text>
      
      <Text style={detailText}>
        <strong>Date de confirmation :</strong> {new Date(orderData.payment_confirmed_at || Date.now()).toLocaleString('fr-FR')}
      </Text>

      {transactionType !== 'transfer' && (
        <>
          <Text style={detailText}>
            <strong>Type :</strong> {orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'}
          </Text>
          <Text style={detailText}>
            <strong>Montant payé :</strong> {orderData.amount || 0} {orderData.currency || 'CFA'}
          </Text>
          <Text style={detailText}>
            <strong>USDT à recevoir :</strong> {orderData.usdt_amount || 0} USDT
          </Text>
          <Text style={detailText}>
            <strong>Réseau :</strong> {orderData.network || 'TRC20'}
          </Text>
          <Text style={detailText}>
            <strong>Adresse de réception :</strong> {orderData.wallet_address || 'N/A'}
          </Text>
        </>
      )}
      
      {transactionType === 'transfer' && (
        <>
          <Text style={detailText}>
            <strong>Montant envoyé :</strong> {orderData.amount || 0} {orderData.from_currency || 'USDT'}
          </Text>
          <Text style={detailText}>
            <strong>Destinataire :</strong> {orderData.recipient_name || 'N/A'}
          </Text>
          <Text style={detailText}>
            <strong>Pays :</strong> {orderData.recipient_country || 'N/A'}
          </Text>
          <Text style={detailText}>
            <strong>Montant à recevoir :</strong> {orderData.total_amount || 0} {orderData.to_currency || 'N/A'}
          </Text>
          <Text style={detailText}>
            <strong>Frais :</strong> {orderData.fees || 0} {orderData.from_currency || 'USDT'}
          </Text>
        </>
      )}
      
      <Text style={detailText}>
        <strong>Méthode de paiement :</strong> {
          orderData.payment_method === 'card' ? 'Carte bancaire' : 
          orderData.payment_method === 'wave' ? 'Wave' :
          orderData.payment_method === 'orange' ? 'Orange Money' : 
          orderData.payment_method || 'N/A'
        }
      </Text>
      
      <Text style={detailText}>
        <strong>Référence :</strong> {orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}
      </Text>

      <Text style={sectionTitle}>PROGRESSION DE VOTRE TRANSACTION</Text>
      
      <Text style={progressText}>Traitement en cours - 85% terminé</Text>

      <Text style={stepText}>✅ Demande reçue</Text>
      <Text style={stepText}>✅ Paiement confirmé</Text>
      <Text style={stepText}>🔄 Traitement final</Text>
      <Text style={stepText}>
        ⏳ {transactionType === 'transfer' 
          ? 'Réception par le destinataire'
          : 'USDT envoyés à votre adresse'
        }
      </Text>

      <Text style={sectionTitle}>DÉLAI ESTIMÉ RESTANT</Text>
      
      <Text style={timingText}>
        <strong>{transactionType === 'transfer' ? '2-5 minutes' : '2-5 minutes'}</strong>
      </Text>
      <Text style={timingDescription}>
        {transactionType === 'transfer' 
          ? 'Les transferts sont traités très rapidement'
          : 'Délai habituel pour les transactions USDT après confirmation du paiement'
        }
      </Text>

      <Text style={thankYouText}>
        🌟 Merci de faire confiance à Terex !
      </Text>
      <Text style={teamText}>
        Vous recevrez une notification immédiate dès que votre {transactionType === 'transfer' ? 'transfert sera terminé' : 'USDT sera envoyé'}.
      </Text>
    </BaseEmail>
  );
};

// Styles simples et lisibles
const confirmationText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const subText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0 0 30px 0',
  lineHeight: '1.5',
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

const progressText = {
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const stepText = {
  color: '#333333',
  fontSize: '14px',
  margin: '6px 0',
  lineHeight: '1.5',
};

const timingText = {
  color: '#2563eb',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
};

const timingDescription = {
  color: '#666666',
  fontSize: '13px',
  margin: '0 0 30px 0',
  lineHeight: '1.5',
  textAlign: 'center' as const,
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
  lineHeight: '1.5',
};
