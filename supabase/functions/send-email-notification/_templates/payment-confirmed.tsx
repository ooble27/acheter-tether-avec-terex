
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

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_BG = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const TEREX_SOFT_BG = '#fafbfa';

export const PaymentConfirmedEmail = ({ orderData, transactionType }: PaymentConfirmedProps) => {
  let title = 'Transaction finalisée';
  let subtitle = 'Votre transaction a été traitée avec succès.';
  let preview = 'Transaction Terex finalisée';

  if (transactionType === 'buy') {
    title = 'Achat USDT finalisé';
    subtitle = `Votre achat de ${orderData.usdt_amount || 0} USDT a été traité avec succès.`;
    preview = `Achat de ${orderData.usdt_amount || 0} USDT finalisé`;
  } else if (transactionType === 'sell') {
    title = 'Vente USDT finalisée';
    subtitle = `Votre vente de ${orderData.usdt_amount || 0} USDT a été traitée avec succès.`;
    preview = `Vente de ${orderData.usdt_amount || 0} USDT finalisée`;
  } else if (transactionType === 'transfer') {
    title = 'Transfert déposé';
    subtitle = `Le transfert vers ${orderData.recipient_name || 'votre destinataire'} a été déposé.`;
    preview = `Transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} déposé`;
  }

  let clientInfo: any = null;
  try {
    if (orderData.notes) clientInfo = JSON.parse(orderData.notes);
  } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `#TEREX-${orderData.id?.slice(-8) || 'N/A'}`;
  const dateStr = new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR');

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle}>
      {/* Bandeau succès */}
      <Section style={successBanner}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={checkCell}>
                <div style={checkCircle}>
                  <span style={checkMark}>✓</span>
                </div>
              </td>
              <td style={successTextCell}>
                <Text style={successTitle}>Confirmé</Text>
                <Text style={successSub}>{reference} • {dateStr}</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Détails */}
      <Text style={sectionTitle}>Récapitulatif</Text>
      <Container style={detailsContainer}>
        {transactionType === 'buy' && (
          <>
            <DetailRow label="Montant payé" value={`${orderData.amount || 0} ${orderData.currency || 'CFA'}`} />
            <DetailRow label="USDT reçu" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow label="Adresse" value={orderData.wallet_address || 'N/A'} mono wrap />
          </>
        )}

        {transactionType === 'sell' && (
          <>
            <DetailRow label="USDT vendu" value={`${orderData.usdt_amount || 0} USDT`} />
            <DetailRow label="Montant reçu" value={`${orderData.amount || 0} ${orderData.currency || 'CFA'}`} accent />
            <DetailRow label="Service" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono />
          </>
        )}

        {transactionType === 'transfer' && (
          <>
            <DetailRow label="Envoyé" value={`${orderData.amount || 0} ${orderData.from_currency || 'USDT'}`} />
            <DetailRow label="Reçu" value={`${orderData.total_amount || 0} ${orderData.to_currency || ''}`} accent />
            <DetailRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow label="Service" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono />
          </>
        )}
      </Container>

      <Hr style={divider} />

      <Text style={signature}>
        {transactionType === 'transfer'
          ? 'Le bénéficiaire a été notifié de la réception des fonds.'
          : 'Vos fonds sont disponibles.'}
        <br />
        <span style={signatureBrand}>L'équipe Terex</span>
      </Text>
    </BaseEmail>
  );
};

const DetailRow = ({ label, value, mono, wrap, accent }: { label: string; value: string; mono?: boolean; wrap?: boolean; accent?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = wrap ? addressText : monoText;
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

/* — Styles — */

const successBanner = {
  backgroundColor: TEREX_GREEN_BG,
  borderRadius: '10px',
  padding: '16px 20px',
  margin: '0 0 28px 0',
  border: `1px solid ${TEREX_GREEN}33`,
};

const checkCell = {
  width: '52px',
  verticalAlign: 'middle' as const,
};

const checkCircle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: TEREX_GREEN,
  textAlign: 'center' as const,
  lineHeight: '40px',
};

const checkMark = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700' as const,
  lineHeight: '40px',
};

const successTextCell = {
  verticalAlign: 'middle' as const,
};

const successTitle = {
  color: TEREX_DARK,
  fontSize: '16px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const successSub = {
  color: TEREX_MUTED,
  fontSize: '12px',
  margin: '4px 0 0 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
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
  fontSize: '15px',
  fontWeight: '700' as const,
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
