import { wrapEmail, hero, noticeBox, ctaButton, sectionLabel, steps, alertRing, C } from './html-utils.ts';

interface KYCRejectedEmailProps {
  userFirstName?: string;
  reasons?: string[];
  resubmitLink?: string;
}

const DEFAULT_REASONS = [
  'Photo du document floue ou illisible',
  'Visage non visible clairement sur le selfie',
  'Assurez-vous que toutes les pièces du document sont visibles',
];

const STEPS = [
  'Prenez la photo en bonne lumière naturelle',
  'Document entier visible, sans reflet ni ombre',
  'Selfie : visage dégagé, bien éclairé, document tenu bien visible',
];

export function kycRejectedHtml({
  userFirstName,
  reasons = DEFAULT_REASONS,
  resubmitLink = 'https://terangaexchange.com/dashboard',
}: KYCRejectedEmailProps): string {
  const subtitle = userFirstName
    ? `Bonjour ${userFirstName}, votre dossier n'a pas pu être validé. Vous pouvez le soumettre à nouveau avec les corrections indiquées ci-dessous.`
    : "Votre dossier n'a pas pu être validé. Vous pouvez le soumettre à nouveau avec les corrections indiquées ci-dessous.";

  const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const reasonRows = reasons.map((r, i) => `
    <tr>
      <td style="padding:12px 16px;width:12px;vertical-align:middle;${i < reasons.length - 1 ? `border-bottom:1px solid ${C.borderSoft};` : ''}">
        <div style="width:6px;height:6px;border-radius:50%;background-color:${C.red};"></div>
      </td>
      <td class="ered" style="padding:12px 16px 12px 4px;font-family:${F};font-size:12px;color:${C.red};line-height:1.5;${i < reasons.length - 1 ? `border-bottom:1px solid ${C.borderSoft};` : ''}">${r}</td>
    </tr>`).join('');

  const reasonsBlock = `
<tr>
  <td style="padding:0 24px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <td colspan="2" class="edim" style="padding:10px 16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">Problèmes détectés</td>
      </tr>
      ${reasonRows}
    </table>
  </td>
</tr>`;

  const rows =
    hero({ iconHtml: alertRing('!', C.red), title: "Votre vérification KYC n'a pas abouti", subtitle }) +
    `<tr><td style="height:28px;"></td></tr>` +
    sectionLabel('Raison(s) du refus') +
    reasonsBlock +
    sectionLabel('Comment corriger') +
    steps(STEPS.map(t => ({ text: t }))) +
    noticeBox('Vous avez 7 jours pour soumettre à nouveau votre dossier. Passé ce délai, votre compte sera suspendu temporairement jusqu\'à validation de votre identité.', 'warning') +
    ctaButton('Soumettre à nouveau', resubmitLink);

  return wrapEmail(
    "Votre vérification KYC n'a pas abouti — Action requise",
    rows,
    `<span style="font-family:-apple-system,sans-serif;font-size:10px;font-weight:700;color:${C.red};">&#9679; Action requise</span>`,
    'Vous avez reçu cet email suite au traitement de votre dossier KYC sur Terex.'
  );
}
