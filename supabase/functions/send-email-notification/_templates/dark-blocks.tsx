/**
 * Blocs partagés pour la partie "corps" des emails Terex.
 * Tous reprennent le langage visuel du hero : fond TEREX_DARK arrondi,
 * accent vert, gros chiffres, icônes pleines — pas de tableaux denses.
 */
import {
  Section,
  Text,
  Container,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

export const TEREX_GREEN = '#3B968F';
export const TEREX_GREEN_LIGHT = '#eaf5f4';
export const TEREX_DARK = '#0F1411';
export const TEREX_MUTED = '#94a3b8';
export const TEREX_BORDER = 'rgba(255,255,255,0.08)';

/* ============================================================
   DarkCard — conteneur noir arrondi (hero-style)
   ============================================================ */
export const DarkCard = ({
  label,
  children,
}: { label?: string; children: React.ReactNode }) => (
  <Section style={darkCard}>
    {label && <Text style={darkLabel}>{label}</Text>}
    {children}
  </Section>
);

const darkCard = {
  backgroundColor: TEREX_DARK,
  borderRadius: '14px',
  padding: '22px 24px',
  margin: '0 0 16px 0',
};

const darkLabel = {
  color: TEREX_GREEN,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  letterSpacing: '0.8px',
  textTransform: 'uppercase' as const,
};

/* ============================================================
   AmountFlow — gros chiffre haut → flèche → gros chiffre bas
   ============================================================ */
export const AmountFlow = ({
  fromLabel,
  fromAmount,
  fromUnit,
  toLabel,
  toAmount,
  toUnit,
  rate,
}: {
  fromLabel: string;
  fromAmount: string | number;
  fromUnit: string;
  toLabel: string;
  toAmount: string | number;
  toUnit: string;
  rate?: string;
}) => (
  <>
    <Text style={amountTinyLabel}>{fromLabel}</Text>
    <table cellPadding={0} cellSpacing={0} role="presentation">
      <tbody>
        <tr>
          <td><Text style={amountBig}>{fromAmount}</Text></td>
          <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
            <span style={amountUnit}>{fromUnit}</span>
          </td>
        </tr>
      </tbody>
    </table>

    <div style={arrowDot}><span style={arrowDotText}>↓</span></div>

    <Text style={amountTinyLabel}>{toLabel}</Text>
    <table cellPadding={0} cellSpacing={0} role="presentation">
      <tbody>
        <tr>
          <td><Text style={amountBig}>{toAmount}</Text></td>
          <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
            <span style={amountUnit}>{toUnit}</span>
          </td>
        </tr>
      </tbody>
    </table>

    {rate && (
      <div style={rateBox}>
        <Text style={rateText}>
          <span style={rateLabel}>Taux appliqué</span><br />
          <span style={rateValue}>{rate}</span>
        </Text>
      </div>
    )}
  </>
);

const amountTinyLabel = {
  color: TEREX_MUTED,
  fontSize: '11px',
  fontWeight: '500' as const,
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.4px',
};
const amountBig = {
  color: '#ffffff',
  fontSize: '30px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.1',
  letterSpacing: '-0.6px',
};
const amountUnit = {
  display: 'inline-block',
  backgroundColor: TEREX_GREEN,
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700' as const,
  padding: '4px 10px',
  borderRadius: '6px',
  letterSpacing: '0.5px',
};
const arrowDot = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center' as const,
  lineHeight: '32px',
  margin: '14px 0',
};
const arrowDotText = {
  color: TEREX_GREEN,
  fontSize: '14px',
  fontWeight: '700' as const,
  lineHeight: '32px',
};
const rateBox = {
  marginTop: '18px',
  padding: '12px 14px',
  borderRadius: '10px',
  backgroundColor: 'rgba(59, 150, 143, 0.12)',
  border: `1px solid ${TEREX_GREEN}33`,
};
const rateText = { margin: '0', lineHeight: '1.5' };
const rateLabel = { color: TEREX_MUTED, fontSize: '11px' };
const rateValue = { color: '#ffffff', fontWeight: '700' as const, fontSize: '13px' };

/* ============================================================
   InfoLine — ligne dark : icône ronde + label + valeur
   À placer à l'intérieur d'un DarkCard, séparée par un divider léger.
   ============================================================ */
export const InfoLine = ({
  icon,
  label,
  value,
  mono,
  last,
}: { icon: string; label: string; value: string; mono?: boolean; last?: boolean }) => (
  <table
    width="100%"
    cellPadding={0}
    cellSpacing={0}
    role="presentation"
    style={last ? infoLineLast : infoLine}
  >
    <tbody>
      <tr>
        <td style={infoIconCell}>
          <div style={infoIcon}><span style={infoIconText}>{icon}</span></div>
        </td>
        <td style={infoLabelCell}>
          <Text style={infoLabel}>{label}</Text>
        </td>
        <td style={infoValueCell}>
          <Text style={mono ? infoValueMono : infoValue}>{value}</Text>
        </td>
      </tr>
    </tbody>
  </table>
);

const infoLine = {
  borderBottom: `1px solid ${TEREX_BORDER}`,
};
const infoLineLast = {};
const infoIconCell = {
  width: '40px',
  verticalAlign: 'middle' as const,
  paddingTop: '12px',
  paddingBottom: '12px',
};
const infoIcon = {
  width: '28px',
  height: '28px',
  borderRadius: '8px',
  backgroundColor: 'rgba(59, 150, 143, 0.18)',
  textAlign: 'center' as const,
  lineHeight: '28px',
};
const infoIconText = {
  color: TEREX_GREEN,
  fontSize: '13px',
  lineHeight: '28px',
  fontWeight: '700' as const,
};
const infoLabelCell = { verticalAlign: 'middle' as const, paddingRight: '12px' };
const infoLabel = {
  color: TEREX_MUTED,
  fontSize: '12px',
  fontWeight: '500' as const,
  margin: '12px 0',
  lineHeight: '1.3',
};
const infoValueCell = { verticalAlign: 'middle' as const, textAlign: 'right' as const };
const infoValue = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '12px 0',
  lineHeight: '1.3',
  textAlign: 'right' as const,
};
const infoValueMono = {
  ...infoValue,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '12px',
};

/* ============================================================
   StepsDark — étapes verticales dark, avec icône pleine + check
   ============================================================ */
export const StepsDark = ({
  steps,
}: {
  steps: { icon: string; label: string; state: 'done' | 'active' | 'pending' }[];
}) => (
  <>
    {steps.map((s, i) => {
      const isLast = i === steps.length - 1;
      const dotStyle =
        s.state === 'done' ? stepDotDone :
        s.state === 'active' ? stepDotActive : stepDotPending;
      const labelStyle = s.state === 'pending' ? stepLabelPending : stepLabelActive;
      return (
        <table
          key={i}
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{ marginBottom: isLast ? 0 : 4 }}
        >
          <tbody>
            <tr>
              <td style={stepIconCell}>
                <div style={dotStyle}>
                  <span style={stepIconText}>
                    {s.state === 'done' ? '✓' : s.icon}
                  </span>
                </div>
              </td>
              <td style={stepLabelCell}>
                <Text style={labelStyle}>{s.label}</Text>
                {s.state === 'active' && <Text style={stepActiveBadge}>● En cours</Text>}
              </td>
            </tr>
          </tbody>
        </table>
      );
    })}
  </>
);

const stepIconCell = { width: '44px', verticalAlign: 'middle' as const, paddingTop: 8, paddingBottom: 8 };
const stepLabelCell = { verticalAlign: 'middle' as const };
const stepDotBase = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  textAlign: 'center' as const,
  lineHeight: '32px',
};
const stepDotDone = {
  ...stepDotBase,
  backgroundColor: TEREX_GREEN,
};
const stepDotActive = {
  ...stepDotBase,
  backgroundColor: TEREX_GREEN,
  boxShadow: `0 0 0 4px ${TEREX_GREEN}33`,
};
const stepDotPending = {
  ...stepDotBase,
  backgroundColor: 'transparent',
  border: '1.5px solid rgba(255,255,255,0.18)',
};
const stepIconText = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '700' as const,
  lineHeight: '32px',
};
const stepLabelActive = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '4px 0 0 0',
  lineHeight: '1.3',
};
const stepLabelPending = {
  color: TEREX_MUTED,
  fontSize: '14px',
  fontWeight: '500' as const,
  margin: '4px 0 0 0',
  lineHeight: '1.3',
};
const stepActiveBadge = {
  color: TEREX_GREEN,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '2px 0 0 0',
  letterSpacing: '0.4px',
};

/* ============================================================
   NoticeDark — bloc info à fond dark accentué
   ============================================================ */
export const NoticeDark = ({
  icon = 'ⓘ',
  title,
  text,
  variant = 'info',
}: { icon?: string; title: string; text: string; variant?: 'info' | 'success' | 'warn' | 'error' }) => {
  const colors =
    variant === 'success' ? { bg: 'rgba(59, 150, 143, 0.16)', border: `${TEREX_GREEN}55`, accent: TEREX_GREEN } :
    variant === 'warn'    ? { bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.35)', accent: '#fbbf24' } :
    variant === 'error'   ? { bg: 'rgba(248, 113, 113, 0.12)', border: 'rgba(248, 113, 113, 0.35)', accent: '#f87171' } :
                            { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)', accent: TEREX_GREEN };
  return (
    <Section
      style={{
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '16px 18px',
        margin: '0 0 16px 0',
      }}
    >
      <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
        <tbody>
          <tr>
            <td style={{ width: '40px', verticalAlign: 'top' as const }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  textAlign: 'center' as const,
                  lineHeight: '30px',
                }}
              >
                <span style={{ color: '#0F1411', fontSize: '14px', fontWeight: 700, lineHeight: '30px' }}>
                  {icon}
                </span>
              </div>
            </td>
            <td>
              <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0' }}>{title}</Text>
              <Text style={{ color: TEREX_MUTED, fontSize: '13px', margin: 0, lineHeight: 1.55 }}>{text}</Text>
            </td>
          </tr>
        </tbody>
      </table>
    </Section>
  );
};

/* ============================================================
   BodyShell — wrapper qui force le fond noir pour TOUT le corps
   (entre le hero et le bloc d'aide). Le fond du conteneur reste blanc,
   donc on enveloppe nos blocs dans une "feuille" noire continue.
   ============================================================ */
export const BodyShell = ({ children }: { children: React.ReactNode }) => (
  <Container
    style={{
      backgroundColor: TEREX_DARK,
      borderRadius: '14px',
      padding: '20px',
      margin: '0 0 20px 0',
    }}
  >
    {children}
  </Container>
);
