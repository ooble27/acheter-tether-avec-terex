
import {
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface StatusUpdateProps {
  orderData: any;
  transactionType: string;
}

export const StatusUpdateEmail = ({ orderData, transactionType }: StatusUpdateProps) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'processing':
        return 'En cours de traitement';
      case 'completed':
        return 'Terminée avec succès';
      case 'cancelled':
        return 'Annulée';
      case 'failed':
        return 'Échec de la transaction';
      default:
        return status;
    }
  };

  const title = `Mise à jour de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}`;
  const preview = `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été mise à jour`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <Text style={statusText}>
        📊 Le statut de votre {transactionType === 'transfer' ? 'transfert international' : 'commande'} a été mis à jour.
      </Text>

      <Text style={newStatusText}>
        <strong>Nouveau statut : {getStatusText(orderData.status)}</strong>
      </Text>

      <Text style={sectionTitle}>DÉTAILS DE VOTRE TRANSACTION</Text>
      
      <Text style={detailText}>
        <strong>Numéro :</strong> {transactionType === 'transfer' ? 'Transfert' : 'Commande'} #TEREX-{orderData.id?.slice(-8) || 'N/A'}
      </Text>
      
      <Text style={detailText}>
        <strong>Date de création :</strong> {new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}
      </Text>
      
      <Text style={detailText}>
        <strong>Dernière mise à jour :</strong> {new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}
      </Text>

      {transactionType !== 'transfer' && (
        <>
          <Text style={detailText}>
            <strong>Type :</strong> {orderData.type === 'buy' ? 'Achat USDT' : 'Vente USDT'}
          </Text>
          <Text style={detailText}>
            <strong>Montant :</strong> {orderData.amount || 0} {orderData.currency || 'CFA'}
          </Text>
          <Text style={detailText}>
            <strong>USDT :</strong> {orderData.usdt_amount || 0} USDT
          </Text>
          <Text style={detailText}>
            <strong>Réseau :</strong> {orderData.network || 'TRC20'}
          </Text>
        </>
      )}
      
      {transactionType === 'transfer' && (
        <>
          <Text style={detailText}>
            <strong>Montant envoyé :</strong> {orderData.amount || 0} {orderData.from_currency || 'USDT'}
          </Text>
          <Text style={detailText}>
            <strong>Montant à recevoir :</strong> {orderData.total_amount || 0} {orderData.to_currency || 'N/A'}
          </Text>
          <Text style={detailText}>
            <strong>Destinataire :</strong> {orderData.recipient_name || 'N/A'}
          </Text>
          <Text style={detailText}>
            <strong>Pays :</strong> {orderData.recipient_country || 'N/A'}
          </Text>
        </>
      )}
      
      <Text style={detailText}>
        <strong>Méthode de paiement :</strong> {
          orderData.payment_method === 'card' ? 'Carte bancaire' : 
          orderData.payment_method === 'wave' ? 'Wave' :
          orderData.payment_method === 'orange' ? 'Orange Money' : 
          orderData.payment_method || 'N/A'
        }
      </Text>
      
      <Text style={detailText}>
        <strong>Référence :</strong> {orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}
      </Text>

      {/* Messages spécifiques selon le statut */}
      {orderData.status === 'completed' && (
        <>
          <Text style={sectionTitle}>TRANSACTION TERMINÉE AVEC SUCCÈS</Text>
          <Text style={completedText}>
            🎉 Parfait ! Votre {transactionType === 'transfer' ? 'transfert international' : 'transaction USDT'} a été finalisée avec succès.
          </Text>
          {transactionType === 'transfer' ? (
            <Text style={detailText}>
              Montant envoyé : {orderData.amount || 0} {orderData.from_currency || 'USDT'}{'\n'}
              Montant reçu : {orderData.total_amount || 0} {orderData.to_currency || 'N/A'}{'\n'}
              Destinataire : {orderData.recipient_name || 'N/A'}{'\n'}
              ✅ Les fonds ont été crédités avec succès
            </Text>
          ) : (
            <Text style={detailText}>
              {orderData.type === 'buy' ? 'Achat' : 'Vente'} USDT terminé{'\n'}
              Montant : {orderData.amount || 0} {orderData.currency || 'CFA'}{'\n'}
              USDT : {orderData.usdt_amount || 0} USDT{'\n'}
              ✅ Transaction terminée avec succès
            </Text>
          )}
        </>
      )}
      
      {orderData.status === 'processing' && (
        <>
          <Text style={sectionTitle}>TRANSACTION EN COURS DE TRAITEMENT</Text>
          <Text style={progressText}>⏳ Traitement en cours - 70% terminé</Text>
          <Text style={detailText}>
            Notre équipe traite activement votre {transactionType === 'transfer' ? 'transfert' : 'commande'}.{'\n'}
            Délai estimé restant : 5 minutes{'\n'}
            Vous serez notifié immédiatement une fois le traitement terminé.
          </Text>
        </>
      )}
      
      {(orderData.status === 'cancelled' || orderData.status === 'failed') && (
        <>
          <Text style={sectionTitle}>
            {orderData.status === 'cancelled' ? 'TRANSACTION ANNULÉE' : 'ÉCHEC DE LA TRANSACTION'}
          </Text>
          {orderData.status === 'cancelled' ? (
            <Text style={problemText}>
              ❌ Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} a été annulée.{'\n'}
              Date d'annulation : {new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}{'\n'}
              Raison : {orderData.cancellation_reason || 'Annulation demandée'}{'\n'}
              Si vous avez effectué un paiement, celui-ci sera remboursé dans un délai de 3-5 jours ouvrables.
            </Text>
          ) : (
            <Text style={problemText}>
              ⚠️ Une erreur s'est produite lors du traitement.{'\n'}
              Description : {orderData.error_message || 'Erreur technique temporaire'}{'\n'}
              Notre équipe technique a été notifiée et travaille sur une solution.
            </Text>
          )}
        </>
      )}

      <Text style={thankYouText}>
        🙏 Merci de faire confiance à Terex !
      </Text>
      <Text style={teamText}>
        Notre équipe reste à votre disposition pour toute question.
      </Text>
    </BaseEmail>
  );
};

// Styles simples et lisibles
const statusText = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  lineHeight: '1.4',
};

const newStatusText = {
  color: '#059669',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 30px 0',
  textAlign: 'center' as const,
};

const sectionTitle = {
  color: '#2563eb',
  fontSize: '16px',
  fontWeight: '700',
  margin: '30px 0 15px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
};

const detailText = {
  color: '#333333',
  fontSize: '14px',
  margin: '8px 0',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const,
};

const completedText = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const progressText = {
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  textAlign: 'center' as const,
};

const problemText = {
  color: '#dc2626',
  fontSize: '14px',
  margin: '0 0 15px 0',
  lineHeight: '1.5',
  whiteSpace: 'pre-line' as const,
};

const thankYouText = {
  color: '#2563eb',
  fontSize: '18px',
  fontWeight: '600',
  margin: '30px 0 8px 0',
  textAlign: 'center' as const,
};

const teamText = {
  color: '#666666',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
  textAlign: 'center' as const,
};
