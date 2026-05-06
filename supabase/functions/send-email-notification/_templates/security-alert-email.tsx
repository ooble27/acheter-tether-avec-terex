import { wrapEmail, hero, infoTable, noticeBox, alertRing, C } from './html-utils.ts';

interface SecurityAlertEmailProps {
  device?: string;
  location?: string;
  date?: string;
  secureLink?: string;
}

export function securityAlertHtml({
  device = 'Appareil inconnu',
  location = 'Localisation inconnue',
  date,
  secureLink = 'https://terangaexchange.com/dashboard',
}: SecurityAlertEmailProps): string {
  const dateStr = date || new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
  const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const dualButtons = `
<tr>
  <td style="padding:0 24px 32px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right:10px;">
          <a href="${secureLink}" style="display:inline-block;background-color:${C.green};color:#ffffff;font-family:${F};font-size:13px;font-weight:600;padding:13px 28px;border-radius:8px;text-decoration:none;">Sécuriser mon compte</a>
        </td>
        <td>
          <a href="https://terangaexchange.com/dashboard" class="emuted" style="display:inline-block;background-color:${C.rowBg};color:${C.textMuted};font-family:${F};font-size:13px;font-weight:500;padding:13px 28px;border-radius:8px;text-decoration:none;border:1px solid ${C.border};">C'est moi</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({ iconHtml: alertRing('⚠', C.red), title: 'Connexion depuis un nouvel appareil', subtitle: "Une connexion à votre compte Terex a été détectée depuis un appareil inconnu. Si ce n'est pas vous, sécurisez votre compte immédiatement." }) +
    `<tr><td style="height:28px;"></td></tr>` +
    infoTable([
      { label: 'Date',        value: dateStr },
      { label: 'Appareil',    value: device },
      { label: 'Localisation',value: location, last: true },
    ], 'Détails de la connexion') +
    noticeBox("Si c'est bien vous, ignorez cet email. Sinon, cliquez sur \"Sécuriser mon compte\" pour changer votre mot de passe et révoquer l'accès.", 'warning') +
    dualButtons;

  return wrapEmail(
    'Connexion depuis un nouvel appareil — Terex',
    rows,
    `<span style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;color:${C.red};">&#9679; Alerte sécurité</span>`,
    'Vous avez reçu cet email suite à une activité de connexion sur votre compte Terex.'
  );
}
