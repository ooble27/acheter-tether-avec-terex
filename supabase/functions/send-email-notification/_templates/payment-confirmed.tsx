import { wrapEmail, hero, infoTable, ctaButton } from './html-utils.ts';

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

export function paymentConfirmedHtml({ orderData, transactionType, clientName }: PaymentConfirmedProps): string {
  const reference = `TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phone    = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const amount   = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt     = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency = orderData.currency || 'CFA';
  const network  = orderData.network || 'TRC-20';

  let title: string;
  let lead: string;
  let detailRows: any[];

  if (transactionType === 'buy') {
    title = 'Votre transaction est terminée';
    lead  = clientName
      ? `Bonjour ${clientName}, vos ${usdt} USDT ont bien été envoyés.`
      : `Vos ${usdt} USDT ont bien été envoyés.`;
    detailRows = [
      { label: 'Référence',   value: reference,     mono: true },
      { label: 'Vous avez payé', value: `${amount} ${currency}` },
      { label: 'Vous avez reçu', value: `${usdt} USDT`, big: true },
      { label: 'Réseau',      value: network },
      { label: 'Adresse',     value: orderData.wallet_address || 'N/A', mono: true },
    ];
    if (orderData.transaction_hash) {
      detailRows.push({ label: 'Hash de transaction', value: orderData.transaction_hash, mono: true, last: true });
    }
  } else if (transactionType === 'sell') {
    title = 'Votre transaction est terminée';
    lead  = clientName
      ? `Bonjour ${clientName}, ${amount} ${currency} ont été versés sur votre ${providerName}.`
      : `${amount} ${currency} ont été versés sur votre ${providerName}.`;
    detailRows = [
      { label: 'Référence',       value: reference,               mono: true },
      { label: 'Vous avez envoyé', value: `${usdt} USDT` },
      { label: 'Vous avez reçu',   value: `${amount} ${currency}`, big: true },
      { label: 'Service',         value: providerName },
      { label: 'Numéro',          value: phone,                    mono: true, last: true },
    ];
  } else {
    const toAmount = Number(orderData.total_amount || 0).toLocaleString('fr-FR');
    const toCur    = orderData.to_currency || currency;
    title = 'Votre transaction est terminée';
    lead  = clientName
      ? `Bonjour ${clientName}, les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`
      : `Les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`;
    detailRows = [
      { label: 'Référence',    value: reference,              mono: true },
      { label: 'Vous avez envoyé', value: `${amount} ${orderData.from_currency || 'USDT'}` },
      { label: 'Bénéficiaire a reçu', value: `${toAmount} ${toCur}`, big: true },
      { label: 'Destinataire', value: orderData.recipient_name || 'N/A' },
      { label: 'Service',      value: providerName,           last: true },
    ];
  }

  const rows =
    hero({ eyebrow: 'Terminé', title, subtitle: lead }) +
    infoTable(detailRows) +
    ctaButton('Voir le reçu', 'https://terangaexchange.com/dashboard');

  return wrapEmail(title, rows);
}
