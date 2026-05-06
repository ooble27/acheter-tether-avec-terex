import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  PrimaryButton,
  SummaryBar,
  StatusPill,
  TEREX,
} from './base-email.tsx';

interface WelcomeEmailProps {
  userFirstName?: string;
  kycLink?: string;
}

export const WelcomeEmail = ({ userFirstName, kycLink = 'https://terangaexchange.com/dashboard' }: WelcomeEmailProps) => (
  <BaseEmail
    preview={`Bienvenue sur Terex${userFirstName ? `, ${userFirstName}` : ''} — Commencez à trader du USDT`}
    topRight={<StatusPill label="Bienvenue" tone="success" />}
  >
    <Hero
      eyebrow="Nouveau membre"
      title={<>Bienvenue sur Terex{userFirstName ? `, ${userFirstName} 👋` : ' 👋'}</>}
      subtitle="Votre compte a été créé avec succès. Vous êtes maintenant prêt à acheter et vendre du USDT simplement depuis votre téléphone."
    />

    <SummaryBar
      cols={[
        { label: 'Étape 1', value: '✓ Compte créé', green: true },
        { label: 'Étape 2', value: 'KYC requis', sub: 'Vérification d\'identité' },
        { label: 'Étape 3', value: 'Trader', sub: 'Achat & vente USDT' },
      ]}
    />

    <div style={{ height: '36px' }} />

    <Section style={{ padding: '0 40px', marginBottom: '8px' }}>
      <Text
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          color: TEREX.textDim,
          margin: '0 0 14px',
        }}
      >
        Prochaine étape — Vérification KYC
      </Text>
    </Section>

    <InfoTable title="Ce dont vous avez besoin">
      <InfoRow label="Document" value="CNI ou Passeport en cours de validité" />
      <InfoRow label="Selfie" value="Photo de vous tenant le document" />
      <InfoRow label="Durée" value="Moins de 5 minutes" green />
      <InfoRow label="Validation" value="Sous 24h" last />
    </InfoTable>

    <NoticeBox>
      Sans KYC, vous ne pourrez pas effectuer de transactions. C'est une obligation légale qui protège votre compte et garantit la sécurité de la plateforme.
    </NoticeBox>

    <PrimaryButton href={kycLink}>Commencer la vérification KYC</PrimaryButton>
  </BaseEmail>
);
