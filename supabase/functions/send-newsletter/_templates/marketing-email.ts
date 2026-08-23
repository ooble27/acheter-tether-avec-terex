import {
  hero, ctaButton, noticeBox, summaryBar, wrapEmail, C, LOGO,
} from '../../send-email-notification/_templates/html-utils.ts';

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

  let rows = hero({ title: p.heroTitle });

  rows += `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${C.textMuted};">${greeting}</p>`;

  for (const para of p.paragraphs) {
    rows += `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:${C.textMuted};">${para}</p>`;
  }

  if (p.highlight) {
    rows += summaryBar([
      { label: p.highlight.label, value: p.highlight.value, sub: p.highlight.sub },
    ]);
  }

  rows += ctaButton(p.ctaText, p.ctaUrl);

  const footerNote = `Vous recevez cet e-mail parce que vous êtes inscrit sur Terex. <a href="${p.unsubscribeUrl}" style="color:${C.textDim};text-decoration:underline;">Se désabonner</a>`;

  return wrapEmail(p.previewText, rows, undefined, footerNote);
}
