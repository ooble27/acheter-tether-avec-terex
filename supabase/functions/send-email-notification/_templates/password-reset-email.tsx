import { wrapEmail, hero, infoTable, noticeBox, ctaButton, linkBox } from './html-utils.ts';

interface PasswordResetEmailProps {
  resetLink: string;
  userEmail?: string;
}

export function passwordResetHtml({ resetLink, userEmail }: PasswordResetEmailProps): string {
  const subtitle = userEmail
    ? `Vous avez demandé à réinitialiser le mot de passe du compte associé à <strong style="color:#fafafa;">${userEmail}</strong>. Cliquez sur le bouton ci-dessous pour en créer un nouveau.`
    : 'Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau.';

  const rows =
    hero({ eyebrow: 'Sécurité du compte', title: 'Réinitialisation de votre mot de passe', subtitle }) +
    ctaButton('Réinitialiser mon mot de passe', resetLink) +
    linkBox(resetLink) +
    infoTable([
      { label: 'Lien valide pendant', value: '1 heure' },
      { label: 'Utilisation',         value: 'Une seule fois', last: true },
    ], 'Informations') +
    noticeBox("Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et sécurisez votre compte immédiatement en contactant notre support.", 'danger');

  return wrapEmail(
    'Réinitialisation de votre mot de passe Terex',
    rows,
    'terangaexchange.com',
    'Vous avez reçu cet email suite à une demande de réinitialisation de mot de passe sur Terex.'
  );
}
