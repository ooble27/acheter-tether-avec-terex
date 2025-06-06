
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
          <Heading style={heading}>{title}</Heading>
          {children}
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#000000',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  margin: '0',
  padding: '0',
};

const container = {
  backgroundColor: '#000000',
  maxWidth: '600px',
  margin: '0 auto',
  padding: '40px 20px',
};

const heading = {
  color: '#3B968F',
  fontSize: '24px',
  fontWeight: '600',
  margin: '0 0 32px 0',
  textAlign: 'center' as const,
};
