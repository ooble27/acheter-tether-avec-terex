
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
      <Text style={text}>
        Bonjour,
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre commande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT. 
        Voici les détails de votre transaction :
      </Text>
      
      <Section style={orderDetails}>
        <Row style={row}>
          <Column style={label}>Numéro de commande :</Column>
          <Column style={value}>#{orderData.id?.slice(-8) || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Type :</Column>
          <Column style={value}>{transactionType === 'buy' ? 'Achat USDT' : 'Vente USDT'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Montant :</Column>
          <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>USDT :</Column>
          <Column style={value}>{orderData.usdt_amount || 0} USDT</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Taux de change :</Column>
          <Column style={value}>{orderData.exchange_rate || 0} CFA/USDT</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Statut :</Column>
          <Column style={value}>En attente de traitement</Column>
        </Row>
      </Section>
      
      <Text style={text}>
        {transactionType === 'buy' 
          ? 'Veuillez effectuer le paiement selon les instructions qui vous seront communiquées.' 
          : 'Veuillez préparer vos USDT pour le transfert selon les instructions qui vous seront communiquées.'
        }
      </Text>
      
      <Text style={text}>
        Vous recevrez une notification dès que votre commande sera traitée par notre équipe.
      </Text>
      
      <Text style={text}>
        Merci de faire confiance à Terex !
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
