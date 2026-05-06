import { wrapEmail, hero, infoTable, C } from './html-utils.ts';

interface JobApplicationAdminProps {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter?: string;
  appliedAt?: string;
}

const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

export function jobApplicationAdminHtml({ firstName, lastName, email, phone, position, coverLetter, appliedAt }: JobApplicationAdminProps): string {
  const dateStr = appliedAt
    ? new Date(appliedAt).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })
    : new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  const detailRows = [
    { label: 'Poste',     value: position,  green: true },
    { label: 'Candidat',  value: fullName },
    { label: 'Email',     value: email,     mono: true },
    ...(phone ? [{ label: 'Téléphone', value: phone, mono: true }] : []),
    { label: 'Date',      value: dateStr,   last: true },
  ];

  const coverLetterBlock = coverLetter ? `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:${C.infoBg};border:1px solid ${C.border};border-left:3px solid ${C.green};border-radius:10px;overflow:hidden;border-collapse:separate;border-spacing:0;">
      <tr>
        <td class="edim" style="padding:10px 16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">
          Lettre de motivation
        </td>
      </tr>
      <tr>
        <td class="emuted" style="padding:16px;font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.7;white-space:pre-wrap;">
          ${coverLetter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </td>
      </tr>
    </table>
  </td>
</tr>` : '';

  const replyBlock = `
<tr>
  <td style="padding:0 24px 28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="background-color:rgba(59,150,143,0.06);border:1px solid rgba(59,150,143,0.2);border-radius:10px;border-collapse:separate;border-spacing:0;">
      <tr>
        <td style="padding:14px 16px;font-family:${F};font-size:12px;color:${C.textMuted};line-height:1.6;">
          <strong style="color:${C.green};">Répondre directement :</strong>
          &nbsp;<a href="mailto:${email}" style="color:${C.green};text-decoration:none;font-family:monospace;">${email}</a>
        </td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({
      eyebrow: 'RH · Recrutement',
      title: 'Nouvelle candidature reçue',
      subtitle: `<strong style="color:#fafafa;">${fullName}</strong> vient de postuler pour le poste de <strong style="color:#fafafa;">${position}</strong>.`,
    }) +
    infoTable(detailRows, 'Informations du candidat') +
    coverLetterBlock +
    replyBlock;

  return wrapEmail(
    `Nouvelle candidature : ${position} — ${fullName}`,
    rows,
    'Notification RH interne',
    `Candidature reçue le ${dateStr}`
  );
}
