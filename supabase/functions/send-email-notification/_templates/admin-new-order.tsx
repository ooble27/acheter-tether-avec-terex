import { wrapEmail, hero, ctaButton, dotBadge, C } from './html-utils.ts';

interface AdminNewOrderProps {
  orderData: any;
  transactionType: 'buy' | 'sell' | 'transfer' | string;
  clientName?: string;
  clientEmail?: string;
}

const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

// Bloc valeur mise en évidence (wallet, numéro, montant clé)
function highlight(value: string, color = C.green): string {
  return `<span style="font-family:monospace,monospace;font-size:13px;font-weight:700;color:${color};background:rgba(59,150,143,0.08);border:1px solid rgba(59,150,143,0.2);border-radius:6px;padding:2px 8px;display:inline-block;word-break:break-all;">${value}</span>`;
}

// Une étape numérotée avec un titre et un corps
function step(num: number, title: string, body: string, accent = C.green): string {
  return `
<tr>
  <td style="padding:0 24px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${C.cardBg};border:1px solid ${C.border};border-radius:14px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <td style="width:48px;padding:18px 0 18px 18px;vertical-align:top;">
          <div style="width:32px;height:32px;border-radius:10px;background:${accent};display:flex;align-items:center;justify-content:center;font-family:${F};font-size:14px;font-weight:800;color:#fff;text-align:center;line-height:32px;">
            ${num}
          </div>
        </td>
        <td style="padding:18px 18px 18px 12px;vertical-align:top;">
          <p style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${accent};margin:0 0 6px 0;">${title}</p>
          <p style="font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.7;margin:0;">${body}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

// Séparateur entre étapes
const gap = `<tr><td style="height:4px;"></td></tr>`;

// En-tête de section "À FAIRE"
function sectionHeader(label: string): string {
  return `
<tr>
  <td style="padding:4px 24px 12px;">
    <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.textDim};margin:0;">${label}</p>
  </td>
</tr>`;
}

export function adminNewOrderHtml({ orderData, transactionType, clientName, clientEmail }: AdminNewOrderProps): string {
  const isBuy  = transactionType === 'buy';
  const isSell = transactionType === 'sell';

  const typeLabel = isBuy ? 'Achat USDT' : isSell ? 'Vente USDT' : 'Virement international';
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr   = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const amount    = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt      = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency  = orderData.currency || 'CFA';
  const rate      = orderData.exchange_rate || 0;

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phoneNumber  = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider     = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const network      = orderData.network || 'TRC-20';
  const wallet       = orderData.wallet_address || null;
  const client       = clientName || 'Client';

  let steps = '';

  if (isBuy) {
    // Client paie CFA → admin envoie USDT
    steps =
      sectionHeader('Ce que vous devez faire — dans l\'ordre') +
      step(1, 'Vérifier le paiement reçu',
        `Confirmez que ${highlight(`${amount} ${currency}`)} ont bien été reçus via ${highlight(providerName)} depuis le numéro ${highlight(phoneNumber)}.`,
        C.amber
      ) +
      gap +
      step(2, 'Envoyer les USDT au client',
        `Transférez ${highlight(`${usdt} USDT`)} sur le réseau ${highlight(`TRON · ${network}`)} à l'adresse suivante :<br/><br/>${highlight(wallet || 'Adresse non renseignée')}`,
        C.green
      ) +
      gap +
      step(3, 'Finaliser la commande',
        `Dans le dashboard, marquez la commande ${highlight(reference)} comme <strong style="color:${C.green};">Finalisée</strong> et envoyez la confirmation au client.`,
        C.green
      );
  } else if (isSell) {
    // Client envoie USDT → admin verse CFA
    steps =
      sectionHeader('Ce que vous devez faire — dans l\'ordre') +
      step(1, 'Vérifier la réception des USDT',
        `Confirmez la réception de ${highlight(`${usdt} USDT`)} sur notre adresse TRON (réseau ${highlight(`TRON · ${network}`)}).`,
        C.amber
      ) +
      gap +
      step(2, 'Verser les fonds au client',
        `Envoyez ${highlight(`${amount} ${currency}`)} via ${highlight(providerName)} au numéro ${highlight(phoneNumber)}.`,
        C.green
      ) +
      gap +
      step(3, 'Finaliser la commande',
        `Dans le dashboard, marquez la commande ${highlight(reference)} comme <strong style="color:${C.green};">Finalisée</strong> et envoyez la confirmation au client.`,
        C.green
      );
  } else {
    // Virement
    const recipientName  = orderData.recipient_name || 'N/A';
    const fromCurrency   = orderData.from_currency || 'USDT';
    steps =
      sectionHeader('Ce que vous devez faire — dans l\'ordre') +
      step(1, 'Vérifier la demande de virement',
        `Confirmez la demande de ${highlight(`${amount} ${fromCurrency}`)} pour le destinataire ${highlight(recipientName)}.`,
        C.amber
      ) +
      gap +
      step(2, 'Effectuer le virement',
        `Procédez au virement international vers ${highlight(recipientName)} selon les informations renseignées dans le dashboard.`,
        C.green
      ) +
      gap +
      step(3, 'Confirmer et finaliser',
        `Marquez la commande ${highlight(reference)} comme <strong style="color:${C.green};">Finalisée</strong> une fois le virement confirmé.`,
        C.green
      );
  }

  // Bloc info client compact (juste ce qui est utile en un coup d'œil)
  const clientBlock = `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:12px;border-collapse:separate;border-spacing:0;">
      <tr>
        <td style="padding:10px 16px 10px;font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">
          Infos client
        </td>
      </tr>
      <tr>
        <td style="padding:14px 16px;font-family:${F};font-size:12px;color:${C.textMuted};line-height:2;">
          <strong style="color:${C.text};">${client}</strong>${clientEmail ? ` &nbsp;·&nbsp; <a href="mailto:${clientEmail}" style="color:${C.green};text-decoration:none;font-family:monospace;">${clientEmail}</a>` : ''}<br/>
          Taux appliqué : <strong style="color:${C.text};">${rate} ${currency}/USDT</strong> &nbsp;·&nbsp; ${dateStr}
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({
      eyebrow: `Admin · ${typeLabel}`,
      title: `Nouvelle commande — ${reference}`,
      subtitle: `<strong style="color:#fafafa;">${client}</strong> vient de soumettre une demande de <strong style="color:#fafafa;">${typeLabel.toLowerCase()}</strong>. Traitez-la dès que possible.`,
    }) +
    `<tr><td style="height:8px;"></td></tr>` +
    steps +
    `<tr><td style="height:8px;"></td></tr>` +
    clientBlock +
    ctaButton('Ouvrir le dashboard admin', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `[${typeLabel}] ${reference} — Action requise`,
    rows,
    dotBadge('Action requise', C.amber),
    `Commande reçue le ${dateStr}`
  );
}
