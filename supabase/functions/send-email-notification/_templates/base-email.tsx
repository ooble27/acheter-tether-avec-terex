
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
        {/* Header avec branding Terex */}
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
  backgroundColor: '#141414', // Terex dark background
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
};

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
  backgroundColor: '#1e1e1e', // Terex darker background
  borderRadius: '16px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
  border: '1px solid #2A2A2A', // Terex gray border
};

const header = {
  textAlign: 'center' as const,
  padding: '40px 30px 30px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)', // Terex accent gradient
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

const h2 = {
  color: '#ffffff', // White text on dark background
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 24px',
  lineHeight: '1.3',
  textAlign: 'center' as const,
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
  color: '#3B968F', // Terex accent color
  textDecoration: 'none',
  fontWeight: '500',
};
