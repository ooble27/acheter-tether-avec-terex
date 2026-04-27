
import {
  Text,
  Section,
  Hr,
  Container,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

const TEREX_GREEN = '#3B968F';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const TEREX_SOFT_BG = '#fafbfa';

const COUNTRIES: Record<string, string> = {
  SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso', NG: 'Nigeria', BJ: 'Bénin',
};

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const country = COUNTRIES[transferData.recipient_country] || transferData.recipient_country;
  const providerName =
    transferData.provider === 'wave' ? 'Wave' :
    transferData.provider === 'orange' || transferData.provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `#TEREX-${transferData.id?.slice(-8) || 'N/A'}`;
  const title = 'Transfert international confirmé';
  const subtitle = `Vers ${transferData.recipient_name} — ${country}.`;
  const preview = `Transfert ${reference} vers ${country} confirmé`;

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle}>
      {/* Récapitulatif visuel */}
      <Section style={summaryCard}>
        <Row>
          <Column>
            <Text style={summaryLabel}>Vous envoyez</Text>
            <Text style={summaryAmount}>{transferData.amount} {transferData.from_currency}</Text>
          </Column>
          <Column style={arrowCell}>
            <Text style={arrowText}>→</Text>
          </Column>
          <Column>
            <Text style={summaryLabel}>Destinataire reçoit</Text>
            <Text style={summaryAmountAccent}>{transferData.total_amount} {transferData.to_currency}</Text>
          </Column>
        </Row>
      </Section>

      {/* Détails du transfert */}
      <Text style={sectionTitle}>Détails du transfert</Text>
      <Container style={detailsContainer}>
        <DetailRow label="Référence" value={reference} mono />
        <DetailRow label="Date" value={new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')} />
        <DetailRow label="Taux" value={`1 ${transferData.from_currency} = ${transferData.exchange_rate} ${transferData.to_currency}`} />
        <DetailRow label="Frais" value={`${transferData.fees} ${transferData.from_currency}`} />
      </Container>

      {/* Destinataire */}
      <Text style={sectionTitle}>Destinataire</Text>
      <Container style={detailsContainer}>
        <DetailRow label="Nom" value={transferData.recipient_name || 'N/A'} />
        <DetailRow label="Pays" value={country} />
        <DetailRow label="Service" value={providerName} accent />
        {transferData.recipient_phone && (
          <DetailRow label="Téléphone" value={transferData.recipient_phone} mono />
        )}
      </Container>

      {/* Étapes */}
      <Text style={sectionTitle}>Suivi</Text>
      <Container style={stepsContainer}>
        <Step done label="Demande confirmée" />
        <Step label="Instructions de paiement" />
        <Step label="Vérification du paiement" />
        <Step label="Traitement du transfert" />
        <Step label="Réception confirmée chez le destinataire" />
      </Container>

      <Hr style={divider} />

      <Text style={signature}>
        Vos transferts en toute sécurité.<br />
        <span style={signatureBrand}>L'équipe Terex</span>
      </Text>
    </BaseEmail>
  );
};

const DetailRow = ({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = monoText;
  return (
    <Row style={detailRowStyle}>
      <Column style={labelColumn}>
        <Text style={labelText}>{label}</Text>
      </Column>
      <Column style={valueColumn}>
        <Text style={style}>{value}</Text>
      </Column>
    </Row>
  );
};

const Step = ({ label, done }: { label: string; done?: boolean }) => (
  <Row style={stepRow}>
    <Column style={stepDotColumn}>
      <div style={done ? stepDotDone : stepDot} />
    </Column>
    <Column>
      <Text style={done ? stepLabelDone : stepLabel}>{label}</Text>
    </Column>
  </Row>
);

/* — Styles — */

const summaryCard = {
  backgroundColor: TEREX_DARK,
  borderRadius: '10px',
  padding: '20px 24px',
  margin: '0 0 28px 0',
};

const arrowCell = {
  width: '40px',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
};

const arrowText = {
  color: TEREX_GREEN,
  fontSize: '20px',
  fontWeight: '700' as const,
  margin: '0',
};

const summaryLabel = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: '600' as const,
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const summaryAmount = {
  color: '#ffffff',
  fontSize: '17px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const summaryAmountAccent = {
  color: TEREX_GREEN,
  fontSize: '17px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const sectionTitle = {
  color: TEREX_DARK,
  fontSize: '13px',
  fontWeight: '700' as const,
  margin: '0 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.6px',
};

const detailsContainer = {
  backgroundColor: TEREX_SOFT_BG,
  border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '10px',
  padding: '8px 18px',
  margin: '0 0 24px 0',
};

const detailRowStyle = {
  borderBottom: `1px solid ${TEREX_BORDER}`,
};

const labelColumn = {
  width: '40%',
  paddingRight: '12px',
  verticalAlign: 'middle' as const,
};

const valueColumn = {
  width: '60%',
  verticalAlign: 'middle' as const,
};

const labelText = {
  color: TEREX_MUTED,
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '12px 0',
  lineHeight: '1.4',
};

const valueText = {
  color: TEREX_DARK,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '12px 0',
  lineHeight: '1.4',
  textAlign: 'right' as const,
};

const valueAccent = {
  ...valueText,
  color: TEREX_GREEN,
  fontWeight: '700' as const,
};

const monoText = {
  ...valueText,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const stepsContainer = {
  padding: '0',
  margin: '0 0 16px 0',
};

const stepRow = {
  marginBottom: '4px',
};

const stepDotColumn = {
  width: '20px',
  verticalAlign: 'middle' as const,
};

const stepDot = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#cbd5d4',
  display: 'inline-block',
};

const stepDotDone = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: TEREX_GREEN,
  display: 'inline-block',
};

const stepLabel = {
  color: TEREX_MUTED,
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '8px 0',
  lineHeight: '1.4',
};

const stepLabelDone = {
  color: TEREX_DARK,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '8px 0',
  lineHeight: '1.4',
};

const divider = {
  borderColor: TEREX_BORDER,
  margin: '20px 0 16px 0',
  borderWidth: '1px',
};

const signature = {
  color: TEREX_MUTED,
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
};

const signatureBrand = {
  color: TEREX_DARK,
  fontWeight: '600' as const,
};
