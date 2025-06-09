
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

interface FastMagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
  region: string;
}

export const FastMagicLinkEmail = ({ magicLink, userEmail, region }: FastMagicLinkEmailProps) => (
  <Html>
    <Head />
    <Preview>Connexion rapide à Terex - Lien valide 5 minutes</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header minimal et optimisé */}
        <Section style={header}>
          <Heading style={h1}>
            <span style={brandName}>TEREX</span>
          </Heading>
          <Text style={tagline}>Connexion Express</Text>
        </Section>
        
        {/* Contenu ultra-léger */}
        <Section style={content}>
          <Text style={greeting}>
            Connexion rapide pour {userEmail}
          </Text>
          
          {/* Bouton de connexion optimisé */}
          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              🚀 Se connecter maintenant
            </Button>
          </Section>
          
          {/* Informations importantes */}
          <Section style={timeInfo}>
            <Text style={timeText}>
              ⏰ <strong>Lien valide 5 minutes</strong> pour votre sécurité
            </Text>
            {region.includes('africa') || region.includes('AF') ? (
              <Text style={regionText}>
                📍 Optimisé pour l'Afrique - Réception ultra-rapide
              </Text>
            ) : null}
          </Section>
          
          <Hr style={hr} />
          
          <Text style={disclaimerText}>
            Si vous n'avez pas demandé cette connexion, ignorez cet email.
          </Text>
        </Section>
        
        {/* Footer minimal */}
        <Section style={footer}>
          <Text style={footerText}>
            <strong>Terex</strong> - Plateforme d'échange USDT
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles ultra-optimisés et légers
const main = {
  backgroundColor: '#141414',
  fontFamily: 'Arial, sans-serif', // Police système rapide
  margin: '0',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  maxWidth: '500px', // Plus petit pour chargement rapide
  backgroundColor: '#1e1e1e',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '1px solid #2A2A2A',
};

const header = {
  textAlign: 'center' as const,
  padding: '30px 20px 20px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  color: '#ffffff',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 5px',
  lineHeight: '1.2',
};

const brandName = {
  letterSpacing: '1px',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
};

const content = {
  padding: '30px 20px',
  backgroundColor: '#1e1e1e',
};

const greeting = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 20px',
  textAlign: 'center' as const,
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '25px 0',
};

const button = {
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  lineHeight: '1.4',
  padding: '14px 28px',
  border: 'none',
};

const timeInfo = {
  backgroundColor: '#2A2A2A',
  border: '1px solid #3B968F',
  borderRadius: '6px',
  padding: '15px',
  margin: '20px 0',
  textAlign: 'center' as const,
};

const timeText = {
  color: '#3B968F',
  fontSize: '13px',
  margin: '0 0 8px',
  fontWeight: '500',
};

const regionText = {
  color: '#4BA89F',
  fontSize: '12px',
  margin: '0',
  fontWeight: '400',
};

const disclaimerText = {
  color: '#94a3b8',
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '0',
  textAlign: 'center' as const,
};

const hr = {
  borderColor: '#2A2A2A',
  margin: '15px 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '15px 20px',
  backgroundColor: '#2A2A2A',
};

const footerText = {
  color: '#ffffff',
  fontSize: '12px',
  margin: '0',
};
