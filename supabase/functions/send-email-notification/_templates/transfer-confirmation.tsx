import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  PrimaryButton,
  SectionLabel,
  TEREX,
} from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
  clientName?: string;
}

const COUNTRIES: Record<string, string> = {
  SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso', NG: 'Nigeria', BJ: 'Bénin',
};

export const TransferConfirmationEmail = ({ transferData, clientName }: TransferConfirmationProps) => {
  const country = COUNTRIES[transferData.recipient_country] || transferData.recipient_country || 'N/A';
  const providerName =
    transferData.provider === 'wave' ? 'Wave' :
    transferData.provider === 'orange' || transferData.provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `#TX-TEREX-${(transferData.id || '').slice(-5).toUpperCase()}`;
  const recipName = transferData.recipient_name || 'Destinataire';
  const initials = recipName
    .split(' ')
    .map((s: string) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const amountSent = `${Number(transferData.amount || 0).toLocaleString('fr-FR')}`;
  const amountReceived = `${Number(transferData.total_amount || 0).toLocaleString('fr-FR')}`;
  const fromCur = transferData.from_currency || 'USDT';
  const toCur = transferData.to_currency || 'CFA';
  const dateStr = new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  return (
    <BaseEmail
      preview={`${reference} — ${recipName} (${country})`}
      topRight={<span style={{ fontSize: '11px', color: TEREX.textDim, letterSpacing: '0.5px' }}>Transfert international</span>}
    >
      <Hero
        reference={`Référence · ${reference}`}
        title={<>Transfert déposé<br />avec succès</>}
        date={dateStr}
        subtitle={
          clientName
            ? `Bonjour ${clientName}, votre transfert vers ${recipName} (${country}) est confirmé.`
            : `Votre transfert vers ${recipName} (${country}) est confirmé.`
        }
      />

      {/* Flow bar custom */}
      <Section
        style={{
          background: TEREX.bg,
          borderTop: `1px solid ${TEREX.border}`,
          borderBottom: `1px solid ${TEREX.border}`,
          padding: '26px 40px',
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', width: '42%' }}>
                <Text style={flowLabel}>Vous avez envoyé</Text>
                <Text style={flowAmountOut}>
                  {amountSent} <span style={flowAmountSub}>{fromCur}</span>
                </Text>
              </td>
              <td style={{ width: '16%', textAlign: 'center', verticalAlign: 'middle' }}>
                <Text style={{ color: TEREX.green, fontSize: '20px', margin: 0, fontWeight: 700 }}>→</Text>
                <Text style={{ fontSize: '11px', color: TEREX.textDim, margin: '6px 0 0' }}>
                  1 {fromCur} = {transferData.exchange_rate || 0} {toCur}
                </Text>
              </td>
              <td style={{ verticalAlign: 'top', width: '42%', textAlign: 'right' }}>
                <Text style={flowLabel}>Bénéficiaire reçoit</Text>
                <Text style={flowAmountIn}>
                  {amountReceived} <span style={flowAmountSubGreen}>{toCur}</span>
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <div style={{ height: '36px' }} />

      <SectionLabel>Bénéficiaire</SectionLabel>
      <Section
        style={{
          margin: '0 40px 24px',
          background: TEREX.bg,
          border: `1px solid ${TEREX.border}`,
          borderRadius: '10px',
          padding: '18px 22px',
        }}
      >
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={{ width: '56px', verticalAlign: 'middle' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: TEREX.surface2,
                    border: `1px solid ${TEREX.border}`,
                    color: TEREX.textMuted,
                    fontSize: '13px',
                    fontWeight: 600,
                    textAlign: 'center',
                    lineHeight: '44px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  }}
                >
                  {initials}
                </div>
              </td>
              <td style={{ verticalAlign: 'middle' }}>
                <Text style={{ fontSize: '14px', fontWeight: 500, color: TEREX.text, margin: '0 0 3px' }}>
                  {recipName}
                </Text>
                {transferData.recipient_phone && (
                  <Text
                    style={{
                      fontSize: '12px',
                      color: TEREX.textMuted,
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      margin: 0,
                    }}
                  >
                    {transferData.recipient_phone}
                  </Text>
                )}
              </td>
              <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                <span
                  style={{
                    fontSize: '11px',
                    color: TEREX.textDim,
                    background: TEREX.surface2,
                    border: `1px solid ${TEREX.border}`,
                    padding: '5px 12px',
                    borderRadius: '6px',
                  }}
                >
                  {providerName}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      <SectionLabel>Détail du transfert</SectionLabel>
      <InfoTable>
        <InfoRow label="Référence" value={reference} mono />
        <InfoRow label="Date" value={dateStr} />
        <InfoRow label="Montant envoyé" value={`${amountSent} ${fromCur}`} />
        <InfoRow label="Montant reçu" value={`${amountReceived} ${toCur}`} green />
        <InfoRow label="Frais de service" value={`${Number(transferData.fees || 0).toLocaleString('fr-FR')} ${fromCur}`} />
        <InfoRow label="Taux de change" value={`${transferData.exchange_rate || 0} ${toCur} / ${fromCur}`} />
        <InfoRow label="Pays destination" value={country} />
        <InfoRow label="Statut" value="Déposé" green last />
      </InfoTable>

      <PrimaryButton href="https://terangaexchange.com/dashboard">Voir l'historique</PrimaryButton>
    </BaseEmail>
  );
};

const flowLabel: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase',
  color: TEREX.textDim,
  margin: '0 0 8px',
};

const flowAmountOut: React.CSSProperties = {
  fontSize: '26px',
  fontWeight: 600,
  color: TEREX.text,
  margin: 0,
  lineHeight: 1.1,
};

const flowAmountIn: React.CSSProperties = {
  ...flowAmountOut,
  color: TEREX.green,
};

const flowAmountSub: React.CSSProperties = {
  fontSize: '14px',
  color: TEREX.textMuted,
  fontWeight: 500,
};

const flowAmountSubGreen: React.CSSProperties = {
  fontSize: '14px',
  color: TEREX.green,
  fontWeight: 500,
};
