import { Section, Text, Link } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  TEREX,
} from './base-email.tsx';

interface SecurityAlertEmailProps {
  device?: string;
  location?: string;
  date?: string;
  secureLink?: string;
}

const AlertRing: React.FC = () => (
  <table cellPadding={0} cellSpacing={0} role="presentation">
    <tbody>
      <tr>
        <td
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            border: `1.5px solid ${TEREX.red}`,
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '52px',
            color: TEREX.red,
            fontSize: '24px',
          }}
        >
          ⚠
        </td>
      </tr>
    </tbody>
  </table>
);

const RedBadge: React.FC = () => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      fontSize: '10px',
      fontWeight: 700,
      color: TEREX.red,
      letterSpacing: '0.5px',
    }}
  >
    <span
      style={{
        display: 'inline-block',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: TEREX.red,
      }}
    />
    Alerte sécurité
  </span>
);

export const SecurityAlertEmail = ({
  device = 'Appareil inconnu',
  location = 'Localisation inconnue',
  date,
  secureLink = 'https://terangaexchange.com/dashboard',
}: SecurityAlertEmailProps) => {
  const dateStr = date
    ? date
    : new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <BaseEmail
      preview="Connexion depuis un nouvel appareil détectée sur votre compte Terex"
      topRight={<RedBadge />}
    >
      <Hero
        iconRing={<AlertRing />}
        title="Connexion depuis un nouvel appareil"
        subtitle="Une connexion à votre compte Terex a été détectée depuis un appareil inconnu. Si ce n'est pas vous, sécurisez votre compte immédiatement."
      />

      <div style={{ height: '36px' }} />

      <InfoTable title="Détails de la connexion">
        <InfoRow label="Date" value={dateStr} />
        <InfoRow label="Appareil" value={device} />
        <InfoRow label="Localisation" value={location} last />
      </InfoTable>

      <NoticeBox tone="warning">
        Si c'est bien vous, ignorez cet email. Sinon, cliquez sur "Sécuriser mon compte" pour changer votre mot de passe et révoquer l'accès.
      </NoticeBox>

      <Section style={{ padding: '0 40px 40px', display: 'flex', gap: '12px' }}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={{ paddingRight: '10px' }}>
                <Link
                  href={secureLink}
                  style={{
                    display: 'inline-block',
                    background: TEREX.green,
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    padding: '13px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                  }}
                >
                  Sécuriser mon compte
                </Link>
              </td>
              <td>
                <Link
                  href="https://terangaexchange.com/dashboard"
                  style={{
                    display: 'inline-block',
                    background: TEREX.surface2,
                    color: TEREX.textMuted,
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '13px 28px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    border: `1px solid ${TEREX.border}`,
                  }}
                >
                  C'est moi
                </Link>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
    </BaseEmail>
  );
};
