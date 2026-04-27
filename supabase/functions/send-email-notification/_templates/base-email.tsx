
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
  greeting?: string; // ex: "Bonjour Mohamed,"
  children: React.ReactNode;
}

// Palette Terex — version premium dark (inspirée Desjardins / Stripe / Linear)
export const TEREX = {
  green: '#3B968F',
  greenDark: '#2E7873',
  greenSoft: '#1F2D2C',
  bg: '#0F1411',          // fond principal (page)
  surface: '#161D1B',     // carte / container
  surfaceAlt: '#1B2422',  // surface secondaire / détails
  border: '#243029',      // bordure subtile
  borderSoft: '#1F2926',
  text: '#F1F5F4',
  textSoft: '#B8C2BF',
  textMuted: '#7C8783',
  white: '#ffffff',
  accentYellow: '#E8C547',
  accentRed: '#E5484D',
};

const LOGO_URL = 'https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png';

export const BaseEmail = ({ preview, title, subtitle, greeting, children }: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Top bar / brand */}
          <Section style={topBar}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td style={logoCell}>
                    <Img src={LOGO_URL} alt="Terex" width="28" height="28" style={logoImg} />
                  </td>
                  <td style={brandCell}>
                    <Text style={brandName}>TEREX</Text>
                  </td>
                  <td style={brandRightCell}>
                    <Text style={brandTagline}>Teranga Exchange</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Accent bar */}
          <div style={accentBar} />

          {/* Hero — salutation + titre */}
          <Section style={heroSection}>
            {greeting && <Text style={greetingStyle}>{greeting}</Text>}
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
                    <Text style={footerText}>WhatsApp · +1 418 261 9091</Text>
                  </td>
                  <td style={footerColRight}>
                    <Text style={footerColTitle}>Plateforme</Text>
                    <Link href="https://terangaexchange.com" style={footerLink}>
                      terangaexchange.com
                    </Link>
                    <Link href="https://terangaexchange.com/dashboard" style={footerLink}>
                      Mon tableau de bord
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

        {/* Spacer external */}
        <div style={{ height: '32px' }} />
      </Body>
    </Html>
  );
};

/* — Styles — */

const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  margin: '0',
  padding: '32px 12px',
  backgroundColor: TEREX.bg,
  color: TEREX.text,
};

const container = {
  maxWidth: '620px',
  margin: '0 auto',
  backgroundColor: TEREX.surface,
  borderRadius: '14px',
  overflow: 'hidden',
  border: `1px solid ${TEREX.border}`,
};

const topBar = {
  backgroundColor: TEREX.bg,
  padding: '20px 32px',
  borderBottom: `1px solid ${TEREX.border}`,
};

const logoCell = {
  width: '36px',
  verticalAlign: 'middle' as const,
  paddingRight: '10px',
};

const logoImg = {
  display: 'block',
  borderRadius: '6px',
};

const brandCell = {
  verticalAlign: 'middle' as const,
};

const brandRightCell = {
  verticalAlign: 'middle' as const,
  textAlign: 'right' as const,
};

const brandName = {
  color: TEREX.white,
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0',
  letterSpacing: '2.5px',
  lineHeight: '1',
};

const brandTagline = {
  color: TEREX.textMuted,
  fontSize: '11px',
  margin: '0',
  letterSpacing: '0.5px',
};

const accentBar = {
  height: '2px',
  backgroundColor: TEREX.green,
};

const heroSection = {
  padding: '36px 32px 8px 32px',
};

const greetingStyle = {
  color: TEREX.textSoft,
  fontSize: '14px',
  margin: '0 0 16px 0',
  fontWeight: '500' as const,
};

const titleStyle = {
  color: TEREX.white,
  fontSize: '26px',
  fontWeight: '700' as const,
  margin: '0 0 12px 0',
  lineHeight: '1.25',
  letterSpacing: '-0.5px',
};

const subtitleStyle = {
  color: TEREX.textSoft,
  fontSize: '15px',
  margin: '0',
  lineHeight: '1.55',
};

const contentSection = {
  padding: '24px 32px 32px 32px',
};

const footer = {
  backgroundColor: TEREX.bg,
  padding: '24px 32px 28px 32px',
  borderTop: `1px solid ${TEREX.border}`,
};

const footerDivider = {
  borderColor: TEREX.border,
  margin: '0 0 18px 0',
  borderWidth: '1px',
};

const footerCol = {
  width: '50%',
  verticalAlign: 'top' as const,
  padding: '4px 0',
};

const footerColRight = {
  width: '50%',
  verticalAlign: 'top' as const,
  padding: '4px 0',
  textAlign: 'right' as const,
};

const footerColTitle = {
  color: TEREX.textMuted,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.8px',
};

const footerText = {
  color: TEREX.textSoft,
  fontSize: '13px',
  margin: '3px 0',
  lineHeight: '1.5',
};

const footerLink = {
  color: TEREX.green,
  fontSize: '13px',
  textDecoration: 'none',
  fontWeight: '500' as const,
  display: 'block',
  margin: '3px 0',
};

const legalText = {
  color: TEREX.textMuted,
  fontSize: '12px',
  margin: '8px 0 4px 0',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const copyrightText = {
  color: TEREX.textMuted,
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
};
