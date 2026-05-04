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
  /** Titre principal — le dernier mot peut être mis en accent vert via highlightTitle */
  title: string;
  /** Mot/expression du titre à colorer en vert Terex (doit être présent dans title) */
  highlightTitle?: string;
  /** Sous-titre court sous le titre, dans le hero */
  subtitle?: string;
  /** Salutation au-dessus du contenu — ex: "Bonjour 👋" */
  greeting?: string;
  /** Phrase d'introduction sous la salutation */
  intro?: string;
  /** URL absolue d'illustration optionnelle dans le hero (à droite) */
  heroImageUrl?: string;
  /** Texte alternatif de l'image hero */
  heroImageAlt?: string;
  /** Bloc principal */
  children: React.ReactNode;
  /** Désactive le bloc "Besoin d'aide ?" en bas */
  hideHelpBlock?: boolean;
  /** Texte de l'aide (par défaut : Notre équipe est disponible 24/7) */
  helpText?: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const SITE_URL = 'https://terangaexchange.com';

/**
 * Layout email Terex 2026 : hero sombre + illustration + footer riche.
 * Inspiré directement de la maquette transmise par le founder (mai 2026).
 */
export const BaseEmail = ({
  preview,
  title,
  highlightTitle,
  subtitle,
  greeting,
  intro,
  heroImageUrl,
  heroImageAlt = 'Illustration Terex',
  children,
  hideHelpBlock,
  helpText = "Notre équipe est disponible 24/7 pour vous accompagner.",
}: BaseEmailProps) => {
  // Titre formaté : on coupe la chaîne pour mettre en accent vert le mot "highlightTitle"
  const renderTitle = () => {
    if (!highlightTitle || !title.includes(highlightTitle)) {
      return <Heading style={titleStyle}>{title}</Heading>;
    }
    const [before, after] = title.split(highlightTitle);
    return (
      <Heading style={titleStyle}>
        {before}
        <span style={titleAccent}>{highlightTitle}</span>
        {after}
      </Heading>
    );
  };

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* ============= HERO sombre avec illustration ============= */}
          <Section style={hero}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={heroTextCell}>
                    <Text style={brandLabel}>Terex</Text>
                    <div style={brandUnderline} />
                    {renderTitle()}
                    {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
                  </td>
                  {heroImageUrl && (
                    <td style={heroImageCell}>
                      <Img
                        src={heroImageUrl}
                        alt={heroImageAlt}
                        width="220"
                        height="220"
                        style={heroImg}
                      />
                    </td>
                  )}
                </tr>
              </tbody>
            </table>
          </Section>

          {/* ============= Bloc salutation / intro ============= */}
          {(greeting || intro) && (
            <Section style={greetingSection}>
              {greeting && <Heading style={greetingStyle}>{greeting}</Heading>}
              {intro && <Text style={introStyle}>{intro}</Text>}
            </Section>
          )}

          {/* ============= Contenu principal ============= */}
          <Section style={contentSection}>{children}</Section>

          {/* ============= Bloc "Besoin d'aide ?" — dark, mobile friendly ============= */}
          {!hideHelpBlock && (
            <Section style={helpSection}>
              <div style={helpIconWrap}>
                <div style={helpIcon}><span style={helpIconText}>?</span></div>
              </div>
              <Text style={helpTitle}>Besoin d'aide&nbsp;?</Text>
              <Text style={helpDescription}>{helpText}</Text>
              <Link href={`${SITE_URL}/contact`} style={helpButton}>
                Nous contacter →
              </Link>
            </Section>
          )}

          {/* ============= Footer riche ============= */}
          <Section style={footer}>
            <Hr style={footerDivider} />

            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td style={footerColLeft}>
                    <Text style={footerBrand}>Terex</Text>
                    <Text style={footerTagline}>
                      La manière la plus simple<br />d'acheter et de vendre des USDT.
                    </Text>
                  </td>
                  <td style={footerColCenter}>
                    <Link href={`${SITE_URL}/help`} style={footerLink}>
                      Centre d'aide →
                    </Link>
                    <br />
                    <Link href={`${SITE_URL}/terms`} style={footerLink}>
                      Conditions d'utilisation →
                    </Link>
                    <br />
                    <Link href={`${SITE_URL}/contact`} style={footerLink}>
                      Nous contacter →
                    </Link>
                  </td>
                  <td style={footerColRight}>
                    <div style={securityBadge}>
                      <Text style={securityBadgeTitle}>🔒 Sécurisé</Text>
                      <Text style={securityBadgeText}>
                        Vos transactions<br />sont 100% sécurisées
                      </Text>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <Hr style={footerDivider} />

            <Text style={copyrightText}>
              © {new Date().getFullYear()} Terex — Teranga Exchange. Tous droits réservés.
            </Text>
            <Text style={legalText}>
              Vous recevez cet email car vous êtes inscrit sur Terex.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

/* =================== STYLES =================== */

const main = {
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  margin: '0',
  padding: '24px 0',
  backgroundColor: '#f5f7f6',
  color: TEREX_DARK,
};

const container = {
  maxWidth: '640px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(15, 20, 17, 0.08)',
};

/* ===== Hero ===== */

const hero = {
  backgroundColor: TEREX_DARK,
  padding: '36px 36px 32px 36px',
};

const heroTextCell = {
  verticalAlign: 'middle' as const,
  width: '60%',
  paddingRight: '12px',
};

const heroImageCell = {
  verticalAlign: 'middle' as const,
  width: '40%',
  textAlign: 'right' as const,
};

const heroImg = {
  display: 'block',
  marginLeft: 'auto',
  borderRadius: '8px',
  maxWidth: '100%',
  height: 'auto',
};

const brandLabel = {
  color: TEREX_GREEN,
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0',
  letterSpacing: '0.5px',
  lineHeight: '1.2',
};

const brandUnderline = {
  width: '32px',
  height: '2px',
  backgroundColor: TEREX_GREEN,
  margin: '8px 0 20px 0',
};

const titleStyle = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  lineHeight: '1.15',
  letterSpacing: '-0.6px',
};

const titleAccent = {
  color: TEREX_GREEN,
};

const subtitleStyle = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.55',
};

/* ===== Greeting ===== */

const greetingSection = {
  padding: '32px 36px 0 36px',
};

const greetingStyle = {
  color: TEREX_DARK,
  fontSize: '20px',
  fontWeight: '700' as const,
  margin: '0 0 8px 0',
  lineHeight: '1.3',
};

const introStyle = {
  color: TEREX_DARK,
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
  fontWeight: '500' as const,
};

/* ===== Content ===== */

const contentSection = {
  padding: '24px 36px 8px 36px',
};

/* ===== Help block — dark, centered, mobile-safe ===== */

const helpSection = {
  margin: '8px 36px 28px 36px',
  backgroundColor: TEREX_DARK,
  borderRadius: '14px',
  padding: '24px 22px',
  textAlign: 'center' as const,
};

const helpIconWrap = {
  textAlign: 'center' as const,
  marginBottom: '12px',
};

const helpIcon = {
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: 'rgba(59, 150, 143, 0.18)',
  border: `1.5px solid ${TEREX_GREEN}`,
  textAlign: 'center' as const,
  lineHeight: '42px',
  margin: '0 auto',
};

const helpIconText = {
  color: TEREX_GREEN,
  fontSize: '20px',
  fontWeight: '700' as const,
  lineHeight: '42px',
};

const helpTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '700' as const,
  margin: '0 0 6px 0',
  lineHeight: '1.2',
  textAlign: 'center' as const,
};

const helpDescription = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0 0 16px 0',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const helpButton = {
  display: 'inline-block',
  backgroundColor: TEREX_GREEN,
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600' as const,
  padding: '10px 16px',
  borderRadius: '10px',
  textDecoration: 'none',
};

/* ===== Footer ===== */

const footer = {
  padding: '8px 36px 28px 36px',
};

const footerDivider = {
  borderColor: TEREX_BORDER,
  margin: '12px 0 18px 0',
  borderWidth: '1px',
};

const footerColLeft = {
  width: '40%',
  verticalAlign: 'top' as const,
  paddingRight: '12px',
};

const footerColCenter = {
  width: '35%',
  verticalAlign: 'top' as const,
  paddingRight: '12px',
};

const footerColRight = {
  width: '25%',
  verticalAlign: 'top' as const,
};

const footerBrand = {
  color: TEREX_GREEN,
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0 0 6px 0',
  letterSpacing: '0.3px',
};

const footerTagline = {
  color: TEREX_MUTED,
  fontSize: '11px',
  lineHeight: '1.5',
  margin: '0',
};

const footerLink = {
  color: TEREX_DARK,
  fontSize: '12px',
  textDecoration: 'none',
  fontWeight: '500' as const,
  lineHeight: '2',
};

const securityBadge = {
  border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '10px',
  padding: '12px',
  textAlign: 'center' as const,
  backgroundColor: '#fafbfa',
};

const securityBadgeTitle = {
  color: TEREX_DARK,
  fontSize: '12px',
  fontWeight: '700' as const,
  margin: '0 0 4px 0',
};

const securityBadgeText = {
  color: TEREX_MUTED,
  fontSize: '10px',
  margin: '0',
  lineHeight: '1.4',
};

const copyrightText = {
  color: TEREX_MUTED,
  fontSize: '11px',
  margin: '0',
  textAlign: 'center' as const,
  lineHeight: '1.5',
};

const legalText = {
  color: '#94a3b8',
  fontSize: '10px',
  margin: '4px 0 0 0',
  textAlign: 'center' as const,
};
