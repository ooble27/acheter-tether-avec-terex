
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

interface PaymentConfirmedProps {
  orderData: any;
  transactionType: string;
}

export const PaymentConfirmedEmail = ({ orderData, transactionType }: PaymentConfirmedProps) => {
  let title = '';
  let preview = '';
  let introMessage = '';

  if (transactionType === 'buy') {
    title = 'Votre achat USDT a été finalisé avec succès';
    preview = `Votre achat de ${orderData.usdt_amount || 0} USDT a été finalisé`;
    introMessage = `Votre achat de ${orderData.usdt_amount || 0} USDT a été finalisé avec succès.`;
  } else if (transactionType === 'sell') {
    title = 'Votre vente USDT a été finalisée avec succès';
    preview = `Votre vente de ${orderData.usdt_amount || 0} USDT a été finalisée`;
    introMessage = `Votre vente de ${orderData.usdt_amount || 0} USDT a été finalisée avec succès.`;
  } else if (transactionType === 'transfer') {
    title = 'Votre transfert a été déposé avec succès';
    preview = `Votre transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} à ${orderData.recipient_name} a été déposé`;
    introMessage = `Le transfert de ${orderData.amount || 0} ${orderData.from_currency || 'USDT'} que vous avez envoyé à ${orderData.recipient_name} a été déposé.`;
  } else {
    title = 'Votre transaction a été finalisée avec succès';
    preview = 'Votre transaction a été finalisée avec succès';
    introMessage = 'Votre transaction a été finalisée avec succès.';
  }

  // Parser les notes pour récupérer les informations du client
  let clientInfo = null;
  try {
    if (orderData.notes) {
      clientInfo = JSON.parse(orderData.notes);
    }
  } catch (e) {
    console.log('Impossible de parser les notes:', e);
  }

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || orderData.recipient_phone || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || orderData.provider || 'N/A';
  const providerName = provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : provider === 'orange_money' ? 'Orange Money' : 'Mobile Money';
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Message d'introduction simple */}
      <Section style={introSection}>
        <Text style={introText}>
          Bonjour,
        </Text>
        <Text style={mainMessage}>
          {introMessage}
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Détails de la transaction */}
      <Section style={transactionDetails}>
        <Text style={sectionTitle}>DÉTAILS DE VOTRE TRANSACTION</Text>
        
        <Container style={detailsContainer}>
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Numéro de référence :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>#TEREX-{orderData.id?.slice(-8) || 'N/A'}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Date de finalisation :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{new Date(orderData.processed_at || orderData.updated_at || Date.now()).toLocaleString('fr-FR')}</Text>
            </Column>
          </Row>

          {transactionType === 'buy' && (
            <>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant payé :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>USDT reçu :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.usdt_amount || 0} USDT</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Adresse de réception :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={addressText}>{orderData.wallet_address || 'N/A'}</Text>
                </Column>
              </Row>
            </>
          )}

          {transactionType === 'sell' && (
            <>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>USDT vendu :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.usdt_amount || 0} USDT</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant reçu :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Service de réception :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{providerName}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Numéro de réception :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={phoneText}>{phoneNumber}</Text>
                </Column>
              </Row>
            </>
          )}

          {transactionType === 'transfer' && (
            <>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant envoyé :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.amount || 0} {orderData.from_currency || 'USDT'}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant reçu :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.total_amount || 0} {orderData.to_currency || 'N/A'}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Destinataire :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{orderData.recipient_name || 'N/A'}</Text>
                </Column>
              </Row>

              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Service de réception :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{providerName}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Numéro de réception :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={phoneText}>{phoneNumber}</Text>
                </Column>
              </Row>
            </>
          )}
        </Container>
      </Section>

      <Hr style={divider} />

      {/* Message de confirmation final */}
      <Section style={confirmationSection}>
        <Text style={confirmationText}>
          {transactionType === 'transfer' 
            ? 'Le bénéficiaire a été notifié de la réception des fonds.'
            : 'Votre transaction a été traitée avec succès.'
          }
        </Text>
      </Section>

      <Text style={thankYouText}>
        Merci de faire confiance à Terex !
      </Text>
      <Text style={teamText}>
        L'équipe Terex - Votre partenaire crypto de confiance
      </Text>
    </BaseEmail>
  );
};

// Styles
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
  color: '#059669',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '30px 0',
  borderWidth: '1px',
};

const transactionDetails = {
  margin: '0 0 30px 0',
};

const sectionTitle = {
  color: '#1e293b',
  fontSize: '18px',
  fontWeight: '700',
  margin: '0 0 20px 0',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  borderLeft: '4px solid #059669',
  paddingLeft: '12px',
};

const detailsContainer = {
  backgroundColor: '#f8fafc',
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

const addressText = {
  color: '#1e293b',
  fontSize: '12px',
  fontWeight: '500',
  margin: '8px 0',
  lineHeight: '1.4',
  fontFamily: 'monospace',
  backgroundColor: '#f1f5f9',
  padding: '6px 8px',
  borderRadius: '4px',
  wordBreak: 'break-all' as const,
};

const phoneText = {
  color: '#1e293b',
  fontSize: '16px',
  fontWeight: '700',
  margin: '8px 0',
  lineHeight: '1.5',
  fontFamily: 'monospace',
};

const confirmationSection = {
  textAlign: 'center' as const,
  margin: '0 0 30px 0',
  padding: '20px',
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  border: '1px solid #bbf7d0',
};

const confirmationText = {
  color: '#059669',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
  lineHeight: '1.4',
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
