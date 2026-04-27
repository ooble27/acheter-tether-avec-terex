
import {
  Text,
  Section,
  Container,
  Row,
  Column,
  Hr,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail, TEREX } from './base-email.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string; border: string; icon: string }> = {
  processing: { label: 'En cours de traitement', color: TEREX.accentYellow, bg: '#2A2510', border: '#3F3815', icon: '⏳' },
  completed:  { label: 'Terminée avec succès',   color: TEREX.green,        bg: TEREX.greenSoft, border: `${TEREX.green}55`, icon: '✓' },
  cancelled:  { label: 'Annulée',                color: TEREX.accentRed,    bg: '#2C1416',       border: '#4A1F22', icon: '✕' },
  failed:     { label: 'Échec',                  color: TEREX.accentRed,    bg: '#2C1416',       border: '#4A1F22', icon: '✕' },
};

export const StatusUpdateEmail = ({ orderData, transactionType, clientName }: StatusUpdateProps) => {
  const meta = STATUS_META[orderData.status] || { label: orderData.status, color: TEREX.text, bg: TEREX.surfaceAlt, border: TEREX.border, icon: '•' };
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer ? 'transfert international' : (transactionType === 'buy' ? 'achat USDT' : transactionType === 'sell' ? 'vente USDT' : 'transaction');

  const title = `Mise à jour de votre ${isTransfer ? 'transfert' : 'commande'}`;
  const subtitle = `Le statut de votre ${objectName} a évolué : ${meta.label.toLowerCase()}.`;
  const preview = `${objectName} — ${meta.label}`;
  const reference = `#TEREX-${orderData.id?.slice(-8) || 'N/A'}`;
  const greeting = clientName ? `Bonjour ${clientName},` : 'Bonjour,';

  return (
    <BaseEmail preview={preview} title={title} subtitle={subtitle} greeting={greeting}>
      {/* Bandeau de statut */}
      <Section style={{ ...statusBanner, backgroundColor: meta.bg, borderColor: meta.border }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={statusIconCell}>
                <div style={{ ...statusIcon, backgroundColor: meta.color }}>
                  <span style={statusIconText}>{meta.icon}</span>
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
            <DetailRow label="Montant" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`} />
            <DetailRow label="USDT" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow label="Réseau" value={orderData.network || 'TRC20'} last />
          </>
        )}

        {isTransfer && (
          <>
            <DetailRow label="Envoyé" value={`${orderData.amount || 0} ${orderData.from_currency || 'USDT'}`} />
            <DetailRow label="À recevoir" value={`${orderData.total_amount || 0} ${orderData.to_currency || ''}`} accent />
            <DetailRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow label="Pays" value={orderData.recipient_country || 'N/A'} last />
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
        <Section style={infoBoxSuccess}>
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
              : `Une erreur s'est produite. ${orderData.error_message || 'Notre équipe technique a été notifiée et reviendra vers vous rapidement.'}`}
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

const DetailRow = ({ label, value, mono, accent, last }: { label: string; value: string; mono?: boolean; accent?: boolean; last?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = monoText;
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

const statusBanner = {
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '0 0 30px 0',
  border: '1px solid',
};

const statusIconCell = { width: '54px', verticalAlign: 'middle' as const };

const statusIcon = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  textAlign: 'center' as const,
  lineHeight: '40px',
};

const statusIconText = {
  color: '#0F1411',
  fontSize: '18px',
  fontWeight: '800' as const,
  lineHeight: '40px',
};

const statusTextCell = { verticalAlign: 'middle' as const };

const statusLabel = {
  fontSize: '15px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
};

const statusRef = {
  color: TEREX.textMuted,
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
  margin: '0 0 24px 0',
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

const valueAccent = { ...valueText, color: TEREX.green, fontWeight: '700' as const };
const monoText = { ...valueText, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

const infoBox = {
  backgroundColor: '#2A2510',
  border: '1px solid #3F3815',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 24px 0',
};

const infoBoxSuccess = {
  backgroundColor: TEREX.greenSoft,
  border: `1px solid ${TEREX.green}55`,
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 24px 0',
};

const infoText = {
  color: TEREX.text,
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
};

const alertBox = {
  backgroundColor: '#2C1416',
  border: '1px solid #4A1F22',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '0 0 24px 0',
};

const alertText = {
  color: '#FFB4B7',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
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

const signatureBrand = { color: TEREX.white, fontWeight: '600' as const };
