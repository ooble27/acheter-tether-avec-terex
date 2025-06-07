import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Preview,
  Section,
  Text,
  Link,
  Hr,
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
          {/* Header simple */}
          <Section style={header}>
            <Text style={brandName}>TEREX</Text>
            <Heading style={titleStyle}>{title}</Heading>
          </Section>

          {/* Contenu principal */}
          <Section style={contentSection}>
            {children}
          </Section>

          {/* Footer avec toutes les informations */}
          <Section style={footer}>
            <Hr style={separator} />
            
            {/* Support client */}
            <Text style={footerTitle}>📞 Support Client 24h/7j</Text>
            <Text style={contactText}>📧 terangaexchange@gmail.com</Text>
            <Text style={contactText}>📱 +221 77 397 27 49</Text>
            <Text style={contactText}>💬 WhatsApp : +1 418 261 9091</Text>
            <Text style={contactText}>👨‍💼 lomohamed834@gmail.com</Text>
            
            <Text style={footerTitle}>🚀 Accédez à votre compte</Text>
            <Link href="https://app.terangaexchange.com" style={platformLink}>
              Ouvrir la plateforme Terex →
            </Link>

            <Text style={footerTitle}>🔒 Sécurité & Conformité</Text>
            <Text style={securityText}>
              • Cryptage SSL 256-bit{'\n'}
              • Portefeuilles multi-signatures{'\n'}
              • Surveillance 24h/7j{'\n'}
              • Conformité réglementaire internationale
            </Text>

            {/* Informations légales */}
            <Text style={legalText}>
              <strong>Terex</strong> - Plateforme d'échange crypto et transferts internationaux
            </Text>
            <Text style={legalText}>
              Fondé par Mohamed Lo • Basé au Sénégal, Dakar
            </Text>
            <Text style={copyrightText}>
              © 2025 Terex. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles avec largeur augmentée
const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  margin: '0',
  padding: '20px 0',
  backgroundColor: '#f4f4f4',
  color: '#333333',
};

const container = {
  maxWidth: '700px', // Augmenté de 600px à 700px
  margin: '0 auto',
  backgroundColor: '#ffffff',
  padding: '40px',
};

const header = {
  marginBottom: '30px',
  textAlign: 'center' as const,
};

const brandName = {
  color: '#2563eb',
  fontSize: '28px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  letterSpacing: '2px',
};

const titleStyle = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.3',
};

const contentSection = {
  marginBottom: '40px',
};

const footer = {
  borderTop: '2px solid #e5e7eb',
  paddingTop: '30px',
  marginTop: '40px',
};

const separator = {
  borderColor: '#e5e7eb',
  margin: '0 0 20px 0',
};

const footerTitle = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  margin: '20px 0 8px 0',
};

const contactText = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0',
  fontWeight: '400',
};

const platformLink = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0',
};

const securityText = {
  color: '#666666',
  fontSize: '13px',
  margin: '8px 0',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const,
};

const legalText = {
  color: '#888888',
  fontSize: '12px',
  margin: '15px 0 5px 0',
  lineHeight: '1.4',
  textAlign: 'center' as const,
};

const legalLinks = {
  margin: '10px 0',
  textAlign: 'center' as const,
};

const legalLink = {
  color: '#2563eb',
  fontSize: '12px',
  textDecoration: 'none',
};

const linkSeparator = {
  color: '#888888',
  fontSize: '12px',
};

const copyrightText = {
  color: '#999999',
  fontSize: '11px',
  margin: '10px 0 0 0',
  lineHeight: '1.4',
  textAlign: 'center' as const,
};
