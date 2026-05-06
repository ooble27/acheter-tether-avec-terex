import { wrapEmail, hero, infoTable, noticeBox, ctaButton } from './html-utils.ts';

interface ReengagementEmailProps {
  userFirstName?: string;
  currentRate?: string;
  dashboardLink?: string;
}

export function reengagementHtml({
  userFirstName,
  currentRate,
  dashboardLink = 'https://terangaexchange.com/dashboard',
}: ReengagementEmailProps): string {
  const greeting = userFirstName ? `Ça fait un moment, ${userFirstName}` : 'Ça fait un moment';
  const subtitle = currentRate
    ? `Vous n'avez pas effectué de transaction depuis un moment. Le taux du jour est de ${currentRate} CFA/USDT — achetez ou vendez en quelques minutes.`
    : "Vous n'avez pas effectué de transaction depuis un moment. Le tarif du jour est disponible sur Terex — achetez ou vendez en quelques minutes.";

  const rows =
    hero({ eyebrow: 'On pense à vous', title: greeting, subtitle }) +
    `<tr><td style="height:28px;"></td></tr>` +
    infoTable([
      { label: 'Paiement',   value: 'Orange Money · Wave',        green: true },
      { label: 'Délai',      value: '~3 minutes par transaction' },
      { label: 'Commission', value: '2% fixe, sans surprise' },
      { label: 'Réseaux',    value: '7 réseaux pris en charge',   last: true },
    ], 'Pourquoi revenir sur Terex ?') +
    noticeBox('Votre compte est toujours actif et sécurisé. Connectez-vous pour voir le taux du jour et effectuer une transaction en quelques minutes.') +
    ctaButton('Voir le tarif du jour', dashboardLink);

  return wrapEmail(
    `${userFirstName ? `${userFirstName}, o` : 'O'}n pense à vous — Le taux du jour est disponible sur Terex`,
    rows,
    'terangaexchange.com',
    'Vous avez reçu cet email car votre compte Terex est inactif depuis un moment.'
  );
}
