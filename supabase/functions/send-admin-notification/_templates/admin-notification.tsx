
import * as React from 'npm:react@18.3.1';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Row,
  Column,
  Hr,
  Img,
} from 'npm:@react-email/components@0.0.22';

interface AdminNotificationEmailProps {
  notificationType: string;
  data: any;
}

// Palette neutre / light (compatible dark mode système iOS / Gmail)
// Fond blanc + texte sombre : laisse le client mail gérer dark/light naturellement
const T = {
  green: '#3B968F',
  greenSoft: '#E8F3F1',
  bg: '#F5F7F6',
  surface: '#FFFFFF',
  surfaceAlt: '#F8FAF9',
  border: '#E4E9E7',
  borderSoft: '#EEF1F0',
  text: '#0F1411',
  textSoft: '#3F4946',
  textMuted: '#6B7470',
  white: '#0F1411',         // utilisé pour titres → mappé au texte sombre
  buy: '#3B968F',
  sell: '#B8860B',
  transfer: '#2563EB',
  kyc: '#B8860B',
  vip: '#7C3AED',
  status: '#0EA5E9',
};

const LOGO_URL = 'https://terangaexchange.com/lovable-uploads/3e8bdd84-3bdf-49ba-98b7-08e541f8323a.png';

export const AdminNotificationEmail = ({ notificationType, data }: AdminNotificationEmailProps) => {
  // Configuration par type de notification
  let preview = '';
  let badgeLabel = '';
  let badgeColor = T.green;
  let title = '';
  let subtitle = '';
  let actionLabel = 'Ouvrir le tableau de bord';
  let actionUrl = 'https://terangaexchange.com/admin';

  // Sections structurées
  let clientSection: { label: string; value: string; mono?: boolean }[] = [];
  let transactionSection: { label: string; value: string; mono?: boolean; accent?: boolean }[] = [];
  let extraSection: { title: string; rows: { label: string; value: string; mono?: boolean }[] } | null = null;
  let highlightCard: { left: { label: string; value: string }; right: { label: string; value: string } } | null = null;
  let urgentNote = '';

  switch (notificationType) {
    case 'new_order': {
      const isBuy = data.type === 'buy';
      const isSell = data.type === 'sell';
      const isTransfer = data.type === 'transfer';
      badgeLabel = isBuy ? 'NOUVEL ACHAT' : isSell ? 'NOUVELLE VENTE' : 'NOUVEAU TRANSFERT';
      badgeColor = isBuy ? T.buy : isSell ? T.sell : T.transfer;
      title = isBuy ? `Nouvelle commande d'achat USDT` : isSell ? 'Nouvelle commande de vente USDT' : 'Nouveau transfert international';
      subtitle = `Une nouvelle ${isTransfer ? 'demande de transfert' : 'commande'} vient d'être créée et nécessite votre attention.`;
      preview = `${badgeLabel} — ${formatMoney(data.amount, data.currency)}`;

      const clientName = [data.client_first_name, data.client_last_name].filter(Boolean).join(' ') || data.client_name || 'Client non identifié';
      clientSection = [
        { label: 'Nom complet', value: clientName },
        { label: 'Email', value: data.client_email || data.email || 'Non renseigné', mono: true },
        { label: 'Téléphone', value: data.client_phone || data.phone || 'Non renseigné', mono: true },
        { label: 'ID utilisateur', value: data.user_id ? `${data.user_id.slice(0, 8)}…` : 'N/A', mono: true },
      ];

      highlightCard = isBuy
        ? {
            left: { label: 'Le client paie', value: formatMoney(data.amount, data.currency) },
            right: { label: 'Doit recevoir', value: `${data.usdtAmount || data.usdt_amount || 0} USDT` },
          }
        : isSell
        ? {
            left: { label: 'Le client envoie', value: `${data.usdtAmount || data.usdt_amount || 0} USDT` },
            right: { label: 'Doit recevoir', value: formatMoney(data.amount, data.currency) },
          }
        : {
            left: { label: 'Envoyé', value: `${data.amount || 0} ${data.from_currency || data.currency || ''}` },
            right: { label: 'À recevoir', value: `${data.total_amount || 0} ${data.to_currency || ''}` },
          };

      transactionSection = [
        { label: 'Référence', value: `#TEREX-${(data.id || data.orderId || '').toString().slice(-8) || 'N/A'}`, mono: true },
        { label: 'Type', value: isBuy ? 'Achat USDT' : isSell ? 'Vente USDT' : 'Transfert international' },
        { label: 'Montant', value: formatMoney(data.amount, data.currency), accent: true },
        { label: 'USDT', value: `${data.usdtAmount || data.usdt_amount || (isTransfer ? '—' : 'N/A')} ${isTransfer ? '' : 'USDT'}`.trim() },
        { label: 'Méthode de paiement', value: formatPaymentMethod(data.paymentMethod || data.payment_method || data.provider) },
        { label: 'Statut', value: formatStatus(data.status || 'pending') },
        { label: 'Créée le', value: formatDate(data.createdAt || data.created_at) },
      ];

      if (isBuy && data.wallet_address) {
        extraSection = {
          title: 'Wallet de réception',
          rows: [
            { label: 'Réseau', value: data.network || 'TRC20' },
            { label: 'Adresse', value: data.wallet_address, mono: true },
          ],
        };
      } else if ((isSell || isTransfer) && (data.phone_number || data.recipient_phone)) {
        extraSection = {
          title: isTransfer ? 'Destinataire' : 'Compte de réception',
          rows: [
            ...(isTransfer ? [{ label: 'Nom', value: data.recipient_name || 'N/A' }] : []),
            ...(isTransfer && data.recipient_country ? [{ label: 'Pays', value: data.recipient_country }] : []),
            { label: 'Service', value: formatPaymentMethod(data.provider || data.payment_method) },
            { label: 'Numéro', value: data.recipient_phone || data.phone_number || 'N/A', mono: true },
          ],
        };
      }

      actionLabel = 'Traiter cette commande';
      urgentNote = 'Traitez cette commande sous 30 minutes pour garantir une expérience client optimale.';
      break;
    }

    case 'kyc_submission': {
      badgeLabel = 'NOUVELLE VÉRIFICATION KYC';
      badgeColor = T.kyc;
      title = 'Nouvelle vérification d\'identité';
      subtitle = `${data.firstName} ${data.lastName} a soumis ses documents pour vérification KYC.`;
      preview = `KYC — ${data.firstName} ${data.lastName}`;

      clientSection = [
        { label: 'Nom complet', value: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'N/A' },
        { label: 'Email', value: data.email || 'Non renseigné', mono: true },
        { label: 'Téléphone', value: data.phone || 'Non renseigné', mono: true },
        { label: 'Nationalité', value: data.nationality || 'N/A' },
      ];

      transactionSection = [
        { label: 'Type de document', value: data.documentType || 'N/A' },
        { label: 'Pays d\'émission', value: data.documentCountry || data.nationality || 'N/A' },
        { label: 'Date de naissance', value: data.dateOfBirth || 'N/A' },
        { label: 'Soumis le', value: formatDate(data.submittedAt || new Date().toISOString()) },
      ];

      actionLabel = 'Vérifier les documents';
      urgentNote = 'Vérifiez les documents dans les 24h pour débloquer le compte client.';
      break;
    }

    case 'high_volume_request': {
      badgeLabel = 'DEMANDE GROS VOLUME · VIP';
      badgeColor = T.vip;
      title = 'Demande de gros volume';
      subtitle = 'Un client souhaite effectuer une transaction de gros volume. À traiter en priorité.';
      preview = `Gros volume — ${data.clientInfo?.firstName} ${data.clientInfo?.lastName}`;

      clientSection = [
        { label: 'Nom complet', value: `${data.clientInfo?.firstName || ''} ${data.clientInfo?.lastName || ''}`.trim() },
        { label: 'Email', value: data.clientInfo?.email || 'N/A', mono: true },
        { label: 'Téléphone', value: data.clientInfo?.phone || 'N/A', mono: true },
      ];

      highlightCard = {
        left: { label: 'Volume demandé', value: formatMoney(data.clientInfo?.amount, 'CFA') },
        right: { label: 'Statut', value: 'À contacter' },
      };

      transactionSection = [
        { label: 'Objectif', value: data.clientInfo?.purpose || 'N/A' },
        ...(data.clientInfo?.additionalInfo ? [{ label: 'Informations', value: data.clientInfo.additionalInfo }] : []),
        { label: 'Reçu le', value: formatDate(new Date().toISOString()) },
      ];

      actionLabel = 'Contacter le client';
      urgentNote = 'Contactez le client dans l\'heure pour discuter des conditions et conclure la transaction.';
      break;
    }

    case 'status_update': {
      badgeLabel = 'MISE À JOUR DE STATUT';
      badgeColor = T.status;
      title = 'Statut de commande mis à jour';
      subtitle = `La commande a été mise à jour de "${formatStatus(data.oldStatus)}" vers "${formatStatus(data.newStatus)}".`;
      preview = `Commande #${data.orderId?.slice(-8)} → ${data.newStatus}`;

      transactionSection = [
        { label: 'Référence', value: `#TEREX-${data.orderId?.slice(-8) || 'N/A'}`, mono: true },
        { label: 'Ancien statut', value: formatStatus(data.oldStatus) },
        { label: 'Nouveau statut', value: formatStatus(data.newStatus) },
        { label: 'Mis à jour le', value: formatDate(new Date().toISOString()) },
      ];
      break;
    }

    default:
      title = 'Notification administrative';
      subtitle = 'Nouvelle notification Terex';
      preview = 'Notification Terex';
      badgeLabel = 'INFORMATION';
  }

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Top bar */}
          <Section style={topBar}>
            <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
              <tbody>
                <tr>
                  <td style={logoCell}>
                    <Img src={LOGO_URL} alt="Terex" width="28" height="28" style={logoImg} />
                  </td>
                  <td style={brandCell}>
                    <Text style={brandName}>TEREX</Text>
                  </td>
                  <td style={brandRightCell}>
                    <Text style={brandTagline}>Tableau de bord Admin</Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          <div style={{ ...accentBar, backgroundColor: badgeColor }} />

          {/* Hero */}
          <Section style={heroSection}>
            <span style={{ ...badge, backgroundColor: `${badgeColor}22`, color: badgeColor, borderColor: `${badgeColor}55` }}>
              {badgeLabel}
            </span>
            <Heading style={titleStyle}>{title}</Heading>
            <Text style={subtitleStyle}>{subtitle}</Text>
          </Section>

          <Section style={contentSection}>
            {/* Highlight card si présent */}
            {highlightCard && (
              <Section style={highlightCardStyle}>
                <Row>
                  <Column>
                    <Text style={highlightLabel}>{highlightCard.left.label}</Text>
                    <Text style={highlightValue}>{highlightCard.left.value}</Text>
                  </Column>
                  <Column style={arrowCell}>
                    <Text style={{ ...arrowText, color: badgeColor }}>→</Text>
                  </Column>
                  <Column>
                    <Text style={highlightLabel}>{highlightCard.right.label}</Text>
                    <Text style={{ ...highlightValueAccent, color: badgeColor }}>{highlightCard.right.value}</Text>
                  </Column>
                </Row>
              </Section>
            )}

            {/* Client */}
            {clientSection.length > 0 && (
              <>
                <Text style={sectionTitle}>Informations client</Text>
                <Container style={detailsContainer}>
                  {clientSection.map((row, i) => (
                    <DetailRow key={i} label={row.label} value={row.value} mono={row.mono} last={i === clientSection.length - 1} />
                  ))}
                </Container>
              </>
            )}

            {/* Transaction */}
            {transactionSection.length > 0 && (
              <>
                <Text style={sectionTitle}>Détails {notificationType === 'kyc_submission' ? 'KYC' : 'transaction'}</Text>
                <Container style={detailsContainer}>
                  {transactionSection.map((row, i) => (
                    <DetailRow key={i} label={row.label} value={row.value} mono={row.mono} accent={row.accent} last={i === transactionSection.length - 1} />
                  ))}
                </Container>
              </>
            )}

            {/* Section extra (wallet ou destinataire) */}
            {extraSection && (
              <>
                <Text style={sectionTitle}>{extraSection.title}</Text>
                <Container style={detailsContainer}>
                  {extraSection.rows.map((row, i) => (
                    <DetailRow key={i} label={row.label} value={row.value} mono={row.mono} last={i === extraSection!.rows.length - 1} />
                  ))}
                </Container>
              </>
            )}

            {/* Note urgente */}
            {urgentNote && (
              <Section style={urgentBox}>
                <Text style={urgentText}>{urgentNote}</Text>
              </Section>
            )}

            {/* CTA */}
            <Section style={{ textAlign: 'center' as const, margin: '28px 0 8px 0' }}>
              <Link href={actionUrl} style={{ ...ctaButton, backgroundColor: badgeColor }}>
                {actionLabel} →
              </Link>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={legalText}>
              Email automatique — Tableau de bord administratif Terex.
            </Text>
            <Text style={copyrightText}>
              © {new Date().getFullYear()} Teranga Exchange · Tous droits réservés
            </Text>
          </Section>
        </Container>

        <div style={{ height: '32px' }} />
      </Body>
    </Html>
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

/* — Helpers — */

function formatMoney(amount: any, currency?: string) {
  if (amount === undefined || amount === null) return 'N/A';
  return `${Number(amount).toLocaleString('fr-FR')} ${currency || 'CFA'}`;
}

function formatPaymentMethod(method: string) {
  const map: Record<string, string> = {
    'wave': 'Wave',
    'orange': 'Orange Money',
    'orange_money': 'Orange Money',
    'mobile': 'Mobile Money',
    'card': 'Carte bancaire',
    'bank_transfer': 'Virement bancaire',
    'interac': 'Interac',
  };
  return map[method] || method || 'Non spécifié';
}

function formatStatus(status: string) {
  const map: Record<string, string> = {
    'pending': 'En attente',
    'processing': 'En cours',
    'completed': 'Terminée',
    'cancelled': 'Annulée',
    'failed': 'Échouée',
  };
  return map[status] || status || 'N/A';
}

function formatDate(date: string) {
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return date;
  }
}

/* — Styles — */

const main = {
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif',
  margin: '0',
  padding: '32px 12px',
  backgroundColor: T.bg,
  color: T.text,
};

const container = {
  maxWidth: '620px',
  margin: '0 auto',
  backgroundColor: T.surface,
  borderRadius: '14px',
  overflow: 'hidden',
  border: `1px solid ${T.border}`,
};

const topBar = {
  backgroundColor: T.bg,
  padding: '20px 32px',
  borderBottom: `1px solid ${T.border}`,
};

const logoCell = { width: '36px', verticalAlign: 'middle' as const, paddingRight: '10px' };
const logoImg = { display: 'block', borderRadius: '6px' };
const brandCell = { verticalAlign: 'middle' as const };
const brandRightCell = { verticalAlign: 'middle' as const, textAlign: 'right' as const };
const brandName = { color: T.white, fontSize: '15px', fontWeight: '700' as const, margin: '0', letterSpacing: '2.5px', lineHeight: '1' };
const brandTagline = { color: T.textMuted, fontSize: '11px', margin: '0', letterSpacing: '0.5px' };

const accentBar = { height: '2px' };

const heroSection = { padding: '32px 32px 8px 32px' };

const badge = {
  display: 'inline-block' as const,
  fontSize: '10px',
  fontWeight: '700' as const,
  letterSpacing: '1.2px',
  textTransform: 'uppercase' as const,
  padding: '6px 12px',
  borderRadius: '6px',
  border: '1px solid',
  marginBottom: '18px',
};

const titleStyle = {
  color: T.white,
  fontSize: '26px',
  fontWeight: '700' as const,
  margin: '0 0 12px 0',
  lineHeight: '1.25',
  letterSpacing: '-0.5px',
};

const subtitleStyle = {
  color: T.textSoft,
  fontSize: '15px',
  margin: '0',
  lineHeight: '1.55',
};

const contentSection = { padding: '24px 32px 32px 32px' };

const highlightCardStyle = {
  backgroundColor: T.surfaceAlt,
  borderRadius: '12px',
  padding: '22px 26px',
  margin: '0 0 30px 0',
  border: `1px solid ${T.border}`,
};

const arrowCell = { width: '40px', textAlign: 'center' as const, verticalAlign: 'middle' as const };
const arrowText = { fontSize: '22px', fontWeight: '700' as const, margin: '0' };

const highlightLabel = {
  color: T.textMuted,
  fontSize: '11px',
  fontWeight: '600' as const,
  margin: '0 0 8px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.6px',
};

const highlightValue = { color: T.white, fontSize: '18px', fontWeight: '700' as const, margin: '0', lineHeight: '1.2' };
const highlightValueAccent = { fontSize: '18px', fontWeight: '700' as const, margin: '0', lineHeight: '1.2' };

const sectionTitle = {
  color: T.textMuted,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '24px 0 12px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.8px',
};

const detailsContainer = {
  backgroundColor: T.surfaceAlt,
  border: `1px solid ${T.border}`,
  borderRadius: '12px',
  padding: '6px 20px',
  margin: '0 0 8px 0',
};

const detailRowStyle = { borderBottom: `1px solid ${T.borderSoft}` };
const detailRowLast = { borderBottom: 'none' };

const labelColumn = { width: '40%', paddingRight: '12px', verticalAlign: 'middle' as const };
const valueColumn = { width: '60%', verticalAlign: 'middle' as const };

const labelText = { color: T.textMuted, fontSize: '13px', fontWeight: '500' as const, margin: '14px 0', lineHeight: '1.4' };

const valueText = {
  color: T.text,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '14px 0',
  lineHeight: '1.4',
  textAlign: 'right' as const,
  wordBreak: 'break-word' as const,
};

const valueAccent = { ...valueText, color: T.green, fontSize: '14px', fontWeight: '700' as const };
const monoText = { ...valueText, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', wordBreak: 'break-all' as const };

const urgentBox = {
  backgroundColor: '#2A2510',
  border: '1px solid #3F3815',
  borderRadius: '10px',
  padding: '14px 18px',
  margin: '24px 0 0 0',
};

const urgentText = { color: '#F5DC8B', fontSize: '13px', margin: '0', lineHeight: '1.6', fontWeight: '500' as const };

const ctaButton = {
  display: 'inline-block' as const,
  color: '#0F1411',
  fontSize: '14px',
  fontWeight: '700' as const,
  textDecoration: 'none' as const,
  padding: '14px 28px',
  borderRadius: '10px',
  letterSpacing: '0.3px',
};

const footer = {
  backgroundColor: T.bg,
  padding: '24px 32px 28px 32px',
  borderTop: `1px solid ${T.border}`,
};

const footerDivider = { borderColor: T.border, margin: '0 0 18px 0', borderWidth: '1px' };

const legalText = {
  color: T.textMuted,
  fontSize: '12px',
  margin: '8px 0 4px 0',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const copyrightText = { color: T.textMuted, fontSize: '11px', margin: '0', textAlign: 'center' as const };
