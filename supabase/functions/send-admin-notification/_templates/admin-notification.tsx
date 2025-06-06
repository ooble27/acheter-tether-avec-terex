
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
  Preview,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface AdminNotificationEmailProps {
  notificationType: 'new_order' | 'kyc_submission' | 'status_update';
  data: any;
}

export const AdminNotificationEmail = ({ notificationType, data }: AdminNotificationEmailProps) => {
  const getPreviewText = () => {
    switch (notificationType) {
      case 'new_order':
        return `Nouvelle commande ${data.type} - ${data.amount} ${data.currency}`;
      case 'kyc_submission':
        return `Vérification KYC en attente - ${data.firstName} ${data.lastName}`;
      case 'status_update':
        return `Statut mis à jour: ${data.newStatus}`;
      default:
        return 'Notification admin Terex';
    }
  };

  const renderOrderDetails = () => (
    <Section style={section}>
      <Text style={heading}>🛒 Nouvelle Commande</Text>
      <div style={detailBox}>
        <Text style={detail}><strong>Type:</strong> {data.type === 'buy' ? 'Achat USDT' : data.type === 'sell' ? 'Vente USDT' : 'Transfert International'}</Text>
        <Text style={detail}><strong>Montant:</strong> {data.amount?.toLocaleString()} {data.currency}</Text>
        <Text style={detail}><strong>USDT:</strong> {data.usdtAmount} USDT</Text>
        <Text style={detail}><strong>Méthode:</strong> {data.paymentMethod}</Text>
        <Text style={detail}><strong>Statut:</strong> {data.status}</Text>
        <Text style={detail}><strong>ID Commande:</strong> #{data.orderId?.slice(-8)}</Text>
        <Text style={detail}><strong>Date:</strong> {new Date(data.createdAt).toLocaleString('fr-FR')}</Text>
      </div>
      <Button
        href={`https://app.terangaexchange.com`}
        style={button}
      >
        🔗 Gérer la commande
      </Button>
    </Section>
  );

  const renderKYCDetails = () => (
    <Section style={section}>
      <Text style={heading}>🆔 Nouvelle Vérification KYC</Text>
      <div style={detailBox}>
        <Text style={detail}><strong>Nom:</strong> {data.firstName} {data.lastName}</Text>
        <Text style={detail}><strong>Statut:</strong> {data.status}</Text>
        <Text style={detail}><strong>Soumis le:</strong> {new Date(data.submittedAt).toLocaleString('fr-FR')}</Text>
        <Text style={detail}><strong>ID Utilisateur:</strong> {data.userId?.slice(-8)}</Text>
      </div>
      <Button
        href={`https://app.terangaexchange.com`}
        style={button}
      >
        🔍 Examiner KYC
      </Button>
    </Section>
  );

  const renderStatusUpdate = () => (
    <Section style={section}>
      <Text style={heading}>📊 Mise à Jour de Statut</Text>
      <div style={detailBox}>
        <Text style={detail}><strong>Commande:</strong> #{data.orderId?.slice(-8)}</Text>
        <Text style={detail}><strong>Type:</strong> {data.type}</Text>
        <Text style={detail}><strong>Ancien statut:</strong> {data.oldStatus}</Text>
        <Text style={detail}><strong>Nouveau statut:</strong> {data.newStatus}</Text>
        <Text style={detail}><strong>Montant:</strong> {data.amount} {data.currency}</Text>
      </div>
    </Section>
  );

  return (
    <Html>
      <Head />
      <Preview>{getPreviewText()}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <div style={logo}>TEREX ADMIN</div>
            <Text style={headerText}>Notification Administrateur</Text>
          </div>
          
          <div style={content}>
            {notificationType === 'new_order' && renderOrderDetails()}
            {notificationType === 'kyc_submission' && renderKYCDetails()}
            {notificationType === 'status_update' && renderStatusUpdate()}
          </div>

          <div style={footer}>
            <Text style={footerText}>
              📧 admin@terangaexchange.com | 📞 +221 77 397 27 49
            </Text>
            <Text style={footerText}>
              💬 WhatsApp: +1 4182619091
            </Text>
          </div>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: '0',
  padding: '0',
  backgroundColor: '#0f0f0f',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#1a1a1a',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
};

const header = {
  background: 'linear-gradient(135deg, #DC2626 0%, #EF4444 50%, #B91C1C 100%)',
  padding: '30px',
  textAlign: 'center' as const,
};

const logo = {
  fontSize: '28px',
  fontWeight: '900',
  color: '#ffffff',
  letterSpacing: '2px',
  marginBottom: '10px',
};

const headerText = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '30px',
};

const section = {
  marginBottom: '25px',
};

const heading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#ffffff',
  margin: '0 0 15px 0',
};

const detailBox = {
  backgroundColor: '#2a2a2a',
  padding: '20px',
  borderRadius: '12px',
  border: '1px solid #333333',
  marginBottom: '20px',
};

const detail = {
  color: '#cccccc',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
};

const button = {
  backgroundColor: '#3B968F',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '14px',
  display: 'inline-block',
};

const footer = {
  backgroundColor: '#0f0f0f',
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#888888',
  fontSize: '12px',
  margin: '5px 0',
};
