import { Section, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import {
  BaseEmail,
  Hero,
  InfoTable,
  InfoRow,
  NoticeBox,
  PrimaryButton,
  StatusPill,
  TEREX,
} from './base-email.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
  clientName?: string;
}

const STATUS_META: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  processing: { label: 'En cours de traitement', tone: 'warning' },
  completed:  { label: 'Terminée avec succès',   tone: 'success' },
  cancelled:  { label: 'Annulée',                tone: 'danger' },
  failed:     { label: 'Échec',                  tone: 'danger' },
};

export const StatusUpdateEmail = ({ orderData, transactionType, clientName }: StatusUpdateProps) => {
  const meta = STATUS_META[orderData.status] || { label: orderData.status || 'Mise à jour', tone: 'neutral' as const };
  const reference = `#TEREX-${(orderData.id || '').slice(-8).toUpperCase() || 'N/A'}`;
  const isTransfer = transactionType === 'transfer';
  const objectName = isTransfer
    ? 'transfert international'
    : transactionType === 'buy'
    ? 'achat USDT'
    : transactionType === 'sell'
    ? 'vente USDT'
    : 'transaction';

  return (
    <BaseEmail preview={`${reference} — ${meta.label}`} topRight={<StatusPill label={meta.label} tone={meta.tone} />}>
      <Hero
        reference={`Référence · ${reference}`}
        title={
          <>
            Mise à jour de votre<br />
            {isTransfer ? 'transfert' : 'commande'}
          </>
        }
        date={new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' })}
        subtitle={
          clientName
            ? `Bonjour ${clientName}, le statut de votre ${objectName} a évolué : ${meta.label.toLowerCase()}.`
            : `Le statut de votre ${objectName} a évolué : ${meta.label.toLowerCase()}.`
        }
      />

      <div style={{ height: '36px' }} />

      <InfoTable title="Détails">
        <InfoRow label="Référence" value={reference} mono />
        <InfoRow label="Création" value={new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')} />
        <InfoRow label="Mise à jour" value={new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')} />

        {!isTransfer && (
          <>
            <InfoRow label="Type" value={transactionType === 'buy' ? 'Achat USDT' : 'Vente USDT'} />
            <InfoRow label="Montant" value={`${Number(orderData.amount || 0).toLocaleString('fr-FR')} ${orderData.currency || 'CFA'}`} />
            <InfoRow label="USDT" value={`${Number(orderData.usdt_amount || 0).toLocaleString('fr-FR')} USDT`} green />
            <InfoRow label="Réseau" value={orderData.network || 'TRC-20'} last />
          </>
        )}

        {isTransfer && (
          <>
            <InfoRow label="Envoyé" value={`${orderData.amount || 0} ${orderData.from_currency || 'USDT'}`} />
            <InfoRow label="À recevoir" value={`${Number(orderData.total_amount || 0).toLocaleString('fr-FR')} ${orderData.to_currency || ''}`} green />
            <InfoRow label="Destinataire" value={orderData.recipient_name || 'N/A'} />
            <InfoRow label="Pays" value={orderData.recipient_country || 'N/A'} last />
          </>
        )}
      </InfoTable>

      {orderData.status === 'processing' && (
        <NoticeBox tone="warning">
          Notre équipe traite activement votre {isTransfer ? 'transfert' : 'commande'}. Vous recevrez une nouvelle
          notification dès la finalisation.
        </NoticeBox>
      )}
      {orderData.status === 'completed' && (
        <NoticeBox tone="success">
          {isTransfer
            ? 'Les fonds ont été crédités au destinataire avec succès.'
            : 'Votre transaction a été traitée avec succès.'}
        </NoticeBox>
      )}
      {(orderData.status === 'cancelled' || orderData.status === 'failed') && (
        <NoticeBox tone="danger">
          {orderData.status === 'cancelled'
            ? `Votre ${isTransfer ? 'transfert' : 'commande'} a été annulé. ${
                orderData.cancellation_reason ? `Motif : ${orderData.cancellation_reason}. ` : ''
              }Si un paiement a été effectué, il sera remboursé sous 3 à 5 jours ouvrables.`
            : `Une erreur s'est produite. ${orderData.error_message || 'Notre équipe technique a été notifiée.'}`}
        </NoticeBox>
      )}

      <PrimaryButton href="https://terangaexchange.com/dashboard">Voir le détail</PrimaryButton>
    </BaseEmail>
  );
};
