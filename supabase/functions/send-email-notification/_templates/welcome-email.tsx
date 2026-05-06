import { wrapEmail, hero, summaryBar, infoTable, noticeBox, ctaButton, sectionLabel, statusBadge } from './html-utils.ts';

interface WelcomeEmailProps {
  userFirstName?: string;
  kycLink?: string;
}

export function welcomeHtml({ userFirstName, kycLink = 'https://terangaexchange.com/dashboard' }: WelcomeEmailProps): string {
  const greeting = userFirstName ? `Bienvenue sur Terex, ${userFirstName}` : 'Bienvenue sur Terex';
  const subtitle = 'Votre compte a été créé avec succès. Vous êtes maintenant prêt à acheter et vendre du USDT simplement depuis votre téléphone.';

  const rows =
    hero({ eyebrow: 'Nouveau membre', title: greeting, subtitle }) +
    summaryBar([
      { label: 'Étape 1', value: 'Compte créé',  sub: 'Terminé',                        green: true },
      { label: 'Étape 2', value: 'KYC requis',   sub: "Vérification d'identité" },
      { label: 'Étape 3', value: 'Trader',        sub: 'Achat & vente USDT' },
    ]) +
    `<tr><td style="height:28px;"></td></tr>` +
    sectionLabel('Prochaine étape — Vérification KYC') +
    infoTable([
      { label: 'Document', value: 'CNI ou Passeport en cours de validité' },
      { label: 'Selfie',   value: 'Photo de vous tenant le document' },
      { label: 'Durée',    value: 'Moins de 5 minutes',               green: true },
      { label: 'Validation', value: 'Sous 24h',                       last: true },
    ], 'Ce dont vous avez besoin') +
    noticeBox("Sans KYC, vous ne pourrez pas effectuer de transactions. C'est une obligation légale qui protège votre compte et garantit la sécurité de la plateforme.") +
    ctaButton('Commencer la vérification KYC', kycLink);

  return wrapEmail(
    `Bienvenue sur Terex${userFirstName ? `, ${userFirstName}` : ''} — Commencez à trader du USDT`,
    rows,
    statusBadge('Bienvenue', 'success'),
    'Vous avez reçu cet email suite à la création de votre compte sur Terex.'
  );
}
