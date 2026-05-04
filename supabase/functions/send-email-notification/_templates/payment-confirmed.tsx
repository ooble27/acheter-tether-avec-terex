import * as React from 'npm:react@18.3.1';
import { Text } from 'npm:@react-email/components@0.0.22';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';
import {
  BodyShell,
  InfoLine,
  NoticeDark,
} from './dark-blocks.tsx';

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
}

export const PaymentConfirmedEmail = ({ orderData, transactionType }: PaymentConfirmedProps) => {
  const isBuy = transactionType === 'buy';
  const isSell = transactionType === 'sell';
  const isTransfer = transactionType === 'transfer';

  let title = 'Votre transaction est finalisée';
  let highlight = 'finalisée';
  let intro = 'Votre transaction a été traitée avec succès.';

  if (isBuy) {
    title = 'Votre achat USDT est finalisé';
    intro = `Vos ${orderData.usdt_amount || 0} USDT ont été envoyés sur votre wallet.`;
  } else if (isSell) {
    title = 'Votre vente USDT est finalisée';
    intro = `Le paiement de ${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'} a été envoyé.`;
  } else if (isTransfer) {
    title = 'Votre transfert est livré';
    highlight = 'livré';
    intro = `${orderData.recipient_name || 'Le destinataire'} a bien reçu les fonds.`;
  }

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}
  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const dateStr = new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR', {
    day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const walletShort = orderData.wallet_address
    ? `${orderData.wallet_address.slice(0, 6)}...${orderData.wallet_address.slice(-6)}`
    : 'N/A';

  return (
    <BaseEmail
      preview={`${reference} — Transaction Terex finalisée`}
      title={title}
      highlightTitle={highlight}
      subtitle="Tout s'est bien passé. Vos fonds sont disponibles."
      heroImageUrl={EMAIL_ILLUSTRATIONS.success}
      heroImageAlt="Transaction réussie"
      greeting="Félicitations ! 🎉"
      intro={intro}
    >
      {/* Bloc succès dark */}
      <BodyShell>
        <Text style={blockLabel}>✓ TRANSACTION CONFIRMÉE</Text>
        <Text style={bigSuccess}>
          {isBuy && `${orderData.usdt_amount || 0} USDT`}
          {isSell && `${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`}
          {isTransfer && `${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || 'FCFA'}`}
        </Text>
        <Text style={successSub}>
          {isBuy && 'envoyés sur votre wallet'}
          {isSell && 'crédités sur votre Mobile Money'}
          {isTransfer && `reçus par ${orderData.recipient_name || 'le destinataire'}`}
        </Text>
      </BodyShell>

      <BodyShell>
        <Text style={blockLabel}>DÉTAILS</Text>
        {isBuy && (
          <>
            <InfoLine icon="$" label="Payé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} />
            <InfoLine icon="₮" label="USDT envoyés" value={`${orderData.usdt_amount || 0} USDT`} />
            <InfoLine icon="📦" label="Wallet" value={walletShort} mono />
            <InfoLine icon="🌐" label="Réseau" value={orderData.network || 'TRC20'} />
          </>
        )}
        {isSell && (
          <>
            <InfoLine icon="₮" label="USDT vendus" value={`${orderData.usdt_amount || 0} USDT`} />
            <InfoLine icon="$" label="Reçu" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} />
            <InfoLine icon="💳" label="Service" value={providerName} />
            <InfoLine icon="📱" label="Numéro" value={phoneNumber} mono />
          </>
        )}
        {isTransfer && (
          <>
            <InfoLine icon="↗" label="Envoyé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.from_currency || 'CAD'}`} />
            <InfoLine icon="↙" label="Reçu" value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || 'FCFA'}`} />
            <InfoLine icon="👤" label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <InfoLine icon="📱" label="Numéro" value={phoneNumber} mono />
          </>
        )}
        <InfoLine icon="#" label="Référence" value={reference} mono />
        <InfoLine icon="📅" label="Date" value={dateStr} last />
      </BodyShell>

      <NoticeDark
        variant="success"
        icon="✓"
        title="Tout est en ordre"
        text="Conservez cette référence pour vos archives. Une question ? Notre équipe est disponible 24/7."
      />
    </BaseEmail>
  );
};

const blockLabel = {
  color: '#3B968F',
  fontSize: '11px',
  fontWeight: '700' as const,
  margin: '0 0 14px 0',
  letterSpacing: '0.8px',
  textTransform: 'uppercase' as const,
};
const bigSuccess = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.1',
  letterSpacing: '-0.6px',
};
const successSub = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '6px 0 0 0',
  lineHeight: '1.4',
};
