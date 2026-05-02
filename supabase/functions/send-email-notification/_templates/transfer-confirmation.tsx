import {
  Text,
  Section,
  Container,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';

interface TransferConfirmationProps {
  transferData: any;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';

const COUNTRIES: Record<string, string> = {
  SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso',
  NG: 'Nigeria', BJ: 'Bénin', CA: 'Canada', FR: 'France',
};

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const country = COUNTRIES[transferData.recipient_country] || transferData.recipient_country || 'N/A';
  const providerName =
    transferData.provider === 'wave' ? 'Wave' :
    transferData.provider === 'orange' || transferData.provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(transferData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const dateStr = new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <BaseEmail
      preview={`${reference} — Transfert vers ${country} confirmé`}
      title="Votre transfert est en cours de traitement"
      highlightTitle="traitement"
      subtitle={`Nous avons bien reçu votre demande. Votre transfert vers ${transferData.recipient_name || 'le destinataire'} sera livré sous peu.`}
      heroImageUrl={EMAIL_ILLUSTRATIONS.transfer}
      heroImageAlt="Transfert international Terex"
      greeting="Bonjour 👋"
      intro={`Merci d'avoir choisi Terex. Voici le récapitulatif de votre transfert international.`}
    >
      <Container style={recapCard}>
        <div style={recapDarkCell}>
          <Text style={recapTitleSmall}>📋 RÉCAPITULATIF DU TRANSFERT</Text>
          <div style={recapInner}>
            <Text style={recapLabelSmall}>Vous envoyez</Text>
            <table cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td><Text style={recapBigAmount}>{Number(transferData.amount).toLocaleString('fr-FR')}</Text></td>
                  <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
                    <span style={recapPill}>{transferData.from_currency}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={recapArrow}><span style={recapArrowText}>↓</span></div>

            <Text style={recapLabelSmall}>Le destinataire reçoit</Text>
            <table cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td><Text style={recapBigAmount}>{Number(transferData.total_amount).toLocaleString('fr-FR')}</Text></td>
                  <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
                    <span style={recapPill}>{transferData.to_currency}</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div style={recapRateBox}>
              <Text style={recapRateText}>
                ⓘ Taux appliqué<br />
                <span style={recapRateValue}>1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}</span>
              </Text>
            </div>
          </div>
        </div>

        <div style={detailsBlock}>
          <DetailRow icon="🌍" label="Pays de destination" value={country} accent />
          <DetailRow icon="👤" label="Destinataire" value={transferData.recipient_name || 'N/A'} />
          <DetailRow icon="📱" label={`Numéro ${providerName}`} value={transferData.recipient_phone || 'N/A'} mono />
          <DetailRow icon="💳" label="Service de réception" value={providerName} accent />
          <DetailRow icon="%" label="Frais de transaction" value={`${Number(transferData.fees || 0).toLocaleString('fr-FR')} ${transferData.from_currency}`} />
          <DetailRow icon="#" label="ID de transaction" value={reference} mono />
          <DetailRow icon="📅" label="Date" value={dateStr} />
          <DetailRow icon="🕒" label="Statut" value="En cours de traitement" pill />
        </div>
      </Container>

      {/* Étapes simplifiées */}
      <Text style={sectionTitle}>SUIVI DU TRANSFERT</Text>
      <Container style={stepsContainer}>
        <Step done label="Demande confirmée" />
        <Step done label="Paiement vérifié" />
        <Step active label="Traitement du transfert" />
        <Step label="Réception chez le destinataire" />
      </Container>

      <Section style={infoBox}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={infoIconCell}>
                <div style={infoIcon}><span style={infoIconText}>ⓘ</span></div>
              </td>
              <td>
                <Text style={infoTitle}>À savoir</Text>
                <Text style={infoText}>
                  Votre transfert sera livré sous 24h ouvrables. Le destinataire recevra une notification dès la réception des fonds.
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
    </BaseEmail>
  );
};

const DetailRow = ({
  icon, label, value, mono, accent, pill,
}: { icon: string; label: string; value: string; mono?: boolean; accent?: boolean; pill?: boolean }) => (
  <Row style={detailRowStyle}>
    <Column style={iconColumn}>
      <div style={iconBadge}><span style={iconBadgeText}>{icon}</span></div>
    </Column>
    <Column style={labelColumn}><Text style={labelText}>{label}</Text></Column>
    <Column style={valueColumn}>
      {pill ? (
        <span style={statusPill}>🕒 {value}</span>
      ) : (
        <Text style={accent ? valueAccent : (mono ? monoText : valueText)}>{value}</Text>
      )}
    </Column>
  </Row>
);

const Step = ({ label, done, active }: { label: string; done?: boolean; active?: boolean }) => (
  <Row style={stepRow}>
    <Column style={stepDotColumn}>
      <div style={done ? stepDotDone : active ? stepDotActive : stepDot} />
    </Column>
    <Column>
      <Text style={done || active ? stepLabelDone : stepLabel}>{label}</Text>
    </Column>
  </Row>
);

/* ============= STYLES (réutilise le même langage que order-confirmation) ============= */

const recapCard = {
  backgroundColor: '#ffffff',
  border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '14px',
  margin: '0 0 28px 0',
  overflow: 'hidden',
};
const recapDarkCell = { padding: '20px 22px 8px 22px' };
const recapTitleSmall = {
  color: TEREX_GREEN, fontSize: '11px', fontWeight: '700' as const,
  margin: '0 0 16px 0', letterSpacing: '0.8px', textTransform: 'uppercase' as const,
};
const recapInner = { backgroundColor: TEREX_DARK, borderRadius: '12px', padding: '20px 22px' };
const recapLabelSmall = {
  color: '#94a3b8', fontSize: '11px', fontWeight: '500' as const,
  margin: '0 0 6px 0', textTransform: 'uppercase' as const, letterSpacing: '0.4px',
};
const recapBigAmount = {
  color: '#ffffff', fontSize: '28px', fontWeight: '700' as const, margin: '0',
  lineHeight: '1.1', letterSpacing: '-0.5px',
};
const recapPill = {
  display: 'inline-block', backgroundColor: TEREX_GREEN, color: '#ffffff',
  fontSize: '11px', fontWeight: '700' as const, padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.5px',
};
const recapArrow = {
  width: '32px', height: '32px', borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center' as const, lineHeight: '32px', margin: '14px 0',
};
const recapArrowText = { color: TEREX_GREEN, fontSize: '14px', fontWeight: '700' as const, lineHeight: '32px' };
const recapRateBox = {
  marginTop: '16px', padding: '10px 12px', borderRadius: '8px',
  backgroundColor: 'rgba(59, 150, 143, 0.12)', border: `1px solid ${TEREX_GREEN}33`,
};
const recapRateText = { color: '#94a3b8', fontSize: '11px', margin: '0', lineHeight: '1.5' };
const recapRateValue = { color: '#ffffff', fontWeight: '700' as const, fontSize: '13px' };

const detailsBlock = { padding: '8px 22px 20px 22px' };
const detailRowStyle = { borderBottom: `1px solid ${TEREX_BORDER}` };
const iconColumn = { width: '36px', verticalAlign: 'middle' as const, paddingTop: '12px', paddingBottom: '12px' };
const iconBadge = {
  width: '24px', height: '24px', borderRadius: '6px',
  backgroundColor: TEREX_GREEN_LIGHT, textAlign: 'center' as const, lineHeight: '24px',
};
const iconBadgeText = { color: TEREX_GREEN, fontSize: '12px', lineHeight: '24px' };
const labelColumn = { verticalAlign: 'middle' as const, paddingRight: '12px' };
const valueColumn = { verticalAlign: 'middle' as const, textAlign: 'right' as const };
const labelText = { color: TEREX_MUTED, fontSize: '13px', fontWeight: '500' as const, margin: '12px 0', lineHeight: '1.4' };
const valueText = { color: TEREX_DARK, fontSize: '13px', fontWeight: '600' as const, margin: '12px 0', lineHeight: '1.4', textAlign: 'right' as const };
const valueAccent = { ...valueText, color: TEREX_GREEN, fontWeight: '700' as const };
const monoText = { ...valueText, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };
const statusPill = {
  display: 'inline-block', backgroundColor: TEREX_GREEN_LIGHT, color: TEREX_GREEN,
  fontSize: '12px', fontWeight: '700' as const, padding: '6px 12px', borderRadius: '20px',
};

const sectionTitle = {
  color: TEREX_DARK, fontSize: '11px', fontWeight: '700' as const,
  margin: '0 0 14px 0', letterSpacing: '0.8px', textTransform: 'uppercase' as const,
};
const stepsContainer = { padding: '0 8px', margin: '0 0 24px 0' };
const stepRow = { marginBottom: '4px' };
const stepDotColumn = { width: '24px', verticalAlign: 'middle' as const };
const stepDot = { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#cbd5d4', display: 'inline-block' };
const stepDotDone = { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: TEREX_GREEN, display: 'inline-block' };
const stepDotActive = {
  width: '10px', height: '10px', borderRadius: '50%', backgroundColor: TEREX_GREEN,
  display: 'inline-block', boxShadow: `0 0 0 4px ${TEREX_GREEN}33`,
};
const stepLabel = { color: TEREX_MUTED, fontSize: '13px', fontWeight: '500' as const, margin: '8px 0', lineHeight: '1.4' };
const stepLabelDone = { color: TEREX_DARK, fontSize: '13px', fontWeight: '600' as const, margin: '8px 0', lineHeight: '1.4' };

const infoBox = {
  backgroundColor: '#ffffff', border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '12px', padding: '16px 20px', margin: '0 0 8px 0',
};
const infoIconCell = { width: '48px', verticalAlign: 'top' as const, paddingTop: '2px' };
const infoIcon = {
  width: '36px', height: '36px', borderRadius: '50%',
  backgroundColor: TEREX_GREEN_LIGHT, textAlign: 'center' as const, lineHeight: '36px',
};
const infoIconText = { color: TEREX_GREEN, fontSize: '16px', fontWeight: '700' as const, lineHeight: '36px' };
const infoTitle = { color: TEREX_DARK, fontSize: '14px', fontWeight: '700' as const, margin: '0 0 4px 0' };
const infoText = { color: TEREX_MUTED, fontSize: '13px', margin: '0', lineHeight: '1.55' };
