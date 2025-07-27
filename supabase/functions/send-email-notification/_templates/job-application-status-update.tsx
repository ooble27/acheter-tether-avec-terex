
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Hr,
  Link,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface JobApplicationStatusUpdateEmailProps {
  orderData: {
    position: string;
    first_name: string;
    last_name: string;
    email: string;
    status: string;
    admin_notes?: string;
  };
}

export const JobApplicationStatusUpdateEmail = ({
  orderData,
}: JobApplicationStatusUpdateEmailProps) => {
  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'accepted':
        return {
          title: 'Félicitations ! Votre candidature a été acceptée',
          message: 'Nous sommes ravis de vous informer que votre candidature a été retenue pour le poste de ' + orderData.position + ' chez Terex.',
          nextSteps: [
            'Notre équipe RH va vous contacter dans les prochaines 24-48 heures pour organiser le processus d\'intégration.',
            'Vous recevrez un email avec les détails de votre contrat et les prochaines étapes à suivre.',
            'Un kit d\'accueil vous sera envoyé avec toutes les informations nécessaires pour votre premier jour.',
            'Vous aurez accès à notre plateforme interne d\'onboarding pour préparer votre arrivée.',
            'Une session d\'orientation est prévue pour vous familiariser avec nos outils et notre culture d\'entreprise.'
          ]
        };
      case 'rejected':
        return {
          title: 'Mise à jour concernant votre candidature',
          message: 'Nous vous remercions pour l\'intérêt que vous portez à Terex et pour le temps que vous avez consacré à votre candidature pour le poste de ' + orderData.position + '.',
          nextSteps: [
            'Bien que votre profil soit intéressant, nous avons décidé de poursuivre avec d\'autres candidats dont l\'expérience correspond davantage à nos besoins actuels.',
            'Nous gardons votre CV dans notre base de données pour de futures opportunités qui pourraient mieux correspondre à votre profil.',
            'N\'hésitez pas à postuler à nouveau si d\'autres postes vous intéressent à l\'avenir.',
            'Nous vous encourageons à nous suivre sur nos réseaux sociaux pour rester informé de nos nouvelles offres d\'emploi.',
            'Continuez à développer vos compétences dans le domaine des cryptomonnaies et de la fintech, c\'est un secteur en pleine croissance.'
          ]
        };
      case 'under_review':
        return {
          title: 'Votre candidature est en cours d\'examen',
          message: 'Nous avons bien reçu votre candidature pour le poste de ' + orderData.position + ' et nous vous remercions pour votre intérêt.',
          nextSteps: [
            'Votre dossier est actuellement en cours d\'examen par notre équipe de recrutement.',
            'Nous analysons attentivement votre profil et votre expérience par rapport aux exigences du poste.',
            'Le processus d\'évaluation peut prendre entre 5 à 10 jours ouvrables.',
            'Nous vous contacterons dès que nous aurons une mise à jour concernant votre candidature.',
            'En attendant, n\'hésitez pas à consulter notre site web pour en savoir plus sur Terex et notre mission.'
          ]
        };
      case 'interview_scheduled':
        return {
          title: 'Entretien programmé - Prochaine étape de votre candidature',
          message: 'Votre candidature pour le poste de ' + orderData.position + ' a retenu notre attention et nous souhaitons vous rencontrer.',
          nextSteps: [
            'Un entretien a été programmé avec notre équipe de recrutement.',
            'Vous recevrez prochainement un email avec les détails de l\'entretien (date, heure, lieu ou lien de visioconférence).',
            'Nous vous recommandons de vous préparer en consultant notre site web et nos valeurs d\'entreprise.',
            'L\'entretien durera environ 45 minutes et sera l\'occasion de discuter de votre expérience et de vos motivations.',
            'N\'hésitez pas à préparer des questions sur le poste et l\'entreprise, cela montrera votre intérêt.'
          ]
        };
      default:
        return {
          title: 'Mise à jour de votre candidature',
          message: 'Nous vous contactons concernant votre candidature pour le poste de ' + orderData.position + ' chez Terex.',
          nextSteps: [
            'Votre candidature a été mise à jour dans notre système.',
            'Notre équipe continue d\'examiner votre profil.',
            'Nous vous tiendrons informé des prochaines étapes du processus de recrutement.',
            'Merci pour votre patience et votre intérêt pour Terex.',
            'N\'hésitez pas à nous contacter si vous avez des questions.'
          ]
        };
    }
  };

  const statusInfo = getStatusMessage(orderData.status);

  return (
    <Html>
      <Head />
      <Preview>{statusInfo.title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>TEREX</Heading>
          <Text style={subtitle}>Plateforme d'échange crypto & transferts internationaux</Text>
          
          <Hr style={hr} />
          
          <Heading style={h2}>{statusInfo.title}</Heading>
          
          <Text style={greeting}>Bonjour {orderData.first_name} {orderData.last_name},</Text>
          
          <Text style={text}>{statusInfo.message}</Text>
          
          <Text style={text}>
            Après avoir examiné votre candidature, votre CV et votre lettre de motivation, nous avons une mise à jour importante à vous communiquer concernant votre candidature pour le poste de <strong>{orderData.position}</strong>.
          </Text>
          
          <Heading style={h3}>Prochaines étapes</Heading>
          
          {statusInfo.nextSteps.map((step, index) => (
            <Text key={index} style={listItem}>
              • {step}
            </Text>
          ))}
          
          {orderData.admin_notes && (
            <>
              <Heading style={h3}>Notes de l'équipe de recrutement</Heading>
              <Text style={adminNotes}>{orderData.admin_notes}</Text>
            </>
          )}
          
          <Hr style={hr} />
          
          <Heading style={h3}>À propos de ce poste</Heading>
          
          <Text style={text}>
            Le poste de <strong>{orderData.position}</strong> est un rôle clé dans notre équipe. Chez Terex, nous révolutionnons les transferts d'argent et les échanges de cryptomonnaies en Afrique. Notre mission est de rendre les services financiers numériques accessibles à tous, en particulier dans les pays en développement.
          </Text>
          
          <Text style={text}>
            Nous recherchons des personnes passionnées par l'innovation financière, la technologie blockchain et qui partagent notre vision d'un avenir financier plus inclusif. Si vous rejoignez notre équipe, vous contribuerez directement à cette mission en travaillant sur des projets qui ont un impact réel sur la vie des gens.
          </Text>
          
          <Heading style={h3}>Pourquoi choisir Terex ?</Heading>
          
          <Text style={listItem}>• <strong>Innovation constante</strong> : Nous sommes à la pointe de la technologie blockchain et des services financiers numériques</Text>
          <Text style={listItem}>• <strong>Impact social</strong> : Votre travail aura un impact direct sur l'inclusion financière en Afrique</Text>
          <Text style={listItem}>• <strong>Équipe internationale</strong> : Collaborez avec des talents du monde entier</Text>
          <Text style={listItem}>• <strong>Croissance rapide</strong> : Rejoignez une entreprise en pleine expansion avec de nombreuses opportunités</Text>
          <Text style={listItem}>• <strong>Formation continue</strong> : Développez vos compétences avec nos programmes de formation</Text>
          <Text style={listItem}>• <strong>Flexibilité</strong> : Travail hybride et horaires flexibles</Text>
          
          <Hr style={hr} />
          
          <Heading style={h3}>Nos valeurs</Heading>
          
          <Text style={text}>
            <strong>Transparence</strong> : Nous croyons en une communication ouverte et honnête avec nos utilisateurs, nos partenaires et notre équipe.
          </Text>
          
          <Text style={text}>
            <strong>Sécurité</strong> : La sécurité de nos utilisateurs et de leurs fonds est notre priorité absolue. Nous investissons massivement dans les meilleures pratiques de sécurité.
          </Text>
          
          <Text style={text}>
            <strong>Innovation</strong> : Nous repoussons constamment les limites de ce qui est possible dans le domaine des services financiers numériques.
          </Text>
          
          <Text style={text}>
            <strong>Inclusion</strong> : Nous travaillons pour rendre les services financiers accessibles à tous, indépendamment de leur situation géographique ou économique.
          </Text>
          
          <Hr style={hr} />
          
          <Heading style={h3}>Nos services</Heading>
          
          <Text style={text}>
            <strong>Échange de cryptomonnaies</strong> : Achat et vente de USDT avec des méthodes de paiement locales (Orange Money, Wave, Moov Money, etc.)
          </Text>
          
          <Text style={text}>
            <strong>Transferts internationaux</strong> : Envoi d'argent rapide et sécurisé vers l'Afrique et le monde entier
          </Text>
          
          <Text style={text}>
            <strong>Portefeuille numérique</strong> : Gestion sécurisée de vos cryptomonnaies avec des fonctionnalités avancées
          </Text>
          
          <Text style={text}>
            <strong>Support 24/7</strong> : Une équipe de support client disponible 24h/24 et 7j/7 pour accompagner nos utilisateurs
          </Text>
          
          <Hr style={hr} />
          
          <Heading style={h3}>Contactez-nous</Heading>
          
          <Text style={text}>
            Si vous avez des questions concernant votre candidature ou si vous souhaitez obtenir plus d'informations sur le poste ou l'entreprise, n'hésitez pas à nous contacter :
          </Text>
          
          <Text style={contactInfo}>
            📧 Email : <Link href="mailto:terangaexchange@gmail.com" style={link}>terangaexchange@gmail.com</Link>
          </Text>
          
          <Text style={contactInfo}>
            💬 WhatsApp : <Link href="https://wa.me/14182619091" style={link}>+1 418 261 9091</Link>
          </Text>
          
          <Text style={contactInfo}>
            🌐 Site web : <Link href="https://terex.app" style={link}>terex.app</Link>
          </Text>
          
          <Text style={contactInfo}>
            📱 Plateforme : <Link href="https://app.terangaexchange.com" style={link}>app.terangaexchange.com</Link>
          </Text>
          
          <Hr style={hr} />
          
          <Text style={text}>
            Nous vous remercions encore une fois pour votre intérêt pour Terex et pour le temps que vous avez consacré à votre candidature. Nous apprécions votre professionnalisme et votre motivation.
          </Text>
          
          <Text style={text}>
            Que cette candidature aboutisse ou non, nous espérons que vous garderez un œil sur notre croissance et nos futurs postes. Le marché des cryptomonnaies et de la fintech évolue rapidement, et nous cherchons toujours des talents pour nous accompagner dans cette aventure.
          </Text>
          
          <Text style={signature}>
            Cordialement,<br />
            L'équipe de recrutement Terex<br />
            <strong>Mohamed Lo</strong>, Fondateur & CEO
          </Text>
          
          <Hr style={hr} />
          
          <Text style={footer}>
            © 2025 Terex. Tous droits réservés.<br />
            Cette notification a été générée automatiquement par notre système de gestion des candidatures.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#1a1a1a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif',
  color: '#ffffff',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#1a1a1a',
  margin: '0 auto',
  padding: '40px 30px',
  maxWidth: '600px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
  textAlign: 'center' as const,
  letterSpacing: '2px',
};

const subtitle = {
  color: '#888888',
  fontSize: '14px',
  textAlign: 'center' as const,
  margin: '0 0 30px 0',
};

const h2 = {
  color: '#ffffff',
  fontSize: '22px',
  fontWeight: 'bold',
  margin: '30px 0 20px 0',
  textAlign: 'center' as const,
};

const h3 = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '25px 0 15px 0',
};

const greeting = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '20px 0',
};

const text = {
  color: '#cccccc',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '15px 0',
};

const listItem = {
  color: '#cccccc',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '8px 0',
};

const adminNotes = {
  color: '#cccccc',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '15px 0',
  padding: '15px',
  backgroundColor: '#2a2a2a',
  borderRadius: '8px',
  fontStyle: 'italic',
};

const contactInfo = {
  color: '#cccccc',
  fontSize: '14px',
  margin: '8px 0',
};

const link = {
  color: '#4dabf7',
  textDecoration: 'none',
};

const signature = {
  color: '#ffffff',
  fontSize: '14px',
  margin: '30px 0',
  lineHeight: '1.6',
};

const footer = {
  color: '#666666',
  fontSize: '12px',
  textAlign: 'center' as const,
  margin: '30px 0 0 0',
  lineHeight: '1.6',
};

const hr = {
  borderColor: '#333333',
  margin: '25px 0',
};
