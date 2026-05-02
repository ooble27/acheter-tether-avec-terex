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

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';

export const PaymentConfirmedEmail = ({ orderData, transactionType }: PaymentConfirmedProps) => {
  const isBuy = transactionType === 'buy';
  const isSell = transactionType === 'sell';
  const isTransfer = transactionType === 'transfer';

  let title = 'Votre transaction est finalisée';
  let highlight = 'finalisée';
  let intro = 'Votre transaction a été traitée avec succès.';

  if (isBuy) {
    title = 'Votre achat USDT est finalisé';
    intro = `Vos ${orderData.usdt_amount || 0} USDT ont été envoyés à votre wallet avec succès.`;
  } else if (isSell) {
    title = 'Votre vente USDT est finalisée';
    intro = `Le paiement de ${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'} a été envoyé sur votre Mobile Money.`;
  } else if (isTransfer) {
    title = 'Votre transfert est livré';
    highlight = 'livré';
    intro = `${orderData.recipient_name || 'Le destinataire'} a bien reçu les fonds.`;
  }

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}
  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const dateStr = new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <BaseEmail
      preview={`${reference} — Transaction Terex finalisée`}
      title={title}
      highlightTitle={highlight}
      subtitle="Tout s'est bien passé. Vos fonds sont disponibles."
      heroImageUrl={EMAIL_ILLUSTRATIONS.success}
      heroImageAlt="Transaction réussie"
      greeting="Félicitations ! 🎉"
      intro={intro}
    >
      {/* Bandeau succès */}
      <Section style={successBanner}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={checkCell}>
                <div style={checkCircle}><span style={checkMark}>✓</span></div>
              </td>
              <td style={successTextCell}>
                <Text style={successTitle}>Transaction confirmée</Text>
                <Text style={successSub}>{reference} • {dateStr}</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Détails */}
      <Text style={sectionTitle}>RÉCAPITULATIF</Text>
      <Container style={detailsContainer}>
        {isBuy && (
          <>
            <DetailRow icon="$" label="Montant payé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} />
            <DetailRow icon="₮" label="USDT reçu" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow icon="📦" label="Adresse wallet" value={orderData.wallet_address || 'N/A'} mono wrap />
            <DetailRow icon="🌐" label="Réseau" value={orderData.network || 'TRC20'} />
          </>
        )}
        {isSell && (
          <>
            <DetailRow icon="₮" label="USDT vendu" value={`${orderData.usdt_amount || 0} USDT`} />
            <DetailRow icon="$" label="Montant reçu" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} accent />
            <DetailRow icon="💳" label="Service" value={providerName} />
            <DetailRow icon="📱" label="Numéro" value={phoneNumber} mono />
          </>
        )}
        {isTransfer && (
          <>
            <DetailRow icon="↗" label="Envoyé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.from_currency || 'CAD'}`} />
            <DetailRow icon="↙" label="Reçu" value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || 'FCFA'}`} accent />
            <DetailRow icon="👤" label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow icon="💳" label="Service" value={providerName} />
            <DetailRow icon="📱" label="Numéro" value={phoneNumber} mono />
          </>
        )}
        <DetailRow icon="#" label="ID de transaction" value={reference} mono />
        <DetailRow icon="📅" label="Date de finalisation" value={dateStr} />
      </Container>
    </BaseEmail>
  );
};

const DetailRow = ({
  icon, label, value, mono, wrap, accent,
}: { icon: string; label: string; value: string; mono?: boolean; wrap?: boolean; accent?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = wrap ? addressText : monoText;
  return (
    <Row style={detailRowStyle}>
      <Column style={iconColumn}>
        <div style={iconBadge}><span style={iconBadgeText}>{icon}</span></div>
      </Column>
      <Column style={labelColumn}><Text style={labelText}>{label}</Text></Column>
      <Column style={valueColumn}><Text style={style}>{value}</Text></Column>
    </Row>
  );
};

/* ============= STYLES ============= */

const successBanner = {
  backgroundColor: TEREX_GREEN_LIGHT,
  borderRadius: '12px',
  padding: '18px 22px',
  margin: '0 0 28px 0',
  border: `1px solid ${TEREX_GREEN}33`,
};
const checkCell = { width: '56px', verticalAlign: 'middle' as const };
const checkCircle = {
  width: '44px', height: '44px', borderRadius: '50%',
  backgroundColor: TEREX_GREEN, textAlign: 'center' as const, lineHeight: '44px',
};
const checkMark = { color: '#ffffff', fontSize: '22px', fontWeight: '700' as const, lineHeight: '44px' };
const successTextCell = { verticalAlign: 'middle' as const };
const successTitle = { color: TEREX_DARK, fontSize: '17px', fontWeight: '700' as const, margin: '0', lineHeight: '1.2' };
const successSub = {
  color: TEREX_MUTED, fontSize: '12px', margin: '4px 0 0 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const sectionTitle = {
  color: TEREX_DARK, fontSize: '11px', fontWeight: '700' as const,
  margin: '0 0 14px 0', letterSpacing: '0.8px', textTransform: 'uppercase' as const,
};
const detailsContainer = {
  backgroundColor: '#ffffff', border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '12px', padding: '0 22px', margin: '0 0 8px 0',
};
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
const valueAccent = { ...valueText, color: TEREX_GREEN, fontWeight: '700' as const, fontSize: '14px' };
const monoText = { ...valueText, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };
const addressText = {
  color: TEREX_DARK, fontSize: '11px', fontWeight: '500' as const,
  margin: '10px 0', lineHeight: '1.4',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  wordBreak: 'break-all' as const, textAlign: 'right' as const,
};
