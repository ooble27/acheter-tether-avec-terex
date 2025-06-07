
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
          {/* Header professionnel inspiré d'Interac */}
          <Section style={header}>
            <Container style={headerContainer}>
              <Text style={brandName}>TEREX</Text>
              <Text style={brandSubtitle}>Plateforme d'échange crypto & transferts internationaux</Text>
            </Container>
            <Hr style={headerDivider} />
            <Heading style={titleStyle}>{title}</Heading>
          </Section>

          {/* Contenu principal */}
          <Section style={contentSection}>
            {children}
          </Section>

          {/* Footer professionnel */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            
            {/* Informations de contact */}
            <Container style={contactSection}>
              <Text style={footerTitle}>📞 Support Client 24h/7j</Text>
              <Text style={contactText}>📧 terangaexchange@gmail.com</Text>
              <Text style={contactText}>📱 +221 77 397 27 49</Text>
              <Text style={contactText}>💬 WhatsApp : +1 418 261 9091</Text>
            </Container>
            
            {/* Accès plateforme */}
            <Container style={platformSection}>
              <Text style={footerTitle}>🚀 Accédez à votre compte</Text>
              <Link href="https://app.terangaexchange.com" style={platformLink}>
                Ouvrir la plateforme Terex →
              </Link>
            </Container>

            {/* Sécurité */}
            <Container style={securitySection}>
              <Text style={footerTitle}>🔒 Sécurité & Conformité</Text>
              <Text style={securityText}>
                • Cryptage SSL 256-bit{'\n'}
                • Portefeuilles multi-signatures{'\n'}
                • Surveillance 24h/7j{'\n'}
                • Conformité réglementaire internationale
              </Text>
            </Container>

            {/* Informations légales */}
            <Container style={legalSection}>
              <Text style={legalText}>
                <strong>Terex</strong> - Votre partenaire crypto de confiance
              </Text>
              <Text style={legalText}>
                Fondé par Mohamed Lo • Basé au Sénégal, Dakar
              </Text>
              <Text style={copyrightText}>
                © 2025 Terex. Tous droits réservés.
              </Text>
            </Container>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles inspirés des emails Interac - professionnels et modernes
const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif',
  margin: '0',
  padding: '20px 0',
  backgroundColor: '#f3f4f6',
  color: '#1f2937',
};

const container = {
  maxWidth: '680px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#1e293b',
  padding: '40px 30px',
  textAlign: 'center' as const,
};

const headerContainer = {
  marginBottom: '20px',
};

const brandName = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '800',
  margin: '0 0 8px 0',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
};

const brandSubtitle = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '0',
  fontWeight: '400',
  letterSpacing: '0.5px',
};

const headerDivider = {
  borderColor: '#475569',
  margin: '20px 0',
  borderWidth: '1px',
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.4',
};

const contentSection = {
  padding: '40px 30px',
  backgroundColor: '#ffffff',
};

const footer = {
  backgroundColor: '#f8fafc',
  padding: '30px',
  borderTop: '1px solid #e2e8f0',
};

const footerDivider = {
  borderColor: '#e2e8f0',
  margin: '0 0 25px 0',
  borderWidth: '1px',
};

const contactSection = {
  marginBottom: '25px',
};

const footerTitle = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  letterSpacing: '0.5px',
};

const contactText = {
  color: '#64748b',
  fontSize: '14px',
  margin: '5px 0',
  fontWeight: '400',
};

const platformSection = {
  marginBottom: '25px',
};

const platformLink = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  margin: '8px 0',
  padding: '12px 24px',
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  border: '2px solid #2563eb',
  transition: 'all 0.2s',
};

const securitySection = {
  marginBottom: '25px',
};

const securityText = {
  color: '#64748b',
  fontSize: '13px',
  margin: '8px 0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const legalSection = {
  textAlign: 'center' as const,
  borderTop: '1px solid #e2e8f0',
  paddingTop: '20px',
};

const legalText = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '8px 0',
  lineHeight: '1.4',
};

const copyrightText = {
  color: '#9ca3af',
  fontSize: '11px',
  margin: '15px 0 0 0',
  lineHeight: '1.4',
  fontWeight: '500',
};
