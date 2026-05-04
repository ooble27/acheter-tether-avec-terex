import * as React from 'npm:react@18.3.1';
import { Text } from 'npm:@react-email/components@0.0.22';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';
import {
  BodyShell,
  AmountFlow,
  InfoLine,
  StepsDark,
  NoticeDark,
} from './dark-blocks.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

const COUNTRIES: Record<string, string> = {
  SN: 'Sénégal', CI: "Côte d'Ivoire", ML: 'Mali', BF: 'Burkina Faso',
  NG: 'Nigeria', BJ: 'Bénin', CA: 'Canada', FR: 'France',
};

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const country = COUNTRIES[transferData.recipient_country] || transferData.recipient_country || 'N/A';
  const providerName =
    transferData.provider === 'wave' ? 'Wave' :
    transferData.provider === 'orange' || transferData.provider === 'orange_money' ? 'Orange Money' :
    'Mobile Money';

  const reference = `TRX${(transferData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;

  return (
    <BaseEmail
      preview={`${reference} — Transfert vers ${country} confirmé`}
      title="Votre transfert est en cours de traitement"
      highlightTitle="traitement"
      subtitle={`Votre transfert vers ${transferData.recipient_name || 'le destinataire'} sera livré sous peu.`}
      heroImageUrl={EMAIL_ILLUSTRATIONS.transfer}
      heroImageAlt="Transfert international Terex"
      greeting="Bonjour 👋"
      intro="Voici les informations clés de votre transfert international."
    >
      <BodyShell>
        <Text style={blockLabel}>LE TRANSFERT</Text>
        <AmountFlow
          fromLabel="Vous envoyez"
          fromAmount={Number(transferData.amount).toLocaleString('fr-FR')}
          fromUnit={transferData.from_currency}
          toLabel="Le destinataire reçoit"
          toAmount={Number(transferData.total_amount).toLocaleString('fr-FR')}
          toUnit={transferData.to_currency}
          rate={`1 ${transferData.from_currency} = ${transferData.exchange_rate} ${transferData.to_currency}`}
        />
      </BodyShell>

      <BodyShell>
        <Text style={blockLabel}>DESTINATAIRE</Text>
        <InfoLine icon="👤" label="Nom" value={transferData.recipient_name || 'N/A'} />
        <InfoLine icon="🌍" label="Pays" value={country} />
        <InfoLine icon="💳" label="Service" value={providerName} />
        <InfoLine icon="📱" label="Numéro" value={transferData.recipient_phone || 'N/A'} mono />
        <InfoLine icon="#" label="Référence" value={reference} mono last />
      </BodyShell>

      <BodyShell>
        <Text style={blockLabel}>SUIVI</Text>
        <StepsDark
          steps={[
            { icon: '1', label: 'Demande confirmée', state: 'done' },
            { icon: '2', label: 'Paiement vérifié', state: 'done' },
            { icon: '3', label: 'Traitement du transfert', state: 'active' },
            { icon: '4', label: 'Réception chez le destinataire', state: 'pending' },
          ]}
        />
      </BodyShell>

      <NoticeDark
        title="Délai de livraison"
        text="Votre transfert sera livré sous 24h ouvrables. Le destinataire recevra une notification dès la réception des fonds."
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
