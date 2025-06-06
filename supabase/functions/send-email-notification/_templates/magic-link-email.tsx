
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
        {/* Header avec branding Terex */}
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
            <Link href="mailto:terangaexchange@gmail.com" style={link}>
              💬 Support client
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles avec les couleurs Terex
const main = {
  backgroundColor: '#141414', // Terex dark
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  backgroundColor: '#1e1e1e', // Terex darker
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  border: '1px solid #2A2A2A', // Terex gray
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 30px 30px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)', // Terex gradient
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
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
  fontWeight: '400',
};

const content = {
  padding: '40px 30px',
  backgroundColor: '#1e1e1e', // Terex darker
};

const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const lockIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)', // Terex gradient
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const h2 = {
  color: '#ffffff', // White text on dark background
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  lineHeight: '1.3',
  textAlign: 'center' as const,
};

const greeting = {
  color: '#ffffff', // White text
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
};

const text = {
  color: '#e2e8f0', // Light gray text
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px',
};

const emailHighlight = {
  color: '#3B968F', // Terex accent
  fontWeight: '600',
  backgroundColor: '#2A2A2A', // Terex gray
  padding: '2px 6px',
  borderRadius: '4px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)', // Terex gradient
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
  boxShadow: '0 4px 12px rgba(59, 150, 143, 0.4)', // Terex accent shadow
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
  backgroundColor: '#3a1f1f', // Dark red tint
  border: '1px solid #e53e3e',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
};

const securityText = {
  color: '#feb2b2', // Light red
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
  color: '#94a3b8', // Light gray
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0',
  fontStyle: 'italic',
};

const hr = {
  borderColor: '#2A2A2A', // Terex gray
  margin: '20px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '30px',
  backgroundColor: '#2A2A2A', // Terex gray
};

const footerText = {
  color: '#ffffff', // White text
  fontSize: '14px',
  lineHeight: '1.4',
  margin: '0 0 16px',
};

const footerLinks = {
  color: '#ffffff', // White text
  fontSize: '14px',
  margin: '0',
};

const link = {
  color: '#3B968F', // Terex accent
  textDecoration: 'none',
  fontWeight: '500',
};
