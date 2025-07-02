
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface ContactNotificationEmailProps {
  contactData: {
    user_name: string;
    user_email: string;
    user_phone?: string;
    subject: string;
    message: string;
  };
}

export const ContactNotificationEmail = ({
  contactData,
}: ContactNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Nouveau message de contact de {contactData.user_name}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🔔 Nouveau message de contact</Heading>
        
        <div style={alertBox}>
          <Text style={alertText}>
            Un nouveau message de contact a été reçu sur la plateforme Terex
          </Text>
        </div>

        <div style={section}>
          <Heading style={h2}>Informations du client</Heading>
          <Text style={text}><strong>Nom :</strong> {contactData.user_name}</Text>
          <Text style={text}><strong>Email :</strong> {contactData.user_email}</Text>
          {contactData.user_phone && (
            <Text style={text}><strong>Téléphone :</strong> {contactData.user_phone}</Text>
          )}
        </div>

        <Hr style={hr} />

        <div style={section}>
          <Heading style={h2}>Message</Heading>
          <Text style={text}><strong>Sujet :</strong> {contactData.subject}</Text>
          <div style={messageBox}>
            <Text style={messageText}>{contactData.message}</Text>
          </div>
        </div>

        <Hr style={hr} />

        <div style={footer}>
          <Text style={footerText}>
            Cette notification a été générée automatiquement par la plateforme Terex.<br/>
            Répondez directement à l'adresse email du client : {contactData.user_email}
          </Text>
        </div>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '20px 0 10px 0',
};

const text = {
  color: '#333',
  fontSize: '14px',
  margin: '10px 0',
  lineHeight: '1.6',
};

const alertBox = {
  backgroundColor: '#e3f2fd',
  border: '1px solid #2196f3',
  borderRadius: '8px',
  padding: '16px',
  margin: '20px 0',
};

const alertText = {
  color: '#1976d2',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0',
  textAlign: 'center' as const,
};

const section = {
  padding: '20px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  margin: '20px 0',
};

const messageBox = {
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  padding: '16px',
  margin: '10px 0',
};

const messageText = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#e0e0e0',
  margin: '20px 0',
};

const footer = {
  padding: '20px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#666',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0',
};
