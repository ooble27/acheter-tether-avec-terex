/**
 * URLs publiques des illustrations utilisées dans les emails Terex.
 * Servies depuis le bucket `public/lovable-uploads/emails/` via le domaine
 * terangaexchange.com. Toutes les images doivent rester accessibles
 * publiquement (les clients email ne peuvent pas charger des fichiers locaux).
 */
const BASE = 'https://terangaexchange.com/lovable-uploads/emails';

export const EMAIL_ILLUSTRATIONS = {
  buy: `${BASE}/illustration-buy.png`,
  sell: `${BASE}/illustration-sell.png`,
  transfer: `${BASE}/illustration-transfer.png`,
  success: `${BASE}/illustration-success.png`,
  kyc: `${BASE}/illustration-kyc.png`,
  contact: `${BASE}/illustration-contact.png`,
} as const;

export type EmailIllustration = keyof typeof EMAIL_ILLUSTRATIONS;
