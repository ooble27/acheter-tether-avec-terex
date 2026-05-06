import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  PrimaryButton,
  SectionLabel,
  StatusPill,
  SummaryBar,
  TEREX,
} from './base-email.tsx';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
  clientName?: string;
}

export const OrderConfirmationEmail = ({ orderData, transactionType, clientName }: OrderConfirmationProps) => {
  const isBuy = transactionType === 'buy';
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr = new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let clientInfo: any = null;
  try {
    if (orderData.notes) clientInfo = JSON.parse(orderData.notes);
  } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'wave';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const amount = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const rate = orderData.exchange_rate || 0;
  const network = orderData.network || 'TRC-20';
  const wallet = orderData.wallet_address || 'N/A';

  const title = isBuy ? (
    <>Votre demande d'achat<br />a été reçue</>
  ) : (
    <>Votre demande de vente<br />a été reçue</>
  );

  return (
    <BaseEmail
      preview={`${reference} — ${usdt} USDT`}
      topRight={
        <span style={{ fontSize: '11px', color: TEREX.amber }}>
          ● En cours de traitement
        </span>
      }
    >
      <Hero
        reference={`Référence · ${reference}`}
        title={title}
        date={dateStr}
        subtitle={
          clientName
            ? `Bonjour ${clientName}, nous avons bien reçu votre commande et notre équipe la traite actuellement.`
            : `Bonjour, nous avons bien reçu votre commande et notre équipe la traite actuellement.`
        }
      />

      <SummaryBar
        cols={[
          {
            label: 'Vous payez',
            value: isBuy ? amount : usdt,
            sub: isBuy ? `${orderData.currency || 'CFA'} · ${providerName}` : `USDT · ${network}`,
          },
          {
            label: 'Vous recevez',
            value: isBuy ? usdt : amount,
            sub: isBuy ? `USDT · ${network}` : `${orderData.currency || 'CFA'} · ${providerName}`,
            green: true,
          },
          {
            label: 'Taux appliqué',
            value: rate,
            sub: `${orderData.currency || 'CFA'} par USDT`,
          },
        ]}
      />

      <div style={{ height: '36px' }} />

      <SectionLabel>Détails de la transaction</SectionLabel>
      <InfoTable>
        <InfoRow label="Référence" value={reference} mono />
        <InfoRow label="Type" value={isBuy ? 'Achat USDT' : 'Vente USDT'} green />
        {isBuy ? (
          <>
            <InfoRow label="Mode de paiement" value={providerName} />
            <InfoRow label="Réseau de réception" value={`TRON (${network})`} />
            <InfoRow label="Adresse de réception" value={wallet} mono last />
          </>
        ) : (
          <>
            <InfoRow label="USDT à envoyer" value={`${usdt} USDT`} />
            <InfoRow label="Réseau" value={`TRON (${network})`} />
            <InfoRow label="Service de réception" value={providerName} />
            <InfoRow label="Numéro" value={phoneNumber} mono last />
          </>
        )}
      </InfoTable>

      <SectionLabel>Prochaines étapes</SectionLabel>
      <Section style={{ padding: '0 40px 32px' }}>
        <StepRow n={1} done text="Demande reçue et enregistrée" />
        <StepRow
          n={2}
          text={
            isBuy
              ? `Effectuez le paiement ${providerName} selon les instructions reçues`
              : `Envoyez ${usdt} USDT vers l'adresse Terex communiquée`
          }
        />
        <StepRow n={3} text="Vérification par notre équipe" />
        <StepRow
          n={4}
          last
          text={
            isBuy
              ? `Envoi de ${usdt} USDT sur votre adresse de réception`
              : `Versement de ${amount} ${orderData.currency || 'CFA'} sur ${providerName} (${phoneNumber})`
          }
        />
      </Section>

      <PrimaryButton href="https://terangaexchange.com/dashboard">Suivre ma commande</PrimaryButton>
    </BaseEmail>
  );
};

const StepRow: React.FC<{ n: number; text: string; done?: boolean; last?: boolean }> = ({ n, text, done, last }) => (
  <table
    width="100%"
    cellPadding={0}
    cellSpacing={0}
    role="presentation"
    style={{ borderCollapse: 'collapse', borderBottom: last ? 'none' : `1px solid ${TEREX.borderSoft}` }}
  >
    <tbody>
      <tr>
        <td style={{ width: '34px', padding: '12px 0', verticalAlign: 'top' }}>
          <div
            style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              background: done ? TEREX.green : TEREX.surface2,
              border: done ? 'none' : `1px solid ${TEREX.border}`,
              color: done ? '#fff' : TEREX.textDim,
              fontSize: '10px',
              fontWeight: 700,
              textAlign: 'center',
              lineHeight: '22px',
            }}
          >
            {n}
          </div>
        </td>
        <td style={{ padding: '12px 0', verticalAlign: 'top' }}>
          <Text
            style={{
              fontSize: '13px',
              lineHeight: 1.5,
              color: done ? TEREX.text : TEREX.textDim,
              margin: 0,
            }}
          >
            {text}
          </Text>
        </td>
      </tr>
    </tbody>
  </table>
);
