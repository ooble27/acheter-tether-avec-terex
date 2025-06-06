
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
  const preview = `Votre demande de transfert #TEREX-${transferData.id?.slice(-8)} a été confirmée`;
  
  const getCountryName = (code: string) => {
    const countries = {
      'SN': 'Sénégal',
      'CI': 'Côte d\'Ivoire',
      'ML': 'Mali',
      'BF': 'Burkina Faso',
      'NG': 'Nigeria',
      'BJ': 'Bénin'
    };
    return countries[code as keyof typeof countries] || code;
  };

  const getPaymentMethodName = () => {
    switch (transferData.payment_method) {
      case 'card': return '💳 Carte bancaire';
      case 'bank': return '🏦 Virement bancaire';
      case 'interac': return '💸 Interac E-Transfer';
      default: return transferData.payment_method || 'À définir';
    }
  };

  const getReceiveMethodName = () => {
    switch (transferData.receive_method) {
      case 'mobile': return '📱 Mobile Money';
      case 'bank_transfer': return '🏦 Virement bancaire';
      case 'cash_pickup': return '💰 Retrait en espèces';
      default: return transferData.receive_method || 'À définir';
    }
  };

  const getProviderName = () => {
    if (transferData.provider === 'wave') return 'Wave';
    if (transferData.provider === 'orange') return 'Orange Money';
    return '';
  };
  
  return (
    <BaseEmail preview={preview} title={title}>      
      <div style={iconContainer}>
        <div style={transferIcon}>🌍</div>
      </div>
      
      <Text style={greeting}>
        Excellent ! Votre transfert international a été confirmé
      </Text>
      
      <Text style={text}>
        Nous avons bien reçu votre demande de transfert international. 
        Voici le récapitulatif de votre transfert :
      </Text>
      
      <Section style={transferCard}>
        <div style={cardHeader}>
          <Text style={cardTitle}>
            💸 Détails du transfert
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Numéro de transfert :</Column>
            <Column style={value}>TEREX-{transferData.id?.slice(-8)}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Date de création :</Column>
            <Column style={value}>{new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant envoyé :</Column>
            <Column style={valueHighlight}>
              {transferData.amount} {transferData.from_currency}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Montant à recevoir :</Column>
            <Column style={totalAmount}>
              {transferData.total_amount} {transferData.to_currency}
            </Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Taux de change :</Column>
            <Column style={value}>1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Frais :</Column>
            <Column style={value}>{transferData.fees} {transferData.from_currency}</Column>
          </Row>
        </div>
      </Section>
      
      <Section style={recipientCard}>
        <div style={recipientHeader}>
          <Text style={recipientTitle}>
            👤 Informations du destinataire
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Nom complet :</Column>
            <Column style={value}>{transferData.recipient_name}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Pays de destination :</Column>
            <Column style={countryValue}>{getCountryName(transferData.recipient_country)}</Column>
          </Row>
          {transferData.recipient_phone && (
            <Row style={row}>
              <Column style={label}>Téléphone :</Column>
              <Column style={value}>{transferData.recipient_phone}</Column>
            </Row>
          )}
          {transferData.recipient_email && (
            <Row style={row}>
              <Column style={label}>Email :</Column>
              <Column style={value}>{transferData.recipient_email}</Column>
            </Row>
          )}
          {transferData.recipient_account && (
            <Row style={row}>
              <Column style={label}>Compte/Numéro :</Column>
              <Column style={accountValue}>{transferData.recipient_account}</Column>
            </Row>
          )}
          {transferData.recipient_bank && (
            <Row style={row}>
              <Column style={label}>Banque :</Column>
              <Column style={value}>{transferData.recipient_bank}</Column>
            </Row>
          )}
        </div>
      </Section>

      <Section style={paymentCard}>
        <div style={paymentHeader}>
          <Text style={paymentTitle}>
            💳 Méthodes de transfert
          </Text>
        </div>
        
        <div style={cardContent}>
          <Row style={row}>
            <Column style={label}>Vous payez par :</Column>
            <Column style={value}>{getPaymentMethodName()}</Column>
          </Row>
          <Row style={row}>
            <Column style={label}>Destinataire reçoit par :</Column>
            <Column style={value}>
              {getReceiveMethodName()}
              {transferData.provider && getProviderName() && ` (${getProviderName()})`}
            </Column>
          </Row>
        </div>
      </Section>
      
      <Section style={statusCard}>
        <Text style={statusTitle}>
          📊 Prochaines étapes
        </Text>
        <Text style={statusText}>
          1. ✅ Demande confirmée et enregistrée
          2. ⏳ Instructions de paiement en cours d'envoi
          3. ⏸️ En attente : Réception de votre paiement
          4. ⏸️ En attente : Traitement et envoi des fonds
          5. ⏸️ En attente : Confirmation de réception par le destinataire
        </Text>
      </Section>

      <Section style={contactCard}>
        <Text style={contactTitle}>
          📞 Support et assistance
        </Text>
        <Text style={contactText}>
          Email : terangaexchange@gmail.com
          Téléphone : +221 77 397 27 49
          WhatsApp : +1 4182619091
          
          Numéro de suivi : TEREX-{transferData.id?.slice(-8)}
          Délai de traitement : 24-48h ouvrables
        </Text>
      </Section>
      
      <Text style={text}>
        Vous allez recevoir les instructions de paiement dans quelques instants. 
        Notre équipe traitera votre transfert dès réception de votre paiement.
      </Text>
      
      <Text style={thankYou}>
        🌟 Merci de faire confiance à Terex pour vos transferts internationaux !
      </Text>
    </BaseEmail>
  );
};

// Styles avec couleurs Terex (sombre et vert)
const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '24px',
};

const transferIcon = {
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

const transferCard = {
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

const recipientCard = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '1px solid #3B968F', // Terex accent border
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const recipientHeader = {
  backgroundColor: '#3B968F', // Terex accent
  padding: '16px 20px',
};

const recipientTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const paymentCard = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '1px solid #3B968F', // Terex accent border
  borderRadius: '12px',
  overflow: 'hidden',
  margin: '24px 0',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
};

const paymentHeader = {
  backgroundColor: '#3B968F', // Terex accent
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

const totalAmount = {
  color: '#4BA89F', // Terex accent light
  fontSize: '16px',
  fontWeight: '700',
  width: '60%',
};

const countryValue = {
  color: '#3B968F', // Terex accent
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const accountValue = {
  color: '#ffffff', // White text
  fontSize: '12px',
  fontWeight: '600',
  width: '60%',
  fontFamily: 'monospace',
};

const statusPending = {
  color: '#f59e0b', // Amber color
  fontSize: '14px',
  fontWeight: '600',
  width: '60%',
};

const statusCard = {
  backgroundColor: '#2A2A2A', // Terex gray
  border: '1px solid #3B968F', // Terex accent border
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const statusTitle = {
  color: '#ffffff', // White text
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 12px',
};

const statusText = {
  color: '#e2e8f0', // Light gray text
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

const thankYou = {
  color: '#3B968F', // Terex accent
  fontSize: '18px',
  fontWeight: '600',
  margin: '24px 0 0',
  textAlign: 'center' as const,
};
