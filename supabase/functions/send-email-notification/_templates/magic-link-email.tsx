import { Section, Text, Link } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail, Hero, NoticeBox, PrimaryButton, TEREX } from './base-email.tsx';

interface MagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
  /** Optional 6-digit OTP code shown in a dedicated card. */
  otpCode?: string;
}

export const MagicLinkEmail = ({ magicLink, userEmail, otpCode }: MagicLinkEmailProps) => (
  <BaseEmail preview="Votre lien de connexion sécurisé pour Terex">
    <Hero
      eyebrow="Connexion sécurisée"
      title={<>Votre lien de connexion<br />à Terex</>}
      subtitle={
        <>
          Une demande de connexion a été initiée pour le compte associé à{' '}
          <strong style={{ color: TEREX.text, fontWeight: 500 }}>{userEmail}</strong>.
        </>
      }
    />

    {otpCode && (
      <Section style={{ padding: '0 40px 28px' }}>
        <div
          style={{
            background: TEREX.bg,
            border: `1px solid ${TEREX.border}`,
            borderRadius: '10px',
            padding: '32px',
            textAlign: 'center',
          }}
        >
          <Text
            style={{
              fontSize: '10px',
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: TEREX.textDim,
              margin: '0 0 8px',
            }}
          >
            Code de vérification
          </Text>
          <Text
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '10px',
              color: TEREX.text,
              margin: '8px 0',
              lineHeight: 1,
            }}
          >
            {otpCode}
          </Text>
          <Text style={{ fontSize: '11px', color: TEREX.textDim, margin: '8px 0 0' }}>
            Expire dans <span style={{ color: TEREX.red }}>10 minutes</span>
          </Text>
        </div>
      </Section>
    )}

    <PrimaryButton href={magicLink}>Accéder à mon compte</PrimaryButton>

    <Section style={{ padding: '0 40px 12px' }}>
      <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
        <tbody>
          <tr>
            <td style={{ height: '1px', background: TEREX.borderSoft }}></td>
            <td style={{ padding: '0 14px', whiteSpace: 'nowrap' }}>
              <Text style={{ fontSize: '11px', color: TEREX.textDim, margin: 0 }}>ou copiez ce lien</Text>
            </td>
            <td style={{ height: '1px', background: TEREX.borderSoft }}></td>
          </tr>
        </tbody>
      </table>
    </Section>

    <Section style={{ padding: '12px 40px 28px' }}>
      <div
        style={{
          background: TEREX.bg,
          border: `1px solid ${TEREX.border}`,
          borderRadius: '8px',
          padding: '14px 18px',
        }}
      >
        <Link
          href={magicLink}
          style={{
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
            fontSize: '11px',
            color: TEREX.textMuted,
            textDecoration: 'none',
            wordBreak: 'break-all',
          }}
        >
          {magicLink}
        </Link>
      </div>
    </Section>

    <NoticeBox>
      Si vous n'êtes pas à l'origine de cette demande, ignorez cet email. Votre compte reste sécurisé et ce
      lien expirera automatiquement.
    </NoticeBox>
  </BaseEmail>
);
