
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Section,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface FastMagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
  type: string;
}

export const FastMagicLinkEmail = ({ magicLink, userEmail, type }: FastMagicLinkEmailProps) => {
  const isSignup = type === 'signup';
  
  return (
    <Html>
      <Head />
      <Preview>{isSignup ? 'Activez votre compte Terex' : 'Connectez-vous à Terex'}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header simple et rapide */}
          <Section style={header}>
            <div style={logoContainer}>
              <Text style={logoText}>T</Text>
            </div>
            <Heading style={h1}>Terex</Heading>
            <Text style={tagline}>
              {isSignup ? 'Bienvenue sur Terex !' : 'Connexion rapide'}
            </Text>
          </Section>
          
          {/* Contenu principal optimisé */}
          <Section style={content}>
            <Heading style={h2}>
              {isSignup ? 'Activez votre compte' : 'Connectez-vous'}
            </Heading>
            
            <Text style={text}>
              {isSignup 
                ? `Votre compte Terex est prêt ! Cliquez sur le bouton ci-dessous pour l'activer et commencer à échanger vos USDT.`
                : `Cliquez sur le bouton ci-dessous pour vous connecter instantanément à votre compte Terex.`
              }
            </Text>
            
            {/* Bouton principal */}
            <Section style={buttonContainer}>
              <Button style={button} href={magicLink}>
                {isSignup ? '✅ Activer mon compte' : '🚀 Se connecter'}
              </Button>
            </Section>
            
            {/* Info sécurité simplifiée */}
            <Text style={securityText}>
              ⏰ Ce lien est valable 10 minutes
            </Text>
          </Section>
          
          {/* Footer minimal */}
          <Section style={footer}>
            <Text style={footerText}>
              Terex - Votre plateforme USDT de confiance
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles optimisés et allégés
const main = {
  backgroundColor: '#141414',
  fontFamily: 'Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  backgroundColor: '#1e1e1e',
  borderRadius: '12px',
};

const header = {
  textAlign: 'center' as const,
  padding: '20px 0',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  borderRadius: '8px',
  marginBottom: '30px',
};

const logoContainer = {
  width: '50px',
  height: '50px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 15px',
};

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 10px',
};

const tagline = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
};

const content = {
  padding: '20px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 20px',
};

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '1.5',
  margin: '0 0 25px',
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
  padding: '15px 30px',
  display: 'inline-block',
};

const securityText = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '20px 0 0',
};

const footer = {
  textAlign: 'center' as const,
  padding: '20px 0',
  borderTop: '1px solid #2A2A2A',
  marginTop: '20px',
};

const footerText = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '0',
};
