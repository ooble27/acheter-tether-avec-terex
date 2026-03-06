
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

export const AdminNotificationEmail = ({ notificationType, data }: AdminNotificationEmailProps) => {
  let previewText = '';
  let icon = '🔔';
  let title = '';
  let badgeColor = '#10b981';
  let badgeText = '';
  let details: { label: string; value: string }[] = [];
  let actionText = '';

  switch (notificationType) {
    case 'new_order':
      icon = data.type === 'buy' ? '🟢' : data.type === 'sell' ? '🔴' : '🌍';
      title = data.type === 'buy' ? 'Nouvel Achat USDT' : data.type === 'sell' ? 'Nouvelle Vente USDT' : 'Nouveau Transfert';
      badgeColor = data.type === 'buy' ? '#10b981' : data.type === 'sell' ? '#ef4444' : '#3b82f6';
      badgeText = data.type === 'buy' ? 'ACHAT' : data.type === 'sell' ? 'VENTE' : 'TRANSFERT';
      previewText = `${title} - ${data.amount} ${data.currency}`;
      details = [
        { label: 'Montant', value: `${Number(data.amount).toLocaleString('fr-FR')} ${data.currency}` },
        { label: 'USDT', value: `${data.usdtAmount || data.usdt_amount || 'N/A'} USDT` },
        { label: 'Paiement', value: formatPaymentMethod(data.paymentMethod || data.payment_method) },
        { label: 'Statut', value: data.status || 'pending' },
        { label: 'Date', value: formatDate(data.createdAt || data.created_at) },
      ];
      actionText = 'Traiter cette commande dans le tableau de bord admin.';
      break;

    case 'kyc_submission':
      icon = '🆔';
      title = 'Nouvelle Vérification KYC';
      badgeColor = '#f59e0b';
      badgeText = 'KYC';
      previewText = `Vérification KYC - ${data.firstName} ${data.lastName}`;
      details = [
        { label: 'Nom complet', value: `${data.firstName} ${data.lastName}` },
        { label: 'Email', value: data.email || 'N/A' },
        { label: 'Téléphone', value: data.phone || 'N/A' },
        { label: 'Nationalité', value: data.nationality || 'N/A' },
        { label: 'Document', value: data.documentType || 'N/A' },
      ];
      actionText = 'Vérifiez les documents dans le panneau admin.';
      break;

    case 'high_volume_request':
      icon = '💎';
      title = 'Demande Gros Volume';
      badgeColor = '#8b5cf6';
      badgeText = 'VIP';
      previewText = `Gros volume - ${data.clientInfo?.firstName} ${data.clientInfo?.lastName}`;
      details = [
        { label: 'Client', value: `${data.clientInfo?.firstName} ${data.clientInfo?.lastName}` },
        { label: 'Email', value: data.clientInfo?.email || 'N/A' },
        { label: 'Téléphone', value: data.clientInfo?.phone || 'N/A' },
        { label: 'Montant', value: `${Number(data.clientInfo?.amount).toLocaleString('fr-FR')} CFA` },
        { label: 'Objectif', value: data.clientInfo?.purpose || 'N/A' },
      ];
      if (data.clientInfo?.additionalInfo) {
        details.push({ label: 'Infos', value: data.clientInfo.additionalInfo });
      }
      actionText = 'Contactez le client rapidement pour discuter des conditions.';
      break;

    case 'status_update':
      icon = '📊';
      title = 'Mise à Jour Commande';
      badgeColor = '#6366f1';
      badgeText = 'UPDATE';
      previewText = `Commande #${data.orderId?.slice(-8)} → ${data.newStatus}`;
      details = [
        { label: 'Commande', value: `#${data.orderId?.slice(-8)}` },
        { label: 'Ancien statut', value: formatStatus(data.oldStatus) },
        { label: 'Nouveau statut', value: formatStatus(data.newStatus) },
      ];
      break;

    default:
      title = 'Notification';
      previewText = 'Nouvelle notification Terex';
  }

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>TEREX</Text>
            <Text style={logoSubtext}>Tableau de bord Admin</Text>
          </Section>

          {/* Badge */}
          <Section style={{ textAlign: 'center' as const, padding: '8px 0' }}>
            <span style={{
              ...badge,
              backgroundColor: badgeColor,
            }}>
              {badgeText}
            </span>
          </Section>

          {/* Title */}
          <Heading style={h1}>{icon} {title}</Heading>

          {/* Details Card */}
          <Section style={card}>
            {details.map((detail, i) => (
              <div key={i} style={detailRow}>
                <Text style={detailLabel}>{detail.label}</Text>
                <Text style={detailValue}>{detail.value}</Text>
              </div>
            ))}
          </Section>

          {/* Action */}
          {actionText && (
            <Section style={actionBox}>
              <Text style={actionTextStyle}>⚡ {actionText}</Text>
            </Section>
          )}

          {/* CTA Button */}
          <Section style={{ textAlign: 'center' as const, margin: '32px 0' }}>
            <Link href="https://acheter-tether-avec-terex.lovable.app/admin" style={ctaButton}>
              Ouvrir le Dashboard Admin →
            </Link>
          </Section>

          {/* Footer */}
          <Hr style={hr} />
          <Text style={footer}>
            Cet email a été envoyé automatiquement par <strong>Terex</strong>.
          </Text>
          <Text style={footerSmall}>
            © {new Date().getFullYear()} Terex - Teranga Exchange · Tous droits réservés
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

function formatPaymentMethod(method: string) {
  const map: Record<string, string> = {
    'wave': '🌊 Wave',
    'orange_money': '🟠 Orange Money',
    'mobile': '📱 Mobile Money',
    'card': '💳 Carte bancaire',
    'bank_transfer': '🏦 Virement bancaire',
    'interac': '🍁 Interac',
  };
  return map[method] || method || 'N/A';
}

function formatStatus(status: string) {
  const map: Record<string, string> = {
    'pending': '⏳ En attente',
    'processing': '🔄 En cours',
    'completed': '✅ Terminée',
    'cancelled': '❌ Annulée',
    'failed': '⛔ Échouée',
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

// ─── Styles ───────────────────────────────────────────

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
};

const header = {
  backgroundColor: '#0f172a',
  padding: '28px 32px',
  borderRadius: '12px 12px 0 0',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#10b981',
  fontSize: '28px',
  fontWeight: '800' as const,
  letterSpacing: '3px',
  margin: '0',
  padding: '0',
};

const logoSubtext = {
  color: '#94a3b8',
  fontSize: '12px',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '4px 0 0 0',
};

const badge = {
  display: 'inline-block' as const,
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700' as const,
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  padding: '6px 16px',
  borderRadius: '20px',
};

const h1 = {
  color: '#0f172a',
  fontSize: '22px',
  fontWeight: '700' as const,
  textAlign: 'center' as const,
  margin: '16px 0 24px 0',
  padding: '0',
};

const card = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '24px',
  margin: '0 20px',
};

const detailRow = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  padding: '10px 0',
  borderBottom: '1px solid #e2e8f0',
};

const detailLabel = {
  color: '#64748b',
  fontSize: '13px',
  margin: '0',
  fontWeight: '500' as const,
};

const detailValue = {
  color: '#0f172a',
  fontSize: '14px',
  fontWeight: '600' as const,
  margin: '0',
  textAlign: 'right' as const,
};

const actionBox = {
  backgroundColor: '#fffbeb',
  border: '1px solid #fde68a',
  borderRadius: '10px',
  padding: '14px 20px',
  margin: '20px 20px 0 20px',
};

const actionTextStyle = {
  color: '#92400e',
  fontSize: '13px',
  margin: '0',
  fontWeight: '500' as const,
};

const ctaButton = {
  display: 'inline-block' as const,
  backgroundColor: '#10b981',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600' as const,
  textDecoration: 'none' as const,
  padding: '14px 32px',
  borderRadius: '10px',
  letterSpacing: '0.5px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '32px 20px 16px 20px',
};

const footer = {
  color: '#64748b',
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '0 20px',
  lineHeight: '1.5',
};

const footerSmall = {
  color: '#94a3b8',
  fontSize: '11px',
  textAlign: 'center' as const,
  margin: '8px 20px 32px 20px',
};
