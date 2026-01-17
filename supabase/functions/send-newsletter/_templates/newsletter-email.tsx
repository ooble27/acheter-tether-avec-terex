import {
  Body,
  Container,
  Head,
  Heading,
  Html,
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
  content: string;
  ctaText?: string;
  ctaUrl?: string;
}

export const NewsletterEmail = ({
  userName = 'Cher client',
  subject,
  previewText,
  heroTitle,
  content,
  ctaText = 'Accéder à mon compte',
  ctaUrl = 'https://terangaexchange.com',
}: NewsletterEmailProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <table width="100%" cellPadding="0" cellSpacing="0">
            <tr>
              <td>
                <Text style={logoText}>TEREX</Text>
              </td>
              <td style={{ textAlign: 'right' }}>
                <Link href={ctaUrl} style={headerLink}>
                  Se connecter
                </Link>
              </td>
            </tr>
          </table>
        </Section>

        {/* Main Content */}
        <Section style={contentSection}>
          <Heading style={heroHeading}>{heroTitle}</Heading>
          
          <Text style={greeting}>{userName},</Text>
          
          <Text style={bodyText}>{content}</Text>

          {/* CTA Button */}
          <Section style={ctaSection}>
            <Button href={ctaUrl} style={ctaButton}>
              {ctaText}
            </Button>
          </Section>

          <Text style={supportText}>
            Si vous avez des questions, répondez à cet email pour contacter notre équipe de support client.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerLogo}>TEREX</Text>
          
          <Text style={footerText}>
            Vous avez reçu cet email en raison de votre inscription chez Terex, pour assurer la mise en œuvre de nos Conditions de service et (ou) pour d'autres questions légitimes.
          </Text>

          <Text style={footerLinks}>
            <Link href="https://terangaexchange.com/privacy" style={footerLink}>
              Politique de Confidentialité
            </Link>
            {' | '}
            <Link href="https://terangaexchange.com/help" style={footerLink}>
              Centre d'aide
            </Link>
          </Text>

          <Text style={copyright}>© 2025 Terex. Tous droits réservés.</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default NewsletterEmail

// Styles - Clean and simple
const main = {
  backgroundColor: '#111111',
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
}

const container = {
  margin: '0 auto',
  padding: '0',
  maxWidth: '600px',
}

const header = {
  backgroundColor: '#1a1a1a',
  padding: '20px 30px',
  borderBottom: '1px solid #333',
}

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#0FA958',
  margin: '0',
  letterSpacing: '2px',
}

const headerLink = {
  color: '#ffffff',
  fontSize: '14px',
  textDecoration: 'none',
  border: '1px solid #444',
  padding: '8px 16px',
  borderRadius: '4px',
}

const contentSection = {
  backgroundColor: '#1a1a1a',
  padding: '40px 30px',
}

const heroHeading = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 30px 0',
  lineHeight: '1.3',
}

const greeting = {
  color: '#ffffff',
  fontSize: '16px',
  margin: '0 0 20px 0',
}

const bodyText = {
  color: '#cccccc',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 30px 0',
}

const ctaSection = {
  textAlign: 'center' as const,
  margin: '30px 0',
}

const ctaButton = {
  backgroundColor: '#0FA958',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  padding: '16px 32px',
  textDecoration: 'none',
  display: 'inline-block',
}

const supportText = {
  color: '#888888',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '30px 0 0 0',
}

const divider = {
  borderColor: '#333',
  margin: '0',
}

const footer = {
  backgroundColor: '#111111',
  padding: '30px',
  textAlign: 'center' as const,
}

const footerLogo = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#0FA958',
  margin: '0 0 20px 0',
  letterSpacing: '2px',
}

const footerText = {
  color: '#666666',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
}

const footerLinks = {
  margin: '0 0 15px 0',
}

const footerLink = {
  color: '#888888',
  fontSize: '12px',
  textDecoration: 'underline',
}

const copyright = {
  color: '#444444',
  fontSize: '11px',
  margin: '0',
}
