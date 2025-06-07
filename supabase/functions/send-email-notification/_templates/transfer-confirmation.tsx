
import {
  Text,
  Section,
  Hr,
  Container,
  Row,
  Column,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseEmail } from './base-email.tsx';

interface TransferConfirmationProps {
  transferData: any;
}

export const TransferConfirmationEmail = ({ transferData }: TransferConfirmationProps) => {
  const title = 'Confirmation de transfert international';
  const preview = `Votre transfert #TEREX-${transferData.id?.slice(-8)} vers ${transferData.recipient_country} a été confirmé`;
  
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

  const getReceiveMethodName = () => {
    if (transferData.provider === 'wave') return 'Wave';
    if (transferData.provider === 'orange') return 'Orange Money';
    if (transferData.receive_method === 'mobile') return transferData.provider === 'wave' ? 'Wave' : 'Orange Money';
    return 'Mobile Money';
  };
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Message d'introduction simple */}
      <Section style={introSection}>
        <Text style={introText}>
          Bonjour,
        </Text>
        <Text style={mainMessage}>
          Votre transfert de {transferData.amount} {transferData.from_currency} vers {getCountryName(transferData.recipient_country)} a été confirmé et est en cours de traitement.
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Informations du transfert */}
      <Section style={transferDetails}>
        <Text style={sectionTitle}>DÉTAILS DE VOTRE TRANSFERT</Text>
        
        <Container style={detailsContainer}>
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Numéro de référence :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>#TEREX-{transferData.id?.slice(-8)}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Date et heure :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{new Date(transferData.created_at || Date.now()).toLocaleString('fr-FR')}</Text>
            </Column>
          </Row>

          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Vous envoyez :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={amountText}>{transferData.amount} {transferData.from_currency}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Destinataire reçoit :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={amountText}>{transferData.total_amount} {transferData.to_currency}</Text>
            </Column>
          </Row>

          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Taux de change :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>1 {transferData.from_currency} = {transferData.exchange_rate} {transferData.to_currency}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Frais de transfert :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={feesText}>{transferData.fees} {transferData.from_currency}</Text>
            </Column>
          </Row>
        </Container>
      </Section>

      <Hr style={divider} />

      {/* Informations du destinataire */}
      <Section style={recipientSection}>
        <Text style={sectionTitle}>INFORMATIONS DU DESTINATAIRE</Text>
        
        <Container style={detailsContainer}>
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Nom complet :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{transferData.recipient_name}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Pays de destination :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{getCountryName(transferData.recipient_country)}</Text>
            </Column>
          </Row>

          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Service de réception :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={serviceText}>{getReceiveMethodName()}</Text>
            </Column>
          </Row>
          
          {transferData.recipient_phone && (
            <Row>
              <Column style={labelColumn}>
                <Text style={labelText}>Numéro de téléphone :</Text>
              </Column>
              <Column style={valueColumn}>
                <Text style={phoneText}>{transferData.recipient_phone}</Text>
              </Column>
            </Row>
          )}
        </Container>
      </Section>

      <Hr style={divider} />

      {/* Processus de transfert */}
      <Section style={processSection}>
        <Text style={sectionTitle}>PROCESSUS DE TRANSFERT</Text>
        
        <Container style={stepsContainer}>
          <Text style={stepCompleted}>1. ✅ Demande confirmée</Text>
          <Text style={stepPending}>2. ⏳ Instructions de paiement</Text>
          <Text style={stepPending}>3. ⏳ Vérification du paiement</Text>
          <Text style={stepPending}>4. ⏳ Traitement du transfert</Text>
          <Text style={stepPending}>5. ⏳ Réception confirmée chez le destinataire</Text>
        </Container>
      </Section>

      <Hr style={divider} />

      <Text style={thankYouText}>
        Merci de faire confiance à Terex pour vos transferts internationaux !
      </Text>
      <Text style={teamText}>
        L'équipe Terex - Vos transferts en toute sécurité
      </Text>
    </BaseEmail>
  );
};

// Styles simples et propres
const introSection = {
  margin: '0 0 30px 0',
};

const introText = {
  color: '#1e293b',
  fontSize: '16px',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const mainMessage = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '500',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
  borderWidth: '1px',
};

const transferDetails = {
  margin: '0 0 30px 0',
};

const sectionTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 20px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  borderLeft: '4px solid #2563eb',
  paddingLeft: '12px',
};

const detailsContainer = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
};

const labelColumn = {
  width: '40%',
  paddingRight: '15px',
  verticalAlign: 'top' as const,
};

const valueColumn = {
  width: '60%',
  verticalAlign: 'top' as const,
};

const labelText = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '8px 0',
  lineHeight: '1.5',
};

const valueText = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0',
  lineHeight: '1.5',
};

const amountText = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: '700',
  margin: '8px 0',
  lineHeight: '1.5',
};

const serviceText = {
  color: '#2563eb',
  fontSize: '15px',
  fontWeight: '700',
  margin: '8px 0',
  lineHeight: '1.5',
};

const feesText = {
  color: '#dc2626',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0',
  lineHeight: '1.5',
};

const phoneText = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '700',
  margin: '8px 0',
  lineHeight: '1.5',
  fontFamily: 'monospace',
};

const recipientSection = {
  margin: '0 0 30px 0',
};

const processSection = {
  margin: '0 0 30px 0',
};

const stepsContainer = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '20px',
};

const stepCompleted = {
  color: '#059669',
  fontSize: '14px',
  fontWeight: '600',
  margin: '8px 0',
  lineHeight: '1.5',
};

const stepPending = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '8px 0',
  lineHeight: '1.5',
};

const thankYouText = {
  color: '#2563eb',
  fontSize: '20px',
  fontWeight: '700',
  margin: '30px 0 10px 0',
  textAlign: 'center' as const,
  lineHeight: '1.3',
};

const teamText = {
  color: '#64748b',
  fontSize: '14px',
  margin: '0',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  lineHeight: '1.4',
};
