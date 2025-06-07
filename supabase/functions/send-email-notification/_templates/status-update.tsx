
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return '#ffa657';
      case 'completed':
        return '#4BA89F';
      case 'cancelled':
        return '#f85149';
      case 'failed':
        return '#f85149';
      default:
        return '#b0b0b0';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return '⏳';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'failed':
        return '⚠️';
      default:
        return '📊';
    }
  };

  const title = `Mise à jour de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}`;
  const preview = `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été mise à jour`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Status principal */}
      <Section style={statusSection}>
        <div style={statusBadge}>
          <span style={statusIcon}>{getStatusIcon(orderData.status)}</span>
          <Text style={statusText}>Mise à jour importante</Text>
        </div>
        <Text style={statusMessage}>
          Le statut de votre {transactionType === 'transfer' ? 'transfert international' : 'commande'} a été mis à jour.
        </Text>
        
        <div style={statusUpdateCard}>
          <Text style={newStatusLabel}>Nouveau statut :</Text>
          <Text style={{...newStatusValue, color: getStatusColor(orderData.status)}}>
            {getStatusText(orderData.status)}
          </Text>
        </div>
      </Section>

      {/* Détails de la transaction */}
      <Section style={detailsSection}>
        <Text style={sectionTitle}>📋 Détails de votre transaction</Text>
        
        <div style={transactionCard}>
          <div style={transactionHeader}>
            <Text style={transactionNumber}>
              {transactionType === 'transfer' ? 'Transfert' : 'Commande'} #TEREX-{orderData.id?.slice(-8) || 'N/A'}
            </Text>
            <div style={{...currentStatusBadge, backgroundColor: getStatusColor(orderData.status)}}>
              <Text style={currentStatusText}>{getStatusText(orderData.status)}</Text>
            </div>
          </div>
          
          <div style={transactionContent}>
            <div style={detailsGrid}>
              <div style={detailItem}>
                <Text style={detailLabel}>Date de création</Text>
                <Text style={detailValue}>
                  {new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}
                </Text>
              </div>
              
              <div style={detailItem}>
                <Text style={detailLabel}>Dernière mise à jour</Text>
                <Text style={detailValue}>
                  {new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}
                </Text>
              </div>

              {transactionType !== 'transfer' && (
                <>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Type</Text>
                    <Text style={detailValue}>
                      {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                    </Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Montant</Text>
                    <Text style={amountValue}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>USDT</Text>
                    <Text style={usdtValue}>{orderData.usdt_amount || 0} USDT</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Réseau</Text>
                    <Text style={detailValue}>{orderData.network || 'TRC20'}</Text>
                  </div>
                </>
              )}
              
              {transactionType === 'transfer' && (
                <>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Montant envoyé</Text>
                    <Text style={amountValue}>{orderData.amount || 0} {orderData.from_currency || 'USDT'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Montant à recevoir</Text>
                    <Text style={usdtValue}>{orderData.total_amount || 0} {orderData.to_currency || 'N/A'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Destinataire</Text>
                    <Text style={detailValue}>{orderData.recipient_name || 'N/A'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Pays</Text>
                    <Text style={detailValue}>{orderData.recipient_country || 'N/A'}</Text>
                  </div>
                </>
              )}
              
              <div style={detailItem}>
                <Text style={detailLabel}>Méthode de paiement</Text>
                <Text style={detailValue}>
                  {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
                   orderData.payment_method === 'wave' ? '📱 Wave' :
                   orderData.payment_method === 'orange' ? '🟠 Orange Money' : 
                   orderData.payment_method || 'N/A'}
                </Text>
              </div>
              
              <div style={detailItem}>
                <Text style={detailLabel}>Référence</Text>
                <Text style={detailValue}>{orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}</Text>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Messages spécifiques selon le statut */}
      {orderData.status === 'completed' && (
        <Section style={completedSection}>
          <div style={completedHeader}>
            <span style={completedIcon}>🎉</span>
            <Text style={completedTitle}>Transaction terminée avec succès !</Text>
          </div>
          <div style={completedContent}>
            <Text style={completedMessage}>
              {transactionType === 'transfer' 
                ? `Parfait ! Votre transfert international a été effectué avec succès.

📤 Montant envoyé : ${orderData.amount || 0} ${orderData.from_currency || 'USDT'}
📥 Montant reçu : ${orderData.total_amount || 0} ${orderData.to_currency || 'N/A'}
👤 Destinataire : ${orderData.recipient_name || 'N/A'}

✅ Les fonds ont été crédités avec succès`
                : `Parfait ! Votre transaction USDT a été finalisée avec succès.

${orderData.type === 'buy' ? '💳 Achat' : '💸 Vente'} USDT terminé
💰 Montant : ${orderData.amount || 0} ${orderData.currency || 'CFA'}
🪙 USDT : ${orderData.usdt_amount || 0} USDT

✅ Transaction terminée avec succès`
              }
            </Text>
          </div>
        </Section>
      )}
      
      {orderData.status === 'processing' && (
        <Section style={processingSection}>
          <Text style={processingSectionTitle}>⏳ Transaction en cours de traitement</Text>
          
          <div style={progressContainer}>
            <div style={progressTrack}>
              <div style={progressFill}></div>
            </div>
            <Text style={progressText}>Traitement en cours - 70% terminé</Text>
          </div>

          <div style={processingInfo}>
            <Text style={processingInfoText}>
              Notre équipe traite activement votre {transactionType === 'transfer' ? 'transfert' : 'commande'}.
              
              Délai estimé restant : {transactionType === 'transfer' ? '6-24 heures' : '5-15 minutes'}
              
              Vous serez notifié immédiatement une fois le traitement terminé.
            </Text>
          </div>
        </Section>
      )}
      
      {(orderData.status === 'cancelled' || orderData.status === 'failed') && (
        <Section style={problemSection}>
          <div style={problemHeader}>
            <span style={problemIcon}>
              {orderData.status === 'cancelled' ? '❌' : '⚠️'}
            </span>
            <Text style={problemTitle}>
              {orderData.status === 'cancelled' ? 'Transaction annulée' : 'Échec de la transaction'}
            </Text>
          </div>
          
          <div style={problemContent}>
            <Text style={problemMessage}>
              {orderData.status === 'cancelled' 
                ? `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été annulée.

🗓️ Date d'annulation : ${new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}
📝 Raison : ${orderData.cancellation_reason || 'Annulation demandée'}

Si vous avez effectué un paiement, celui-ci sera remboursé dans un délai de 3-5 jours ouvrables.`
                : `Une erreur s'est produite lors du traitement.

📝 Description : ${orderData.error_message || 'Erreur technique temporaire'}

Notre équipe technique a été notifiée et travaille sur une solution.`
              }
            </Text>
          </div>
        </Section>
      )}

      {/* Message de remerciement */}
      <Section style={thankYouSection}>
        <Text style={thankYouMessage}>
          🙏 Merci de faire confiance à Terex !
        </Text>
        <Text style={teamMessage}>
          Notre équipe reste à votre disposition pour toute question.
        </Text>
      </Section>
    </BaseEmail>
  );
};

// Styles avec couleurs Terex
const statusSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '32px',
  backgroundColor: 'rgba(59, 150, 143, 0.05)',
  borderRadius: '12px',
  border: '1px solid rgba(59, 150, 143, 0.3)',
};

const statusBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '12px',
  backgroundColor: '#58a6ff',
  color: '#ffffff',
  padding: '12px 24px',
  borderRadius: '25px',
  marginBottom: '20px',
};

const statusIcon = {
  fontSize: '20px',
};

const statusText = {
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const statusMessage = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  lineHeight: '1.4',
};

const statusUpdateCard = {
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  border: '1px solid rgba(59, 150, 143, 0.3)',
  borderRadius: '8px',
  padding: '16px',
  display: 'inline-block',
};

const newStatusLabel = {
  color: '#b0b0b0',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0 0 4px 0',
  textTransform: 'uppercase' as const,
};

const newStatusValue = {
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const detailsSection = {
  marginBottom: '32px',
};

const sectionTitle = {
  color: '#3B968F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #3B968F',
  paddingBottom: '8px',
  display: 'inline-block',
};

const transactionCard = {
  backgroundColor: 'rgba(59, 150, 143, 0.05)',
  border: '1px solid rgba(59, 150, 143, 0.3)',
  borderRadius: '12px',
  overflow: 'hidden',
};

const transactionHeader = {
  backgroundColor: '#3B968F',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const transactionNumber = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0',
  fontFamily: 'monospace',
};

const currentStatusBadge = {
  padding: '6px 12px',
  borderRadius: '6px',
};

const currentStatusText = {
  color: '#ffffff',
  fontSize: '12px',
  fontWeight: '600',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const transactionContent = {
  padding: '24px',
};

const detailsGrid = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
};

const detailItem = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '6px',
};

const detailLabel = {
  color: '#b0b0b0',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const detailValue = {
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  wordBreak: 'break-word' as const,
};

const amountValue = {
  color: '#ffa657',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

const usdtValue = {
  color: '#4BA89F',
  fontSize: '16px',
  fontWeight: '700',
  margin: '0',
};

// Styles pour statut completed
const completedSection = {
  marginBottom: '32px',
  backgroundColor: 'rgba(75, 168, 159, 0.1)',
  border: '2px solid #4BA89F',
  borderRadius: '12px',
  overflow: 'hidden',
};

const completedHeader = {
  backgroundColor: '#4BA89F',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
};

const completedIcon = {
  fontSize: '32px',
};

const completedTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
};

const completedContent = {
  padding: '24px',
};

const completedMessage = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

// Styles pour statut processing
const processingSection = {
  marginBottom: '32px',
};

const processingSectionTitle = {
  color: '#ffa657',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #ffa657',
  paddingBottom: '8px',
  display: 'inline-block',
};

const progressContainer = {
  marginBottom: '24px',
};

const progressTrack = {
  width: '100%',
  height: '8px',
  backgroundColor: 'rgba(255, 166, 87, 0.2)',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '8px',
};

const progressFill = {
  width: '70%',
  height: '100%',
  background: 'linear-gradient(90deg, #ffa657 0%, #ff8c42 100%)',
  borderRadius: '4px',
};

const progressText = {
  color: '#b0b0b0',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'center' as const,
};

const processingInfo = {
  backgroundColor: 'rgba(255, 166, 87, 0.1)',
  border: '1px solid rgba(255, 166, 87, 0.3)',
  borderRadius: '8px',
  padding: '16px',
};

const processingInfoText = {
  color: '#ffffff',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

// Styles pour statut cancelled/failed
const problemSection = {
  marginBottom: '32px',
  backgroundColor: 'rgba(248, 81, 73, 0.1)',
  border: '2px solid #f85149',
  borderRadius: '12px',
  overflow: 'hidden',
};

const problemHeader = {
  backgroundColor: '#f85149',
  padding: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
};

const problemIcon = {
  fontSize: '32px',
  color: '#ffffff',
};

const problemTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
};

const problemContent = {
  padding: '24px',
};

const problemMessage = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const thankYouSection = {
  textAlign: 'center' as const,
  marginTop: '40px',
  padding: '24px',
  backgroundColor: 'rgba(59, 150, 143, 0.1)',
  borderRadius: '12px',
  border: '1px solid #3B968F',
};

const thankYouMessage = {
  color: '#4BA89F',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 8px 0',
};

const teamMessage = {
  color: '#b0b0b0',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
};
