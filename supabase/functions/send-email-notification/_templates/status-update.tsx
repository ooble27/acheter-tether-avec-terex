
import {
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
}

export const StatusUpdateEmail = ({ orderData, transactionType }: StatusUpdateProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'En cours de traitement';
      case 'completed':
        return 'Terminée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#f59e0b';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const title = `Mise à jour de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}`;
  const preview = `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été mise à jour`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <Text style={text}>
        Bonjour,
      </Text>
      
      <Text style={text}>
        Le statut de votre {transactionType === 'transfer' ? 'transfert international' : 'commande'} a été mis à jour.
      </Text>
      
      <Section style={statusSection}>
        <Text style={statusLabel}>Nouveau statut :</Text>
        <Text style={{...statusValue, color: getStatusColor(orderData.status)}}>
          {getStatusText(orderData.status)}
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
              <Column style={label}>USDT :</Column>
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
          </>
        )}
      </Section>
      
      {orderData.status === 'completed' && (
        <Text style={successText}>
          🎉 Félicitations ! Votre {transactionType === 'transfer' ? 'transfert' : 'transaction'} a été effectuée avec succès.
        </Text>
      )}
      
      {orderData.status === 'processing' && (
        <Text style={text}>
          Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} est en cours de traitement. 
          Vous serez notifié dès qu'elle sera finalisée.
        </Text>
      )}
      
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

const statusSection = {
  textAlign: 'center' as const,
  padding: '24px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  margin: '24px 0',
};

const statusLabel = {
  color: '#888888',
  fontSize: '14px',
  margin: '0 0 8px',
};

const statusValue = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const successText = {
  color: '#10b981',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '24px 0',
  textAlign: 'center' as const,
  fontWeight: '600',
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
