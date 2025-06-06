
import {
  Text,
  Section,
  Row,
  Column,
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
        return '#f59e0b';
      case 'completed':
        return '#4BA89F'; // Terex accent light
      case 'cancelled':
        return '#ef4444';
      case 'failed':
        return '#dc2626';
      default:
        return '#6b7280';
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
      <div style={iconContainer}>
        <div style={updateIcon}>📢</div>
      </div>
      
      <Text style={greeting}>
        Mise à jour importante !
      </Text>
      
      <Text style={text}>
        Le statut de votre {transactionType === 'transfer' ? 'transfert international' : 'commande'} a été mis à jour.
        Voici tous les détails de cette mise à jour :
      </Text>
      
      <Section style={statusBanner}>
        <div style={statusContent}>
          <div style={statusIconLarge}>
            {getStatusIcon(orderData.status)}
          </div>
          <div>
            <Text style={statusLabel}>Nouveau statut :</Text>
            <Text style={{...statusValue, color: getStatusColor(orderData.status)}}>
              {getStatusText(orderData.status)}
            </Text>
          </div>
        </div>
      </Section>
      
      <Section style={orderCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            📋 Détails complets de la transaction
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>
              {transactionType === 'transfer' ? 'Numéro de transfert :' : 'Numéro de commande :'}
            </Column>
            <Column style={value}>
              #TEREX-{orderData.id?.slice(-8) || 'N/A'}
            </Column>
          </Row>
          
          <Row style={row}>
            <Column style={label}>Date de création :</Column>
            <Column style={value}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          
          <Row style={row}>
            <Column style={label}>Dernière mise à jour :</Column>
            <Column style={value}>{new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          
          {transactionType !== 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Type de transaction :</Column>
                <Column style={valueHighlight}>
                  {orderData.type === 'buy' ? '💳 Achat USDT' : '💸 Vente USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant :</Column>
                <Column style={value}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Quantité USDT :</Column>
                <Column style={usdtAmount}>{orderData.usdt_amount || 0} USDT</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Réseau blockchain :</Column>
                <Column style={value}>{orderData.network || 'TRC20'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Adresse de réception :</Column>
                <Column style={addressValue}>{orderData.wallet_address || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Taux de change :</Column>
                <Column style={value}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Column>
              </Row>
            </>
          )}
          
          {transactionType === 'transfer' && (
            <>
              <Row style={row}>
                <Column style={label}>Montant envoyé :</Column>
                <Column style={valueHighlight}>
                  {orderData.amount || 0} {orderData.from_currency || 'USDT'}
                </Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Montant à recevoir :</Column>
                <Column style={usdtAmount}>{orderData.total_amount || 0} {orderData.to_currency || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Destinataire :</Column>
                <Column style={value}>{orderData.recipient_name || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Compte destinataire :</Column>
                <Column style={addressValue}>{orderData.recipient_account || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Banque :</Column>
                <Column style={value}>{orderData.recipient_bank || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Pays :</Column>
                <Column style={countryValue}>{orderData.recipient_country || 'N/A'}</Column>
              </Row>
              <Row style={row}>
                <Column style={label}>Frais :</Column>
                <Column style={value}>{orderData.fees || 0} {orderData.from_currency || 'USDT'}</Column>
              </Row>
            </>
          )}
          
          <Row style={row}>
            <Column style={label}>Méthode de paiement :</Column>
            <Column style={value}>
              {orderData.payment_method === 'card' ? '💳 Carte bancaire' : 
               orderData.payment_method === 'wave' ? '📱 Wave' :
               orderData.payment_method === 'orange' ? '🟠 Orange Money' : 
               orderData.payment_method || 'N/A'}
            </Column>
          </Row>
          
          <Row style={row}>
            <Column style={label}>Référence :</Column>
            <Column style={value}>{orderData.payment_reference || orderData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
        </div>
      </Section>
      
      {orderData.status === 'completed' && (
        <Section style={celebrationCard}>
          <div style={celebrationHeader}>
            <div style={celebrationIcon}>🎉</div>
            <Text style={celebrationTitle}>
              Transaction terminée avec succès !
            </Text>
          </div>
          <Text style={celebrationText}>
            {transactionType === 'transfer' 
              ? `Excellente nouvelle ! Votre transfert international a été effectué avec succès.

• Montant envoyé : ${orderData.amount || 0} ${orderData.from_currency || 'USDT'}
• Montant reçu par le destinataire : ${orderData.total_amount || 0} ${orderData.to_currency || 'N/A'}
• Destinataire : ${orderData.recipient_name || 'N/A'}
• Banque : ${orderData.recipient_bank || 'N/A'}
• Pays : ${orderData.recipient_country || 'N/A'}

Les fonds ont été crédités sur le compte du destinataire.
Le destinataire a été notifié de la réception.`
              : `Parfait ! Votre transaction USDT a été finalisée avec succès.

• Type : ${orderData.type === 'buy' ? 'Achat' : 'Vente'} USDT
• Montant payé : ${orderData.amount || 0} ${orderData.currency || 'CFA'}
• USDT ${orderData.type === 'buy' ? 'reçus' : 'vendus'} : ${orderData.usdt_amount || 0} USDT
• Réseau : ${orderData.network || 'TRC20'}
• Adresse : ${orderData.wallet_address || 'N/A'}

${orderData.type === 'buy' 
  ? 'Vos USDT ont été envoyés à votre adresse de portefeuille.' 
  : 'Votre paiement a été effectué vers votre méthode de paiement.'}`
            }
          </Text>
        </Section>
      )}
      
      {orderData.status === 'processing' && (
        <Section style={processingCard}>
          <Text style={processingTitle}>
            ⏳ Traitement en cours
          </Text>
          <Text style={processingText}>
            Votre {transactionType === 'transfer' ? 'transfert' : 'commande'} est actuellement en cours de traitement. 

Étapes en cours :
• Vérification des informations ✅
• Validation du paiement ✅  
• Traitement de la transaction 🔄 EN COURS
• Finalisation ⏳ En attente

Notre équipe travaille activement sur votre demande.
Délai estimé restant : {transactionType === 'transfer' ? '12-24h' : '5-15 minutes'}

Vous serez notifié immédiatement une fois le traitement terminé.
          </Text>
          
          <div style={progressContainer}>
            <div style={progressBar}>
              <div style={progressFill}></div>
            </div>
            <Text style={progressText}>Traitement en cours - 60% complété</Text>
          </div>
        </Section>
      )}
      
      {(orderData.status === 'cancelled' || orderData.status === 'failed') && (
        <Section style={problemCard}>
          <Text style={problemTitle}>
            {orderData.status === 'cancelled' ? '❌ Transaction annulée' : '⚠️ Échec de la transaction'}
          </Text>
          <Text style={problemText}>
            {orderData.status === 'cancelled' 
              ? `Votre ${transactionType === 'transfer' ? 'transfert' : 'commande'} a été annulée.

Raison de l'annulation : ${orderData.cancellation_reason || 'Annulation demandée par l\'utilisateur'}

Détails :
• Numéro de référence : #TEREX-${orderData.id?.slice(-8) || 'N/A'}
• Date d'annulation : ${new Date(orderData.updated_at || Date.now()).toLocaleString('fr-FR')}
• Remboursement : ${orderData.refund_status || 'En cours de traitement'}

Si vous avez effectué un paiement, celui-ci sera remboursé dans un délai de 3-5 jours ouvrables.`
              : `Une erreur s'est produite lors du traitement de votre ${transactionType === 'transfer' ? 'transfert' : 'commande'}.

Détails de l'erreur :
• Code d'erreur : ${orderData.error_code || 'UNKNOWN'}
• Description : ${orderData.error_message || 'Erreur technique temporaire'}
• Tentatives : ${orderData.retry_count || 1}/3

Notre équipe technique a été automatiquement notifiée et travaille sur une solution.
Un remboursement automatique sera initié si nécessaire.`
            }

Contact notre support si vous avez des questions :
• Email : terangaexchange@gmail.com
• Téléphone Sénégal : +221 77 397 27 49
• WhatsApp : +1 4182619091  
• Chat en direct : 24h/7j sur notre site
• Numéro de référence : #TEREX-{orderData.id?.slice(-8) || 'N/A'}
          
N'hésitez pas à nous contacter pour toute question !
          </Text>
        </Section>
      )}

      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Support client disponible
        </Text>
        <Text style={contactText}>
          • Support email : terangaexchange@gmail.com
          • Téléphone Sénégal : +221 77 397 27 49
          • WhatsApp : +1 4182619091  
          • Chat en direct : 24h/7j sur notre site
          • Numéro de référence : #TEREX-{orderData.id?.slice(-8) || 'N/A'}
          
N'hésitez pas à nous contacter pour toute question !
        </Text>
      </Section>
      
      <Text style={text}>
        Merci de faire confiance à Terex pour vos transactions !
      </Text>
    </BaseEmail>
  );
};

// Styles avec couleurs Terex (sombre et vert)
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const updateIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #3B968F 0%, #4BA89F 100%)', // Terex gradient
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const greeting = {
  color: '#ffffff', // White text on dark background
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const text = {
  color: '#e2e8f0', // Light gray text
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const statusBanner = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '2px solid #3A3A3A', // Terex gray light
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
};

const statusContent = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
};

const statusIconLarge = {
  fontSize: '32px',
};

const statusLabel = {
  color: '#94a3b8', // Light gray
  fontSize: '14px',
  margin: '0 0 4px',
  fontWeight: '500',
};

const statusValue = {
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
  textTransform: 'uppercase' as const,
};

const orderCard = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '1px solid #3A3A3A', // Terex gray light
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const cardHeader = {
  backgroundColor: '#3B968F', // Terex accent
  padding: '16px 20px',
};

const cardTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const cardContent = {
  padding: '20px',
  backgroundColor: '#2A2A2A', // Terex gray
};

const row = {
  marginBottom: '12px',
  borderBottom: '1px solid #3A3A3A', // Terex gray light
  paddingBottom: '8px',
};

const label = {
  color: '#94a3b8', // Light gray
  fontSize: '14px',
  width: '40%',
  verticalAlign: 'top' as const,
  fontWeight: '500',
};

const value = {
  color: '#ffffff', // White text
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const valueHighlight = {
  color: '#3B968F', // Terex accent
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const usdtAmount = {
  color: '#4BA89F', // Terex accent light
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const countryValue = {
  color: '#3B968F', // Terex accent
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const addressValue = {
  color: '#ffffff', // White text
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  wordBreak: 'break-all' as const,
  fontFamily: 'monospace',
};

// Cards pour différents statuts
const celebrationCard = {
  backgroundColor: '#1e3a3a', // Dark green tint
  border: '2px solid #3B968F', // Terex accent border
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const celebrationHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  marginBottom: '16px',
};

const celebrationIcon = {
  fontSize: '32px',
};

const celebrationTitle = {
  color: '#ffffff', // White text
  fontSize: '20px',
  fontWeight: '700',
  margin: '0',
};

const celebrationText = {
  color: '#ffffff', // White text
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
  textAlign: 'left' as const,
};

const processingCard = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '1px solid #3B968F', // Terex accent border
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const processingTitle = {
  color: '#4BA89F', // Terex accent light
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const processingText = {
  color: '#ffffff', // White text
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0 0 16px',
  whiteSpace: 'pre-line' as const,
};

const progressContainer = {
  textAlign: 'center' as const,
};

const progressBar = {
  width: '100%',
  height: '6px',
  backgroundColor: '#3A3A3A', // Terex gray light
  borderRadius: '3px',
  overflow: 'hidden',
  margin: '0 0 8px',
};

const progressFill = {
  width: '60%',
  height: '100%',
  background: 'linear-gradient(90deg, #3B968F 0%, #4BA89F 100%)', // Terex gradient
  borderRadius: '3px',
  animation: 'pulse 2s infinite',
};

const progressText = {
  color: '#94a3b8', // Light gray
  fontSize: '12px',
  fontWeight: '500',
  margin: '0',
};

const problemCard = {
  backgroundColor: '#3a1f1f', // Dark red tint
  border: '1px solid #e53e3e',
  borderRadius: '12px',
  padding: '20px',
  margin: '24px 0',
};

const problemTitle = {
  color: '#feb2b2', // Light red
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const problemText = {
  color: '#feb2b2', // Light red
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#1e3a3a', // Dark green tint
  border: '1px solid #3B968F', // Terex accent border
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#4BA89F', // Terex accent light
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const contactText = {
  color: '#ffffff', // White text
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};
