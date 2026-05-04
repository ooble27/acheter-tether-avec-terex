
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

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

export const PaymentConfirmedEmail = ({ orderData, transactionType, clientName }: PaymentConfirmedProps) => {
  let title = 'Transaction finalisée';
  let subtitle = 'Votre transaction a été traitée avec succès et les fonds sont disponibles.';
  let preview = 'Transaction Terex finalisée';

  if (transactionType === 'buy') {
    title = 'Achat USDT finalisé';
    subtitle = `Vos ${orderData.usdt_amount || 0} USDT ont été envoyés sur votre wallet avec succès.`;
    preview = `Achat de ${orderData.usdt_amount || 0} USDT finalisé`;
  } else if (transactionType === 'sell') {
    title = 'Vente USDT finalisée';
    subtitle = `Le paiement de ${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'} a été envoyé sur votre compte.`;
    preview = `Vente de ${orderData.usdt_amount || 0} USDT finalisée`;
  } else if (transactionType === 'transfer') {
    title = 'Transfert déposé avec succès';
    subtitle = `Les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`;
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
  const greeting = clientName ? `Bonjour ${clientName},` : 'Bonjour,';

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle} greeting={greeting}>
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
                <Text style={successTitle}>Transaction confirmée</Text>
                <Text style={successSub}>{reference} · {dateStr}</Text>
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
            <DetailRow label="Montant payé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`} />
            <DetailRow label="USDT reçu" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow label="Adresse" value={orderData.wallet_address || 'N/A'} mono wrap last />
          </>
        )}

        {transactionType === 'sell' && (
          <>
            <DetailRow label="USDT vendu" value={`${orderData.usdt_amount || 0} USDT`} />
            <DetailRow label="Montant reçu" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`} accent />
            <DetailRow label="Service" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono last />
          </>
        )}

        {transactionType === 'transfer' && (
          <>
            <DetailRow label="Envoyé" value={`${orderData.amount || 0} ${orderData.from_currency || 'USDT'}`} />
            <DetailRow label="Reçu" value={`${orderData.total_amount || 0} ${orderData.to_currency || ''}`} accent />
            <DetailRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow label="Service" value={providerName} />
            <DetailRow label="Numéro" value={phoneNumber} mono last />
          </>
        )}
      </Container>

      <Hr style={divider} />

      <Text style={signature}>
        {transactionType === 'transfer'
          ? 'Le bénéficiaire a été notifié de la réception des fonds.'
          : 'Vos fonds sont disponibles. Vous pouvez consulter l\'historique complet dans votre tableau de bord.'}
        <br />
        <span style={signatureBrand}>L'équipe Terex</span>
      </Text>
    </BaseEmail>
  );
};

const DetailRow = ({ label, value, mono, wrap, accent, last }: { label: string; value: string; mono?: boolean; wrap?: boolean; accent?: boolean; last?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = wrap ? addressText : monoText;
  return (
    <Row style={last ? detailRowLast : detailRowStyle}>
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
  backgroundColor: TEREX.greenSoft,
  borderRadius: '12px',
  padding: '18px 22px',
  margin: '0 0 30px 0',
  border: `1px solid ${TEREX.green}55`,
};

const checkCell = {
  width: '54px',
  verticalAlign: 'middle' as const,
};

const checkCircle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: TEREX.green,
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
  color: TEREX.white,
  fontSize: '16px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const successSub = {
  color: TEREX.textSoft,
  fontSize: '12px',
  margin: '4px 0 0 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
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
  margin: '0 0 26px 0',
};

const detailRowStyle = { borderBottom: `1px solid ${TEREX.borderSoft}` };
const detailRowLast = { borderBottom: 'none' };

const labelColumn = { width: '40%', paddingRight: '12px', verticalAlign: 'middle' as const };
const valueColumn = { width: '60%', verticalAlign: 'middle' as const };

const labelText = { color: TEREX.textMuted, fontSize: '13px', fontWeight: '500' as const, margin: '14px 0', lineHeight: '1.4' };

const valueText = {
  color: TEREX.text,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '14px 0',
  lineHeight: '1.4',
  textAlign: 'right' as const,
};

const valueAccent = {
  ...valueText,
  color: TEREX.green,
  fontSize: '15px',
  fontWeight: '700' as const,
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
