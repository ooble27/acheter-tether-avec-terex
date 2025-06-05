
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
  Img,
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
        <Section style={header}>
          <Img
            src="https://app.terangaexchange.com/placeholder.svg"
            width="50"
            height="50"
            alt="Terex"
            style={logo}
          />
          <Heading style={h1}>
            <span style={brandName}>Terex</span>
          </Heading>
          <Text style={tagline}>Plateforme d'échange USDT et transferts internationaux</Text>
        </Section>
        
        <Section style={content}>
          <Heading style={h2}>{title}</Heading>
          {children}
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
  backgroundColor: '#0a0a0a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
  padding: '20px',
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
};

const logo = {
  margin: '0 auto 16px',
};

const h1 = {
  color: '#ffffff',
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
  color: '#888888',
  fontSize: '14px',
  margin: '8px 0 0',
};

const content = {
  backgroundColor: '#1a1a1a',
  padding: '32px',
  borderRadius: '12px',
  marginBottom: '24px',
};

const h2 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 24px',
  lineHeight: '1.3',
};

const hr = {
  borderColor: '#333333',
  margin: '20px 0',
};

const footer = {
  textAlign: 'center' as const,
  color: '#666666',
};

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.4',
  margin: '0 0 12px',
};

const footerLinks = {
  color: '#666666',
  fontSize: '12px',
  margin: '0',
};

const link = {
  color: '#667eea',
  textDecoration: 'none',
};
