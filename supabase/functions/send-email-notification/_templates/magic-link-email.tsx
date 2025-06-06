
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
  Img,
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
        {/* Header avec logo et branding */}
        <Section style={header}>
          <div style={logoContainer}>
            <div style={logoCircle}>
              <Text style={logoText}>T</Text>
            </div>
          </div>
          <Heading style={h1}>
            <span style={brandName}>Terex</span>
          </Heading>
          <Text style={tagline}>Votre plateforme d'échange USDT de confiance</Text>
        </Section>
        
        {/* Contenu principal */}
        <Section style={content}>
          <div style={iconContainer}>
            <div style={lockIcon}>🔐</div>
          </div>
          
          <Heading style={h2}>Votre lien de connexion</Heading>
          
          <Text style={greeting}>
            Bonjour,
          </Text>
          
          <Text style={text}>
            Vous avez demandé à vous connecter à votre compte Terex avec l'adresse{' '}
            <span style={emailHighlight}>{userEmail}</span>.
          </Text>
          
          <Text style={text}>
            Cliquez sur le bouton ci-dessous pour vous connecter en toute sécurité :
          </Text>
          
          {/* Bouton de connexion stylisé */}
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              <div style={buttonContent}>
                <span style={buttonIcon}>🚀</span>
                <span>Se connecter à Terex</span>
              </div>
            </Button>
          </Section>
          
          {/* Informations de sécurité */}
          <Section style={securityInfo}>
            <Text style={securityText}>
              <span style={warningIcon}>⏰</span>
              Ce lien de connexion est valable pendant <strong>10 minutes</strong> pour votre sécurité.
            </Text>
          </Section>
          
          <Hr style={hr} />
          
          <Text style={disclaimerText}>
            Si vous n'avez pas demandé cette connexion, ignorez simplement cet email.
            Votre compte reste parfaitement sécurisé.
          </Text>
        </Section>
        
        <Hr style={hr} />
        
        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Cet email a été envoyé par <strong>Terex</strong><br />
            Votre plateforme de confiance pour les échanges USDT
          </Text>
          <Text style={footerLinks}>
            <Link href="https://app.terangaexchange.com" style={link}>
              🌐 Accéder à la plateforme
            </Link>
            {' • '}
            <Link href="mailto:support@terangaexchange.com" style={link}>
              💬 Support client
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles améliorés
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 30px 30px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#ffffff',
};

const logoContainer = {
  marginBottom: '20px',
};

const logoCircle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
  border: '2px solid rgba(255, 255, 255, 0.3)',
};

const logoText = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  lineHeight: '1.2',
};

const brandName = {
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
  fontWeight: '400',
};

const content = {
  padding: '40px 30px',
};

const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const lockIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const h2 = {
  color: '#1a202c',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  lineHeight: '1.3',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#2d3748',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const emailHighlight = {
  color: '#667eea',
  fontWeight: '600',
  backgroundColor: '#f7fafc',
  padding: '2px 6px',
  borderRadius: '4px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  lineHeight: '1.5',
  padding: '16px 32px',
  border: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
  transition: 'all 0.2s ease',
};

const buttonContent = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
};

const buttonIcon = {
  fontSize: '18px',
};

const securityInfo = {
  backgroundColor: '#fff5f5',
  border: '1px solid #fed7d7',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const securityText = {
  color: '#c53030',
  fontSize: '14px',
  margin: '0',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: '500',
};

const warningIcon = {
  fontSize: '16px',
};

const disclaimerText = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '30px',
  backgroundColor: '#f7fafc',
};

const footerText = {
  color: '#718096',
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '0 0 16px',
};

const footerLinks = {
  color: '#718096',
  fontSize: '14px',
  margin: '0',
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
  fontWeight: '500',
};
