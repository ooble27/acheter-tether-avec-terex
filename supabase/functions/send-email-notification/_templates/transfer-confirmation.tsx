
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
      <div style={iconContainer}>
        <div style={transferIcon}>🌍</div>
      </div>
      
      <Text style={greeting}>
        Excellent !
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre demande de transfert international. 
        Voici les détails de votre transfert :
      </Text>
      
      <Section style={transferCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            💸 Détails du transfert
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Numéro de transfert :</Column>
            <Column style={value}>#TEREX-{transferData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant :</Column>
            <Column style={valueHighlight}>
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
            <Column style={totalAmount}>
              {transferData.total_amount || 0} {transferData.to_currency || 'N/A'}
            </Column>
          </Row>
        </div>
      </Section>
      
      <Section style={recipientCard}>
        <div style={recipientHeader}>
          <Text style={recipientTitle}>
            👤 Informations du destinataire
          </Text>
        </div>
        
        <div style={cardContent}>
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
            <Column style={countryValue}>{transferData.recipient_country || 'N/A'}</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={statusCard}>
        <Text style={statusTitle}>
          📊 Statut du transfert
        </Text>
        <Text style={statusText}>
          Votre demande de transfert est en attente de traitement. Notre équipe va examiner 
          votre demande et vous contacter pour les étapes de paiement.
        </Text>
      </Section>
      
      <Text style={text}>
        Vous recevrez une notification dès que votre transfert sera traité par notre équipe.
      </Text>
      
      <Text style={thankYou}>
        🌟 Merci de faire confiance à Terex pour vos transferts internationaux !
      </Text>
    </BaseEmail>
  );
};

// Styles améliorés
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const transferIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
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

const transferCard = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const cardHeader = {
  backgroundColor: '#4299e1',
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

const recipientCard = {
  backgroundColor: '#f0fff4',
  border: '1px solid #9ae6b4',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const recipientHeader = {
  backgroundColor: '#48bb78',
  padding: '16px 20px',
};

const recipientTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
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
  color: '#4299e1',
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const totalAmount = {
  color: '#48bb78',
  fontSize: '16px',
  fontWeight: '700',
  width: '60%',
};

const countryValue = {
  color: '#48bb78',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const statusCard = {
  backgroundColor: '#fef5e7',
  border: '1px solid #f6e05e',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statusTitle = {
  color: '#744210',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const statusText = {
  color: '#975a16',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};

const thankYou = {
  color: '#48bb78',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
