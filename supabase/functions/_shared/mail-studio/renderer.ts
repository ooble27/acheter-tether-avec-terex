// Terex Mail Studio — Renderer
// Prend une spec JSON { subject, previewText, blocks: [{ type, props }] }
// et produit le HTML complet de l'email en assemblant les blocs.

import { T } from './tokens.ts';
import { BLOCK_REGISTRY } from './blocks.ts';

export interface BlockSpec {
  type: string;
  props?: Record<string, unknown>;
}

export interface MailTemplate {
  subject: string;
  previewText: string;
  blocks: BlockSpec[];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export function renderBlocks(blocks: BlockSpec[]): string {
  return blocks
    .map((block) => {
      const fn = BLOCK_REGISTRY[block.type];
      if (!fn) {
        console.warn(`[mail-studio] Unknown block type: ${block.type}`);
        return '';
      }
      return fn(block.props ?? {});
    })
    .filter(Boolean)
    .join('');
}

export function renderEmail(template: MailTemplate): string {
  const blocksHtml = renderBlocks(template.blocks);

  return `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${esc(template.subject)}</title>
<!--[if mso]>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:AllowPNG/>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
<style>
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body { margin: 0; padding: 0; width: 100%; background-color: ${T.pageBg}; font-family: ${T.font}; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table { border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  td { padding: 0; }
  img { border: 0; display: block; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
  a { color: ${T.brand}; }
  [data-ogsc] body, [data-ogsb] body { background-color: ${T.pageBg} !important; }
  u + .body { background-color: ${T.pageBg} !important; }
</style>
</head>
<body class="body" style="margin:0;padding:0;width:100%;background-color:${T.pageBg};font-family:${T.font};">
  <!-- Preview text -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${T.pageBg};">${esc(template.previewText)}${'&#847; &zwnj; '.repeat(30)}</div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.pageBg};">
    <tr>
      <td align="center" style="padding:24px 16px 40px;">
        <!-- Card -->
        <table role="presentation" width="${T.maxWidth}" cellpadding="0" cellspacing="0" border="0" style="max-width:${T.maxWidth}px;width:100%;background:${T.cardBg};border-radius:${T.cardRadius}px;overflow:hidden;">
          <tr>
            <td>
              ${blocksHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Variante pratique : on passe les blocs en arguments fluents
export function email(subject: string, previewText: string, ...blockHtmlParts: string[]): string {
  return renderEmail({
    subject,
    previewText,
    blocks: [],
  }).replace(
    '<!-- BLOCKS_PLACEHOLDER -->',
    blockHtmlParts.join(''),
  );
}

// Variante encore plus directe : on passe le HTML déjà assemblé
export function wrapMailStudio(subject: string, previewText: string, innerHtml: string): string {
  return `<!doctype html>
<html lang="fr" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="dark" />
<meta name="supported-color-schemes" content="dark" />
<title>${esc(subject)}</title>
<style>
  :root { color-scheme: dark; supported-color-schemes: dark; }
  body { margin: 0; padding: 0; width: 100%; background-color: ${T.pageBg}; font-family: ${T.font}; -webkit-text-size-adjust: 100%; }
  table { border-spacing: 0; }
  img { border: 0; display: block; }
  a { color: ${T.brand}; }
  u + .body { background-color: ${T.pageBg} !important; }
</style>
</head>
<body class="body" style="margin:0;padding:0;width:100%;background-color:${T.pageBg};font-family:${T.font};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;font-size:1px;line-height:1px;color:${T.pageBg};">${esc(previewText)}${'&#847; &zwnj; '.repeat(30)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${T.pageBg};">
    <tr>
      <td align="center" style="padding:24px 16px 40px;">
        <table role="presentation" width="${T.maxWidth}" cellpadding="0" cellspacing="0" border="0" style="max-width:${T.maxWidth}px;width:100%;background:${T.cardBg};border-radius:${T.cardRadius}px;overflow:hidden;">
          <tr>
            <td>${innerHtml}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
