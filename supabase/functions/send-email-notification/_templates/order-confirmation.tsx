import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';
import {
  BodyShell,
  AmountFlow,
  InfoLine,
  StepsDark,
  NoticeDark,
} from './dark-blocks.tsx';
import { Text } from 'npm:@react-email/components@0.0.22';

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const isBuy = transactionType === 'buy';

  let clientInfo: any = null;
  try { if (orderData.notes) clientInfo = JSON.parse(orderData.notes); } catch (_) {}

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName =
    provider === 'wave' ? 'Wave' :
    provider === 'orange' || provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const fiatAmount = orderData.amount || 0;
  const fiatCurrency = orderData.currency || 'FCFA';
  const usdtAmount = orderData.usdt_amount || 0;
  const exchangeRate = orderData.exchange_rate || 0;

  const walletShort = orderData.wallet_address
    ? `${orderData.wallet_address.slice(0, 6)}...${orderData.wallet_address.slice(-6)}`
    : 'N/A';

  return (
    <BaseEmail
      preview={`${reference} — ${isBuy ? `Achat de ${usdtAmount} USDT` : `Vente de ${usdtAmount} USDT`}`}
      title={isBuy ? 'Votre achat est en cours de traitement' : 'Votre vente est en cours de traitement'}
      highlightTitle="traitement"
      subtitle="Nous avons bien reçu votre demande. Vérification en cours."
      heroImageUrl={isBuy ? EMAIL_ILLUSTRATIONS.buy : EMAIL_ILLUSTRATIONS.sell}
      heroImageAlt="Transaction Terex"
      greeting="Bonjour 👋"
      intro={`Voici les informations clés de votre ${isBuy ? 'achat' : 'vente'} de USDT.`}
    >
      {/* === BLOC 1 — Montants en gros, langage hero === */}
      <BodyShell>
        <Text style={blockLabel}>{isBuy ? 'VOTRE ACHAT' : 'VOTRE VENTE'}</Text>
        <AmountFlow
          fromLabel={isBuy ? 'Vous payez' : 'Vous envoyez'}
          fromAmount={isBuy ? Number(fiatAmount).toLocaleString('fr-FR') : usdtAmount}
          fromUnit={isBuy ? fiatCurrency : 'USDT'}
          toLabel={isBuy ? 'Vous recevez' : 'Vous recevez'}
          toAmount={isBuy ? usdtAmount : Number(fiatAmount).toLocaleString('fr-FR')}
          toUnit={isBuy ? 'USDT' : fiatCurrency}
          rate={`1 USDT = ${exchangeRate} ${fiatCurrency}`}
        />
      </BodyShell>

      {/* === BLOC 2 — Informations essentielles, langage dark === */}
      <BodyShell>
        <Text style={blockLabel}>INFORMATIONS</Text>
        <InfoLine icon="💳" label="Paiement" value={providerName} />
        {isBuy
          ? <InfoLine icon="📦" label="Wallet de réception" value={walletShort} mono />
          : <InfoLine icon="📱" label={`Numéro ${providerName}`} value={phoneNumber} mono />
        }
        <InfoLine icon="#" label="Référence" value={reference} mono last />
      </BodyShell>

      {/* === BLOC 3 — Étapes, dark vertical === */}
      <BodyShell>
        <Text style={blockLabel}>SUIVI</Text>
        <StepsDark
          steps={[
            { icon: '1', label: isBuy ? 'Paiement reçu' : 'Demande reçue', state: 'done' },
            { icon: '2', label: 'Vérification', state: 'active' },
            { icon: '3', label: isBuy ? 'USDT envoyés à votre wallet' : 'Paiement envoyé sur Mobile Money', state: 'pending' },
          ]}
        />
      </BodyShell>

      {/* === BLOC 4 — Notice contextuelle === */}
      <NoticeDark
        title="Bon à savoir"
        text={isBuy
          ? "Une fois la vérification terminée, vos USDT seront automatiquement envoyés sur le wallet indiqué."
          : "Une fois la vérification terminée, le paiement sera automatiquement envoyé sur votre Mobile Money."}
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
