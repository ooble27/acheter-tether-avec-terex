import {
  Html,
  Head,
  Body,
  Container,
  Preview,
  Section,
  Text,
  Link,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

const FORCE_DARK_CSS = `
/* ── Force dark theme ── */
:root { color-scheme: dark; }
body, html {
  background-color: #141414 !important;
  color: #fafafa !important;
  margin: 0 !important;
  padding: 0 !important;
}
/* Override light mode — keep email always dark */
@media (prefers-color-scheme: light) {
  body, html { background-color: #141414 !important; }
  .t-bg    { background-color: #141414 !important; }
  .t-card  { background-color: #141414 !important; border-color: #1f1f23 !important; }
  .t-bar   { background-color: #0e0e0e !important; border-color: #1f1f23 !important; }
  .t-row   { background-color: #1a1a1a !important; }
  .t-foot  { background-color: #0e0e0e !important; }
  .t-infocard { background-color: #0e0e0e !important; border-color: #1f1f23 !important; }
  .t-text  { color: #fafafa !important; }
  .t-muted { color: #71717a !important; }
  .t-dim   { color: #3f3f46 !important; }
  .t-green { color: #3B968F !important; }
}
/* ── Mobile responsive ── */
@media only screen and (max-width: 620px) {
  .t-card  { border-radius: 0 !important; }
  .t-hero  { padding: 28px 16px 22px !important; }
  .t-body  { padding-left: 16px !important; padding-right: 16px !important; }
  .t-section { padding-left: 16px !important; padding-right: 16px !important; }
  .t-infocard { margin-left: 16px !important; margin-right: 16px !important; }
  .t-notice { margin-left: 16px !important; margin-right: 16px !important; }
  .t-btn-wrap { padding-left: 16px !important; padding-right: 16px !important; }
  .t-h1   { font-size: 20px !important; }
  .t-otp  { font-size: 28px !important; letter-spacing: 6px !important; }
  .t-stat-col { display: block !important; width: 100% !important; border-right: none !important; border-bottom: 1px solid #1f1f23 !important; }
  .t-stat-last { border-bottom: none !important; }
  .t-inforow td { padding: 10px 14px !important; }
  .t-topbar { padding: 14px 16px !important; }
  .t-foot  { padding: 20px 16px !important; }
  .t-ref   { font-size: 9px !important; }
}
`;


// Palette Terex — moodboard dark premium (zinc + Tether green)
export const TEREX = {
  green: '#3B968F',
  greenDark: '#2d726c',
  greenBg: '#0b1f1e',
  pageBg: '#050507',
  bg: '#0e0e0e',
  surface: '#141414',
  surface2: '#1a1a1a',
  border: '#1f1f23',
  borderSoft: '#111111',
  text: '#fafafa',
  textMuted: '#71717a',
  textDim: '#3f3f46',
  white: '#ffffff',
  red: '#f87171',
  amber: '#fbbf24',
  blue: '#60a5fa',
};

const LOGO_URL = 'https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png';

interface BaseEmailProps {
  preview: string;
  /** Right-side text in the top bar (status pill text or right meta). */
  topRight?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Wrapper minimaliste : enveloppe la page + carte + footer commun.
 * Chaque template fournit son propre hero / contenu.
 */
export const BaseEmail = ({ preview, topRight, children }: BaseEmailProps) => (
  <Html lang="fr">
    <Head>
      <meta name="color-scheme" content="dark" />
      <meta name="supported-color-schemes" content="dark" />
      <style dangerouslySetInnerHTML={{ __html: FORCE_DARK_CSS }} />
    </Head>
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={card} className="t-card">
        {/* TOP BAR */}
        <Section style={topBar} className="t-topbar t-bg">
          <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={brandCell}>
                  <table cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ paddingRight: '10px', verticalAlign: 'middle' }}>
                          <Img src={LOGO_URL} alt="Terex" width="22" height="22" style={{ display: 'block', borderRadius: '4px' }} />
                        </td>
                        <td style={{ verticalAlign: 'middle' }}>
                          <Text style={brandText} className="t-green">TEREX</Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={topRightCell}>
                  {typeof topRight === 'string' || typeof topRight === 'number' ? (
                    <Text style={topRightText} className="t-dim">{topRight}</Text>
                  ) : (topRight ?? <Text style={topRightText} className="t-dim">terangaexchange.com</Text>)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* CONTENU SPÉCIFIQUE */}
        {children}

        {/* FOOTER */}
        <Hr style={footerDivider} />
        <Section style={footer} className="t-foot t-bar">
          <Text style={footerLogo} className="t-dim">TEREX</Text>
          <Text style={footerText} className="t-dim">
            Vous avez reçu cet email suite à une activité sur votre compte Terex.
          </Text>
          <Text style={footerText} className="t-dim">
            © {new Date().getFullYear()} Teranga Exchange — Tous droits réservés.
          </Text>
          <Text style={footerLinks}>
            <Link href="https://terangaexchange.com/privacy" style={footerLink} className="t-dim">Confidentialité</Link>
            <span style={footerSep}> · </span>
            <Link href="https://terangaexchange.com/help" style={footerLink} className="t-dim">Centre d'aide</Link>
            <span style={footerSep}> · </span>
            <Link href="https://terangaexchange.com" style={footerLink} className="t-dim">terangaexchange.com</Link>
          </Text>
        </Section>
      </Container>
      <div style={{ height: '32px' }} />
    </Body>
  </Html>
);

/* — Atomes réutilisables exportés pour les templates — */

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={sectionLabelStyle} className="t-section t-dim">{children}</Text>
);

export const InfoTable: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <Section style={infoCard} className="t-infocard">
    {title && <Text style={infoHead} className="t-dim">{title}</Text>}
    {children}
  </Section>
);

export const InfoRow: React.FC<{
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  green?: boolean;
  big?: boolean;
  last?: boolean;
}> = ({ label, value, mono, green, big, last }) => {
  const valueStyle: React.CSSProperties = {
    color: green ? TEREX.green : TEREX.text,
    fontSize: big ? '15px' : '12px',
    fontWeight: big ? 700 : 500,
    margin: 0,
    fontFamily: mono
      ? 'ui-monospace, SFMono-Regular, Menlo, monospace'
      : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    textAlign: 'right',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
  };
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      className="t-inforow"
      style={{
        borderCollapse: 'collapse',
        borderBottom: last ? 'none' : `1px solid ${TEREX.borderSoft}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '12px 16px', verticalAlign: 'middle', width: '40%' }}>
            <Text style={infoLabel} className="t-muted">{label}</Text>
          </td>
          <td style={{ padding: '12px 16px', verticalAlign: 'middle' }}>
            <Text style={valueStyle} className={green ? 't-green' : 't-text'}>{value}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const PrimaryButton: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Section style={{ textAlign: 'center', padding: '0 28px 36px' }} className="t-btn-wrap">
    <Link href={href} style={primaryBtn}>
      {children}
    </Link>
  </Section>
);

export const NoticeBox: React.FC<{ children: React.ReactNode; tone?: 'neutral' | 'warning' | 'success' | 'danger' }> = ({
  children,
  tone = 'neutral',
}) => {
  const toneStyle: React.CSSProperties = (() => {
    switch (tone) {
      case 'success':
        return { background: TEREX.greenBg, borderColor: 'rgba(59,150,143,0.25)', color: TEREX.text };
      case 'warning':
        return { background: '#1f1a08', borderColor: '#3a2f0f', color: '#f4d77a' };
      case 'danger':
        return { background: '#1f0d0e', borderColor: '#3a1517', color: '#fca5a5' };
      default:
        return { background: TEREX.surface2, borderColor: TEREX.border, color: TEREX.textMuted };
    }
  })();
  return (
    <Section
      className="t-notice"
      style={{
        padding: '14px 18px',
        margin: '0 28px 28px',
        borderRadius: '8px',
        border: `1px solid ${toneStyle.borderColor}`,
        backgroundColor: toneStyle.background as string,
      }}
    >
      <Text style={{ fontSize: '12px', lineHeight: '1.7', margin: 0, color: toneStyle.color as string }}>
        {children}
      </Text>
    </Section>
  );
};

/* — Styles — */

const main: React.CSSProperties = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  margin: 0,
  padding: 0,
  backgroundColor: TEREX.surface,
  color: TEREX.text,
};

const card: React.CSSProperties = {
  maxWidth: '680px',
  width: '100%',
  margin: '0 auto',
  backgroundColor: TEREX.surface,
  borderRadius: '0',
  overflow: 'hidden',
};

const topBar: React.CSSProperties = {
  padding: '18px 28px',
  backgroundColor: TEREX.surface,
  borderBottom: `1px solid ${TEREX.borderSoft}`,
};

const brandCell: React.CSSProperties = { verticalAlign: 'middle', width: '50%' };
const topRightCell: React.CSSProperties = { verticalAlign: 'middle', textAlign: 'right' };

const brandText: React.CSSProperties = {
  color: TEREX.green,
  fontSize: '13px',
  fontWeight: 700,
  letterSpacing: '4px',
  margin: 0,
  lineHeight: 1,
};

const topRightText: React.CSSProperties = {
  color: TEREX.textDim,
  fontSize: '11px',
  margin: 0,
};

const sectionLabelStyle: React.CSSProperties = {
  color: TEREX.textDim,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  margin: '0 28px 12px',
};

const infoCard: React.CSSProperties = {
  margin: '0 28px 28px',
  background: TEREX.bg,
  border: `1px solid ${TEREX.border}`,
  borderRadius: '10px',
  overflow: 'hidden',
};

const infoHead: React.CSSProperties = {
  padding: '12px 20px',
  borderBottom: `1px solid ${TEREX.borderSoft}`,
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '1.8px',
  textTransform: 'uppercase',
  color: TEREX.textDim,
  margin: 0,
};

const infoLabel: React.CSSProperties = {
  color: TEREX.textMuted,
  fontSize: '12px',
  margin: 0,
};

const primaryBtn: React.CSSProperties = {
  display: 'inline-block',
  background: TEREX.green,
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 600,
  padding: '13px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  letterSpacing: '0.2px',
};

const footerDivider: React.CSSProperties = {
  borderColor: TEREX.borderSoft,
  margin: 0,
  borderWidth: '1px',
};

const footer: React.CSSProperties = {
  padding: '24px 28px',
  backgroundColor: TEREX.bg,
};

const footerLogo: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '3px',
  color: TEREX.textDim,
  margin: '0 0 14px',
};

const footerText: React.CSSProperties = {
  fontSize: '11px',
  color: TEREX.textDim,
  lineHeight: 1.8,
  margin: '0 0 4px',
};

const footerLinks: React.CSSProperties = {
  fontSize: '11px',
  margin: '14px 0 0',
};

const footerLink: React.CSSProperties = {
  color: TEREX.textDim,
  textDecoration: 'none',
};

const footerSep: React.CSSProperties = { color: TEREX.textDim };

/* — Helpers Hero / Status Pill exportés — */

export const Hero: React.FC<{
  eyebrow?: string;
  reference?: string;
  title: React.ReactNode;
  date?: string;
  subtitle?: React.ReactNode;
  iconRing?: React.ReactNode;
}> = ({ eyebrow, reference, title, date, subtitle, iconRing }) => (
  <Section style={{ padding: '40px 28px 32px', backgroundColor: TEREX.surface }} className="t-hero t-bg">
    {iconRing && <div style={{ marginBottom: '24px' }}>{iconRing}</div>}
    {eyebrow && (
      <Text
        style={{
          color: TEREX.green,
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          margin: '0 0 18px',
        }}
      >
        {eyebrow}
      </Text>
    )}
    {reference && (
      <Text
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          fontSize: '10px',
          color: TEREX.textDim,
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          margin: '0 0 14px',
        }}
      >
        {reference}
      </Text>
    )}
    <Text
      style={{
        fontSize: '24px',
        fontWeight: 600,
        color: TEREX.text,
        lineHeight: 1.3,
        margin: '0 0 8px',
        letterSpacing: '-0.3px',
      }}
    >
      {title}
    </Text>
    {date && <Text style={{ fontSize: '12px', color: TEREX.textDim, margin: 0 }}>{date}</Text>}
    {subtitle && (
      <Text style={{ fontSize: '14px', color: TEREX.textMuted, lineHeight: 1.7, margin: '10px 0 0' }}>
        {subtitle}
      </Text>
    )}
  </Section>
);

export const StatusPill: React.FC<{ label: string; tone?: 'success' | 'warning' | 'danger' | 'neutral' }> = ({
  label,
  tone = 'success',
}) => {
  const map = {
    success: { color: TEREX.green, bg: TEREX.greenBg, border: 'rgba(38,161,123,0.25)' },
    warning: { color: TEREX.amber, bg: '#1f1a08', border: '#3a2f0f' },
    danger: { color: TEREX.red, bg: '#1f0d0e', border: '#3a1517' },
    neutral: { color: TEREX.textMuted, bg: TEREX.surface2, border: TEREX.border },
  }[tone];
  return (
    <span
      style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '1.5px',
        textTransform: 'uppercase',
        color: map.color,
        background: map.bg,
        padding: '3px 10px',
        borderRadius: '20px',
        border: `1px solid ${map.border}`,
      }}
    >
      {label}
    </span>
  );
};

export const CheckRing: React.FC = () => (
  <table cellPadding={0} cellSpacing={0} role="presentation">
    <tbody>
      <tr>
        <td
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: `1.5px solid ${TEREX.green}`,
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '52px',
            color: TEREX.green,
            fontSize: '24px',
            fontWeight: 700,
          }}
        >
          ✓
        </td>
      </tr>
    </tbody>
  </table>
);

export const SummaryBar: React.FC<{
  cols: { label: string; value: React.ReactNode; sub?: string; green?: boolean }[];
}> = ({ cols }) => (
  <Section
    className="t-bar"
    style={{
      background: TEREX.bg,
      borderTop: `1px solid ${TEREX.border}`,
      borderBottom: `1px solid ${TEREX.border}`,
    }}
  >
    <table width="100%" cellPadding={0} cellSpacing={0} role="presentation" style={{ borderCollapse: 'collapse' }}>
      <tbody>
        <tr>
          {cols.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <td style={{ width: '1px', background: TEREX.border }} />}
              <td
                className={`t-stat-col${i === cols.length - 1 ? ' t-stat-last' : ''}`}
                style={{ padding: '18px 16px', verticalAlign: 'top', width: `${100 / cols.length}%` }}
              >
                <Text
                  className="t-dim"
                  style={{
                    fontSize: '9px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: TEREX.textDim,
                    margin: '0 0 6px',
                  }}
                >
                  {c.label}
                </Text>
                <Text
                  className={c.green ? 't-green' : 't-text'}
                  style={{
                    fontSize: '17px',
                    fontWeight: 600,
                    color: c.green ? TEREX.green : TEREX.text,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {c.value}
                </Text>
                {c.sub && (
                  <Text className="t-dim" style={{ fontSize: '10px', color: TEREX.textDim, margin: '3px 0 0' }}>{c.sub}</Text>
                )}
              </td>
            </React.Fragment>
          ))}
        </tr>
      </tbody>
    </table>
  </Section>
);
