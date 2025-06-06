
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '📊';
    }
  };

  const title = `Mise à jour de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}`;
  const preview = `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été mise à jour`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <div style={iconContainer}>
        <div style={updateIcon}>📢</div>
      </div>
      
      <Text style={greeting}>
        Mise à jour importante !
      </Text>
      
      <Text style={text}>
        Le statut de votre {transactionType === 'transfer' ? 'transfert international' : 'commande'} a été mis à jour.
      </Text>
      
      <Section style={statusBanner}>
        <div style={statusContent}>
          <div style={statusIconLarge}>
            {getStatusIcon(orderData.status)}
          </div>
          <div>
            <Text style={statusLabel}>Nouveau statut :</Text>
            <Text style={{...statusValue, color: getStatusColor(orderData.status)}}>
              {getStatusText(orderData.status)}
            </Text>
          </div>
        </div>
      </Section>
      
      <Section style={orderCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            📋 Détails de la transaction
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
          
          {transactionType !== 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Type :</Column>
                <Column style={valueHighlight}>
                  {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>USDT :</Column>
                <Column style={usdtAmount}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
            </>
          )}
          
          {transactionType === 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Montant :</Column>
                <Column style={valueHighlight}>
                  {orderData.amount || 0} {orderData.from_currency || 'USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Destinataire :</Column>
                <Column style={value}>{orderData.recipient_name || 'N/A'}</Column>
              </Row>
            </>
          )}
        </div>
      </Section>
      
      {orderData.status === 'completed' && (
        <Section style={celebrationCard}>
          <div style={celebrationHeader}>
            <div style={celebrationIcon}>🎉</div>
            <Text style={celebrationTitle}>
              Félicitations !
            </Text>
          </div>
          <Text style={celebrationText}>
            Votre {transactionType === 'transfer' ? 'transfert' : 'transaction'} a été effectuée avec succès.
            {transactionType === 'transfer' 
              ? ' Les fonds ont été envoyés au destinataire.' 
              : ' Vos USDT sont maintenant disponibles dans votre portefeuille.'
            }
          </Text>
        </Section>
      )}
      
      {orderData.status === 'processing' && (
        <Section style={processingCard}>
          <Text style={processingTitle}>
            ⏳ Traitement en cours
          </Text>
          <Text style={processingText}>
            Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} est en cours de traitement. 
            Notre équipe travaille activement sur votre demande.
          </Text>
          
          <div style={progressContainer}>
            <div style={progressBar}>
              <div style={progressFill}></div>
            </div>
            <Text style={progressText}>Traitement en cours...</Text>
          </div>
        </Section>
      )}
      
      {orderData.status === 'cancelled' && (
        <Section style={cancelledCard}>
          <Text style={cancelledTitle}>
            ❌ Transaction annulée
          </Text>
          <Text style={cancelledText}>
            Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} a été annulée. 
            Si vous avez des questions, n'hésitez pas à contacter notre support.
          </Text>
        </Section>
      )}
      
      <Text style={text}>
        Merci de faire confiance à Terex !
      </Text>
    </BaseEmail>
  );
};

// Styles améliorés
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const updateIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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

const statusBanner = {
  backgroundColor: '#f7fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const statusContent = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const statusIconLarge = {
  fontSize: '32px',
};

const statusLabel = {
  color: '#718096',
  fontSize: '14px',
  margin: '0 0 4px',
  fontWeight: '500',
};

const statusValue = {
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
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
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

// Cards pour différents statuts
const celebrationCard = {
  backgroundColor: '#f0fff4',
  border: '2px solid #9ae6b4',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const celebrationHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '16px',
};

const celebrationIcon = {
  fontSize: '32px',
};

const celebrationTitle = {
  color: '#22543d',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
};

const celebrationText = {
  color: '#22543d',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0',
};

const processingCard = {
  backgroundColor: '#fef5e7',
  border: '1px solid #f6e05e',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const processingTitle = {
  color: '#744210',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const processingText = {
  color: '#975a16',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 16px',
};

const progressContainer = {
  textAlign: 'center' as const,
};

const progressBar = {
  width: '100%',
  height: '6px',
  backgroundColor: '#e2e8f0',
  borderRadius: '3px',
  overflow: 'hidden',
  margin: '0 0 8px',
};

const progressFill = {
  width: '60%',
  height: '100%',
  background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
  borderRadius: '3px',
  animation: 'pulse 2s infinite',
};

const progressText = {
  color: '#975a16',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
};

const cancelledCard = {
  backgroundColor: '#fed7d7',
  border: '1px solid #fc8181',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const cancelledTitle = {
  color: '#c53030',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const cancelledText = {
  color: '#c53030',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
};
