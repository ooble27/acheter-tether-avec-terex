import { wrapEmail, hero, summaryBar, infoTable, ctaButton, linkBox, statusBadge } from './html-utils.ts';

interface ReferralEmailProps {
  referrerName: string;
  referralLink: string;
  recipientEmail?: string;
}

export function referralHtml({ referrerName, referralLink }: ReferralEmailProps): string {
  const rows =
    hero({
      eyebrow: 'Parrainage',
      title: `${referrerName} vous invite sur Terex`,
      subtitle: `Votre ami ${referrerName} vous invite à rejoindre Terex, la plateforme simple pour acheter et vendre de l'USDT en Afrique de l'Ouest.`,
    }) +
    summaryBar([
      { label: 'Mobile Money', value: 'Accepté',   sub: 'Orange Money · Wave', green: true },
      { label: 'Temps moyen',  value: '~3 min',    sub: 'Par transaction' },
      { label: 'Commission',   value: '2%',         sub: 'Fixe et transparente' },
    ]) +
    `<tr><td style="height:28px;"></td></tr>` +
    infoTable([
      { label: 'Étape 1', value: 'Créez votre compte gratuitement' },
      { label: 'Étape 2', value: 'Vérifiez votre identité (KYC)' },
      { label: 'Étape 3', value: 'Achetez vos premiers USDT', green: true, last: true },
    ], 'Comment démarrer') +
    ctaButton('Rejoindre Terex', referralLink) +
    linkBox(referralLink);

  return wrapEmail(
    `${referrerName} vous invite à rejoindre Terex`,
    rows,
    statusBadge('Invitation', 'success'),
    'Vous avez reçu cet email car un utilisateur Terex vous a invité à rejoindre la plateforme.'
  );
}
