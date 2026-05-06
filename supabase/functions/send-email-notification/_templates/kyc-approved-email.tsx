import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  PrimaryButton,
  StatusPill,
  TEREX,
} from './base-email.tsx';

interface KYCApprovedEmailProps {
  magicLink: string;
  userFirstName: string;
  userLastName: string;
}

const ShieldRing = () => (
  <table cellPadding={0} cellSpacing={0} role="presentation">
    <tbody>
      <tr>
        <td
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: `1.5px solid ${TEREX.green}`,
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '52px',
            color: TEREX.green,
            fontSize: '22px',
          }}
        >
          ✦
        </td>
      </tr>
    </tbody>
  </table>
);

export const KYCApprovedEmail = ({ magicLink, userFirstName, userLastName }: KYCApprovedEmailProps) => {
  const fullName = [userFirstName, userLastName].filter(Boolean).join(' ');
  const today = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <BaseEmail preview="Votre identité a été vérifiée — Compte Terex activé" topRight={<StatusPill label="Compte vérifié" tone="success" />}>
      <Hero
        iconRing={<ShieldRing />}
        title={<>Votre identité<br />a été vérifiée</>}
        subtitle={
          fullName
            ? `Félicitations ${userFirstName}, votre vérification KYC a été approuvée. Votre compte Terex est maintenant pleinement actif.`
            : 'Votre vérification KYC a été approuvée. Votre compte Terex est maintenant pleinement actif.'
        }
      />

      {/* Perks */}
      <Section
        style={{
          background: TEREX.bg,
          borderTop: `1px solid ${TEREX.border}`,
          borderBottom: `1px solid ${TEREX.border}`,
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <Perk num="5M+" label={<>CFA par jour<br />de limite</>} />
              <td style={{ width: '1px', background: TEREX.border }} />
              <Perk num="Priorité" label={<>Traitement<br />accéléré</>} />
              <td style={{ width: '1px', background: TEREX.border }} />
              <Perk num="Afrique" label={<>Transferts<br />internationaux</>} />
            </tr>
          </tbody>
        </table>
      </Section>

      <div style={{ height: '36px' }} />

      <InfoTable title="Informations du compte">
        <InfoRow label="Statut KYC" value="Approuvé" green />
        <InfoRow label="Date de vérification" value={today} />
        <InfoRow label="Niveau de compte" value="Premium" green />
        <InfoRow label="Limite journalière" value="5 000 000 CFA" last />
      </InfoTable>

      <PrimaryButton href={magicLink || 'https://terangaexchange.com/dashboard'}>
        Accéder à mon compte
      </PrimaryButton>
    </BaseEmail>
  );
};

const Perk: React.FC<{ num: React.ReactNode; label: React.ReactNode }> = ({ num, label }) => (
  <td style={{ padding: '24px 20px', verticalAlign: 'top', width: '33%' }}>
    <Text style={{ fontSize: '18px', fontWeight: 700, color: TEREX.text, margin: '0 0 4px' }}>{num}</Text>
    <Text style={{ fontSize: '11px', color: TEREX.textMuted, lineHeight: 1.5, margin: 0 }}>{label}</Text>
  </td>
);
