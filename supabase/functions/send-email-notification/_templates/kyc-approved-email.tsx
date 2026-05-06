import { wrapEmail, hero, infoTable, ctaButton, statusBadge, checkRing } from './html-utils.ts';

interface KYCApprovedEmailProps {
  magicLink: string;
  userFirstName: string;
  userLastName: string;
}

export function kycApprovedHtml({ magicLink, userFirstName, userLastName }: KYCApprovedEmailProps): string {
  const fullName = [userFirstName, userLastName].filter(Boolean).join(' ');
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const subtitle = fullName
    ? `Félicitations ${userFirstName}, votre vérification KYC a été approuvée. Votre compte Terex est maintenant pleinement actif.`
    : 'Votre vérification KYC a été approuvée. Votre compte Terex est maintenant pleinement actif.';

  const C = { green: '#3B968F', text: '#fafafa', textDim: '#3f3f46', border: '#1f1f23', infoBg: '#0e0e0e' };
  const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const perks = `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <td class="scol" style="padding:20px 16px;vertical-align:top;width:33%;border-right:1px solid ${C.border};text-align:center;">
          <p class="etxt" style="font-family:${F};font-size:17px;font-weight:700;color:${C.text};margin:0 0 4px 0;">5M+</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:0;line-height:1.5;">CFA / jour<br>de limite</p>
        </td>
        <td class="scol" style="padding:20px 16px;vertical-align:top;width:33%;border-right:1px solid ${C.border};text-align:center;">
          <p class="etxt" style="font-family:${F};font-size:17px;font-weight:700;color:${C.text};margin:0 0 4px 0;">Priorité</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:0;line-height:1.5;">Traitement<br>accéléré</p>
        </td>
        <td class="scol scol-last" style="padding:20px 16px;vertical-align:top;width:34%;text-align:center;">
          <p class="etxt" style="font-family:${F};font-size:17px;font-weight:700;color:${C.text};margin:0 0 4px 0;">Afrique</p>
          <p class="edim" style="font-family:${F};font-size:11px;color:${C.textDim};margin:0;line-height:1.5;">Transferts<br>internationaux</p>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({ iconHtml: checkRing(), title: 'Votre identité a été vérifiée', subtitle }) +
    perks +
    infoTable([
      { label: 'Statut KYC',         value: 'Approuvé',          green: true },
      { label: 'Date de vérification',value: today },
      { label: 'Niveau de compte',   value: 'Premium',            green: true },
      { label: 'Limite journalière', value: '5 000 000 CFA',      last: true },
    ], 'Informations du compte') +
    ctaButton('Accéder à mon compte', magicLink || 'https://terangaexchange.com/dashboard');

  return wrapEmail(
    'Votre identité a été vérifiée — Compte Terex activé',
    rows,
    statusBadge('Compte vérifié', 'success'),
    'Vous avez reçu cet email suite à la validation de votre dossier KYC sur Terex.'
  );
}
