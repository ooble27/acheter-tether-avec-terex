import { wrapEmail, hero, infoTable, noticeBox, ctaButton, spacer, alertRing, dotBadge, C } from './html-utils.ts';

interface CancellationConfirmationProps {
  orderData: any;
  transactionType?: string;
  clientName?: string;
}

export function cancellationConfirmationHtml({ orderData, transactionType, clientName }: CancellationConfirmationProps): string {
  const typeLabel = transactionType === 'buy' ? 'achat' : transactionType === 'sell' ? 'vente' : 'transfert';
  const typeLabelCap = typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1);
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr = new Date(orderData.updated_at || orderData.cancelled_at || Date.now())
    .toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const amount = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt   = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency = orderData.currency || 'CFA';

  const subtitle = clientName
    ? `Bonjour ${clientName}, votre demande de ${typeLabel} a été annulée. Aucun débit ne sera effectué.`
    : `Votre demande de ${typeLabel} a été annulée. Aucun débit ne sera effectué.`;

  const detailRows = [
    { label: 'Référence', value: reference, mono: true },
    { label: 'Type',      value: `${typeLabelCap} USDT` },
    { label: 'Montant',   value: `${amount} ${currency}` },
    { label: 'USDT',      value: `${usdt} USDT` },
    { label: 'Statut',    value: 'Annulé', last: true },
    ...(orderData.cancellation_reason
      ? [{ label: 'Motif', value: orderData.cancellation_reason, last: true }]
      : []),
  ];

  const notice = transactionType === 'buy'
    ? "Si vous avez déjà effectué un paiement Mobile Money, notre équipe procédera au remboursement dans les 24 à 48 heures. Contactez notre support si vous n'avez pas reçu votre remboursement sous 48h."
    : "Si vous avez déjà envoyé des USDT, notre équipe procédera au remboursement dans les 24 à 48 heures. Contactez notre support si nécessaire.";

  const rows =
    hero({ iconHtml: alertRing('✕', C.red), title: 'Commande annulée', date: dateStr, subtitle }) +
    spacer(20) +
    infoTable(detailRows, 'Détails de la commande annulée') +
    noticeBox(notice, 'warning') +
    ctaButton('Passer une nouvelle commande', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `${reference} — Commande annulée`,
    rows,
    dotBadge('Annulée', C.red),
    'Vous avez reçu cet email suite à l\'annulation de votre commande sur Terex.'
  );
}
