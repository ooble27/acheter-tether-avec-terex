import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  PrimaryButton,
  SectionLabel,
  TEREX,
} from './base-email.tsx';

interface KYCRejectedEmailProps {
  userFirstName?: string;
  reasons?: string[];
  resubmitLink?: string;
}

const DangerRing: React.FC = () => (
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
            fontSize: '22px',
          }}
        >
          !
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
    Action requise
  </span>
);

const DEFAULT_REASONS = [
  'Photo du document floue ou illisible',
  'Visage non visible clairement sur le selfie',
  'Assurez-vous que toutes les pièces du document sont visibles',
];

const STEPS = [
  'Prenez la photo en bonne lumière naturelle',
  'Document entier visible, sans reflet ni ombre',
  'Selfie : visage dégagé, bien éclairé, document tenu bien visible',
];

export const KYCRejectedEmail = ({
  userFirstName,
  reasons = DEFAULT_REASONS,
  resubmitLink = 'https://terangaexchange.com/dashboard',
}: KYCRejectedEmailProps) => (
  <BaseEmail
    preview="Votre vérification KYC n'a pas abouti — Action requise"
    topRight={<RedBadge />}
  >
    <Hero
      iconRing={<DangerRing />}
      title="Votre vérification KYC n'a pas abouti"
      subtitle={
        userFirstName
          ? `Bonjour ${userFirstName}, votre dossier n'a pas pu être validé. Vous pouvez le soumettre à nouveau avec les corrections indiquées ci-dessous.`
          : "Votre dossier n'a pas pu être validé. Vous pouvez le soumettre à nouveau avec les corrections indiquées ci-dessous."
      }
    />

    <div style={{ height: '36px' }} />

    <SectionLabel>Raison(s) du refus</SectionLabel>

    <Section
      style={{
        margin: '0 40px 28px',
        background: TEREX.bg,
        border: `1px solid ${TEREX.border}`,
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <Text
        style={{
          padding: '10px 20px',
          borderBottom: `1px solid ${TEREX.borderSoft}`,
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '1.8px',
          textTransform: 'uppercase',
          color: TEREX.textDim,
          margin: 0,
        }}
      >
        Problèmes détectés
      </Text>
      {reasons.map((reason, i) => (
        <table
          key={i}
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{
            borderCollapse: 'collapse',
            borderBottom: i < reasons.length - 1 ? `1px solid ${TEREX.borderSoft}` : 'none',
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: '12px 20px', verticalAlign: 'middle', width: '16px' }}>
                <div
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: TEREX.red,
                  }}
                />
              </td>
              <td style={{ padding: '12px 20px 12px 4px', verticalAlign: 'middle' }}>
                <Text style={{ fontSize: '12px', color: TEREX.red, margin: 0 }}>{reason}</Text>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </Section>

    <SectionLabel>Comment corriger</SectionLabel>

    <Section style={{ padding: '0 40px 28px' }}>
      {STEPS.map((step, i) => (
        <table
          key={i}
          width="100%"
          cellPadding={0}
          cellSpacing={0}
          role="presentation"
          style={{
            borderCollapse: 'collapse',
            borderBottom: i < STEPS.length - 1 ? `1px solid ${TEREX.borderSoft}` : 'none',
          }}
        >
          <tbody>
            <tr>
              <td style={{ width: '34px', padding: '12px 0', verticalAlign: 'top' }}>
                <div
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: TEREX.green,
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: '22px',
                  }}
                >
                  {i + 1}
                </div>
              </td>
              <td style={{ padding: '12px 0', verticalAlign: 'top' }}>
                <Text style={{ fontSize: '13px', color: TEREX.text, margin: 0, lineHeight: 1.5 }}>
                  {step}
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      ))}
    </Section>

    <NoticeBox tone="warning">
      Vous avez 7 jours pour soumettre à nouveau votre dossier. Passé ce délai, votre compte sera suspendu temporairement jusqu'à validation de votre identité.
    </NoticeBox>

    <PrimaryButton href={resubmitLink}>Soumettre à nouveau</PrimaryButton>
  </BaseEmail>
);
