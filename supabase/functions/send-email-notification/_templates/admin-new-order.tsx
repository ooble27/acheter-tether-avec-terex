import { wrapEmail, hero, infoTable, ctaButton, dotBadge, C } from './html-utils.ts';

interface AdminNewOrderProps {
  orderData: any;
  transactionType: 'buy' | 'sell' | 'transfer' | string;
  clientName?: string;
  clientEmail?: string;
}

const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

export function adminNewOrderHtml({ orderData, transactionType, clientName, clientEmail }: AdminNewOrderProps): string {
  const isBuy      = transactionType === 'buy';
  const isSell     = transactionType === 'sell';
  const isTransfer = transactionType === 'transfer';

  const typeLabel  = isBuy ? 'Achat USDT' : isSell ? 'Vente USDT' : 'Virement international';
  const reference  = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr    = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const amount     = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt       = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency   = orderData.currency || 'CFA';

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}
  const phoneNumber  = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider     = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const network      = orderData.network || 'TRC-20';
  const wallet       = orderData.wallet_address || null;

  const detailRows = isBuy ? [
    { label: 'Référence',           value: reference,                              mono: true },
    { label: 'Type',                value: typeLabel,                              green: true },
    { label: 'Client',              value: clientName || 'Inconnu' },
    { label: 'Email client',        value: clientEmail || 'N/A',                  mono: true },
    { label: 'Montant payé',        value: `${amount} ${currency}` },
    { label: 'USDT à envoyer',      value: `${usdt} USDT`,                        green: true },
    { label: 'Taux',                value: `${orderData.exchange_rate || 0} ${currency}/USDT` },
    { label: 'Mode de paiement',    value: providerName },
    { label: 'Numéro',              value: phoneNumber,                            mono: true },
    { label: 'Réseau',              value: `TRON (${network})` },
    ...(wallet ? [{ label: 'Adresse wallet', value: wallet, mono: true }] : []),
    { label: 'Date',                value: dateStr,                                last: true },
  ] : isSell ? [
    { label: 'Référence',           value: reference,                              mono: true },
    { label: 'Type',                value: typeLabel,                              green: true },
    { label: 'Client',              value: clientName || 'Inconnu' },
    { label: 'Email client',        value: clientEmail || 'N/A',                  mono: true },
    { label: 'USDT reçu',           value: `${usdt} USDT`,                        green: true },
    { label: 'Montant à verser',    value: `${amount} ${currency}` },
    { label: 'Taux',                value: `${orderData.exchange_rate || 0} ${currency}/USDT` },
    { label: 'Service versement',   value: providerName },
    { label: 'Numéro destinataire', value: phoneNumber,                            mono: true },
    { label: 'Réseau',              value: `TRON (${network})` },
    { label: 'Date',                value: dateStr,                                last: true },
  ] : [
    { label: 'Référence',           value: reference,                              mono: true },
    { label: 'Type',                value: typeLabel,                              green: true },
    { label: 'Client',              value: clientName || 'Inconnu' },
    { label: 'Email client',        value: clientEmail || 'N/A',                  mono: true },
    { label: 'Montant',             value: `${amount} ${currency}` },
    { label: 'Destinataire',        value: orderData.recipient_name || 'N/A' },
    { label: 'Date',                value: dateStr,                                last: true },
  ];

  const urgencyBlock = `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:rgba(59,150,143,0.06);border:1px solid rgba(59,150,143,0.25);border-radius:10px;border-collapse:separate;border-spacing:0;">
      <tr>
        <td style="padding:14px 18px;font-family:${F};font-size:12px;color:${C.textMuted};line-height:1.6;">
          <strong style="color:${C.green};">Action requise :</strong>
          Traitez cette commande dès que possible pour garantir la satisfaction du client.
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({
      eyebrow: `Admin · ${typeLabel}`,
      title: 'Nouvelle commande reçue',
      subtitle: `Une nouvelle demande de <strong style="color:#fafafa;">${typeLabel.toLowerCase()}</strong> vient d'être soumise par <strong style="color:#fafafa;">${clientName || 'un client'}</strong>.`,
    }) +
    infoTable(detailRows, 'Détails de la commande') +
    urgencyBlock +
    ctaButton('Gérer les commandes', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `[Commande] ${typeLabel} · ${reference}`,
    rows,
    dotBadge('En attente de traitement', C.amber),
    `Commande reçue le ${dateStr}`
  );
}
