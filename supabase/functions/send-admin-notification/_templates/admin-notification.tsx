
import * as React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22';

interface AdminNotificationEmailProps {
  notificationType: string;
  data: any;
}

export const AdminNotificationEmail = ({ notificationType, data }: AdminNotificationEmailProps) => {
  let previewText = '';
  let content = null;

  switch (notificationType) {
    case 'new_order':
      previewText = `Nouvelle commande ${data.type} - ${data.amount} ${data.currency}`;
      content = (
        <>
          <Heading style={h1}>🔔 Nouvelle commande</Heading>
          <Text style={text}>
            Une nouvelle commande a été créée :
          </Text>
          <div style={orderBox}>
            <Text style={orderText}><strong>Type :</strong> {data.type === 'buy' ? 'Achat USDT' : data.type === 'sell' ? 'Vente USDT' : 'Transfert International'}</Text>
            <Text style={orderText}><strong>Montant :</strong> {data.amount} {data.currency}</Text>
            <Text style={orderText}><strong>USDT :</strong> {data.usdt_amount || 'N/A'}</Text>
            <Text style={orderText}><strong>Méthode de paiement :</strong> {data.payment_method}</Text>
            <Text style={orderText}><strong>Réseau :</strong> {data.network || 'N/A'}</Text>
            <Text style={orderText}><strong>Statut :</strong> {data.status}</Text>
          </div>
        </>
      );
      break;

    case 'kyc_submission':
      previewText = `Nouvelle vérification KYC - ${data.firstName} ${data.lastName}`;
      content = (
        <>
          <Heading style={h1}>🆔 Nouvelle vérification KYC</Heading>
          <Text style={text}>
            Une nouvelle demande de vérification KYC a été soumise :
          </Text>
          <div style={orderBox}>
            <Text style={orderText}><strong>Nom :</strong> {data.firstName} {data.lastName}</Text>
            <Text style={orderText}><strong>Email :</strong> {data.email}</Text>
            <Text style={orderText}><strong>Téléphone :</strong> {data.phone}</Text>
            <Text style={orderText}><strong>Date de naissance :</strong> {data.dateOfBirth}</Text>
            <Text style={orderText}><strong>Nationalité :</strong> {data.nationality}</Text>
            <Text style={orderText}><strong>Type de document :</strong> {data.documentType}</Text>
          </div>
        </>
      );
      break;

    case 'high_volume_request':
      previewText = `Demande de gros volume - ${data.clientInfo?.firstName} ${data.clientInfo?.lastName}`;
      content = (
        <>
          <Heading style={h1}>💰 Demande de gros volume</Heading>
          <Text style={text}>
            Une nouvelle demande de gros volume a été reçue :
          </Text>
          <div style={orderBox}>
            <Text style={orderText}><strong>Client :</strong> {data.clientInfo?.firstName} {data.clientInfo?.lastName}</Text>
            <Text style={orderText}><strong>Email :</strong> {data.clientInfo?.email}</Text>
            <Text style={orderText}><strong>Téléphone :</strong> {data.clientInfo?.phone}</Text>
            <Text style={orderText}><strong>Montant souhaité :</strong> {data.clientInfo?.amount} CFA</Text>
            <Text style={orderText}><strong>Objectif :</strong> {data.clientInfo?.purpose}</Text>
            {data.clientInfo?.additionalInfo && (
              <Text style={orderText}><strong>Informations complémentaires :</strong> {data.clientInfo?.additionalInfo}</Text>
            )}
          </div>
          <Text style={text}>
            <strong>Action requise :</strong> Contactez le client soit par appel soit par email pour discuter des conditions.
          </Text>
        </>
      );
      break;

    case 'status_update':
      previewText = `Mise à jour commande #${data.orderId?.slice(-8)} - ${data.newStatus}`;
      content = (
        <>
          <Heading style={h1}>📊 Mise à jour de commande</Heading>
          <Text style={text}>
            Le statut d'une commande a été mis à jour :
          </Text>
          <div style={orderBox}>
            <Text style={orderText}><strong>ID Commande :</strong> #{data.orderId?.slice(-8)}</Text>
            <Text style={orderText}><strong>Nouveau statut :</strong> {data.newStatus}</Text>
            <Text style={orderText}><strong>Ancien statut :</strong> {data.oldStatus}</Text>
          </div>
        </>
      );
      break;

    default:
      previewText = 'Notification admin';
      content = (
        <>
          <Heading style={h1}>📧 Notification</Heading>
          <Text style={text}>Une nouvelle notification a été générée.</Text>
        </>
      );
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {content}
          <Text style={footer}>
            <Link href="https://terangaexchange.com" target="_blank" style={{...link, color: '#898989'}}>
              Terex - Terang Exchange
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '14px',
  margin: '24px 0',
  lineHeight: '1.5',
};

const orderBox = {
  backgroundColor: '#f9f9f9',
  border: '1px solid #eee',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const orderText = {
  color: '#333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.4',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '22px',
  marginTop: '12px',
  marginBottom: '24px',
};
