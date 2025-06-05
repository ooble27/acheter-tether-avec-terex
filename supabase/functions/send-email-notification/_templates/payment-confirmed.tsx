
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
      <Text style={text}>
        Bonjour,
      </Text>
      
      <Text style={text}>
        Excellente nouvelle ! Nous avons confirmé la réception de votre paiement.
      </Text>
      
      <Section style={confirmationSection}>
        <Text style={confirmationText}>
          ✅ Paiement confirmé
        </Text>
      </Section>
      
      <Section style={orderDetails}>
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
              <Column style={value}>
                {orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'}
              </Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Montant reçu :</Column>
              <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>USDT à recevoir :</Column>
              <Column style={value}>{orderData.usdt_amount || 0} USDT</Column>
            </Row>
          </>
        )}
        {transactionType === 'transfer' && (
          <>
            <Row style={row}>
              <Column style={label}>Montant :</Column>
              <Column style={value}>
                {orderData.amount || 0} {orderData.from_currency || 'USDT'}
              </Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Destinataire :</Column>
              <Column style={value}>{orderData.recipient_name || 'N/A'}</Column>
            </Row>
            <Row style={row}>
              <Column style={label}>Pays de destination :</Column>
              <Column style={value}>{orderData.recipient_country || 'N/A'}</Column>
            </Row>
          </>
        )}
      </Section>
      
      <Text style={text}>
        {transactionType === 'transfer' 
          ? 'Votre transfert international est maintenant en cours de traitement. Nous procédons à l\'envoi des fonds vers le destinataire.'
          : 'Votre transaction est maintenant en cours de finalisation. Nous procédons au transfert des USDT vers votre portefeuille.'
        }
      </Text>
      
      <Text style={text}>
        Vous recevrez une notification dès que la transaction sera terminée.
      </Text>
      
      <Text style={text}>
        Merci de faire confiance à Terex pour vos {transactionType === 'transfer' ? 'transferts internationaux' : 'échanges USDT'} !
      </Text>
    </BaseEmail>
  );
};

const text = {
  color: '#ffffff',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const confirmationSection = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#065f46',
  borderRadius: '8px',
  margin: '24px 0',
};

const confirmationText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
};

const orderDetails = {
  backgroundColor: '#2a2a2a',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const row = {
  marginBottom: '12px',
};

const label = {
  color: '#888888',
  fontSize: '14px',
  width: '40%',
  verticalAlign: 'top' as const,
};

const value = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};
