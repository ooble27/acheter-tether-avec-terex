import { wrapEmail, hero, infoTable, ctaButton, sectionLabel, C } from './html-utils.ts';

interface TransferConfirmationProps {
  transferData: any;
  clientName?: string;
}

const COUNTRIES: Record<string, string> = {
  SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso', NG: 'Nigeria', BJ: 'Bénin',
};

export function transferConfirmationHtml({ transferData, clientName }: TransferConfirmationProps): string {
  const country = COUNTRIES[transferData.recipient_country] || transferData.recipient_country || 'N/A';
  const providerName =
    transferData.provider === 'wave' ? 'Wave' :
    transferData.provider === 'orange' || transferData.provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `#TX-TEREX-${(transferData.id || '').slice(-5).toUpperCase()}`;
  const recipName = transferData.recipient_name || 'Destinataire';
  const initials = recipName
    .split(' ')
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const amountSent = Number(transferData.amount || 0).toLocaleString('fr-FR');
  const amountReceived = Number(transferData.total_amount || 0).toLocaleString('fr-FR');
  const fromCur = transferData.from_currency || 'USDT';
  const toCur = transferData.to_currency || 'CFA';
  const dateStr = new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;
  const FM = `ui-monospace,SFMono-Regular,Menlo,'Courier New',monospace`;

  const subtitle = clientName
    ? `Bonjour ${clientName}, votre transfert vers ${recipName} (${country}) est confirmé.`
    : `Votre transfert vers ${recipName} (${country}) est confirmé.`;

  const flowBar = `
<tr>
  <td class="ebar" bgcolor="${C.footerBg}" style="background-color:${C.footerBg};border-top:1px solid ${C.border};border-bottom:1px solid ${C.border};padding:20px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="vertical-align:top;width:42%;">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 6px 0;">Vous avez envoyé</p>
          <p class="etxt" style="font-family:${F};font-size:24px;font-weight:600;color:${C.text};margin:0;line-height:1.1;">${amountSent} <span class="emuted" style="font-size:14px;font-weight:500;color:${C.textMuted};">${fromCur}</span></p>
        </td>
        <td style="width:16%;text-align:center;vertical-align:middle;">
          <p class="egreen" style="font-family:${F};font-size:20px;font-weight:700;color:${C.green};margin:0;">→</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:6px 0 0 0;">1 ${fromCur} = ${transferData.exchange_rate || 0} ${toCur}</p>
        </td>
        <td style="vertical-align:top;width:42%;text-align:right;">
          <p class="edim" style="font-family:${F};font-size:9px;letter-spacing:1.5px;text-transform:uppercase;color:${C.textDim};margin:0 0 6px 0;">Bénéficiaire reçoit</p>
          <p class="egreen" style="font-family:${F};font-size:24px;font-weight:600;color:${C.green};margin:0;line-height:1.1;">${amountReceived} <span style="font-size:14px;font-weight:500;">${toCur}</span></p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const recipientCard = `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;overflow:hidden;">
      <tr>
        <td style="padding:16px 20px;vertical-align:middle;width:56px;">
          <div style="width:44px;height:44px;border-radius:50%;background-color:${C.rowBg};border:1px solid ${C.border};color:${C.textMuted};font-size:13px;font-weight:600;text-align:center;line-height:44px;font-family:${FM};">${initials}</div>
        </td>
        <td style="padding:16px 0;vertical-align:middle;">
          <p class="etxt" style="font-family:${F};font-size:14px;font-weight:500;color:${C.text};margin:0 0 3px 0;">${recipName}</p>
          ${transferData.recipient_phone ? `<p class="emuted" style="font-family:${FM};font-size:12px;color:${C.textMuted};margin:0;">${transferData.recipient_phone}</p>` : ''}
        </td>
        <td style="padding:16px 20px;vertical-align:middle;text-align:right;">
          <span class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};background-color:${C.rowBg};border:1px solid ${C.border};padding:5px 12px;border-radius:6px;">${providerName}</span>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({ reference: `Référence · ${reference}`, title: 'Transfert déposé avec succès', date: dateStr, subtitle }) +
    flowBar +
    `<tr><td style="height:28px;"></td></tr>` +
    sectionLabel('Bénéficiaire') +
    recipientCard +
    sectionLabel('Détail du transfert') +
    infoTable([
      { label: 'Référence',       value: reference,                                                     mono: true },
      { label: 'Date',            value: dateStr },
      { label: 'Montant envoyé',  value: `${amountSent} ${fromCur}` },
      { label: 'Montant reçu',    value: `${amountReceived} ${toCur}`,                                  green: true },
      { label: 'Frais de service',value: `${Number(transferData.fees || 0).toLocaleString('fr-FR')} ${fromCur}` },
      { label: 'Taux de change',  value: `${transferData.exchange_rate || 0} ${toCur} / ${fromCur}` },
      { label: 'Pays destination',value: country },
      { label: 'Statut',          value: 'Déposé',                                                      green: true, last: true },
    ]) +
    ctaButton("Voir l'historique", 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    `${reference} — ${recipName} (${country})`,
    rows,
    'Transfert international',
    'Vous avez reçu cet email suite à votre transfert international sur Terex.'
  );
}
