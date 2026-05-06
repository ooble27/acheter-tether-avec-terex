import { wrapEmail, hero, infoTable, C } from './html-utils.ts';

interface ContactNotificationEmailProps {
  contactData: {
    user_name: string;
    user_email: string;
    user_phone?: string;
    subject: string;
    message: string;
  };
}

export function contactNotificationHtml({ contactData }: ContactNotificationEmailProps): string {
  const F = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

  const contactRows = [
    { label: 'Nom',   value: contactData.user_name },
    { label: 'Email', value: contactData.user_email, mono: true },
    ...(contactData.user_phone ? [{ label: 'Téléphone', value: contactData.user_phone, mono: true }] : []),
    { label: 'Sujet', value: contactData.subject, last: true },
  ];

  const messageBlock = `
<tr>
  <td style="padding:0 24px 24px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.infoBg};border:1px solid ${C.border};border-radius:10px;overflow:hidden;">
      <tr>
        <td class="edim" style="padding:10px 16px;font-family:${F};font-size:10px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;color:${C.textDim};border-bottom:1px solid ${C.borderSoft};">Message</td>
      </tr>
      <tr>
        <td class="emuted" style="padding:16px;font-family:${F};font-size:13px;color:${C.textMuted};line-height:1.7;white-space:pre-wrap;">${contactData.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>
      </tr>
    </table>
  </td>
</tr>`;

  const rows =
    hero({ eyebrow: 'Nouveau message', title: 'Message de contact reçu', subtitle: `Un message a été envoyé via le formulaire de contact par ${contactData.user_name}.` }) +
    infoTable(contactRows, 'Informations du client') +
    messageBlock;

  return wrapEmail(
    `Nouveau message de contact de ${contactData.user_name}`,
    rows,
    'Notification interne',
    `Répondez directement à l'adresse : ${contactData.user_email}`
  );
}
