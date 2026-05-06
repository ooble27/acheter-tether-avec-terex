import { Section, Text, Link } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  PrimaryButton,
  TEREX,
} from './base-email.tsx';

interface PasswordResetEmailProps {
  resetLink: string;
  userEmail?: string;
}

export const PasswordResetEmail = ({ resetLink, userEmail }: PasswordResetEmailProps) => (
  <BaseEmail
    preview="Réinitialisation de votre mot de passe Terex"
    topRight={<span style={{ fontSize: '11px', color: TEREX.textDim }}>terangaexchange.com</span>}
  >
    <Hero
      eyebrow="Sécurité du compte"
      title="Réinitialisation de votre mot de passe"
      subtitle={
        userEmail
          ? <>Vous avez demandé à réinitialiser le mot de passe du compte associé à <strong style={{ color: TEREX.text, fontWeight: 500 }}>{userEmail}</strong>. Cliquez sur le bouton ci-dessous pour en créer un nouveau.</>
          : "Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour en créer un nouveau."
      }
    />

    <Section style={{ textAlign: 'center', padding: '36px 40px 28px' }}>
      <Link href={resetLink} style={primaryBtn}>
        Réinitialiser mon mot de passe
      </Link>
    </Section>

    <InfoTable title="Informations">
      <InfoRow label="Lien valide pendant" value="1 heure" />
      <InfoRow label="Utilisation" value="Une seule fois" last />
    </InfoTable>

    <NoticeBox tone="danger">
      Si vous n'avez pas demandé cette réinitialisation, ignorez cet email et sécurisez votre compte immédiatement en contactant notre support.
    </NoticeBox>
  </BaseEmail>
);

const primaryBtn: React.CSSProperties = {
  display: 'inline-block',
  background: TEREX.green,
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: 600,
  padding: '13px 32px',
  borderRadius: '8px',
  textDecoration: 'none',
  letterSpacing: '0.2px',
};
