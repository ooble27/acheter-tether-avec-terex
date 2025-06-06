import {
  Text,
  Section,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const title = 'Demande de transfert international confirmée';
  const preview = `Votre demande de transfert #${transferData.id?.slice(-8)} a été confirmée`;
  
  return (
    <BaseEmail preview={preview} title={title}>
      <div style={logoContainer}>
        <Img
          src="https://mwwjrrduavfcwjiyniuy.supabase.co/storage/v1/object/public/avatars/terex-logo.png"
          width="120"
          height="40"
          alt="Terex"
          style={logo}
        />
      </div>
      
      <div style={iconContainer}>
        <div style={transferIcon}>🌍</div>
      </div>
      
      <Text style={greeting}>
        Excellent !
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre demande de transfert international. 
        Voici tous les détails complets de votre transfert :
      </Text>
      
      <Section style={transferCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            💸 Détails complets du transfert
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Numéro de transfert :</Column>
            <Column style={value}>#TEREX-{transferData.id?.slice(-8) || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Date de création :</Column>
            <Column style={value}>{new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant à envoyer :</Column>
            <Column style={valueHighlight}>
              {transferData.amount || 0} {transferData.from_currency || 'USDT'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Devise de destination :</Column>
            <Column style={value}>{transferData.to_currency || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Taux de change appliqué :</Column>
            <Column style={value}>{transferData.exchange_rate || 0}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Frais de transfert :</Column>
            <Column style={value}>{transferData.fees || 0} {transferData.from_currency || 'USDT'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant total à recevoir :</Column>
            <Column style={totalAmount}>
              {transferData.total_amount || 0} {transferData.to_currency || 'N/A'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Statut actuel :</Column>
            <Column style={statusPending}>⏳ En attente de traitement</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={recipientCard}>
        <div style={recipientHeader}>
          <Text style={recipientTitle}>
            👤 Informations complètes du destinataire
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Nom complet :</Column>
            <Column style={value}>{transferData.recipient_name || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Numéro de compte :</Column>
            <Column style={accountValue}>{transferData.recipient_account || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Nom de la banque :</Column>
            <Column style={value}>{transferData.recipient_bank || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Code SWIFT/BIC :</Column>
            <Column style={value}>{transferData.swift_code || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Adresse de la banque :</Column>
            <Column style={value}>{transferData.bank_address || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Pays de destination :</Column>
            <Column style={countryValue}>{transferData.recipient_country || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Ville :</Column>
            <Column style={value}>{transferData.recipient_city || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Téléphone du destinataire :</Column>
            <Column style={value}>{transferData.recipient_phone || 'N/A'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Adresse postale :</Column>
            <Column style={value}>{transferData.recipient_address || 'N/A'}</Column>
          </Row>
        </div>
      </Section>

      <Section style={paymentCard}>
        <div style={paymentHeader}>
          <Text style={paymentTitle}>
            💳 Informations de paiement
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Méthode de paiement :</Column>
            <Column style={value}>
              {transferData.payment_method === 'card' ? '💳 Carte bancaire' : 
               transferData.payment_method === 'wave' ? '📱 Wave' :
               transferData.payment_method === 'orange' ? '🟠 Orange Money' : 
               transferData.payment_method || 'À définir'}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Référence de paiement :</Column>
            <Column style={value}>{transferData.payment_reference || 'Sera fournie'}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Instructions spéciales :</Column>
            <Column style={value}>{transferData.special_instructions || 'Aucune'}</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={statusCard}>
        <Text style={statusTitle}>
          📊 Étapes du transfert
        </Text>
        <Text style={statusText}>
          1. ✅ Demande reçue et confirmée
          2. ⏳ Vérification des informations en cours
          3. ⏸️ En attente : Instructions de paiement
          4. ⏸️ En attente : Traitement du paiement
          5. ⏸️ En attente : Exécution du transfert
          6. ⏸️ En attente : Confirmation de réception
        </Text>
      </Section>

      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Support et assistance
        </Text>
        <Text style={contactText}>
          • Email support : support@terex.com
          • Téléphone Sénégal : +221 77 397 27 49
          • WhatsApp : +1 4182619091
          • Horaires : 24h/7j pour les transferts internationaux
          • Délai de traitement : 24-48h ouvrables
          • Numéro de suivi : TEREX-{transferData.id?.slice(-8) || 'N/A'}
        </Text>
      </Section>
      
      <Text style={text}>
        Notre équipe va examiner votre demande et vous contacter dans les plus brefs délais pour finaliser le processus.
        Vous recevrez une notification à chaque étape du transfert.
      </Text>
      
      <Text style={thankYou}>
        🌟 Merci de faire confiance à Terex pour vos transferts internationaux !
      </Text>
    </BaseEmail>
  );
};

// Styles améliorés avec nouvelles sections
const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '20px',
  paddingTop: '20px',
};

const logo = {
  margin: '0 auto',
};

const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const transferIcon = {
  fontSize: '48px',
  background: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
};

const greeting = {
  color: '#1a202c',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 24px',
};

const transferCard = {
  backgroundColor: '#f7fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const cardHeader = {
  backgroundColor: '#4299e1',
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
};

const recipientCard = {
  backgroundColor: '#f0fff4',
  border: '1px solid #9ae6b4',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const recipientHeader = {
  backgroundColor: '#48bb78',
  padding: '16px 20px',
};

const recipientTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const paymentCard = {
  backgroundColor: '#fef5e7',
  border: '1px solid #f6e05e',
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
};

const paymentHeader = {
  backgroundColor: '#ed8936',
  padding: '16px 20px',
};

const paymentTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const row = {
  marginBottom: '12px',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '8px',
};

const label = {
  color: '#718096',
  fontSize: '14px',
  width: '40%',
  verticalAlign: 'top' as const,
  fontWeight: '500',
};

const value = {
  color: '#2d3748',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const valueHighlight = {
  color: '#4299e1',
  fontSize: '14px',
  fontWeight: '700',
  width: '60%',
};

const totalAmount = {
  color: '#48bb78',
  fontSize: '16px',
  fontWeight: '700',
  width: '60%',
};

const countryValue = {
  color: '#48bb78',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const accountValue = {
  color: '#2d3748',
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  fontFamily: 'monospace',
};

const statusPending = {
  color: '#d69e2e',
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const statusCard = {
  backgroundColor: '#edf2f7',
  border: '1px solid #cbd5e0',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statusTitle = {
  color: '#2d3748',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const statusText = {
  color: '#4a5568',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const contactCard = {
  backgroundColor: '#f0fff4',
  border: '1px solid #9ae6b4',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const contactTitle = {
  color: '#22543d',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const contactText = {
  color: '#22543d',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-line' as const,
};

const thankYou = {
  color: '#48bb78',
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
