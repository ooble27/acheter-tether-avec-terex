import { wrapEmail, ctaButton, dotBadge, C } from './html-utils.ts';

interface AdminNewOrderProps {
  orderData: any;
  transactionType: 'buy' | 'sell' | 'transfer' | string;
  clientName?: string;
  clientEmail?: string;
}

const F  = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
const FM = `'SF Mono','Fira Code','Fira Mono','Roboto Mono',monospace`;

/* Affiche le réseau tel que choisi par le client, sans forcer TRON */
function networkDisplay(network: string): string {
  return network || 'N/A';
}

/* Bloc valeur clé — grand, impossible à rater */
function keyBlock(label: string, value: string, sub?: string, color = C.green): string {
  return `
<div style="margin-bottom:12px;">
  <p style="font-family:${F};font-size:10px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;
     color:${C.textDim};margin:0 0 7px 0;">${label}</p>
  <div style="background:${color}12;border:1.5px solid ${color}30;border-radius:14px;padding:16px 20px;">
    <p style="font-family:${FM};font-size:21px;font-weight:800;color:${color};
       margin:0;line-height:1.15;word-break:break-all;letter-spacing:-0.02em;">${value}</p>
    ${sub ? `<p style="font-family:${F};font-size:11px;color:${C.textMuted};margin:6px 0 0 0;">${sub}</p>` : ''}
  </div>
</div>`;
}

/* Étape numérotée avec design soigné */
function step(num: number, emoji: string, title: string, content: string, done = false): string {
  const numBg   = done ? C.green            : num === 1 ? C.amber : C.green;
  const numText = done ? '#fff'             : '#fff';
  return `
<tr>
  <td style="padding:0 20px 14px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background:${C.cardBg};border:1px solid ${C.border};border-radius:18px;
             overflow:hidden;border-collapse:separate;border-spacing:0;">
      <!-- numéro + titre -->
      <tr>
        <td style="padding:16px 18px 12px;border-bottom:1px solid ${C.borderSoft};">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="width:36px;vertical-align:middle;">
                <div style="width:34px;height:34px;border-radius:11px;background:${numBg};
                  font-family:${F};font-size:16px;font-weight:900;color:${numText};
                  text-align:center;line-height:34px;">${num}</div>
              </td>
              <td style="padding-left:12px;vertical-align:middle;">
                <p style="font-family:${F};font-size:14px;font-weight:700;color:${C.text};
                   margin:0;line-height:1.2;">${emoji}&nbsp; ${title}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- contenu -->
      <tr>
        <td style="padding:16px 18px 18px;">
          ${content}
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr><td style="height:6px;"></td></tr>`;
}

export function adminNewOrderHtml({ orderData, transactionType, clientName, clientEmail }: AdminNewOrderProps): string {
  const isBuy  = transactionType === 'buy';
  const isSell = transactionType === 'sell';

  const typeLabel = isBuy ? 'Achat USDT' : isSell ? 'Vente USDT' : 'Virement';
  const typeBadge = isBuy ? '🟢 ACHAT' : isSell ? '🔴 VENTE' : '🔵 VIREMENT';
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
  const network      = networkDisplay(orderData.network || 'TRC-20');
  const wallet       = orderData.wallet_address || null;
  const client       = clientName || 'Client';

  /* ── HEADER PREMIUM ─────────────────────────────────────────────────────── */
  const header = `
<tr>
  <td style="background:linear-gradient(150deg,#0b1a19 0%,#060e0d 100%);padding:0;">
    <!-- bande colorée top -->
    <div style="height:4px;background:linear-gradient(90deg,${C.green},${C.green}88,transparent);"></div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding:28px 24px 24px;">
          <!-- badge type -->
          <div style="display:inline-block;background:${isBuy ? 'rgba(59,150,143,0.15)' : isSell ? 'rgba(248,113,113,0.12)' : 'rgba(96,165,250,0.12)'};
            border:1px solid ${isBuy ? 'rgba(59,150,143,0.35)' : isSell ? 'rgba(248,113,113,0.3)' : 'rgba(96,165,250,0.3)'};
            border-radius:100px;padding:5px 14px;margin-bottom:16px;">
            <span style="font-family:${F};font-size:11px;font-weight:700;letter-spacing:0.08em;
              color:${isBuy ? C.green : isSell ? '#f87171' : '#60a5fa'};">${typeBadge}</span>
          </div>
          <!-- ref + titre -->
          <p style="font-family:${FM};font-size:12px;color:${C.textDim};margin:0 0 8px 0;">${reference}</p>
          <p style="font-family:${F};font-size:28px;font-weight:900;color:#fff;margin:0 0 6px 0;line-height:1.1;">
            Nouvelle commande
          </p>
          <p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;">
            Reçue le ${dateStr}
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  /* ── RÉSUMÉ TRANSACTION (2 montants côte à côte) ────────────────────────── */
  const payLabel  = isBuy  ? 'Le client paie'    : isSell ? 'Le client envoie' : 'Montant';
  const payVal    = isBuy  ? `${amount} ${currency}` : isSell ? `${usdt} USDT`   : `${amount} ${currency}`;
  const paySub    = isBuy  ? providerName         : isSell ? network            : 'Virement';
  const recvLabel = isBuy  ? 'Vous envoyez'       : isSell ? 'Vous versez'      : 'Destinataire';
  const recvVal   = isBuy  ? `${usdt} USDT`       : isSell ? `${amount} ${currency}` : (orderData.recipient_name || 'N/A');
  const recvSub   = isBuy  ? network              : isSell ? providerName       : '';

  const summary = `
<tr>
  <td style="padding:0 20px 20px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border-collapse:separate;border-spacing:0;border-radius:16px;overflow:hidden;
             border:1px solid ${C.border};background:${C.rowBg};">
      <tr>
        <!-- gauche -->
        <td style="padding:20px;width:50%;border-right:1px solid ${C.border};vertical-align:middle;">
          <p style="font-family:${F};font-size:9px;font-weight:700;letter-spacing:0.12em;
             text-transform:uppercase;color:${C.textDim};margin:0 0 8px 0;">${payLabel}</p>
          <p style="font-family:${FM};font-size:22px;font-weight:900;color:#fff;margin:0;line-height:1;">${payVal}</p>
          <p style="font-family:${F};font-size:11px;color:${C.textMuted};margin:6px 0 0 0;">${paySub}</p>
        </td>
        <!-- droite -->
        <td style="padding:20px;width:50%;vertical-align:middle;">
          <p style="font-family:${F};font-size:9px;font-weight:700;letter-spacing:0.12em;
             text-transform:uppercase;color:${C.textDim};margin:0 0 8px 0;">${recvLabel}</p>
          <p style="font-family:${FM};font-size:22px;font-weight:900;color:${C.green};margin:0;line-height:1;">${recvVal}</p>
          <p style="font-family:${F};font-size:11px;color:${C.textMuted};margin:6px 0 0 0;">${recvSub}</p>
        </td>
      </tr>
      <!-- taux -->
      <tr>
        <td colspan="2" style="padding:10px 20px;border-top:1px solid ${C.border};">
          <p style="font-family:${F};font-size:11px;color:${C.textDim};margin:0;text-align:center;">
            Taux appliqué : <strong style="color:${C.text};">${rate} ${currency}/USDT</strong>
            &nbsp;·&nbsp; Client : <strong style="color:${C.text};">${client}</strong>
            ${clientEmail ? `&nbsp;·&nbsp; <a href="mailto:${clientEmail}" style="color:${C.green};text-decoration:none;">${clientEmail}</a>` : ''}
          </p>
        </td>
      </tr>
    </table>
  </td>
</tr>
<tr><td style="height:4px;"></td></tr>`;

  /* ── SECTION LABEL ──────────────────────────────────────────────────────── */
  const sectionLbl = `
<tr>
  <td style="padding:4px 20px 14px;">
    <p style="font-family:${F};font-size:10px;font-weight:800;letter-spacing:0.14em;
       text-transform:uppercase;color:${C.textDim};margin:0;">
      ▸ &nbsp;À FAIRE — dans l'ordre
    </p>
  </td>
</tr>`;

  /* ── ÉTAPES ─────────────────────────────────────────────────────────────── */
  let steps = '';

  if (isBuy) {
    steps =
      step(1, '🔍', 'Vérifier le paiement reçu',
        keyBlock(`${providerName} · Numéro`, phone, undefined, C.amber) +
        keyBlock('Montant à confirmer', `${amount} ${currency}`, `Taux : ${rate} ${currency}/USDT`, C.amber)
      ) +
      step(2, '📤', 'Envoyer les USDT au client',
        keyBlock('Montant à envoyer', `${usdt} USDT`, `Réseau : ${network}`, C.green) +
        (wallet ? keyBlock('Adresse de destination', wallet, 'Copiez cette adresse exactement — réseau ' + network, C.green) : '')
      ) +
      step(3, '✅', 'Finaliser dans le dashboard',
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.65;">
          Marquez <strong style="font-family:${FM};color:${C.text};font-size:12px;">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>.
          Le client recevra sa confirmation par email automatiquement.
        </p>`
      );
  } else if (isSell) {
    steps =
      step(1, '🔍', 'Vérifier la réception des USDT',
        keyBlock('USDT à recevoir', `${usdt} USDT`, `Réseau : ${network}`, C.amber)
      ) +
      step(2, '💸', 'Verser les fonds au client',
        keyBlock(`${providerName} · Numéro à créditer`, phone, undefined, C.green) +
        keyBlock('Montant à verser', `${amount} ${currency}`, `Taux : ${rate} ${currency}/USDT`, C.green)
      ) +
      step(3, '✅', 'Finaliser dans le dashboard',
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.65;">
          Marquez <strong style="font-family:${FM};color:${C.text};font-size:12px;">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>.
          Le client recevra sa confirmation par email automatiquement.
        </p>`
      );
  } else {
    steps =
      step(1, '🔍', 'Vérifier la demande',
        keyBlock('Montant', `${amount} ${currency}`, '', C.amber) +
        keyBlock('Destinataire', orderData.recipient_name || 'N/A', '', C.amber)
      ) +
      step(2, '📤', 'Effectuer le virement',
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.65;">
          Procédez au virement selon les informations renseignées par le client dans le dashboard.
        </p>`
      ) +
      step(3, '✅', 'Confirmer et finaliser',
        `<p style="font-family:${F};font-size:13px;color:${C.textMuted};margin:0;line-height:1.65;">
          Marquez <strong style="font-family:${FM};color:${C.text};font-size:12px;">${reference}</strong>
          comme <strong style="color:${C.green};">Finalisée</strong>.
        </p>`
      );
  }

  /* ── ASSEMBLAGE ─────────────────────────────────────────────────────────── */
  const rows =
    header +
    `<tr><td style="height:20px;"></td></tr>` +
    summary +
    sectionLbl +
    steps +
    `<tr><td style="height:8px;"></td></tr>` +
    ctaButton('Ouvrir le dashboard admin', 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `[${typeLabel}] ${reference} — Action requise`,
    rows,
    dotBadge('Action requise', C.amber),
    `Commande reçue le ${dateStr}`
  );
}
