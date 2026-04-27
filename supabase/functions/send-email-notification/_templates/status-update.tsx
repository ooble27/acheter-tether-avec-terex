
import {
  Text,
  Section,
  Container,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const TEREX_SOFT_BG = '#fafbfa';

const STATUS_META: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  processing: { label: 'En cours de traitement', color: '#b45309', bg: '#fef3c7', emoji: '⏳' },
  completed:  { label: 'Terminée avec succès',   color: TEREX_GREEN, bg: '#eaf5f4', emoji: '✓' },
  cancelled:  { label: 'Annulée',                color: '#b91c1c', bg: '#fee2e2', emoji: '✕' },
  failed:     { label: 'Échec',                  color: '#b91c1c', bg: '#fee2e2', emoji: '✕' },
};

export const StatusUpdateEmail = ({ orderData, transactionType }: StatusUpdateProps) => {
  const meta = STATUS_META[orderData.status] || { label: orderData.status, color: TEREX_DARK, bg: TEREX_SOFT_BG, emoji: '•' };
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer ? 'transfert international' : (transactionType === 'buy' ? 'achat USDT' : transactionType === 'sell' ? 'vente USDT' : 'transaction');

  const title = `Mise à jour de votre ${isTransfer ? 'transfert' : 'commande'}`;
  const subtitle = `Statut : ${meta.label}.`;
  const preview = `${objectName} — ${meta.label}`;
  const reference = `#TEREX-${orderData.id?.slice(-8) || 'N/A'}`;

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle}>
      {/* Badge de statut */}
      <Section style={{ ...statusBanner, backgroundColor: meta.bg, borderColor: `${meta.color}33` }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={statusIconCell}>
                <div style={{ ...statusIcon, backgroundColor: meta.color }}>
                  <span style={statusIconText}>{meta.emoji}</span>
                </div>
              </td>
              <td style={statusTextCell}>
                <Text style={{ ...statusLabel, color: meta.color }}>{meta.label}</Text>
                <Text style={statusRef}>{reference}</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Détails */}
      <Text style={sectionTitle}>Détails</Text>
      <Container style={detailsContainer}>
        <DetailRow label="Référence" value={reference} mono />
        <DetailRow label="Création" value={new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')} />
        <DetailRow label="Mise à jour" value={new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')} />

        {!isTransfer && (
          <>
            <DetailRow label="Type" value={orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'} />
            <DetailRow label="Montant" value={`${orderData.amount || 0} ${orderData.currency || 'CFA'}`} />
            <DetailRow label="USDT" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow label="Réseau" value={orderData.network || 'TRC20'} />
          </>
        )}

        {isTransfer && (
          <>
            <DetailRow label="Envoyé" value={`${orderData.amount || 0} ${orderData.from_currency || 'USDT'}`} />
            <DetailRow label="À recevoir" value={`${orderData.total_amount || 0} ${orderData.to_currency || ''}`} accent />
            <DetailRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow label="Pays" value={orderData.recipient_country || 'N/A'} />
          </>
        )}
      </Container>

      {/* Message contextuel */}
      {orderData.status === 'processing' && (
        <Section style={infoBox}>
          <Text style={infoText}>
            Notre équipe traite activement votre {isTransfer ? 'transfert' : 'commande'}. Vous recevrez une nouvelle notification dès la finalisation.
          </Text>
        </Section>
      )}

      {orderData.status === 'completed' && (
        <Section style={infoBox}>
          <Text style={infoText}>
            {isTransfer
              ? 'Les fonds ont été crédités au destinataire avec succès.'
              : 'Votre transaction a été traitée avec succès.'}
          </Text>
        </Section>
      )}

      {(orderData.status === 'cancelled' || orderData.status === 'failed') && (
        <Section style={alertBox}>
          <Text style={alertText}>
            {orderData.status === 'cancelled'
              ? `Votre ${isTransfer ? 'transfert' : 'commande'} a été annulée. ${orderData.cancellation_reason ? `Raison : ${orderData.cancellation_reason}.` : ''} Si un paiement a été effectué, il sera remboursé sous 3 à 5 jours ouvrables.`
              : `Une erreur s'est produite. ${orderData.error_message || 'Notre équipe technique a été notifiée.'}`}
          </Text>
        </Section>
      )}

      <Hr style={divider} />

      <Text style={signature}>
        Pour toute question, contactez-nous via WhatsApp ou par email.<br />
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

/* — Styles — */

const statusBanner = {
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 28px 0',
  border: '1px solid',
};

const statusIconCell = {
  width: '52px',
  verticalAlign: 'middle' as const,
};

const statusIcon = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  textAlign: 'center' as const,
  lineHeight: '40px',
};

const statusIconText = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700' as const,
  lineHeight: '40px',
};

const statusTextCell = {
  verticalAlign: 'middle' as const,
};

const statusLabel = {
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const statusRef = {
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
  fontWeight: '700' as const,
};

const monoText = {
  ...valueText,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const infoBox = {
  backgroundColor: '#eaf5f4',
  border: `1px solid ${TEREX_GREEN}33`,
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 24px 0',
};

const infoText = {
  color: TEREX_DARK,
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
};

const alertBox = {
  backgroundColor: '#fee2e2',
  border: '1px solid #fca5a533',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 24px 0',
};

const alertText = {
  color: '#7f1d1d',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
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
