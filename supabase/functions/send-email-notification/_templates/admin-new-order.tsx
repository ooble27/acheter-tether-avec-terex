import { wrapEmail, hero, infoTable, ctaButton } from './html-utils.ts';

interface AdminNewOrderProps {
  orderData: any;
  transactionType: 'buy' | 'sell' | 'transfer' | string;
  clientName?: string;
  clientEmail?: string;
}

export function adminNewOrderHtml({ orderData, transactionType, clientName, clientEmail }: AdminNewOrderProps): string {
  const isBuy  = transactionType === 'buy';
  const isSell = transactionType === 'sell';
  const sideLabel = isBuy ? "Ordre d'achat" : isSell ? 'Ordre de vente' : 'Virement';

  const reference = `TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const amount    = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt      = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency  = orderData.currency || 'CFA';

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phone        = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider     = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const network      = orderData.network || 'TRC-20';
  const wallet       = orderData.wallet_address || 'N/A';
  const client       = clientName?.trim()
    ? `${clientName.trim()}${clientEmail ? ` · ${clientEmail}` : ''}`
    : (clientEmail || 'Client');

  const headline = isBuy
    ? `Achat ${usdt} USDT pour ${amount} ${currency}`
    : isSell
      ? `Vente ${usdt} USDT pour ${amount} ${currency}`
      : `Virement ${amount} ${currency}`;

  const lead = isBuy
    ? "Un client vient de placer un ordre d'achat. Confirmez la réception du paiement puis envoyez les USDT à l'adresse indiquée."
    : isSell
      ? "Un client vient de placer un ordre de vente. Confirmez la réception des USDT sur l'adresse de dépôt puis versez les fonds."
      : "Un client vient de placer une demande de virement. Traitez la demande dans le dashboard.";

  const addressLabel = isBuy ? 'Adresse de réception client' : 'Adresse de dépôt Terex';

  const detailRows: any[] = [
    { label: 'Client',        value: client },
    { label: 'Référence',     value: reference,               mono: true },
  ];
  if (isBuy || isSell) {
    detailRows.push(
      { label: `Montant ${currency}`, value: `${amount} ${currency}` },
      { label: 'Montant USDT',        value: `${usdt} USDT` },
      { label: 'Réseau',              value: network },
    );
    if (isBuy) {
      detailRows.push({ label: addressLabel, value: wallet, mono: true });
      detailRows.push({ label: `${providerName} · Numéro`, value: phone, mono: true, last: true });
    } else {
      detailRows.push({ label: `${providerName} · Numéro à créditer`, value: phone, mono: true, last: true });
    }
  } else {
    detailRows.push(
      { label: 'Destinataire', value: orderData.recipient_name || 'N/A' },
      { label: 'Service',      value: providerName,           last: true },
    );
  }

  const rows =
    hero({ eyebrow: `Nouvelle commande · ${sideLabel}`, title: headline, subtitle: lead }) +
    infoTable(detailRows) +
    ctaButton('Ouvrir dans le back-office', 'https://terangaexchange.com/admin');

  const subject = isBuy
    ? `Nouvelle commande d'achat ${reference}`
    : isSell
      ? `Nouvelle commande de vente ${reference}`
      : `Nouvelle demande de virement ${reference}`;

  return wrapEmail(subject, rows);
}
