
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Preview,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BaseEmailProps {
  preview: string;
  title: string;
  children: React.ReactNode;
}

export const BaseEmail = ({ preview, title, children }: BaseEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={logoContainer}>
            <Heading style={heading}>{title}</Heading>
          </div>
          {children}
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  minHeight: '100vh',
  padding: '0',
  margin: '0',
  width: '100%',
};

const container = {
  backgroundColor: '#000000',
  border: '1px solid #3B968F',
  borderRadius: '8px',
  maxWidth: '600px',
  margin: '20px auto',
  padding: '40px 20px',
  width: '100%',
  boxSizing: 'border-box' as const,
};

const logoContainer = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const heading = {
  color: '#3B968F',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'center' as const,
};
