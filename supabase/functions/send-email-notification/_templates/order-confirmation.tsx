
import {
  Text,
  Section,
  Hr,
  Container,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail, TEREX } from './base-email.tsx';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
  clientName?: string;
}

export const OrderConfirmationEmail = ({ orderData, transactionType, clientName }: OrderConfirmationProps) => {
  const isBuy = transactionType === 'buy';
  const title = isBuy ? `Demande d'achat USDT confirmée` : `Demande de vente USDT confirmée`;
  const subtitle = isBuy
    ? `Nous avons bien reçu votre commande d'achat de ${orderData.usdt_amount || 0} USDT. Notre équipe la traite actuellement.`
    : `Nous avons bien reçu votre commande de vente de ${orderData.usdt_amount || 0} USDT. Notre équipe la traite actuellement.`;
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
  const greeting = clientName ? `Bonjour ${clientName},` : 'Bonjour,';

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle} greeting={greeting}>
      {/* Carte récapitulative — flux Pay → Receive */}
      <Section style={summaryCard}>
        <Row>
          <Column>
            <Text style={summaryLabel}>{isBuy ? 'Vous payez' : 'Vous envoyez'}</Text>
            <Text style={summaryAmount}>
              {isBuy
                ? `${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`
                : `${orderData.usdt_amount || 0} USDT`}
            </Text>
          </Column>
          <Column style={arrowCell}>
            <Text style={arrowText}>→</Text>
          </Column>
          <Column>
            <Text style={summaryLabel}>Vous recevez</Text>
            <Text style={summaryAmountAccent}>
              {isBuy
                ? `${orderData.usdt_amount || 0} USDT`
                : `${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`}
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
          <DetailRow label="Adresse de réception" value={orderData.wallet_address || 'N/A'} mono wrap last />
        ) : (
          <>
            <DetailRow label="Service de réception" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono last />
          </>
        )}
      </Container>

      {/* Suivi */}
      <Text style={sectionTitle}>Suivi de votre commande</Text>
      <Container style={stepsContainer}>
        <Step done label="Demande reçue" />
        <Step label={isBuy ? 'Instructions de paiement' : "Instructions d'envoi USDT"} />
        <Step label="Traitement & vérification" />
        <Step
          label={isBuy
            ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre wallet`
            : `Envoi de ${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'} vers ${providerName}`}
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

const DetailRow = ({ label, value, mono, wrap, last }: { label: string; value: string; mono?: boolean; wrap?: boolean; last?: boolean }) => (
  <Row style={last ? detailRowLast : detailRowStyle}>
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

/* — Styles dark — */

const summaryCard = {
  backgroundColor: TEREX.surfaceAlt,
  borderRadius: '12px',
  padding: '22px 26px',
  margin: '0 0 32px 0',
  border: `1px solid ${TEREX.border}`,
};

const arrowCell = {
  width: '40px',
  textAlign: 'center' as const,
  verticalAlign: 'middle' as const,
};

const arrowText = {
  color: TEREX.green,
  fontSize: '22px',
  fontWeight: '700' as const,
  margin: '0',
};

const summaryLabel = {
  color: TEREX.textMuted,
  fontSize: '11px',
  fontWeight: '600' as const,
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.6px',
};

const summaryAmount = {
  color: TEREX.white,
  fontSize: '19px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const summaryAmountAccent = {
  color: TEREX.green,
  fontSize: '19px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const sectionTitle = {
  color: TEREX.textMuted,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.8px',
};

const detailsContainer = {
  backgroundColor: TEREX.surfaceAlt,
  border: `1px solid ${TEREX.border}`,
  borderRadius: '12px',
  padding: '6px 20px',
  margin: '0 0 30px 0',
};

const detailRowStyle = {
  borderBottom: `1px solid ${TEREX.borderSoft}`,
};

const detailRowLast = {
  borderBottom: 'none',
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
  color: TEREX.textMuted,
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '14px 0',
  lineHeight: '1.4',
};

const valueText = {
  color: TEREX.text,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '14px 0',
  lineHeight: '1.4',
  textAlign: 'right' as const,
};

const monoText = {
  ...valueText,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const addressText = {
  color: TEREX.text,
  fontSize: '12px',
  fontWeight: '500' as const,
  margin: '12px 0',
  lineHeight: '1.4',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  wordBreak: 'break-all' as const,
  textAlign: 'right' as const,
};

const stepsContainer = {
  padding: '4px 0',
  margin: '0 0 24px 0',
};

const stepRow = {
  marginBottom: '4px',
};

const stepDotColumn = {
  width: '22px',
  verticalAlign: 'middle' as const,
};

const stepDot = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: TEREX.border,
  display: 'inline-block',
};

const stepDotDone = {
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: TEREX.green,
  display: 'inline-block',
  boxShadow: `0 0 0 3px ${TEREX.greenSoft}`,
};

const stepLabel = {
  color: TEREX.textMuted,
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '8px 0',
  lineHeight: '1.4',
};

const stepLabelDone = {
  color: TEREX.text,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '8px 0',
  lineHeight: '1.4',
};

const divider = {
  borderColor: TEREX.border,
  margin: '24px 0 18px 0',
  borderWidth: '1px',
};

const signature = {
  color: TEREX.textSoft,
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
};

const signatureBrand = {
  color: TEREX.white,
  fontWeight: '600' as const,
};
