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

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';

const STATUS_META: Record<string, { label: string; color: string; bg: string; emoji: string; illu: 'buy' | 'success' | 'transfer' }> = {
  processing: { label: 'En cours de traitement', color: '#b45309', bg: '#fef3c7', emoji: '⏳', illu: 'buy' },
  completed:  { label: 'Terminée avec succès',   color: TEREX_GREEN, bg: TEREX_GREEN_LIGHT, emoji: '✓', illu: 'success' },
  cancelled:  { label: 'Transaction annulée',    color: '#b91c1c', bg: '#fee2e2', emoji: '✕', illu: 'buy' },
  failed:     { label: 'Échec de la transaction',color: '#b91c1c', bg: '#fee2e2', emoji: '✕', illu: 'buy' },
};

export const StatusUpdateEmail = ({ orderData, transactionType }: StatusUpdateProps) => {
  const meta = STATUS_META[orderData.status] || { label: orderData.status, color: TEREX_DARK, bg: '#fafbfa', emoji: '•', illu: 'buy' as const };
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer ? 'transfert' : (transactionType === 'buy' ? 'achat USDT' : transactionType === 'sell' ? 'vente USDT' : 'transaction');

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const isCompleted = orderData.status === 'completed';
  const isFailed = orderData.status === 'cancelled' || orderData.status === 'failed';

  const title = isCompleted
    ? `Votre ${objectName} est finalisé`
    : isFailed
      ? `Votre ${objectName} a été annulé`
      : `Mise à jour de votre ${objectName}`;
  const highlight = isCompleted ? 'finalisé' : isFailed ? 'annulé' : objectName;

  return (
    <BaseEmail
      preview={`${reference} — ${meta.label}`}
      title={title}
      highlightTitle={highlight}
      subtitle={`Statut actuel : ${meta.label}.`}
      heroImageUrl={EMAIL_ILLUSTRATIONS[meta.illu]}
      heroImageAlt={meta.label}
      greeting="Bonjour 👋"
      intro={`Votre ${objectName} a évolué. Voici les dernières informations.`}
    >
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

      <Text style={sectionTitle}>DÉTAILS</Text>
      <Container style={detailsContainer}>
        <DetailRow icon="#" label="Référence" value={reference} mono />
        <DetailRow icon="📅" label="Création" value={new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')} />
        <DetailRow icon="🕒" label="Mise à jour" value={new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')} />

        {!isTransfer && (
          <>
            <DetailRow icon="🛒" label="Type" value={orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'} />
            <DetailRow icon="$" label="Montant" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} />
            <DetailRow icon="₮" label="USDT" value={`${orderData.usdt_amount || 0} USDT`} accent />
            <DetailRow icon="🌐" label="Réseau" value={orderData.network || 'TRC20'} />
          </>
        )}
        {isTransfer && (
          <>
            <DetailRow icon="↗" label="Envoyé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.from_currency || 'CAD'}`} />
            <DetailRow icon="↙" label="À recevoir" value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || ''}`} accent />
            <DetailRow icon="👤" label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <DetailRow icon="🌍" label="Pays" value={orderData.recipient_country || 'N/A'} />
          </>
        )}
      </Container>

      {/* Message contextuel */}
      {orderData.status === 'processing' && (
        <Section style={infoBox}>
          <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
            <tbody>
              <tr>
                <td style={infoIconCell}><div style={infoIconCircle}><span style={infoIconChar}>ⓘ</span></div></td>
                <td>
                  <Text style={infoTitle}>À savoir</Text>
                  <Text style={infoText}>
                    Notre équipe traite activement votre {objectName}. Vous recevrez une nouvelle notification dès la finalisation.
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      )}

      {isFailed && (
        <Section style={alertBox}>
          <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
            <tbody>
              <tr>
                <td style={infoIconCell}><div style={alertIconCircle}><span style={alertIconChar}>!</span></div></td>
                <td>
                  <Text style={alertTitle}>{orderData.status === 'cancelled' ? 'Transaction annulée' : 'Échec de la transaction'}</Text>
                  <Text style={alertText}>
                    {orderData.status === 'cancelled'
                      ? `${orderData.cancellation_reason ? `Raison : ${orderData.cancellation_reason}. ` : ''}Si un paiement a été effectué, il sera remboursé sous 3 à 5 jours ouvrables.`
                      : (orderData.error_message || `Une erreur s'est produite. Notre équipe technique a été notifiée.`)}
                  </Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>
      )}
    </BaseEmail>
  );
};

const DetailRow = ({
  icon, label, value, mono, accent,
}: { icon: string; label: string; value: string; mono?: boolean; accent?: boolean }) => {
  let style = valueText;
  if (accent) style = valueAccent;
  else if (mono) style = monoText;
  return (
    <Row style={detailRowStyle}>
      <Column style={iconColumn}><div style={iconBadge}><span style={iconBadgeText}>{icon}</span></div></Column>
      <Column style={labelColumn}><Text style={labelText}>{label}</Text></Column>
      <Column style={valueColumn}><Text style={style}>{value}</Text></Column>
    </Row>
  );
};

/* ============= STYLES ============= */

const statusBanner = {
  borderRadius: '12px', padding: '16px 20px', margin: '0 0 28px 0', border: '1px solid',
};
const statusIconCell = { width: '56px', verticalAlign: 'middle' as const };
const statusIcon = {
  width: '44px', height: '44px', borderRadius: '50%',
  textAlign: 'center' as const, lineHeight: '44px',
};
const statusIconText = { color: '#ffffff', fontSize: '20px', fontWeight: '700' as const, lineHeight: '44px' };
const statusTextCell = { verticalAlign: 'middle' as const };
const statusLabel = { fontSize: '16px', fontWeight: '700' as const, margin: '0', lineHeight: '1.2' };
const statusRef = {
  color: TEREX_MUTED, fontSize: '12px', margin: '4px 0 0 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const sectionTitle = {
  color: TEREX_DARK, fontSize: '11px', fontWeight: '700' as const,
  margin: '0 0 14px 0', letterSpacing: '0.8px', textTransform: 'uppercase' as const,
};
const detailsContainer = {
  backgroundColor: '#ffffff', border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '12px', padding: '0 22px', margin: '0 0 24px 0',
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
const valueAccent = { ...valueText, color: TEREX_GREEN, fontWeight: '700' as const };
const monoText = { ...valueText, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

const infoBox = {
  backgroundColor: TEREX_GREEN_LIGHT, border: `1px solid ${TEREX_GREEN}33`,
  borderRadius: '12px', padding: '14px 18px', margin: '0 0 8px 0',
};
const infoIconCell = { width: '44px', verticalAlign: 'top' as const, paddingTop: '2px' };
const infoIconCircle = {
  width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff',
  border: `1.5px solid ${TEREX_GREEN}`, textAlign: 'center' as const, lineHeight: '30px',
};
const infoIconChar = { color: TEREX_GREEN, fontSize: '14px', fontWeight: '700' as const, lineHeight: '30px' };
const infoTitle = { color: TEREX_DARK, fontSize: '14px', fontWeight: '700' as const, margin: '0 0 4px 0' };
const infoText = { color: TEREX_DARK, fontSize: '13px', margin: '0', lineHeight: '1.55' };

const alertBox = {
  backgroundColor: '#fee2e2', border: '1px solid #fca5a5',
  borderRadius: '12px', padding: '14px 18px', margin: '0 0 8px 0',
};
const alertIconCircle = {
  width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#ffffff',
  border: '1.5px solid #b91c1c', textAlign: 'center' as const, lineHeight: '30px',
};
const alertIconChar = { color: '#b91c1c', fontSize: '14px', fontWeight: '700' as const, lineHeight: '30px' };
const alertTitle = { color: '#7f1d1d', fontSize: '14px', fontWeight: '700' as const, margin: '0 0 4px 0' };
const alertText = { color: '#7f1d1d', fontSize: '13px', margin: '0', lineHeight: '1.55' };
