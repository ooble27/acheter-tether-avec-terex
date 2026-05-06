import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  CheckRing,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  PrimaryButton,
  SummaryBar,
  StatusPill,
} from './base-email.tsx';

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

export const PaymentConfirmedEmail = ({ orderData, transactionType, clientName }: PaymentConfirmedProps) => {
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const dateStr = new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  let clientInfo: any = null;
  try {
    if (orderData.notes) clientInfo = JSON.parse(orderData.notes);
  } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'wave';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const amount = Number(orderData.amount || 0).toLocaleString('fr-FR');
  const usdt = Number(orderData.usdt_amount || 0).toLocaleString('fr-FR');
  const rate = orderData.exchange_rate || 0;
  const currency = orderData.currency || 'CFA';
  const network = orderData.network || 'TRC-20';

  let title: React.ReactNode;
  let subtitle: string;

  if (transactionType === 'buy') {
    title = <>Votre achat USDT<br />a été finalisé</>;
    subtitle = `Les ${usdt} USDT ont été envoyés sur votre adresse de réception.`;
  } else if (transactionType === 'sell') {
    title = <>Votre vente USDT<br />a été finalisée</>;
    subtitle = `Le montant de ${amount} ${currency} a été versé sur ${providerName}.`;
  } else {
    title = <>Transfert déposé<br />avec succès</>;
    subtitle = `Les fonds ont été reçus par ${orderData.recipient_name || 'votre destinataire'}.`;
  }

  return (
    <BaseEmail preview={`${reference} — Finalisé`} topRight={<StatusPill label="Finalisé" tone="success" />}>
      <Hero iconRing={<CheckRing />} title={title} subtitle={clientName ? `Bonjour ${clientName}, ${subtitle.charAt(0).toLowerCase() + subtitle.slice(1)}` : subtitle} />

      {transactionType === 'buy' && (
        <SummaryBar
          cols={[
            { label: 'Montant payé', value: amount, sub: currency },
            { label: 'USDT reçu', value: usdt, sub: network, green: true },
            { label: 'Taux', value: rate, sub: `${currency}/USDT` },
          ]}
        />
      )}

      {transactionType === 'sell' && (
        <SummaryBar
          cols={[
            { label: 'USDT vendu', value: usdt, sub: network },
            { label: `${currency} reçu`, value: amount, sub: providerName, green: true },
            { label: 'Taux', value: rate, sub: `${currency}/USDT` },
          ]}
        />
      )}

      {transactionType === 'transfer' && (
        <SummaryBar
          cols={[
            { label: 'Envoyé', value: amount, sub: orderData.from_currency || 'USDT' },
            { label: 'Reçu', value: Number(orderData.total_amount || 0).toLocaleString('fr-FR'), sub: orderData.to_currency || currency, green: true },
            { label: 'Taux', value: orderData.exchange_rate || rate, sub: `${orderData.to_currency || currency}/${orderData.from_currency || 'USDT'}` },
          ]}
        />
      )}

      <div style={{ height: '36px' }} />

      <InfoTable title="Récapitulatif">
        <InfoRow label="Référence" value={reference} mono />
        <InfoRow label="Date de finalisation" value={dateStr} />

        {transactionType === 'buy' && (
          <>
            <InfoRow label="USDT envoyé" value={`${usdt} USDT`} green big />
            <InfoRow label="Adresse de réception" value={orderData.wallet_address || 'N/A'} mono />
            <InfoRow label="Réseau" value={`TRON (${network})`} />
            {orderData.transaction_hash && (
              <InfoRow label="Hash de transaction" value={orderData.transaction_hash} mono last />
            )}
            {!orderData.transaction_hash && <InfoRow label="Type" value="Achat USDT" last />}
          </>
        )}

        {transactionType === 'sell' && (
          <>
            <InfoRow label="Montant envoyé" value={`${amount} ${currency}`} green big />
            <InfoRow label="Service de réception" value={providerName} />
            <InfoRow label="Numéro de réception" value={phoneNumber} mono last />
          </>
        )}

        {transactionType === 'transfer' && (
          <>
            <InfoRow
              label="Montant reçu"
              value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || currency}`}
              green
              big
            />
            <InfoRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <InfoRow label="Service" value={providerName} />
            <InfoRow label="Numéro" value={phoneNumber} mono last />
          </>
        )}
      </InfoTable>

      {transactionType === 'buy' && (
        <NoticeBox>
          La confirmation sur le réseau TRON peut prendre quelques minutes. Si les fonds n'apparaissent pas
          immédiatement dans votre portefeuille, patientez quelques instants.
        </NoticeBox>
      )}
      {transactionType === 'sell' && (
        <NoticeBox>
          Le virement a été initié vers votre compte {providerName}. Si les fonds n'apparaissent pas dans les
          15 minutes, contactez notre support.
        </NoticeBox>
      )}
      {transactionType === 'transfer' && (
        <NoticeBox tone="success">
          Le bénéficiaire a été notifié de la réception des fonds.
        </NoticeBox>
      )}

      <PrimaryButton href="https://terangaexchange.com/dashboard">Voir mon tableau de bord</PrimaryButton>
    </BaseEmail>
  );
};
