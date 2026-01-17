import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Hr,
  Button,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface NewsletterEmailProps {
  userName?: string;
  subject: string;
  previewText: string;
  heroTitle: string;
  heroSubtitle: string;
  updates: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  ctaText?: string;
  ctaUrl?: string;
}

export const NewsletterEmail = ({
  userName = 'Cher client',
  subject,
  previewText,
  heroTitle,
  heroSubtitle,
  updates,
  ctaText = 'Découvrir maintenant',
  ctaUrl = 'https://terangaexchange.com',
}: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header avec logo */}
        <Section style={headerSection}>
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ textAlign: 'center' }}>
            <tr>
              <td>
                <Text style={logoText}>TEREX</Text>
                <Text style={tagline}>L'avenir des transferts d'argent</Text>
              </td>
            </tr>
          </table>
        </Section>

        {/* Hero Section */}
        <Section style={heroSection}>
          <Text style={heroEmoji}>🚀</Text>
          <Heading style={heroHeading}>{heroTitle}</Heading>
          <Text style={heroText}>{heroSubtitle}</Text>
        </Section>

        {/* Greeting */}
        <Section style={contentSection}>
          <Text style={greeting}>Bonjour {userName},</Text>
          <Text style={introText}>
            Nous sommes ravis de vous partager les dernières nouveautés de Terex ! 
            Voici ce qui a changé pour améliorer votre expérience :
          </Text>
        </Section>

        {/* Updates Grid */}
        <Section style={updatesSection}>
          {updates.map((update, index) => (
            <Section key={index} style={updateCard}>
              <Text style={updateIcon}>{update.icon}</Text>
              <Heading as="h3" style={updateTitle}>{update.title}</Heading>
              <Text style={updateDescription}>{update.description}</Text>
            </Section>
          ))}
        </Section>

        <Hr style={divider} />

        {/* CTA Section */}
        <Section style={ctaSection}>
          <Text style={ctaText_style}>Prêt à profiter de ces nouveautés ?</Text>
          <Button href={ctaUrl} style={ctaButton}>
            {ctaText}
          </Button>
        </Section>

        <Hr style={divider} />

        {/* Benefits reminder */}
        <Section style={benefitsSection}>
          <Heading as="h3" style={benefitsTitle}>Pourquoi choisir Terex ?</Heading>
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tr>
              <td style={benefitItem}>✅ Taux compétitifs</td>
              <td style={benefitItem}>✅ Sécurité maximale</td>
            </tr>
            <tr>
              <td style={benefitItem}>✅ Transferts rapides</td>
              <td style={benefitItem}>✅ Support 24/7</td>
            </tr>
          </table>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            L'équipe Terex vous remercie de votre confiance.
          </Text>
          <Text style={socialLinks}>
            <Link href="https://wa.me/14182619091" style={socialLink}>WhatsApp</Link>
            {' • '}
            <Link href="https://terangaexchange.com" style={socialLink}>Site Web</Link>
          </Text>
          <Text style={footerNote}>
            Vous recevez cet email car vous êtes inscrit sur Terex.
            <br />
            <Link href="https://terangaexchange.com/unsubscribe" style={unsubscribeLink}>
              Se désabonner
            </Link>
          </Text>
          <Text style={copyright}>© 2025 Terex. Tous droits réservés.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default NewsletterEmail

// Styles
const main = {
  backgroundColor: '#0a0a0a',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
}

const headerSection = {
  backgroundColor: '#111111',
  padding: '30px 20px',
  borderBottom: '1px solid #222222',
}

const logoText = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#0FA958',
  margin: '0',
  letterSpacing: '4px',
}

const tagline = {
  fontSize: '12px',
  color: '#888888',
  margin: '8px 0 0 0',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
}

const heroSection = {
  background: 'linear-gradient(135deg, #0FA958 0%, #08a045 100%)',
  padding: '50px 30px',
  textAlign: 'center' as const,
}

const heroEmoji = {
  fontSize: '48px',
  margin: '0 0 20px 0',
}

const heroHeading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 15px 0',
  lineHeight: '1.3',
}

const heroText = {
  color: 'rgba(255, 255, 255, 0.9)',
  fontSize: '16px',
  margin: '0',
  lineHeight: '1.5',
}

const contentSection = {
  backgroundColor: '#111111',
  padding: '40px 30px 20px',
}

const greeting = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 15px 0',
}

const introText = {
  color: '#aaaaaa',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
}

const updatesSection = {
  backgroundColor: '#111111',
  padding: '20px 30px 40px',
}

const updateCard = {
  backgroundColor: '#1a1a1a',
  borderRadius: '12px',
  padding: '25px',
  marginBottom: '15px',
  border: '1px solid #222222',
}

const updateIcon = {
  fontSize: '32px',
  margin: '0 0 15px 0',
}

const updateTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 10px 0',
}

const updateDescription = {
  color: '#888888',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
}

const divider = {
  borderColor: '#222222',
  margin: '0',
}

const ctaSection = {
  backgroundColor: '#111111',
  padding: '40px 30px',
  textAlign: 'center' as const,
}

const ctaText_style = {
  color: '#ffffff',
  fontSize: '18px',
  margin: '0 0 25px 0',
}

const ctaButton = {
  backgroundColor: '#0FA958',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  padding: '14px 40px',
  textDecoration: 'none',
  display: 'inline-block',
}

const benefitsSection = {
  backgroundColor: '#0a0a0a',
  padding: '40px 30px',
}

const benefitsTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
  textAlign: 'center' as const,
}

const benefitItem = {
  color: '#888888',
  fontSize: '14px',
  padding: '8px 10px',
}

const footer = {
  backgroundColor: '#111111',
  padding: '40px 30px',
  borderTop: '1px solid #222222',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#888888',
  fontSize: '14px',
  margin: '0 0 20px 0',
}

const socialLinks = {
  margin: '0 0 20px 0',
}

const socialLink = {
  color: '#0FA958',
  fontSize: '14px',
  textDecoration: 'none',
}

const footerNote = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 15px 0',
}

const unsubscribeLink = {
  color: '#666666',
  textDecoration: 'underline',
}

const copyright = {
  color: '#444444',
  fontSize: '11px',
  margin: '0',
}
