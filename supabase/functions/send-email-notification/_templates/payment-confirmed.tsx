import { C, wrapEmail, hero, flowBar, infoTable, noticeBox, ctaButton, spacer, statusBadge, checkRing } from './html-utils.ts';

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

export function paymentConfirmedHtml({ orderData, transactionType, clientName }: PaymentConfirmedProps): string {
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr   = new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phoneNumber  = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider     = clientInfo?.provider || orderData.payment_method || orderData.provider || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const amount   = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt     = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency = orderData.currency || 'CFA';
  const network  = orderData.network || 'TRC-20';

  let title: string;
  let subtitle: string;
  let bar: string;
  let detailRows: any[];
  let notice: string;

  if (transactionType === 'buy') {
    title    = 'Votre achat USDT a été finalisé';
    subtitle = clientName
      ? `Félicitations ${clientName}, les ${usdt} USDT ont été envoyés sur votre adresse.`
      : `Les ${usdt} USDT ont été envoyés sur votre adresse de réception.`;
    bar = flowBar(
      { label: 'Vous avez payé',  amount: `${amount} ${currency}`, sub: providerName },
      { label: 'Vous avez reçu', amount: `${usdt} USDT`,           sub: `TRON · ${network}` },
      `Taux : ${orderData.exchange_rate || 0} ${currency}/USDT`
    );
    detailRows = [
      { label: 'Référence',   value: reference,                        mono: true },
      { label: 'Date',        value: dateStr },
      { label: 'USDT envoyé', value: `${usdt} USDT`,                   green: true, big: true },
      { label: 'Réseau',      value: `TRON (${network})` },
      { label: 'Adresse',     value: orderData.wallet_address || 'N/A', mono: true },
      ...(orderData.transaction_hash
        ? [{ label: 'Hash TX', value: orderData.transaction_hash, mono: true, last: true }]
        : [{ label: 'Type',    value: 'Achat USDT',               last: true }]),
    ];
    notice = 'La confirmation sur le réseau TRON peut prendre quelques minutes.';

  } else if (transactionType === 'sell') {
    title    = 'Votre vente USDT a été finalisée';
    subtitle = clientName
      ? `Félicitations ${clientName}, le montant de ${amount} ${currency} a été versé sur ${providerName}.`
      : `Le montant de ${amount} ${currency} a été versé sur ${providerName}.`;
    bar = flowBar(
      { label: 'Vous avez envoyé', amount: `${usdt} USDT`,         sub: `TRON · ${network}` },
      { label: 'Vous avez reçu',   amount: `${amount} ${currency}`, sub: providerName },
      `Taux : ${orderData.exchange_rate || 0} ${currency}/USDT`
    );
    detailRows = [
      { label: 'Référence',        value: reference,               mono: true },
      { label: 'Date',             value: dateStr },
      { label: `${currency} reçu`, value: `${amount} ${currency}`, green: true, big: true },
      { label: 'Service',          value: providerName },
      { label: 'Numéro',           value: phoneNumber,             mono: true, last: true },
    ];
    notice = `Le virement a été initié vers votre compte ${providerName}. Si les fonds n'apparaissent pas dans les 15 minutes, contactez notre support.`;

  } else {
    const toAmount = Number(orderData.total_amount || 0).toLocaleString('fr-FR');
    const toCur    = orderData.to_currency || currency;
    title    = 'Votre transfert a été finalisé';
    subtitle = clientName
      ? `Félicitations ${clientName}, les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`
      : `Les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`;
    bar = flowBar(
      { label: 'Vous avez envoyé',    amount: `${amount} ${orderData.from_currency || 'USDT'}` },
      { label: 'Bénéficiaire a reçu', amount: `${toAmount} ${toCur}` },
      `Taux : ${orderData.exchange_rate || 0} ${toCur}/${orderData.from_currency || 'USDT'}`
    );
    detailRows = [
      { label: 'Référence',    value: reference,              mono: true },
      { label: 'Date',         value: dateStr },
      { label: 'Montant reçu', value: `${toAmount} ${toCur}`, green: true, big: true },
      { label: 'Destinataire', value: orderData.recipient_name || 'N/A' },
      { label: 'Service',      value: providerName },
      { label: 'Numéro',       value: phoneNumber,            mono: true, last: true },
    ];
    notice = 'Le bénéficiaire a été notifié de la réception des fonds.';
  }

  const rows =
    hero({ iconHtml: checkRing(), title, subtitle }) +
    bar +
    spacer(28) +
    infoTable(detailRows, 'Récapitulatif') +
    noticeBox(notice) +
    ctaButton('Voir mon tableau de bord', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `${reference} — Finalisé`,
    rows,
    statusBadge('Finalisé', 'success'),
    'Vous avez reçu cet email suite à votre transaction sur Terex.'
  );
}
