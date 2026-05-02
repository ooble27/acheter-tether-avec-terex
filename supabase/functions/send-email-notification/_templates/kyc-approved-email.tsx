import {
  Text,
  Section,
  Container,
  Row,
  Column,
  Button,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';

interface KYCApprovedEmailProps {
  magicLink: string;
  userFirstName: string;
  userLastName: string;
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';

export const KYCApprovedEmail = ({ magicLink, userFirstName, userLastName }: KYCApprovedEmailProps) => (
  <BaseEmail
    preview={`${userFirstName}, votre identité est vérifiée — accédez à votre compte Terex`}
    title="Votre identité est vérifiée"
    highlightTitle="vérifiée"
    subtitle="Félicitations ! Vous pouvez désormais accéder à toutes les fonctionnalités Terex."
    heroImageUrl={EMAIL_ILLUSTRATIONS.kyc}
    heroImageAlt="KYC approuvé"
    greeting={`Bonjour ${userFirstName} 🎉`}
    intro="Votre vérification d'identité (KYC) a été approuvée avec succès. Bienvenue dans la communauté Terex."
  >
    {/* Carte avantages */}
    <Container style={benefitsCard}>
      <Text style={cardTitle}>✨ CE QUE VOUS POUVEZ FAIRE MAINTENANT</Text>
      <Benefit icon="₮" title="Acheter et vendre des USDT" desc="Sans limite de montant, à tout moment." />
      <Benefit icon="🌍" title="Transferts internationaux" desc="Envoyez de l'argent partout en Afrique." />
      <Benefit icon="🔒" title="Toutes les fonctionnalités sécurisées" desc="Profil complet, historique, supports prioritaire." />
    </Container>

    {/* Bouton CTA */}
    <Section style={ctaSection}>
      <Button href={magicLink} style={ctaButton}>
        Accéder à mon compte →
      </Button>
      <Text style={ctaNote}>⏰ Ce lien est valable pendant 10 minutes pour votre sécurité.</Text>
    </Section>
  </BaseEmail>
);

const Benefit = ({ icon, title, desc }: { icon: string; title: string; desc: string }) => (
  <Row style={benefitRow}>
    <Column style={benefitIconCol}>
      <div style={benefitIconBadge}><span style={benefitIconText}>{icon}</span></div>
    </Column>
    <Column>
      <Text style={benefitTitle}>{title}</Text>
      <Text style={benefitDesc}>{desc}</Text>
    </Column>
  </Row>
);

/* ============= STYLES ============= */

const benefitsCard = {
  backgroundColor: '#ffffff', border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '14px', padding: '20px 22px', margin: '0 0 24px 0',
};
const cardTitle = {
  color: TEREX_GREEN, fontSize: '11px', fontWeight: '700' as const,
  margin: '0 0 16px 0', letterSpacing: '0.8px', textTransform: 'uppercase' as const,
};
const benefitRow = { borderBottom: `1px solid ${TEREX_BORDER}` };
const benefitIconCol = { width: '48px', verticalAlign: 'middle' as const, paddingTop: '14px', paddingBottom: '14px' };
const benefitIconBadge = {
  width: '36px', height: '36px', borderRadius: '8px',
  backgroundColor: TEREX_GREEN_LIGHT, textAlign: 'center' as const, lineHeight: '36px',
};
const benefitIconText = { color: TEREX_GREEN, fontSize: '16px', fontWeight: '700' as const, lineHeight: '36px' };
const benefitTitle = { color: TEREX_DARK, fontSize: '14px', fontWeight: '700' as const, margin: '14px 0 2px 0' };
const benefitDesc = { color: TEREX_MUTED, fontSize: '12px', margin: '0 0 14px 0', lineHeight: '1.4' };

const ctaSection = { textAlign: 'center' as const, margin: '8px 0 16px 0' };
const ctaButton = {
  backgroundColor: TEREX_GREEN, color: '#ffffff', fontSize: '15px', fontWeight: '700' as const,
  padding: '14px 28px', borderRadius: '12px', textDecoration: 'none',
  display: 'inline-block',
};
const ctaNote = { color: TEREX_MUTED, fontSize: '12px', margin: '12px 0 0 0', textAlign: 'center' as const };
