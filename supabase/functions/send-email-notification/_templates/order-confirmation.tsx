import { wrapEmail, hero, infoTable, ctaButton } from './html-utils.ts';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
  clientName?: string;
}

export function orderConfirmationHtml({ orderData, transactionType, clientName }: OrderConfirmationProps): string {
  const isBuy = transactionType === 'buy';
  const reference = `TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phone   = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const amount  = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt    = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const network = orderData.network || 'TRC-20';
  const wallet  = orderData.wallet_address || 'N/A';
  const currency = orderData.currency || 'CFA';

  const title = isBuy
    ? 'Payez pour recevoir vos USDT'
    : 'Envoyez vos USDT pour recevoir vos francs';

  const lead = isBuy
    ? `Votre commande est enregistrée. Envoyez <strong>${amount} ${currency}</strong> par ${providerName} au numéro Terex, puis nous transférons <strong>${usdt} USDT</strong> vers votre adresse ${network} indiquée dans le récapitulatif.`
    : `Votre commande est enregistrée. Transférez <strong>${usdt} USDT</strong> vers l'adresse ${network} indiquée dans le récapitulatif. Dès confirmation blockchain, vous recevez <strong>${amount} ${currency}</strong> sur votre ${providerName}.`;

  const detailRows = isBuy ? [
    { label: 'Référence',       value: reference,      mono: true },
    { label: 'Montant à payer',  value: `${amount} ${currency}` },
    { label: 'Vous recevrez',    value: `${usdt} USDT` },
    { label: 'Réseau',           value: network },
    { label: 'Adresse de réception', value: wallet, mono: true, last: true },
  ] : [
    { label: 'Référence',      value: reference,      mono: true },
    { label: 'Vous envoyez',    value: `${usdt} USDT` },
    { label: 'Vous recevrez',   value: `${amount} ${currency}` },
    { label: 'Réseau',          value: network },
    { label: 'Numéro à créditer', value: `${providerName} · ${phone}`, mono: true, last: true },
  ];

  const rows =
    hero({ eyebrow: isBuy ? 'Paiement en attente' : 'Dépôt USDT en attente', title, subtitle: (clientName ? `Bonjour ${clientName}, ` : '') + lead }) +
    infoTable(detailRows) +
    ctaButton('Voir ma commande', 'https://terangaexchange.com/dashboard');

  return wrapEmail(title, rows);
}
