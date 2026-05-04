import * as React from 'npm:react@18.3.1';
import { Text } from 'npm:@react-email/components@0.0.22';
import { BaseEmail } from './base-email.tsx';
import { EMAIL_ILLUSTRATIONS } from './illustrations.ts';
import { BodyShell, InfoLine, NoticeDark } from './dark-blocks.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
}

const STATUS_META: Record<string, { label: string; emoji: string; illu: 'buy' | 'success' | 'transfer'; variant: 'info' | 'success' | 'warn' | 'error' }> = {
  processing: { label: 'En cours de traitement', emoji: '⏳', illu: 'buy', variant: 'warn' },
  completed:  { label: 'Terminée avec succès',   emoji: '✓', illu: 'success', variant: 'success' },
  cancelled:  { label: 'Transaction annulée',    emoji: '✕', illu: 'buy', variant: 'error' },
  failed:     { label: 'Échec de la transaction',emoji: '✕', illu: 'buy', variant: 'error' },
};

export const StatusUpdateEmail = ({ orderData, transactionType }: StatusUpdateProps) => {
  const meta = STATUS_META[orderData.status] || { label: orderData.status, emoji: '•', illu: 'buy' as const, variant: 'info' as const };
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer ? 'transfert' : (transactionType === 'buy' ? 'achat USDT' : transactionType === 'sell' ? 'vente USDT' : 'transaction');

  const reference = `TRX${(orderData.id || '').replace(/-/g, '').slice(-12).toUpperCase()}`;
  const isCompleted = orderData.status === 'completed';
  const isFailed = orderData.status === 'cancelled' || orderData.status === 'failed';

  const title = isCompleted
    ? `Votre ${objectName} est finalisé`
    : isFailed
      ? `Votre ${objectName} a été annulé`
      : `Mise à jour de votre ${objectName}`;
  const highlight = isCompleted ? 'finalisé' : isFailed ? 'annulé' : objectName;

  return (
    <BaseEmail
      preview={`${reference} — ${meta.label}`}
      title={title}
      highlightTitle={highlight}
      subtitle={`Statut actuel : ${meta.label}.`}
      heroImageUrl={EMAIL_ILLUSTRATIONS[meta.illu]}
      heroImageAlt={meta.label}
      greeting="Bonjour 👋"
      intro={`Votre ${objectName} a évolué.`}
    >
      <BodyShell>
        <Text style={blockLabel}>NOUVEAU STATUT</Text>
        <Text style={bigStatus}>{meta.emoji}&nbsp;&nbsp;{meta.label}</Text>
        <Text style={statusRef}>{reference}</Text>
      </BodyShell>

      <BodyShell>
        <Text style={blockLabel}>RAPPEL</Text>
        {!isTransfer && (
          <>
            <InfoLine icon="🛒" label="Type" value={orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'} />
            <InfoLine icon="$" label="Montant" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'FCFA'}`} />
            <InfoLine icon="₮" label="USDT" value={`${orderData.usdt_amount || 0} USDT`} />
          </>
        )}
        {isTransfer && (
          <>
            <InfoLine icon="↗" label="Envoyé" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.from_currency || 'CAD'}`} />
            <InfoLine icon="↙" label="À recevoir" value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || ''}`} />
            <InfoLine icon="👤" label="Destinataire" value={orderData.recipient_name || 'N/A'} />
          </>
        )}
        <InfoLine icon="#" label="Référence" value={reference} mono last />
      </BodyShell>

      {orderData.status === 'processing' && (
        <NoticeDark
          variant="info"
          title="Traitement en cours"
          text={`Notre équipe traite activement votre ${objectName}. Vous recevrez une nouvelle notification dès la finalisation.`}
        />
      )}

      {isFailed && (
        <NoticeDark
          variant="error"
          icon="!"
          title={orderData.status === 'cancelled' ? 'Transaction annulée' : 'Échec de la transaction'}
          text={orderData.status === 'cancelled'
            ? `${orderData.cancellation_reason ? `Raison : ${orderData.cancellation_reason}. ` : ''}Si un paiement a été effectué, il sera remboursé sous 3 à 5 jours ouvrables.`
            : (orderData.error_message || `Une erreur s'est produite. Notre équipe technique a été notifiée.`)}
        />
      )}
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
const bigStatus = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700' as const,
  margin: '0',
  lineHeight: '1.2',
  letterSpacing: '-0.4px',
};
const statusRef = {
  color: '#94a3b8',
  fontSize: '12px',
  margin: '8px 0 0 0',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};
