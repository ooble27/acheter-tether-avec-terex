
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
        return '#8b949e';
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
                  <div style={detailItem}>
                    <Text style={detailLabel}>Adresse</Text>
                    <Text style={addressValue}>{orderData.wallet_address || 'N/A'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Taux</Text>
                    <Text style={detailValue}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Text>
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
                  <div style={detailItem}>
                    <Text style={detailLabel}>Compte</Text>
                    <Text style={addressValue}>{orderData.recipient_account || 'N/A'}</Text>
                  </div>
                  <div style={detailItem}>
                    <Text style={detailLabel}>Frais</Text>
                    <Text style={detailValue}>{orderData.fees || 0} {orderData.from_currency || 'USDT'}</Text>
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
🌍 Pays : ${orderData.recipient_country || 'N/A'}

✅ Les fonds ont été crédités avec succès
📱 Le destinataire a été notifié de la réception`
                : `Parfait ! Votre transaction USDT a été finalisée avec succès.

${orderData.type === 'buy' ? '💳 Achat' : '💸 Vente'} USDT terminé
💰 Montant : ${orderData.amount || 0} ${orderData.currency || 'CFA'}
🪙 USDT ${orderData.type === 'buy' ? 'reçus' : 'vendus'} : ${orderData.usdt_amount || 0} USDT
🌐 Réseau : ${orderData.network || 'TRC20'}

${orderData.type === 'buy' 
  ? '✅ Vos USDT ont été envoyés à votre portefeuille' 
  : '✅ Votre paiement a été effectué avec succès'}`
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

          <div style={processingSteps}>
            <div style={stepCompleted}>
              <span style={stepIcon}>✅</span>
              <Text style={stepText}>Demande reçue et validée</Text>
            </div>
            <div style={stepCompleted}>
              <span style={stepIcon}>✅</span>
              <Text style={stepText}>Paiement confirmé</Text>
            </div>
            <div style={stepCurrent}>
              <span style={stepIcon}>🔄</span>
              <Text style={stepText}>Traitement de la transaction</Text>
            </div>
            <div style={stepPending}>
              <span style={stepIcon}>⏳</span>
              <Text style={stepText}>Finalisation et envoi</Text>
            </div>
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
💰 Remboursement : ${orderData.refund_status || 'En cours de traitement'}

Si vous avez effectué un paiement, celui-ci sera remboursé dans un délai de 3-5 jours ouvrables selon votre méthode de paiement.`
                : `Une erreur s'est produite lors du traitement de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}.

🔍 Code d'erreur : ${orderData.error_code || 'TECH_ERROR'}
📝 Description : ${orderData.error_message || 'Erreur technique temporaire'}
🔄 Tentatives : ${orderData.retry_count || 1}/3

Notre équipe technique a été automatiquement notifiée et travaille sur une solution. Un remboursement automatique sera initié si nécessaire.`
              }
            </Text>
          </div>
          
          <div style={contactInfo}>
            <Text style={contactInfoTitle}>📞 Besoin d'aide ?</Text>
            <Text style={contactInfoText}>
              Contactez notre support pour plus d'informations :
              
              📧 Email : terangaexchange@gmail.com
              📱 Téléphone : +221 77 397 27 49
              💬 WhatsApp : +1 418 261 9091
              🆔 Référence : #TEREX-{orderData.id?.slice(-8) || 'N/A'}
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

// Styles optimisés
const statusSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
  padding: '32px',
  backgroundColor: '#21262d',
  borderRadius: '12px',
  border: '1px solid #30363d',
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
  backgroundColor: '#0d1117',
  border: '1px solid #30363d',
  borderRadius: '8px',
  padding: '16px',
  display: 'inline-block',
};

const newStatusLabel = {
  color: '#8b949e',
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
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  borderBottom: '2px solid #3B968F',
  paddingBottom: '8px',
  display: 'inline-block',
};

const transactionCard = {
  backgroundColor: '#21262d',
  border: '1px solid #30363d',
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
  color: '#8b949e',
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

const addressValue = {
  color: '#58a6ff',
  fontSize: '12px',
  fontWeight: '600',
  fontFamily: 'monospace',
  margin: '0',
  wordBreak: 'break-all' as const,
};

// Styles pour statut completed
const completedSection = {
  marginBottom: '32px',
  backgroundColor: '#21262d',
  border: '2px solid #238636',
  borderRadius: '12px',
  overflow: 'hidden',
};

const completedHeader = {
  backgroundColor: '#238636',
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
  backgroundColor: '#30363d',
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
  color: '#8b949e',
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
  textAlign: 'center' as const,
};

const processingSteps = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '12px',
  marginBottom: '24px',
};

const stepCompleted = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#21262d',
  borderRadius: '6px',
  border: '1px solid #238636',
};

const stepCurrent = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#21262d',
  borderRadius: '6px',
  border: '1px solid #ffa657',
};

const stepPending = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px',
  backgroundColor: '#21262d',
  borderRadius: '6px',
  border: '1px solid #30363d',
  opacity: '0.6',
};

const stepIcon = {
  fontSize: '16px',
  width: '20px',
  textAlign: 'center' as const,
};

const stepText = {
  color: '#ffffff',
  fontSize: '13px',
  fontWeight: '500',
  margin: '0',
};

const processingInfo = {
  backgroundColor: '#0d1117',
  border: '1px solid #ffa657',
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
  backgroundColor: '#21262d',
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
  borderBottom: '1px solid #30363d',
};

const problemMessage = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const contactInfo = {
  padding: '24px',
};

const contactInfoTitle = {
  color: '#58a6ff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px 0',
};

const contactInfoText = {
  color: '#8b949e',
  fontSize: '13px',
  margin: '0',
  lineHeight: '1.6',
  whiteSpace: 'pre-line' as const,
};

const thankYouSection = {
  textAlign: 'center' as const,
  marginTop: '40px',
  padding: '24px',
  backgroundColor: '#21262d',
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
  color: '#8b949e',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
};
