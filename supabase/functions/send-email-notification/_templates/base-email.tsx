
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Preview,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BaseEmailProps {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export const BaseEmail = ({ preview, title, children }: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={header}>
            <div style={logoContainer}>
              <div style={logo}>TEREX</div>
            </div>
            <Heading style={heading}>{title}</Heading>
          </div>
          <div style={content}>
            {children}
          </div>
          <div style={footer}>
            <div style={footerBrand}>
              <div style={footerLogo}>TEREX</div>
              <p style={footerText}>
                Votre plateforme de confiance pour les échanges de cryptomonnaies et transferts internationaux
              </p>
            </div>
            <div style={footerContact}>
              <p style={contactInfo}>
                📧 terangaexchange@gmail.com<br/>
                📞 +221 77 397 27 49<br/>
                💬 WhatsApp: +1 4182619091
              </p>
            </div>
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
  backgroundColor: '#0f0f0f', // Fond noir très sombre
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#1a1a1a', // Fond sombre pour le container principal
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
};

const header = {
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 50%, #2d7a73 100%)', // Dégradé Terex
  padding: '40px 30px',
  textAlign: 'center' as const,
  position: 'relative' as const,
  overflow: 'hidden',
};

const logoContainer = {
  marginBottom: '20px',
};

const logo = {
  fontSize: '32px',
  fontWeight: '900',
  color: '#ffffff',
  letterSpacing: '2px',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
};

const heading = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
};

const content = {
  padding: '40px 30px',
  backgroundColor: '#1a1a1a', // Fond sombre pour le contenu
};

const footer = {
  backgroundColor: '#0f0f0f', // Fond très sombre pour le footer
  padding: '30px',
  borderTop: '1px solid #333333',
};

const footerBrand = {
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const footerLogo = {
  fontSize: '20px',
  fontWeight: '900',
  color: '#3B968F',
  letterSpacing: '1px',
  marginBottom: '8px',
};

const footerText = {
  color: '#888888',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const footerContact = {
  textAlign: 'center' as const,
};

const contactInfo = {
  color: '#cccccc',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
};
