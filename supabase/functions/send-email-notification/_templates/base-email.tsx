
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
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BaseEmailProps {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export const BaseEmail = ({ preview, title, children }: BaseEmailProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header avec branding */}
        <Section style={header}>
          <Heading style={h1}>
            <span style={brandName}>Terex</span>
          </Heading>
          <Text style={tagline}>Plateforme d'échange USDT et transferts internationaux</Text>
        </Section>
        
        {/* Contenu principal */}
        <Section style={content}>
          <Heading style={h2}>{title}</Heading>
          {children}
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

// Styles cohérents avec le nouveau design
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
  background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
  color: '#ffffff',
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

const h2 = {
  color: '#1a202c',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  lineHeight: '1.3',
  textAlign: 'center' as const,
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
