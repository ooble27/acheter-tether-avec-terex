
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

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

const TEREX_GREEN = '#3B968F';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const TEREX_SOFT_BG = '#fafbfa';

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const isBuy = transactionType === 'buy';
  const title = isBuy ? `Demande d'achat USDT confirmée` : `Demande de vente USDT confirmée`;
  const subtitle = isBuy
    ? `Votre commande d'achat de ${orderData.usdt_amount || 0} USDT est en cours de traitement.`
    : `Votre commande de vente de ${orderData.usdt_amount || 0} USDT est en cours de traitement.`;
  const preview = `Référence #TEREX-${orderData.id?.slice(-8) || 'N/A'} — ${orderData.usdt_amount || 0} USDT`;

  let clientInfo: any = null;
  try {
    if (orderData.notes) clientInfo = JSON.parse(orderData.notes);
  } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `#TEREX-${orderData.id?.slice(-8) || 'N/A'}`;
  const dateStr = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR');

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle}>
      {/* Carte récapitulative */}
      <Section style={summaryCard}>
        <Row>
          <Column>
            <Text style={summaryLabel}>{isBuy ? 'Vous payez' : 'Vous envoyez'}</Text>
            <Text style={summaryAmount}>
              {isBuy
                ? `${orderData.amount || 0} ${orderData.currency || 'CFA'}`
                : `${orderData.usdt_amount || 0} USDT`}
            </Text>
          </Column>
          <Column style={arrowCell}>
            <Text style={arrowText}>→</Text>
          </Column>
          <Column>
            <Text style={summaryLabel}>{isBuy ? 'Vous recevez' : 'Vous recevez'}</Text>
            <Text style={summaryAmountAccent}>
              {isBuy
                ? `${orderData.usdt_amount || 0} USDT`
                : `${orderData.amount || 0} ${orderData.currency || 'CFA'}`}
            </Text>
          </Column>
        </Row>
      </Section>

      {/* Détails */}
      <Text style={sectionTitle}>Détails de la transaction</Text>
      <Container style={detailsContainer}>
        <DetailRow label="Référence" value={reference} mono />
        <DetailRow label="Date" value={dateStr} />
        <DetailRow label="Type" value={isBuy ? 'Achat USDT' : 'Vente USDT'} />
        <DetailRow label="Taux" value={`${orderData.exchange_rate || 0} ${orderData.currency || 'CFA'} / USDT`} />
        {isBuy ? (
          <DetailRow label="Adresse de réception" value={orderData.wallet_address || 'N/A'} mono wrap />
        ) : (
          <>
            <DetailRow label="Service de réception" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono />
          </>
        )}
      </Container>

      {/* Étapes */}
      <Text style={sectionTitle}>Suivi de votre commande</Text>
      <Container style={stepsContainer}>
        <Step done label="Demande reçue" />
        <Step label={isBuy ? 'Instructions de paiement' : 'Instructions d\'envoi USDT'} />
        <Step label="Traitement & vérification" />
        <Step
          label={isBuy
            ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre wallet`
            : `Envoi de ${orderData.amount || 0} ${orderData.currency || 'CFA'} vers ${providerName}`}
        />
      </Container>

      <Hr style={divider} />

      <Text style={signature}>
        Merci de votre confiance.<br />
        <span style={signatureBrand}>L'équipe Terex</span>
      </Text>
    </BaseEmail>
  );
};

const DetailRow = ({ label, value, mono, wrap }: { label: string; value: string; mono?: boolean; wrap?: boolean }) => (
  <Row style={detailRowStyle}>
    <Column style={labelColumn}>
      <Text style={labelText}>{label}</Text>
    </Column>
    <Column style={valueColumn}>
      <Text style={mono ? (wrap ? addressText : monoText) : valueText}>{value}</Text>
    </Column>
  </Row>
);

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
  fontSize: '18px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const summaryAmountAccent = {
  color: TEREX_GREEN,
  fontSize: '18px',
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
  margin: '0 0 28px 0',
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

const monoText = {
  ...valueText,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const addressText = {
  color: TEREX_DARK,
  fontSize: '12px',
  fontWeight: '500' as const,
  margin: '10px 0',
  lineHeight: '1.4',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  wordBreak: 'break-all' as const,
  textAlign: 'right' as const,
};

const stepsContainer = {
  padding: '0',
  margin: '0 0 24px 0',
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
  margin: '24px 0 16px 0',
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
