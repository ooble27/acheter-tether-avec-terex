
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
          {/* Header simple avec logo et titre */}
          <Section style={header}>
            <div style={logoContainer}>
              <div style={logoCircle}>
                <span style={logoText}>T</span>
              </div>
              <Text style={brandName}>TEREX</Text>
            </div>
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
            <div style={footerBlock}>
              <Text style={footerTitle}>📞 Support Client 24h/7j</Text>
              <div style={contactGrid}>
                <Text style={contactText}>📧 terangaexchange@gmail.com</Text>
                <Text style={contactText}>📱 +221 77 397 27 49</Text>
                <Text style={contactText}>💬 WhatsApp : +1 418 261 9091</Text>
                <Text style={contactText}>👨‍💼 lomohamed834@gmail.com</Text>
              </div>
            </div>

            {/* Accès plateforme */}
            <div style={footerBlock}>
              <Text style={footerTitle}>🚀 Accédez à votre compte</Text>
              <Link href="https://app.terangaexchange.com" style={platformLink}>
                Ouvrir la plateforme Terex →
              </Link>
            </div>

            {/* Sécurité */}
            <div style={footerBlock}>
              <Text style={footerTitle}>🔒 Sécurité & Conformité</Text>
              <Text style={securityText}>
                • Cryptage SSL 256-bit{'\n'}
                • Portefeuilles multi-signatures{'\n'}
                • Surveillance 24h/7j{'\n'}
                • Conformité réglementaire internationale
              </Text>
            </div>

            {/* Informations légales */}
            <div style={legalBlock}>
              <Text style={legalText}>
                <strong>Terex</strong> - Plateforme d'échange crypto et transferts internationaux
              </Text>
              <Text style={legalText}>
                Fondé par Mohamed Lo • Basé au Sénégal, Dakar
              </Text>
              <div style={legalLinks}>
                <Link href="https://app.terangaexchange.com/terms" style={legalLink}>Conditions</Link>
                <span style={linkSeparator}> • </span>
                <Link href="https://app.terangaexchange.com/privacy" style={legalLink}>Confidentialité</Link>
                <span style={linkSeparator}> • </span>
                <Link href="https://app.terangaexchange.com/security" style={legalLink}>Sécurité</Link>
              </div>
              <Text style={copyrightText}>
                © 2024 Terex. Tous droits réservés.
              </Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles modernes avec couleurs Terex
const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  margin: '0',
  padding: '20px 0',
  backgroundColor: 'transparent',
  color: '#ffffff',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: 'transparent',
};

const header = {
  marginBottom: '32px',
  textAlign: 'center' as const,
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '20px',
};

const logoCircle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '900',
  letterSpacing: '1px',
};

const brandName = {
  color: '#3B968F',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '2px',
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.3',
};

const contentSection = {
  marginBottom: '40px',
};

const footer = {
  borderTop: '1px solid #3B968F',
  paddingTop: '32px',
};

const separator = {
  borderColor: '#3B968F',
  margin: '0 0 24px 0',
};

const footerBlock = {
  marginBottom: '24px',
};

const footerTitle = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const contactGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
};

const contactText = {
  color: '#e0e0e0',
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
};

const platformLink = {
  color: '#3B968F',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  padding: '12px 24px',
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  borderRadius: '8px',
  border: '1px solid #3B968F',
};

const securityText = {
  color: '#e0e0e0',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const,
};

const legalBlock = {
  textAlign: 'center' as const,
  marginTop: '32px',
  paddingTop: '20px',
  borderTop: '1px solid rgba(59, 150, 143, 0.3)',
};

const legalText = {
  color: '#b0b0b0',
  fontSize: '12px',
  margin: '0 0 8px 0',
  lineHeight: '1.4',
};

const legalLinks = {
  margin: '12px 0',
};

const legalLink = {
  color: '#3B968F',
  fontSize: '12px',
  textDecoration: 'none',
};

const linkSeparator = {
  color: '#b0b0b0',
  fontSize: '12px',
};

const copyrightText = {
  color: '#888888',
  fontSize: '11px',
  margin: '12px 0 0 0',
  lineHeight: '1.4',
};
