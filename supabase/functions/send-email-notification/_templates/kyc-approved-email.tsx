import * as React from 'npm:react@18.3.1';
import { Section, Text, Button } from 'npm:@react-email/components@0.0.22';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';
import { BodyShell, InfoLine, NoticeDark } from './dark-blocks.tsx';

interface KYCApprovedEmailProps {
  magicLink: string;
  userFirstName: string;
  userLastName: string;
}

export const KYCApprovedEmail = ({ magicLink, userFirstName }: KYCApprovedEmailProps) => (
  <BaseEmail
    preview={`${userFirstName}, votre identité est vérifiée — accédez à votre compte Terex`}
    title="Votre identité est vérifiée"
    highlightTitle="vérifiée"
    subtitle="Vous pouvez désormais accéder à toutes les fonctionnalités Terex."
    heroImageUrl={EMAIL_ILLUSTRATIONS.kyc}
    heroImageAlt="KYC approuvé"
    greeting={`Bonjour ${userFirstName} 🎉`}
    intro="Votre vérification d'identité (KYC) a été approuvée avec succès. Bienvenue dans la communauté Terex."
  >
    <BodyShell>
      <Text style={blockLabel}>CE QUE VOUS POUVEZ FAIRE</Text>
      <InfoLine icon="₮" label="Acheter et vendre des USDT" value="Sans limite" />
      <InfoLine icon="🌍" label="Transferts internationaux" value="Partout en Afrique" />
      <InfoLine icon="🔒" label="Support prioritaire" value="24/7" last />
    </BodyShell>

    <Section style={ctaSection}>
      <Button href={magicLink} style={ctaButton}>
        Accéder à mon compte →
      </Button>
      <Text style={ctaNote}>⏰ Ce lien est valable 10 minutes.</Text>
    </Section>

    <NoticeDark
      variant="success"
      icon="✓"
      title="Bienvenue chez Terex"
      text="Notre équipe est à votre disposition pour vous accompagner dans vos premières transactions."
    />
  </BaseEmail>
);

const blockLabel = {
  color: '#3B968F',
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  letterSpacing: '0.8px',
  textTransform: 'uppercase' as const,
};
const ctaSection = { textAlign: 'center' as const, margin: '8px 0 20px 0' };
const ctaButton = {
  backgroundColor: '#3B968F',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  padding: '14px 28px',
  borderRadius: '12px',
  textDecoration: 'none',
  display: 'inline-block',
};
const ctaNote = { color: '#64748b', fontSize: '12px', margin: '12px 0 0 0', textAlign: 'center' as const };
