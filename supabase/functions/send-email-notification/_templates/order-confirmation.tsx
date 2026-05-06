import { C, wrapEmail, hero, summaryBar, infoTable, sectionLabel, steps, ctaButton, spacer, dotBadge } from './html-utils.ts';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
  clientName?: string;
}

export function orderConfirmationHtml({ orderData, transactionType, clientName }: OrderConfirmationProps): string {
  const isBuy = transactionType === 'buy';
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const amount = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt   = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const network = orderData.network || 'TRC-20';
  const wallet  = orderData.wallet_address || 'N/A';
  const currency = orderData.currency || 'CFA';
  const greeting = clientName
    ? `Bonjour ${clientName}, nous avons bien reçu votre commande et notre équipe la traite actuellement.`
    : `Nous avons bien reçu votre commande et notre équipe la traite actuellement.`;

  const detailRows = isBuy ? [
    { label: 'Référence',            value: reference,           mono: true },
    { label: 'Mode de paiement',     value: providerName },
    { label: 'Réseau',               value: network },
    { label: 'Adresse portefeuille', value: wallet,              mono: true, last: true },
  ] : [
    { label: 'Référence',          value: reference,      mono: true },
    { label: 'USDT à envoyer',     value: `${usdt} USDT` },
    { label: 'Réseau',             value: network },
    { label: 'Service réception',  value: providerName },
    { label: 'Numéro',             value: phoneNumber,    mono: true, last: true },
  ];

  const stepsItems = isBuy ? [
    { text: 'Demande reçue et enregistrée', done: true },
    { text: `Effectuez le paiement ${providerName}` },
    { text: 'Vérification du paiement par notre équipe' },
    { text: `Envoi de ${usdt} USDT sur votre adresse` },
  ] : [
    { text: 'Demande reçue et enregistrée', done: true },
    { text: `Envoyez ${usdt} USDT vers l'adresse Terex communiquée` },
    { text: 'Vérification par notre équipe' },
    { text: `Versement de ${amount} ${currency} sur ${providerName}` },
  ];

  const rows =
    hero({ reference: `Référence · ${reference}`, title: isBuy ? "Votre demande d'achat a été reçue" : 'Votre demande de vente a été reçue', date: dateStr, subtitle: greeting }) +
    summaryBar([
      { label: isBuy ? 'Vous payez'    : 'Vous envoyez',  value: isBuy ? `${amount} ${currency}` : `${usdt} USDT`,    sub: isBuy ? providerName : network },
      { label: isBuy ? 'Vous recevez'  : 'Vous recevez',  value: isBuy ? `${usdt} USDT`          : `${amount} ${currency}`, sub: isBuy ? network : providerName, green: true },
      { label: 'Taux appliqué',                            value: String(orderData.exchange_rate || 0), sub: `${currency} / USDT` },
    ]) +
    spacer(28) +
    sectionLabel('Détails de la transaction') +
    infoTable(detailRows) +
    sectionLabel('Prochaines étapes') +
    steps(stepsItems) +
    ctaButton('Suivre ma commande', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `${reference} — ${usdt} USDT`,
    rows,
    dotBadge('En cours de traitement', C.amber),
    'Vous avez reçu cet email suite à votre commande sur Terex.'
  );
}
