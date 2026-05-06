import { wrapEmail, hero, otpCard, linkBox, noticeBox, ctaButton } from './html-utils.ts';

interface MagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
  otpCode?: string;
}

export function magicLinkHtml({ magicLink, userEmail, otpCode }: MagicLinkEmailProps): string {
  const rows =
    hero({ eyebrow: 'Connexion sécurisée', title: 'Votre lien de connexion à Terex', subtitle: `Une demande de connexion a été initiée pour le compte associé à <strong style="color:#fafafa;">${userEmail}</strong>.` }) +
    (otpCode ? otpCard(otpCode) : '') +
    ctaButton('Accéder à mon compte', magicLink) +
    linkBox(magicLink) +
    noticeBox("Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre compte reste sécurisé.");

  return wrapEmail(
    'Votre lien de connexion sécurisé — Terex',
    rows,
    'terangaexchange.com'
  );
}
