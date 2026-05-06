import { wrapEmail, hero, infoTable, noticeBox, ctaButton, checkRing, statusBadge } from './html-utils.ts';

interface ContactConfirmationProps {
  contactData: {
    user_name: string;
    user_email: string;
    user_phone?: string;
    subject: string;
    message: string;
  };
}

export function contactConfirmationHtml({ contactData }: ContactConfirmationProps): string {
  const firstName = contactData.user_name.split(' ')[0];

  const rows =
    hero({
      iconHtml: checkRing(),
      title: 'Message bien reçu !',
      subtitle: `Bonjour ${firstName}, nous avons bien reçu votre message concernant <strong style="color:#fafafa;">${contactData.subject}</strong>. Notre équipe vous répondra sous 24 heures.`,
    }) +
    infoTable([
      { label: 'Sujet',         value: contactData.subject },
      { label: 'Votre email',   value: contactData.user_email, mono: true },
      { label: 'Délai de réponse', value: '< 24 heures', green: true, last: true },
    ], 'Récapitulatif') +
    noticeBox('Besoin d\'une réponse urgente ? Contactez-nous directement sur WhatsApp au <strong>+1 418 261 9091</strong>.') +
    ctaButton('Retourner sur Terex', 'https://terangaexchange.com');

  return wrapEmail(
    `Message reçu — ${contactData.subject}`,
    rows,
    statusBadge('Message reçu', 'success'),
    'Vous avez reçu cet email suite à votre message sur Terex.'
  );
}
