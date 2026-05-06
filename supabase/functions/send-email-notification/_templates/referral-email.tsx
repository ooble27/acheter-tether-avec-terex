import { Section, Text, Link } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  StatusPill,
  SummaryBar,
  TEREX,
} from './base-email.tsx';

interface ReferralEmailProps {
  referrerName: string;
  referralLink: string;
  recipientEmail?: string;
}

export const ReferralEmail = ({
  referrerName,
  referralLink,
  recipientEmail,
}: ReferralEmailProps) => (
  <BaseEmail
    preview={`${referrerName} vous invite à rejoindre Terex — Achetez du USDT en quelques minutes`}
    topRight={<StatusPill label="Invitation" tone="success" />}
  >
    <Hero
      eyebrow="Parrainage"
      title={<>{referrerName} vous invite sur Terex</>}
      subtitle={`Votre ami ${referrerName} vous invite à rejoindre Terex, la plateforme simple pour acheter et vendre de l'USDT en Afrique de l'Ouest.`}
    />

    <SummaryBar
      cols={[
        { label: 'Mobile Money', value: 'Accepté', sub: 'Orange Money · Wave', green: true },
        { label: 'Temps moyen', value: '~3 min', sub: 'Par transaction' },
        { label: 'Commission', value: '2%', sub: 'Fixe et transparente' },
      ]}
    />

    <div style={{ height: '36px' }} />

    <InfoTable title="Comment démarrer">
      <InfoRow label="Étape 1" value="Créez votre compte gratuitement" />
      <InfoRow label="Étape 2" value="Vérifiez votre identité (KYC)" />
      <InfoRow label="Étape 3" value="Achetez vos premiers USDT" green last />
    </InfoTable>

    <Section style={{ textAlign: 'center', padding: '0 40px 22px' }}>
      <Link
        href={referralLink}
        style={{
          display: 'inline-block',
          background: TEREX.green,
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 600,
          padding: '13px 32px',
          borderRadius: '8px',
          textDecoration: 'none',
          letterSpacing: '0.2px',
        }}
      >
        Rejoindre Terex
      </Link>
    </Section>

    <Section style={{ padding: '0 40px 36px' }}>
      <div
        style={{
          background: TEREX.bg,
          border: `1px solid ${TEREX.border}`,
          borderRadius: '8px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          href={referralLink}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '11px',
            color: TEREX.textMuted,
            textDecoration: 'none',
            wordBreak: 'break-all',
          }}
        >
          {referralLink}
        </Link>
      </div>
    </Section>
  </BaseEmail>
);
