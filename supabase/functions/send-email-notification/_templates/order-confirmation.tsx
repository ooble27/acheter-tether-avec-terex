
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

interface OrderConfirmationProps {
  orderData: any;
  transactionType: 'buy' | 'sell';
}

export const OrderConfirmationEmail = ({ orderData, transactionType }: OrderConfirmationProps) => {
  const title = transactionType === 'buy' ? 'Confirmation de demande d\'achat USDT' : 'Confirmation de demande de vente USDT';
  const preview = `Votre demande ${transactionType === 'buy' ? 'd\'achat' : 'de vente'} #TEREX-${orderData.id?.slice(-8)} a été confirmée`;
  
  // Parser les notes pour récupérer les informations du client
  let clientInfo = null;
  try {
    if (orderData.notes) {
      clientInfo = JSON.parse(orderData.notes);
    }
  } catch (e) {
    console.log('Impossible de parser les notes:', e);
  }

  const phoneNumber = clientInfo?.phoneNumber || orderData.phone_number || 'N/A';
  const provider = clientInfo?.provider || orderData.payment_method || 'N/A';
  const providerName = provider === 'wave' ? 'Wave' : provider === 'orange' ? 'Orange Money' : provider === 'orange_money' ? 'Orange Money' : 'Mobile Money';
  
  return (
    <BaseEmail preview={preview} title={title}>
      {/* Header de confirmation */}
      <Section style={confirmationHeader}>
        <Text style={confirmationIcon}>✅</Text>
        <Text style={confirmationTitle}>
          Demande {transactionType === 'buy' ? 'd\'achat' : 'de vente'} USDT confirmée
        </Text>
        <Text style={confirmationSubtitle}>
          Nous avons bien reçu votre demande et procédons maintenant au traitement
        </Text>
      </Section>

      <Hr style={divider} />

      {/* Informations de la transaction */}
      <Section style={transactionDetails}>
        <Text style={sectionTitle}>📋 DÉTAILS DE VOTRE TRANSACTION</Text>
        
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
              <Text style={labelText}>Date et heure :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{new Date(orderData.created_at || Date.now()).toLocaleString('fr-FR')}</Text>
            </Column>
          </Row>
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Type d'opération :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{transactionType === 'buy' ? '🟢 Achat USDT' : '🔴 Vente USDT'}</Text>
            </Column>
          </Row>

          {transactionType === 'buy' ? (
            <>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant à payer :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.amount || 0} {orderData.currency || 'CFA'}</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>USDT à recevoir :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.usdt_amount || 0} USDT</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Réseau blockchain :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={valueText}>{orderData.network || 'TRC20'}</Text>
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
          ) : (
            <>
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>USDT à vendre :</Text>
                </Column>
                <Column style={valueColumn}>
                  <Text style={amountText}>{orderData.usdt_amount || 0} USDT</Text>
                </Column>
              </Row>
              
              <Row>
                <Column style={labelColumn}>
                  <Text style={labelText}>Montant à recevoir :</Text>
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
          
          <Row>
            <Column style={labelColumn}>
              <Text style={labelText}>Taux de change :</Text>
            </Column>
            <Column style={valueColumn}>
              <Text style={valueText}>{orderData.exchange_rate || 0} {orderData.currency || 'CFA'}/USDT</Text>
            </Column>
          </Row>
        </Container>
      </Section>

      <Hr style={divider} />

      {/* Étapes suivantes */}
      <Section style={processSection}>
        <Text style={sectionTitle}>⚡ PROCHAINES ÉTAPES</Text>
        
        <Container style={stepsContainer}>
          <Text style={stepCompleted}>1. ✅ Demande reçue et confirmée</Text>
          <Text style={stepPending}>
            2. ⏳ {transactionType === 'buy' 
              ? 'Instructions de paiement à suivre' 
              : 'Instructions d\'envoi USDT à suivre'
            }
          </Text>
          <Text style={stepPending}>3. ⏳ Traitement et vérification</Text>
          <Text style={stepPending}>
            4. ⏳ {transactionType === 'buy' 
              ? `Envoi de ${orderData.usdt_amount || 0} USDT vers votre portefeuille`
              : `Envoi de ${orderData.amount || 0} ${orderData.currency || 'CFA'} vers votre ${providerName}`
            }
          </Text>
        </Container>
      </Section>

      <Hr style={divider} />

      {/* Informations importantes */}
      <Section style={infoSection}>
        <Text style={sectionTitle}>ℹ️ INFORMATIONS IMPORTANTES</Text>
        
        <Text style={infoText}>
          <strong>⏱️ Délai de traitement :</strong> 2-5 minutes après confirmation du paiement
        </Text>
        <Text style={infoText}>
          <strong>🔒 Sécurité :</strong> Transaction sécurisée et surveillée 24h/7j
        </Text>
        <Text style={infoText}>
          <strong>📱 Support :</strong> Notre équipe est disponible pour vous aider
        </Text>
        <Text style={infoText}>
          <strong>📊 Suivi :</strong> Vous pouvez suivre l'état sur la plateforme Terex
        </Text>
      </Section>

      <Hr style={divider} />

      <Text style={thankYouText}>
        🙏 Merci de faire confiance à Terex pour vos échanges USDT !
      </Text>
      <Text style={teamText}>
        L'équipe Terex - Votre partenaire crypto de confiance
      </Text>
    </BaseEmail>
  );
};

// Styles inspirés des emails Interac - design professionnel et moderne
const confirmationHeader = {
  textAlign: 'center' as const,
  padding: '30px 20px',
  backgroundColor: '#f8fafc',
  borderRadius: '12px',
  margin: '0 0 30px 0',
  border: '2px solid #e2e8f0',
};

const confirmationIcon = {
  fontSize: '48px',
  margin: '0 0 15px 0',
  display: 'block',
};

const confirmationTitle = {
  color: '#059669',
  fontSize: '24px',
  fontWeight: '700',
  margin: '0 0 10px 0',
  lineHeight: '1.3',
};

const confirmationSubtitle = {
  color: '#64748b',
  fontSize: '16px',
  margin: '0',
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

const infoSection = {
  margin: '0 0 30px 0',
};

const infoText = {
  color: '#475569',
  fontSize: '14px',
  margin: '10px 0',
  lineHeight: '1.6',
  padding: '8px 0',
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
