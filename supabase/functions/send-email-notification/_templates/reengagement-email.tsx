import { Section, Text } from 'npm:@react-email/components@0.0.22';
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

interface ReengagementEmailProps {
  userFirstName?: string;
  currentRate?: string;
  dashboardLink?: string;
}

export const ReengagementEmail = ({
  userFirstName,
  currentRate,
  dashboardLink = 'https://terangaexchange.com/dashboard',
}: ReengagementEmailProps) => (
  <BaseEmail
    preview={`${userFirstName ? `${userFirstName}, o` : 'O'}n pense à vous — Le taux du jour est disponible sur Terex`}
    topRight={<span style={{ fontSize: '11px', color: TEREX.textDim }}>terangaexchange.com</span>}
  >
    <Hero
      eyebrow="On pense à vous"
      title={<>Ça fait un moment{userFirstName ? `, ${userFirstName} 👋` : ' 👋'}</>}
      subtitle={
        currentRate
          ? `Vous n'avez pas effectué de transaction depuis un moment. Le taux du jour est de ${currentRate} CFA/USDT — achetez ou vendez en quelques minutes.`
          : "Vous n'avez pas effectué de transaction depuis un moment. Le tarif du jour est disponible sur Terex — achetez ou vendez en quelques minutes."
      }
    />

    <div style={{ height: '36px' }} />

    <InfoTable title="Pourquoi revenir sur Terex ?">
      <InfoRow label="Paiement" value="Orange Money · Wave" green />
      <InfoRow label="Délai" value="~3 minutes par transaction" />
      <InfoRow label="Commission" value="2% fixe, sans surprise" />
      <InfoRow label="Réseaux" value="7 réseaux pris en charge" last />
    </InfoTable>

    <NoticeBox>
      Votre compte est toujours actif et sécurisé. Connectez-vous pour voir le taux du jour et effectuer une transaction en quelques minutes.
    </NoticeBox>

    <PrimaryButton href={dashboardLink}>Voir le tarif du jour</PrimaryButton>
  </BaseEmail>
);
