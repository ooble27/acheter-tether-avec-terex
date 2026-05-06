import { wrapEmail, hero, infoTable, noticeBox, ctaButton, statusBadge, dotBadge, C } from './html-utils.ts';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

const STATUS_META: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  processing: { label: 'En cours de traitement', tone: 'warning' },
  completed:  { label: 'Terminée avec succès',   tone: 'success' },
  cancelled:  { label: 'Annulée',                tone: 'danger'  },
  failed:     { label: 'Échec',                  tone: 'danger'  },
};

export function statusUpdateHtml({ orderData, transactionType, clientName }: StatusUpdateProps): string {
  const meta = STATUS_META[orderData.status] || { label: orderData.status || 'Mise à jour', tone: 'neutral' as const };
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer ? 'transfert international'
    : transactionType === 'buy' ? 'achat USDT'
    : transactionType === 'sell' ? 'vente USDT'
    : 'transaction';

  const subtitle = clientName
    ? `Bonjour ${clientName}, le statut de votre ${objectName} a évolué : ${meta.label.toLowerCase()}.`
    : `Le statut de votre ${objectName} a évolué : ${meta.label.toLowerCase()}.`;

  const baseRows = [
    { label: 'Référence',   value: reference, mono: true },
    { label: 'Création',    value: new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR') },
    { label: 'Mise à jour', value: new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR') },
  ];

  const typeRows = !isTransfer ? [
    { label: 'Type',    value: transactionType === 'buy' ? 'Achat USDT' : 'Vente USDT' },
    { label: 'Montant', value: `${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}` },
    { label: 'USDT',    value: `${Number(orderData.usdt_amount || 0).toLocaleString('fr-FR')} USDT`, green: true },
    { label: 'Réseau',  value: orderData.network || 'TRC-20', last: true },
  ] : [
    { label: 'Envoyé',      value: `${orderData.amount || 0} ${orderData.from_currency || 'USDT'}` },
    { label: 'À recevoir',  value: `${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || ''}`, green: true },
    { label: 'Destinataire',value: orderData.recipient_name || 'N/A' },
    { label: 'Pays',        value: orderData.recipient_country || 'N/A', last: true },
  ];

  let notice = '';
  if (orderData.status === 'processing') {
    notice = noticeBox(`Notre équipe traite activement votre ${isTransfer ? 'transfert' : 'commande'}. Vous recevrez une nouvelle notification dès la finalisation.`, 'warning');
  } else if (orderData.status === 'completed') {
    notice = noticeBox(isTransfer ? 'Les fonds ont été crédités au destinataire avec succès.' : 'Votre transaction a été traitée avec succès.', 'success');
  } else if (orderData.status === 'cancelled') {
    const reason = orderData.cancellation_reason ? `Motif : ${orderData.cancellation_reason}. ` : '';
    notice = noticeBox(`Votre ${isTransfer ? 'transfert' : 'commande'} a été annulé. ${reason}Si un paiement a été effectué, il sera remboursé sous 3 à 5 jours ouvrables.`, 'danger');
  } else if (orderData.status === 'failed') {
    notice = noticeBox(`Une erreur s'est produite. ${orderData.error_message || 'Notre équipe technique a été notifiée.'}`, 'danger');
  }

  const topRight = meta.tone === 'success' ? statusBadge(meta.label, 'success')
    : meta.tone === 'danger' ? statusBadge(meta.label, 'danger')
    : dotBadge(meta.label, C.amber);

  const rows =
    hero({ reference: `Référence · ${reference}`, title: `Mise à jour de votre ${isTransfer ? 'transfert' : 'commande'}`, date: new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' }), subtitle }) +
    infoTable([...baseRows, ...typeRows], 'Détails') +
    notice +
    ctaButton('Voir le détail', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `${reference} — ${meta.label}`,
    rows,
    topRight,
    'Vous avez reçu cet email suite à une mise à jour de votre transaction sur Terex.'
  );
}
