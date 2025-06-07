
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
          {/* Header avec logo et titre */}
          <Section style={header}>
            <div style={logoSection}>
              <div style={logoCircle}>
                <span style={logoText}>T</span>
              </div>
              <div style={brandInfo}>
                <Text style={brandName}>TEREX</Text>
                <Text style={brandTagline}>Échanges crypto & Transferts internationaux</Text>
              </div>
            </div>
            <Heading style={titleStyle}>{title}</Heading>
          </Section>

          {/* Contenu principal */}
          <Section style={contentSection}>
            {children}
          </Section>

          {/* Ligne de séparation */}
          <Hr style={separator} />

          {/* Footer complet */}
          <Section style={footer}>
            <div style={footerContent}>
              {/* Section contact */}
              <div style={contactSection}>
                <Text style={footerTitle}>📞 Support Client 24h/7j</Text>
                <div style={contactGrid}>
                  <div style={contactItem}>
                    <Text style={contactLabel}>Email Support</Text>
                    <Link href="mailto:terangaexchange@gmail.com" style={contactLink}>
                      terangaexchange@gmail.com
                    </Link>
                  </div>
                  <div style={contactItem}>
                    <Text style={contactLabel}>Téléphone Sénégal</Text>
                    <Link href="tel:+221773972749" style={contactLink}>
                      +221 77 397 27 49
                    </Link>
                  </div>
                  <div style={contactItem}>
                    <Text style={contactLabel}>WhatsApp</Text>
                    <Link href="https://wa.me/14182619091" style={contactLink}>
                      +1 418 261 9091
                    </Link>
                  </div>
                  <div style={contactItem}>
                    <Text style={contactLabel}>Email Fondateur</Text>
                    <Link href="mailto:lomohamed834@gmail.com" style={contactLink}>
                      lomohamed834@gmail.com
                    </Link>
                  </div>
                </div>
              </div>

              {/* Section plateforme */}
              <div style={platformSection}>
                <Text style={footerTitle}>🚀 Accédez à votre compte</Text>
                <Text style={platformText}>
                  Suivez vos transactions en temps réel sur la plateforme Terex
                </Text>
                <Link href="https://app.terangaexchange.com" style={platformButton}>
                  Ouvrir la plateforme Terex
                </Link>
              </div>

              {/* Section sécurité */}
              <div style={securitySection}>
                <Text style={footerTitle}>🔒 Sécurité & Conformité</Text>
                <Text style={securityText}>
                  • Cryptage SSL 256-bit pour toutes les transactions{'\n'}
                  • Portefeuilles multi-signatures sécurisés{'\n'}
                  • Surveillance 24h/7j des opérations{'\n'}
                  • Conformité aux réglementations internationales
                </Text>
              </div>

              {/* Informations légales */}
              <div style={legalSection}>
                <Text style={legalText}>
                  <strong>Terex</strong> - Plateforme d'échange de cryptomonnaies et de transferts internationaux
                </Text>
                <Text style={legalText}>
                  Fondé par Mohamed Lo • Basé au Sénégal, Dakar
                </Text>
                <Text style={legalText}>
                  Terex facilite vos échanges USDT et vos transferts d'argent vers l'Afrique de l'Ouest
                </Text>
                <div style={legalLinks}>
                  <Link href="https://app.terangaexchange.com/terms" style={legalLink}>
                    Conditions d'utilisation
                  </Link>
                  <span style={linkSeparator}>•</span>
                  <Link href="https://app.terangaexchange.com/privacy" style={legalLink}>
                    Politique de confidentialité
                  </Link>
                  <span style={linkSeparator}>•</span>
                  <Link href="https://app.terangaexchange.com/security" style={legalLink}>
                    Politique de sécurité
                  </Link>
                </div>
              </div>

              {/* Copyright */}
              <div style={copyrightSection}>
                <Text style={copyrightText}>
                  © 2024 Terex. Tous droits réservés.
                </Text>
                <Text style={copyrightText}>
                  Votre partenaire de confiance pour les échanges crypto et transferts internationaux.
                </Text>
              </div>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles modernes et professionnels
const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: '0',
  padding: '0',
  backgroundColor: '#0d1117', // Fond sombre comme GitHub/Gmail dark
};

const container = {
  maxWidth: '680px',
  margin: '0 auto',
  backgroundColor: '#161b22',
  borderRadius: '0',
  overflow: 'hidden',
};

const header = {
  backgroundColor: '#21262d',
  padding: '32px 40px',
  borderBottom: '1px solid #30363d',
};

const logoSection = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '24px',
  gap: '16px',
};

const logoCircle = {
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: '0',
};

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '900',
  letterSpacing: '1px',
};

const brandInfo = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
};

const brandName = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  letterSpacing: '2px',
};

const brandTagline = {
  color: '#8b949e',
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.2',
  textAlign: 'center' as const,
};

const contentSection = {
  padding: '40px 40px 32px',
  backgroundColor: '#161b22',
};

const separator = {
  borderColor: '#30363d',
  margin: '0',
};

const footer = {
  backgroundColor: '#0d1117',
  padding: '40px',
  borderTop: '1px solid #21262d',
};

const footerContent = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '32px',
};

const contactSection = {
  marginBottom: '24px',
};

const footerTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 16px 0',
};

const contactGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '16px',
  marginTop: '12px',
};

const contactItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '4px',
};

const contactLabel = {
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const contactLink = {
  color: '#58a6ff',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  margin: '0',
};

const platformSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const platformText = {
  color: '#8b949e',
  fontSize: '14px',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
};

const platformButton = {
  display: 'inline-block',
  backgroundColor: '#3B968F',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '8px',
  transition: 'background-color 0.2s',
};

const securitySection = {
  marginBottom: '24px',
};

const securityText = {
  color: '#8b949e',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const legalSection = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const legalText = {
  color: '#6e7681',
  fontSize: '12px',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
};

const legalLinks = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  marginTop: '12px',
  flexWrap: 'wrap' as const,
};

const legalLink = {
  color: '#58a6ff',
  fontSize: '12px',
  textDecoration: 'none',
};

const linkSeparator = {
  color: '#6e7681',
  fontSize: '12px',
};

const copyrightSection = {
  textAlign: 'center' as const,
  borderTop: '1px solid #21262d',
  paddingTop: '20px',
};

const copyrightText = {
  color: '#6e7681',
  fontSize: '11px',
  margin: '0 0 4px 0',
  lineHeight: '1.4',
};
