import { User, History, HelpCircle, Phone, Gift, Share2, FileText, Shield, UserCheck, Briefcase, type LucideIcon } from 'lucide-react';

export interface ProfileMenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

/**
 * Source de vérité UNIQUE du menu profil (bouton en haut à droite).
 * Utilisée à la fois par le menu bureau (DesktopMenuPopover) et le menu
 * mobile/PWA plein écran (MobileMenu) → garantit des pages 100 % identiques
 * partout, sans divergence possible.
 */
export const PROFILE_MENU: {
  profile: ProfileMenuItem[];
  support: ProfileMenuItem[];
  more: ProfileMenuItem[];
  admin: ProfileMenuItem[];
} = {
  profile: [
    { id: 'profile', label: 'Mon Profil', icon: User, description: 'Informations personnelles' },
    { id: 'history', label: 'Historique', icon: History, description: 'Mes transactions' },
  ],
  support: [
    { id: 'faq', label: 'FAQ', icon: HelpCircle, description: 'Questions fréquentes' },
    { id: 'contact', label: 'Nous Contacter', icon: Phone, description: 'Support client 24/7' },
  ],
  more: [
    { id: 'referral', label: 'Parrainage', icon: Gift, description: 'Invitez vos amis' },
    { id: 'share-app', label: "Partager l'App", icon: Share2, description: 'Partager Terex' },
    { id: 'terms', label: "Conditions d'Utilisation", icon: FileText, description: 'CGU et politique' },
  ],
  admin: [
    { id: 'kyc-admin', label: 'Administration KYC', icon: Shield, description: "Vérifications d'identité" },
    { id: 'orders-admin', label: 'Gestion Commandes', icon: Shield, description: 'Ordres et transactions' },
    { id: 'job-applications', label: 'Candidatures', icon: UserCheck, description: 'Gestion des candidatures' },
    { id: 'b2b', label: 'Portail Business', icon: Briefcase, description: 'Gestion comptes B2B' },
  ],
};
