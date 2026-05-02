import {
  Text,
  Section,
  Container,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

const TEREX_GREEN = '#3B968F';
const TEREX_GREEN_LIGHT = '#eaf5f4';
const TEREX_DARK = '#0F1411';
const TEREX_MUTED = '#64748b';
const TEREX_BORDER = '#eef0ef';
const TEREX_SOFT_BG = '#fafbfa';

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const isBuy = transactionType === 'buy';

  // Parse notes pour extraire infos client
  let clientInfo: any = null;
  try {
    if (orderData.notes) clientInfo = JSON.parse(orderData.notes);
  } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const dateStr = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const fiatAmount = orderData.amount || 0;
  const fiatCurrency = orderData.currency || 'FCFA';
  const usdtAmount = orderData.usdt_amount || 0;
  const exchangeRate = orderData.exchange_rate || 0;
  const fees = orderData.fees || Math.round(fiatAmount * 0.02);

  const walletShort = orderData.wallet_address
    ? `${orderData.wallet_address.slice(0, 4)}...${orderData.wallet_address.slice(-4)}`
    : 'N/A';

  const title = isBuy ? 'Votre achat est en cours de traitement' : 'Votre vente est en cours de traitement';
  const highlight = 'traitement';
  const subtitle = `Nous avons bien reçu votre paiement. Votre transaction est en cours de vérification et sera finalisée très bientôt.`;
  const preview = `${reference} — ${isBuy ? `Achat de ${usdtAmount} USDT` : `Vente de ${usdtAmount} USDT`}`;

  return (
    <BaseEmail
      preview={preview}
      title={title}
      highlightTitle={highlight}
      subtitle={subtitle}
      heroImageUrl={isBuy ? EMAIL_ILLUSTRATIONS.buy : EMAIL_ILLUSTRATIONS.sell}
      heroImageAlt="Transaction Terex en cours"
      greeting="Bonjour 👋"
      intro={`Merci d'avoir choisi Terex. Voici le récapitulatif de votre ${isBuy ? 'achat' : 'vente'} de USDT.`}
    >
      {/* ============== CARTE RÉCAPITULATIVE — bandeau dark + détails ============== */}
      <Container style={recapCard}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              {/* Côté gauche : bandeau dark avec montants */}
              <td style={recapDarkCell}>
                <Text style={recapTitleSmall}>📋 RÉCAPITULATIF DE VOTRE TRANSACTION</Text>
                <div style={recapInner}>
                  <Text style={recapLabelSmall}>{isBuy ? 'Montant payé' : 'USDT à envoyer'}</Text>
                  <table cellPadding={0} cellSpacing={0} role="presentation">
                    <tbody>
                      <tr>
                        <td>
                          <Text style={recapBigAmount}>
                            {isBuy ? Number(fiatAmount).toLocaleString('fr-FR') : usdtAmount}
                          </Text>
                        </td>
                        <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
                          <span style={recapPill}>{isBuy ? fiatCurrency : 'USDT'}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={recapArrow}>
                    <span style={recapArrowText}>↓</span>
                  </div>

                  <Text style={recapLabelSmall}>{isBuy ? 'Montant que vous recevez' : 'Vous recevez'}</Text>
                  <table cellPadding={0} cellSpacing={0} role="presentation">
                    <tbody>
                      <tr>
                        <td>
                          <Text style={recapBigAmount}>
                            {isBuy ? usdtAmount : Number(fiatAmount).toLocaleString('fr-FR')}
                          </Text>
                        </td>
                        <td style={{ paddingLeft: 8, verticalAlign: 'middle' }}>
                          <span style={recapPill}>{isBuy ? 'USDT' : fiatCurrency}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={recapRateBox}>
                    <Text style={recapRateText}>
                      ⓘ Taux appliqué<br />
                      <span style={recapRateValue}>1 USDT = {exchangeRate} {fiatCurrency}</span>
                    </Text>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Détails ligne par ligne */}
        <div style={detailsBlock}>
          <DetailRow icon="🛒" label="Type de transaction" value={isBuy ? 'Achat de USDT' : 'Vente de USDT'} />
          <DetailRow icon="💳" label="Méthode de paiement" value={providerName} accent />
          <DetailRow icon="$" label={isBuy ? 'Montant payé' : 'Montant à envoyer'} value={isBuy ? `${Number(fiatAmount).toLocaleString('fr-FR')} ${fiatCurrency}` : `${usdtAmount} USDT`} accent />
          <DetailRow icon="₮" label={isBuy ? 'Montant que vous recevez' : 'Montant que vous recevez'} value={isBuy ? `${usdtAmount} USDT` : `${Number(fiatAmount).toLocaleString('fr-FR')} ${fiatCurrency}`} accent />
          <DetailRow icon="%" label="Frais de transaction" value={`2% (${Number(fees).toLocaleString('fr-FR')} ${fiatCurrency})`} />
          {isBuy ? (
            <DetailRow icon="📦" label="Adresse de réception (USDT)" value={walletShort} mono />
          ) : (
            <DetailRow icon="📱" label={`Numéro ${providerName}`} value={phoneNumber} mono />
          )}
          <DetailRow icon="#" label="ID de transaction" value={reference} mono />
          <DetailRow icon="📅" label="Date" value={dateStr} />
          <DetailRow icon="🕒" label="Statut" value="En cours de traitement" pill />
        </div>
      </Container>

      {/* ============== ÉTAPES DE TRAITEMENT ============== */}
      <Text style={sectionTitle}>ÉTAPES DE TRAITEMENT</Text>
      <Section style={stepsSection}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={stepCellDone}>
                <div style={stepCircleDone}><span style={stepNumDone}>1</span></div>
                <Text style={stepLabelDone}>{isBuy ? 'Paiement reçu' : 'Demande reçue'}</Text>
                <Text style={stepStatusDone}>Terminé</Text>
              </td>
              <td style={stepConnectorCell}>
                <div style={stepConnectorActive} />
              </td>
              <td style={stepCellActive}>
                <div style={stepCircleActive}><span style={stepNumActive}>2</span></div>
                <Text style={stepLabelActive}>Vérification</Text>
                <Text style={stepStatusActive}>En cours</Text>
              </td>
              <td style={stepConnectorCell}>
                <div style={stepConnectorPending} />
              </td>
              <td style={stepCellPending}>
                <div style={stepCirclePending}><span style={stepNumPending}>3</span></div>
                <Text style={stepLabelPending}>{isBuy ? 'USDT envoyé' : 'Paiement envoyé'}</Text>
                <Text style={stepStatusPending}>Bientôt</Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* ============== Bloc À SAVOIR ============== */}
      <Section style={infoBox}>
        <table width="100%" cellPadding={0} cellSpacing={0} role="presentation">
          <tbody>
            <tr>
              <td style={infoIconCell}>
                <div style={infoIcon}>
                  <span style={infoIconText}>ⓘ</span>
                </div>
              </td>
              <td style={infoTextCell}>
                <Text style={infoTitle}>À savoir</Text>
                <Text style={infoText}>
                  {isBuy
                    ? 'Une fois la vérification terminée, vos USDT seront automatiquement envoyés à l\'adresse indiquée ci-dessus. Vous recevrez une confirmation par email.'
                    : 'Une fois la vérification terminée, le paiement sera automatiquement envoyé sur votre numéro Mobile Money. Vous recevrez une confirmation par email.'}
                </Text>
              </td>
            </tr>
          </tbody>
        </table>
      </Section>
    </BaseEmail>
  );
};

/* ============= DetailRow ============= */

const DetailRow = ({
  icon, label, value, mono, accent, pill,
}: { icon: string; label: string; value: string; mono?: boolean; accent?: boolean; pill?: boolean }) => (
  <Row style={detailRowStyle}>
    <Column style={iconColumn}>
      <div style={iconBadge}><span style={iconBadgeText}>{icon}</span></div>
    </Column>
    <Column style={labelColumn}>
      <Text style={labelText}>{label}</Text>
    </Column>
    <Column style={valueColumn}>
      {pill ? (
        <span style={statusPill}>
          <span style={statusPillDot}>🕒</span> {value}
        </span>
      ) : (
        <Text style={accent ? valueAccent : (mono ? monoText : valueText)}>{value}</Text>
      )}
    </Column>
  </Row>
);

/* =================== STYLES =================== */

const recapCard = {
  backgroundColor: '#ffffff',
  border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '14px',
  padding: '0',
  margin: '0 0 28px 0',
  overflow: 'hidden',
};

const recapDarkCell = {
  padding: '20px 22px 8px 22px',
  verticalAlign: 'top' as const,
};

const recapTitleSmall = {
  color: TEREX_GREEN,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 16px 0',
  letterSpacing: '0.8px',
  textTransform: 'uppercase' as const,
};

const recapInner = {
  backgroundColor: TEREX_DARK,
  borderRadius: '12px',
  padding: '20px 22px',
};

const recapLabelSmall = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: '500' as const,
  margin: '0 0 6px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.4px',
};

const recapBigAmount = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.1',
  letterSpacing: '-0.5px',
};

const recapPill = {
  display: 'inline-block',
  backgroundColor: TEREX_GREEN,
  color: '#ffffff',
  fontSize: '11px',
  fontWeight: '700' as const,
  padding: '4px 10px',
  borderRadius: '6px',
  letterSpacing: '0.5px',
};

const recapArrow = {
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.1)',
  textAlign: 'center' as const,
  lineHeight: '32px',
  margin: '14px 0',
};

const recapArrowText = {
  color: TEREX_GREEN,
  fontSize: '14px',
  fontWeight: '700' as const,
  lineHeight: '32px',
};

const recapRateBox = {
  marginTop: '16px',
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor: 'rgba(59, 150, 143, 0.12)',
  border: `1px solid ${TEREX_GREEN}33`,
};

const recapRateText = {
  color: '#94a3b8',
  fontSize: '11px',
  margin: '0',
  lineHeight: '1.5',
};

const recapRateValue = {
  color: '#ffffff',
  fontWeight: '700' as const,
  fontSize: '13px',
};

/* ===== Détails ===== */

const detailsBlock = {
  padding: '8px 22px 20px 22px',
};

const detailRowStyle = {
  borderBottom: `1px solid ${TEREX_BORDER}`,
};

const iconColumn = {
  width: '36px',
  verticalAlign: 'middle' as const,
  paddingTop: '12px',
  paddingBottom: '12px',
};

const iconBadge = {
  width: '24px',
  height: '24px',
  borderRadius: '6px',
  backgroundColor: TEREX_GREEN_LIGHT,
  textAlign: 'center' as const,
  lineHeight: '24px',
};

const iconBadgeText = {
  color: TEREX_GREEN,
  fontSize: '12px',
  lineHeight: '24px',
};

const labelColumn = {
  verticalAlign: 'middle' as const,
  paddingRight: '12px',
};

const valueColumn = {
  verticalAlign: 'middle' as const,
  textAlign: 'right' as const,
};

const labelText = {
  color: TEREX_MUTED,
  fontSize: '13px',
  fontWeight: '500' as const,
  margin: '12px 0',
  lineHeight: '1.4',
};

const valueText = {
  color: TEREX_DARK,
  fontSize: '13px',
  fontWeight: '600' as const,
  margin: '12px 0',
  lineHeight: '1.4',
  textAlign: 'right' as const,
};

const valueAccent = {
  ...valueText,
  color: TEREX_GREEN,
  fontWeight: '700' as const,
};

const monoText = {
  ...valueText,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

const statusPill = {
  display: 'inline-block',
  backgroundColor: TEREX_GREEN_LIGHT,
  color: TEREX_GREEN,
  fontSize: '12px',
  fontWeight: '700' as const,
  padding: '6px 12px',
  borderRadius: '20px',
};

const statusPillDot = {
  marginRight: '4px',
};

/* ===== Steps ===== */

const sectionTitle = {
  color: TEREX_DARK,
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  letterSpacing: '0.8px',
  textTransform: 'uppercase' as const,
};

const stepsSection = {
  margin: '0 0 28px 0',
  padding: '20px 0',
};

const stepCellDone = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  width: '90px',
};

const stepCellActive = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  width: '90px',
};

const stepCellPending = {
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  width: '90px',
};

const stepConnectorCell = {
  verticalAlign: 'middle' as const,
  paddingBottom: '40px',
};

const stepConnectorActive = {
  height: '2px',
  background: `repeating-linear-gradient(to right, ${TEREX_GREEN}, ${TEREX_GREEN} 4px, transparent 4px, transparent 8px)`,
  borderTop: `2px dashed ${TEREX_GREEN}`,
  borderColor: TEREX_GREEN,
};

const stepConnectorPending = {
  height: '2px',
  borderTop: `2px dashed #cbd5d4`,
};

const stepCircleDone = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: TEREX_GREEN,
  margin: '0 auto 10px auto',
  textAlign: 'center' as const,
  lineHeight: '40px',
};

const stepCircleActive = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: TEREX_GREEN,
  margin: '0 auto 10px auto',
  textAlign: 'center' as const,
  lineHeight: '40px',
  boxShadow: `0 0 0 4px ${TEREX_GREEN}33`,
};

const stepCirclePending = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#ffffff',
  border: '2px solid #cbd5d4',
  margin: '0 auto 10px auto',
  textAlign: 'center' as const,
  lineHeight: '36px',
};

const stepNumDone = {
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  lineHeight: '40px',
};

const stepNumActive = {
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '700' as const,
  lineHeight: '40px',
};

const stepNumPending = {
  color: '#cbd5d4',
  fontSize: '15px',
  fontWeight: '700' as const,
  lineHeight: '36px',
};

const stepLabelDone = {
  color: TEREX_DARK,
  fontSize: '12px',
  fontWeight: '600' as const,
  margin: '0 0 4px 0',
  lineHeight: '1.3',
};

const stepLabelActive = {
  color: TEREX_DARK,
  fontSize: '12px',
  fontWeight: '700' as const,
  margin: '0 0 4px 0',
  lineHeight: '1.3',
};

const stepLabelPending = {
  color: TEREX_MUTED,
  fontSize: '12px',
  fontWeight: '500' as const,
  margin: '0 0 4px 0',
  lineHeight: '1.3',
};

const stepStatusDone = {
  color: TEREX_GREEN,
  fontSize: '11px',
  fontWeight: '600' as const,
  margin: '0',
};

const stepStatusActive = {
  color: TEREX_GREEN,
  fontSize: '11px',
  fontWeight: '600' as const,
  margin: '0',
};

const stepStatusPending = {
  color: '#94a3b8',
  fontSize: '11px',
  fontWeight: '500' as const,
  margin: '0',
};

/* ===== Info box ===== */

const infoBox = {
  backgroundColor: '#ffffff',
  border: `1px solid ${TEREX_BORDER}`,
  borderRadius: '12px',
  padding: '16px 20px',
  margin: '0 0 8px 0',
};

const infoIconCell = {
  width: '48px',
  verticalAlign: 'top' as const,
  paddingTop: '2px',
};

const infoIcon = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  backgroundColor: TEREX_GREEN_LIGHT,
  textAlign: 'center' as const,
  lineHeight: '36px',
};

const infoIconText = {
  color: TEREX_GREEN,
  fontSize: '16px',
  fontWeight: '700' as const,
  lineHeight: '36px',
};

const infoTextCell = {
  verticalAlign: 'top' as const,
};

const infoTitle = {
  color: TEREX_DARK,
  fontSize: '14px',
  fontWeight: '700' as const,
  margin: '0 0 4px 0',
};

const infoText = {
  color: TEREX_MUTED,
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.55',
};
