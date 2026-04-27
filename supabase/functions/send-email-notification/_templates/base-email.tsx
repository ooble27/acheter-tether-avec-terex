
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
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BaseEmailProps {
  preview: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_DARK = '#2E7873';
const TEREX_DARK = '#0F1411';
const LOGO_URL = 'https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png';

export const BaseEmail = ({ preview, title, subtitle, children }: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header avec identité Terex */}
          <Section style={header}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td style={logoCell}>
                    <Img src={LOGO_URL} alt="Terex" width="32" height="32" style={logoImg} />
                  </td>
                  <td style={brandCell}>
                    <Text style={brandName}>TEREX</Text>
                    <Text style={brandTagline}>Teranga Exchange</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Bande accent verte */}
          <div style={accentBar} />

          {/* Titre principal */}
          <Section style={titleSection}>
            <Heading style={titleStyle}>{title}</Heading>
            {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
          </Section>

          {/* Contenu */}
          <Section style={contentSection}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />

            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td style={footerCol}>
                    <Text style={footerColTitle}>Support</Text>
                    <Text style={footerText}>terangaexchange@gmail.com</Text>
                    <Text style={footerText}>WhatsApp : +1 418 261 9091</Text>
                  </td>
                  <td style={footerCol}>
                    <Text style={footerColTitle}>Plateforme</Text>
                    <Link href="https://terangaexchange.com" style={footerLink}>
                      terangaexchange.com
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>

            <Hr style={footerDivider} />

            <Text style={legalText}>
              Terex — Plateforme d'échange USDT et transferts internationaux.
            </Text>
            <Text style={copyrightText}>
              © {new Date().getFullYear()} Teranga Exchange. Tous droits réservés.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

/* — Styles — */

const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  margin: '0',
  padding: '24px 0',
  backgroundColor: '#f5f7f6',
  color: '#0F1411',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 4px 16px rgba(15, 20, 17, 0.08)',
};

const header = {
  backgroundColor: TEREX_DARK,
  padding: '24px 32px',
};

const logoCell = {
  width: '40px',
  verticalAlign: 'middle' as const,
  paddingRight: '12px',
};

const logoImg = {
  display: 'block',
  borderRadius: '6px',
};

const brandCell = {
  verticalAlign: 'middle' as const,
};

const brandName = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700' as const,
  margin: '0',
  letterSpacing: '2px',
  lineHeight: '1.2',
};

const brandTagline = {
  color: '#94a3b8',
  fontSize: '11px',
  margin: '2px 0 0 0',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
};

const accentBar = {
  height: '3px',
  backgroundColor: TEREX_GREEN,
};

const titleSection = {
  padding: '32px 32px 0 32px',
};

const titleStyle = {
  color: '#0F1411',
  fontSize: '24px',
  fontWeight: '700' as const,
  margin: '0 0 8px 0',
  lineHeight: '1.3',
  letterSpacing: '-0.4px',
};

const subtitleStyle = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.5',
};

const contentSection = {
  padding: '24px 32px 32px 32px',
};

const footer = {
  backgroundColor: '#fafbfa',
  padding: '24px 32px 28px 32px',
  borderTop: '1px solid #eef0ef',
};

const footerDivider = {
  borderColor: '#e5e7e6',
  margin: '0 0 18px 0',
  borderWidth: '1px',
};

const footerCol = {
  width: '50%',
  verticalAlign: 'top' as const,
  padding: '4px 0',
};

const footerColTitle = {
  color: '#0F1411',
  fontSize: '12px',
  fontWeight: '700' as const,
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const footerText = {
  color: '#64748b',
  fontSize: '13px',
  margin: '3px 0',
  lineHeight: '1.5',
};

const footerLink = {
  color: TEREX_GREEN,
  fontSize: '13px',
  textDecoration: 'none',
  fontWeight: '500' as const,
};

const legalText = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '8px 0 4px 0',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const copyrightText = {
  color: '#94a3b8',
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
};
