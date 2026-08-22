// Email MARKETING Terex — refactorisé avec le système de blocs Mail Studio.
// L'interface MarketingEmailProps et la signature marketingEmailHtml() restent
// inchangées pour la rétrocompatibilité avec send-newsletter/index.ts.

import {
  BrandHeader,
  BigTitle,
  TextBlock,
  HighlightBox,
  CTAButton,
  QuietDivider,
  Footer,
  wrapMailStudio,
} from '../../_shared/mail-studio/index.ts';

export interface MarketingEmailProps {
  userName?: string;
  previewText: string;
  heroTitle: string;
  paragraphs: string[];
  highlight?: { label: string; value: string; sub?: string };
  ctaText: string;
  ctaUrl: string;
  unsubscribeUrl: string;
}

export function marketingEmailHtml(p: MarketingEmailProps): string {
  const greeting = p.userName ? `Bonjour ${p.userName},` : 'Bonjour,';

  const blocks: string[] = [
    BrandHeader(),

    BigTitle({
      title: p.heroTitle,
    }),

    TextBlock({
      greeting,
      text: p.paragraphs.join('\n\n'),
    }),
  ];

  if (p.highlight) {
    blocks.push(
      HighlightBox({
        label: p.highlight.label,
        value: p.highlight.value,
        sub: p.highlight.sub,
      }),
    );
  }

  blocks.push(
    CTAButton({
      text: p.ctaText,
      url: p.ctaUrl,
      style: 'brand',
    }),

    QuietDivider(),

    Footer({
      unsubscribeUrl: p.unsubscribeUrl,
      note: 'Vous recevez cet e-mail parce que vous êtes inscrit sur Terex.',
    }),
  );

  return wrapMailStudio(
    p.previewText,
    p.previewText,
    blocks.join(''),
  );
}
