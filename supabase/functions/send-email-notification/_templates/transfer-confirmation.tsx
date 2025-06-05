
import {
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const title = 'Demande de transfert international confirmée';
  const preview = `Votre demande de transfert #${transferData.id?.slice(-8)} a été confirmée`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <Text style={text}>
        Bonjour,
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre demande de transfert international. 
        Voici les détails de votre transfert :
      </Text>
      
      <Section style={transferDetails}>
        <Row style={row}>
          <Column style={label}>Numéro de transfert :</Column>
          <Column style={value}>#TEREX-{transferData.id?.slice(-8) || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Montant :</Column>
          <Column style={value}>
            {transferData.amount || 0} {transferData.from_currency || 'USDT'}
          </Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Devise de destination :</Column>
          <Column style={value}>{transferData.to_currency || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Taux de change :</Column>
          <Column style={value}>{transferData.exchange_rate || 0}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Frais :</Column>
          <Column style={value}>{transferData.fees || 0} {transferData.from_currency || 'USDT'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Montant total :</Column>
          <Column style={value}>
            {transferData.total_amount || 0} {transferData.to_currency || 'N/A'}
          </Column>
        </Row>
      </Section>
      
      <Section style={recipientDetails}>
        <Text style={sectionTitle}>Informations du destinataire :</Text>
        <Row style={row}>
          <Column style={label}>Nom :</Column>
          <Column style={value}>{transferData.recipient_name || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Compte :</Column>
          <Column style={value}>{transferData.recipient_account || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Banque :</Column>
          <Column style={value}>{transferData.recipient_bank || 'N/A'}</Column>
        </Row>
        <Row style={row}>
          <Column style={label}>Pays :</Column>
          <Column style={value}>{transferData.recipient_country || 'N/A'}</Column>
        </Row>
      </Section>
      
      <Text style={text}>
        Votre demande de transfert est en attente de traitement. Notre équipe va examiner 
        votre demande et vous contacter pour les étapes de paiement.
      </Text>
      
      <Text style={text}>
        Vous recevrez une notification dès que votre transfert sera traité par notre équipe.
      </Text>
      
      <Text style={text}>
        Merci de faire confiance à Terex pour vos transferts internationaux !
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

const transferDetails = {
  backgroundColor: '#2a2a2a',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const recipientDetails = {
  backgroundColor: '#1e3a8a',
  padding: '20px',
  borderRadius: '8px',
  margin: '24px 0',
};

const sectionTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
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
