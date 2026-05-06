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

// Palette Terex — moodboard dark premium (zinc + Tether green)
export const TEREX = {
  green: '#26a17b',
  greenDark: '#1a7358',
  greenBg: '#0d1f18',
  pageBg: '#050507',
  bg: '#09090b',
  surface: '#111113',
  surface2: '#18181b',
  border: '#1f1f23',
  borderSoft: '#141416',
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
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={card}>
        {/* TOP BAR */}
        <Section style={topBar}>
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
                          <Text style={brandText}>TEREX</Text>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={topRightCell}>
                  {typeof topRight === 'string' || typeof topRight === 'number' ? (
                    <Text style={topRightText}>{topRight}</Text>
                  ) : (topRight ?? <Text style={topRightText}>terangaexchange.com</Text>)}
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* CONTENU SPÉCIFIQUE */}
        {children}

        {/* FOOTER */}
        <Hr style={footerDivider} />
        <Section style={footer}>
          <Text style={footerLogo}>TEREX</Text>
          <Text style={footerText}>
            Vous avez reçu cet email suite à une activité sur votre compte Terex.
          </Text>
          <Text style={footerText}>
            © {new Date().getFullYear()} Teranga Exchange — Tous droits réservés.
          </Text>
          <Text style={footerLinks}>
            <Link href="https://terangaexchange.com/privacy" style={footerLink}>Confidentialité</Link>
            <span style={footerSep}> · </span>
            <Link href="https://terangaexchange.com/help" style={footerLink}>Centre d'aide</Link>
            <span style={footerSep}> · </span>
            <Link href="https://terangaexchange.com" style={footerLink}>terangaexchange.com</Link>
          </Text>
        </Section>
      </Container>
      <div style={{ height: '32px' }} />
    </Body>
  </Html>
);

/* — Atomes réutilisables exportés pour les templates — */

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={sectionLabelStyle}>{children}</Text>
);

export const InfoTable: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => (
  <Section style={infoCard}>
    {title && <Text style={infoHead}>{title}</Text>}
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
    wordBreak: mono ? 'break-all' : 'normal',
  };
  return (
    <table
      width="100%"
      cellPadding={0}
      cellSpacing={0}
      role="presentation"
      style={{
        borderCollapse: 'collapse',
        borderBottom: last ? 'none' : `1px solid ${TEREX.borderSoft}`,
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: '13px 20px', verticalAlign: 'middle', width: '42%' }}>
            <Text style={infoLabel}>{label}</Text>
          </td>
          <td style={{ padding: '13px 20px', verticalAlign: 'middle' }}>
            <Text style={valueStyle}>{value}</Text>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export const PrimaryButton: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <Section style={{ textAlign: 'center', padding: '0 40px 40px' }}>
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
        return { background: TEREX.greenBg, borderColor: 'rgba(38,161,123,0.25)', color: TEREX.text };
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
      style={{
        padding: '16px 20px',
        margin: '0 40px 28px',
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
  padding: '32px 12px',
  backgroundColor: TEREX.pageBg,
  color: TEREX.text,
};

const card: React.CSSProperties = {
  maxWidth: '620px',
  margin: '0 auto',
  backgroundColor: TEREX.surface,
  borderRadius: '12px',
  overflow: 'hidden',
  border: `1px solid ${TEREX.border}`,
};

const topBar: React.CSSProperties = {
  padding: '20px 28px',
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
  margin: '0 40px 14px',
};

const infoCard: React.CSSProperties = {
  margin: '0 40px 28px',
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
  padding: '28px 40px',
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
  /** Optional check/icon ring above the title (use ICON_CHECK / ICON_SHIELD). */
  iconRing?: React.ReactNode;
}> = ({ eyebrow, reference, title, date, subtitle, iconRing }) => (
  <Section style={{ padding: '48px 40px 36px', backgroundColor: TEREX.surface }}>
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
              <td style={{ padding: '20px 22px', verticalAlign: 'top', width: `${100 / cols.length}%` }}>
                <Text
                  style={{
                    fontSize: '10px',
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: TEREX.textDim,
                    margin: '0 0 7px',
                  }}
                >
                  {c.label}
                </Text>
                <Text
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: c.green ? TEREX.green : TEREX.text,
                    margin: 0,
                    lineHeight: 1.2,
                  }}
                >
                  {c.value}
                </Text>
                {c.sub && (
                  <Text style={{ fontSize: '11px', color: TEREX.textDim, margin: '4px 0 0' }}>{c.sub}</Text>
                )}
              </td>
            </React.Fragment>
          ))}
        </tr>
      </tbody>
    </table>
  </Section>
);
