
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Hr,
  Link,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface MagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
}

export const MagicLinkEmail = ({ magicLink, userEmail }: MagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Votre lien de connexion sécurisé pour Terex</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>
            <span style={brandName}>Terex</span>
          </Heading>
          <Text style={tagline}>Votre plateforme d'échange USDT de confiance</Text>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>Connexion sécurisée</Heading>
          
          <Text style={text}>
            Bonjour,
          </Text>
          
          <Text style={text}>
            Vous avez demandé à vous connecter à votre compte Terex avec l'adresse <strong>{userEmail}</strong>.
          </Text>
          
          <Text style={text}>
            Cliquez sur le bouton ci-dessous pour vous connecter automatiquement :
          </Text>
          
          <Section style={buttonContainer}>
            <Button pY={12} pX={24} style={button} href={magicLink}>
              Se connecter à Terex
            </Button>
          </Section>
          
          <Text style={smallText}>
            Ce lien de connexion est valable pendant <strong>10 minutes</strong> pour votre sécurité.
          </Text>
          
          <Hr style={hr} />
          
          <Text style={smallText}>
            Si vous n'avez pas demandé cette connexion, ignorez simplement cet email.
            Votre compte reste sécurisé.
          </Text>
          
          <Text style={smallText}>
            <strong>Astuce :</strong> Ajoutez noreply@terangaexchange.com à vos contacts 
            pour éviter que nos emails arrivent dans les spams.
          </Text>
        </Section>
        
        <Hr style={hr} />
        
        <Section style={footer}>
          <Text style={footerText}>
            Cet email a été envoyé par <strong>Terex</strong><br />
            Votre plateforme de confiance pour les échanges USDT
          </Text>
          <Text style={footerLinks}>
            <Link href="https://app.terangaexchange.com" style={link}>
              Accéder à la plateforme
            </Link>
            {' | '}
            <Link href="mailto:support@terangaexchange.com" style={link}>
              Support client
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
};

const h1 = {
  color: '#1a202c',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
};

const brandName = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const tagline = {
  color: '#64748b',
  fontSize: '14px',
  margin: '8px 0 0',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '32px',
  borderRadius: '12px',
  marginBottom: '24px',
  border: '1px solid #e2e8f0',
};

const h2 = {
  color: '#1a202c',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px',
  lineHeight: '1.3',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const smallText = {
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 12px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  lineHeight: '1.5',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '20px 0',
};

const footer = {
  textAlign: 'center' as const,
  color: '#9ca3af',
};

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '0 0 12px',
};

const footerLinks = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
};
