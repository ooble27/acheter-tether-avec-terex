import { wrapEmail, ctaButton, dotBadge, C } from './html-utils.ts';

interface AdminNewOrderProps {
  orderData: any;
  transactionType: 'buy' | 'sell' | 'transfer' | string;
  clientName?: string;
  clientEmail?: string;
}

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const FM = `'SF Mono','Fira Code','Fira Mono','Roboto Mono',monospace`;

/* ── Blocs de valeur mis en évidence ─────────────────────────────────────── */

function bigValue(label: string, value: string, sub?: string, color = C.green): string {
  return `
<div style="margin-bottom:10px;">
  <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${C.textDim};margin:0 0 6px 0;">${label}</p>
  <div style="background:${color}14;border:1.5px solid ${color}33;border-radius:12px;padding:14px 18px;">
    <p style="font-family:${FM};font-size:22px;font-weight:800;color:${color};margin:0;line-height:1.1;word-break:break-all;">${value}</p>
    ${sub ? `<p style="font-family:${F};font-size:11px;color:${C.textMuted};margin:5px 0 0 0;">${sub}</p>` : ''}
  </div>
</div>`;
}

function infoChip(label: string, value: string): string {
  return `<span style="display:inline-block;background:${C.rowBg};border:1px solid ${C.border};border-radius:8px;padding:5px 12px;font-family:${FM};font-size:12px;color:${C.textMuted};margin:3px 4px 3px 0;">${label}&nbsp;<strong style="color:${C.text};">${value}</strong></span>`;
}

/* ── Étape numérotée grande ─────────────────────────────────────────────── */

function step(num: number, title: string, body: string, accent = C.green): string {
  return `
<tr>
  <td style="padding:0 24px 18px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:separate;border-spacing:0;">
      <tr>
        <!-- numéro cercle -->
        <td style="width:52px;vertical-align:top;padding-top:2px;">
          <div style="width:44px;height:44px;border-radius:14px;background:${accent};
            font-family:${F};font-size:20px;font-weight:900;color:#fff;
            text-align:center;line-height:44px;">${num}</div>
        </td>
        <!-- contenu -->
        <td style="vertical-align:top;padding-left:14px;">
          <p style="font-family:${F};font-size:15px;font-weight:700;color:${C.text};margin:0 0 10px 0;line-height:1.3;">${title}</p>
          ${body}
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr><td style="height:6px;"></td></tr>`;
}

/* ── Bandeau montants (hero de commande) ────────────────────────────────── */

function orderBanner(left: {label:string;val:string;sub:string}, right: {label:string;val:string;sub:string}): string {
  return `
<tr>
  <td style="padding:0 24px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:linear-gradient(135deg,#0e1f1d 0%,#0a1210 100%);
             border:1px solid rgba(59,150,143,0.25);border-radius:16px;
             overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <!-- gauche -->
        <td style="padding:22px 20px;width:50%;border-right:1px solid rgba(59,150,143,0.15);vertical-align:middle;">
          <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:0 0 8px 0;">${left.label}</p>
          <p style="font-family:${FM};font-size:26px;font-weight:900;color:#fff;margin:0;line-height:1;">${left.val}</p>
          <p style="font-family:${F};font-size:11px;color:rgba(255,255,255,0.4);margin:5px 0 0 0;">${left.sub}</p>
        </td>
        <!-- droite -->
        <td style="padding:22px 20px;width:50%;vertical-align:middle;">
          <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin:0 0 8px 0;">${right.label}</p>
          <p style="font-family:${FM};font-size:26px;font-weight:900;color:${C.green};margin:0;line-height:1;">${right.val}</p>
          <p style="font-family:${F};font-size:11px;color:rgba(255,255,255,0.4);margin:5px 0 0 0;">${right.sub}</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;
}

/* ── Diviseur section ───────────────────────────────────────────────────── */

function sectionTitle(label: string): string {
  return `
<tr>
  <td style="padding:4px 24px 18px;">
    <p style="font-family:${F};font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:${C.textDim};margin:0;border-left:3px solid ${C.green};padding-left:10px;">${label}</p>
  </td>
</tr>`;
}

/* ── Composant principal ────────────────────────────────────────────────── */

export function adminNewOrderHtml({ orderData, transactionType, clientName, clientEmail }: AdminNewOrderProps): string {
  const isBuy  = transactionType === 'buy';
  const isSell = transactionType === 'sell';

  const typeLabel = isBuy ? 'Achat USDT' : isSell ? 'Vente USDT' : 'Virement';
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr   = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const amount    = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt      = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const currency  = orderData.currency || 'CFA';
  const rate      = orderData.exchange_rate || 0;

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phone        = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider     = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName = provider === 'wave' ? 'Wave' : (provider === 'orange' || provider === 'orange_money') ? 'Orange Money' : 'Mobile Money';
  const network      = orderData.network || 'TRC-20';
  const wallet       = orderData.wallet_address || null;
  const client       = clientName || 'Client';

  /* ── Hero header ────────────────────────────────────────────────────── */
  const headerHtml = `
<tr>
  <td style="background:linear-gradient(160deg,#0a1615 0%,#080f0e 100%);padding:32px 24px 28px;border-bottom:1px solid ${C.border};">
    <!-- eyebrow -->
    <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:${C.green};margin:0 0 10px 0;">
      ● Admin · ${typeLabel}
    </p>
    <!-- titre principal -->
    <p style="font-family:${F};font-size:26px;font-weight:900;color:#fff;margin:0 0 6px 0;line-height:1.15;">
      Nouvelle commande
    </p>
    <p style="font-family:${FM};font-size:13px;color:${C.textMuted};margin:0 0 14px 0;">${reference}</p>
    <!-- client chip -->
    <div style="display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,0.05);border:1px solid ${C.border};border-radius:100px;padding:6px 14px;">
      <span style="font-family:${F};font-size:12px;color:#fff;font-weight:600;">${client}</span>
      ${clientEmail ? `<span style="font-family:${F};font-size:11px;color:${C.textDim};">${clientEmail}</span>` : ''}
    </div>
  </td>
</tr>
<tr><td style="height:24px;"></td></tr>`;

  /* ── Bandeau montants ───────────────────────────────────────────────── */
  let banner = '';
  if (isBuy) {
    banner = orderBanner(
      { label: 'Client paie',   val: `${amount} ${currency}`, sub: providerName },
      { label: 'Vous envoyez',  val: `${usdt} USDT`,           sub: `TRON · ${network}` }
    );
  } else if (isSell) {
    banner = orderBanner(
      { label: 'Client envoie', val: `${usdt} USDT`,           sub: `TRON · ${network}` },
      { label: 'Vous versez',   val: `${amount} ${currency}`,   sub: providerName }
    );
  } else {
    const toAmt = Number(orderData.total_amount || orderData.amount || 0).toLocaleString('fr-FR');
    banner = orderBanner(
      { label: 'Montant',      val: `${amount} ${currency}`,   sub: 'Virement international' },
      { label: 'Destinataire', val: orderData.recipient_name || 'N/A', sub: '' }
    );
  }

  /* ── Étapes ─────────────────────────────────────────────────────────── */
  let steps = sectionTitle('Ce que vous devez faire');

  if (isBuy) {
    steps +=
      step(1, `Vérifier que le paiement a bien été reçu`,
        bigValue(`${providerName} · Numéro`, phone, undefined, C.amber) +
        bigValue('Montant attendu', `${amount} ${currency}`, `Taux : ${rate} ${currency}/USDT`, C.amber),
        C.amber
      ) +
      step(2, `Envoyer les USDT au client`,
        bigValue('Montant à envoyer', `${usdt} USDT`, `Réseau TRON · ${network}`, C.green) +
        (wallet ? bigValue('Adresse destination', wallet, 'Copiez cette adresse exactement', C.green) : ''),
        C.green
      ) +
      step(3, `Finaliser la commande dans le dashboard`,
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.6;">
          Marquez la commande <strong style="font-family:${FM};color:${C.text};">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>. Le client recevra sa confirmation automatiquement.
        </p>`,
        C.green
      );
  } else if (isSell) {
    steps +=
      step(1, `Vérifier la réception des USDT`,
        bigValue('USDT attendus', `${usdt} USDT`, `Réseau TRON · ${network}`, C.amber),
        C.amber
      ) +
      step(2, `Verser les fonds au client`,
        bigValue(`${providerName} · Numéro à créditer`, phone, undefined, C.green) +
        bigValue('Montant à verser', `${amount} ${currency}`, `Taux appliqué : ${rate} ${currency}/USDT`, C.green),
        C.green
      ) +
      step(3, `Finaliser la commande dans le dashboard`,
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.6;">
          Marquez la commande <strong style="font-family:${FM};color:${C.text};">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>. Le client recevra sa confirmation automatiquement.
        </p>`,
        C.green
      );
  } else {
    steps +=
      step(1, `Vérifier la demande de virement`,
        bigValue('Montant', `${amount} ${currency}`, 'Virement international', C.amber) +
        bigValue('Destinataire', orderData.recipient_name || 'N/A', '', C.amber),
        C.amber
      ) +
      step(2, `Effectuer le virement`,
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.6;">
          Procédez au virement selon les informations renseignées dans le dashboard par le client.
        </p>`,
        C.green
      ) +
      step(3, `Confirmer et finaliser`,
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.6;">
          Marquez la commande <strong style="font-family:${FM};color:${C.text};">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>.
        </p>`,
        C.green
      );
  }

  /* ── Assemblage ─────────────────────────────────────────────────────── */
  const rows =
    headerHtml +
    banner +
    steps +
    `<tr><td style="height:8px;"></td></tr>` +
    ctaButton('Ouvrir le dashboard admin', 'https://terangaexchange.com/dashboard');

  // wrapEmail sans hero standard — on utilise notre propre header
  return wrapEmail(
    `[${typeLabel}] ${reference} — Action requise`,
    rows,
    dotBadge('Action requise', C.amber),
    `Commande reçue le ${dateStr}`
  );
}
