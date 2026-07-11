// Désabonnement marketing — lien signé présent dans chaque email de campagne.
// Vérifie le token HMAC, enregistre l'email dans marketing_optouts, et affiche
// une page de confirmation au design Terex. Aucun login requis (le token signe l'email).

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceKey);

async function expectedToken(email: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(serviceKey.slice(0, 64)),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email.toLowerCase()));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

function page(title: string, message: string, ok: boolean): Response {
  const html = `<!doctype html><html lang="fr"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} — Terex</title>
<style>
  :root{color-scheme:dark}
  body{margin:0;background:#141414;color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{max-width:420px;width:100%;background:#1a1a1a;border:1px solid #2c2c2c;border-radius:20px;padding:40px 32px;text-align:center}
  .logo{width:52px;height:52px;border-radius:14px;border:1px solid #2c2c2c;margin:0 auto 18px;display:block}
  .badge{width:56px;height:56px;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);
    display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:24px;color:#f5f5f5}
  h1{font-size:20px;font-weight:700;letter-spacing:-0.02em;margin:0 0 10px}
  p{font-size:14px;color:#a1a1a1;line-height:1.65;margin:0 0 24px}
  a.btn{display:inline-block;background:#f4f4f4;color:#191919;font-size:14px;font-weight:700;
    padding:13px 26px;border-radius:12px;text-decoration:none}
  .foot{font-size:11.5px;color:#6e6e6e;margin-top:22px}
</style></head><body>
<div class="card">
  <img class="logo" src="https://terangaexchange.com/terex-icon.png" alt="Terex"/>
  <div class="badge">${ok ? '&#10003;' : '!'}</div>
  <h1>${title}</h1>
  <p>${message}</p>
  <a class="btn" href="https://terangaexchange.com">Retour sur Terex</a>
  <p class="foot">© ${new Date().getFullYear()} Teranga Exchange</p>
</div>
</body></html>`;
  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const e = url.searchParams.get('e') || '';
    const t = url.searchParams.get('t') || '';

    // Décodage base64url de l'email
    let email = '';
    try {
      const b64 = e.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((e.length + 3) % 4);
      email = atob(b64);
    } catch (_) { /* invalide */ }

    if (!email || !email.includes('@') || !t) {
      return page('Lien invalide', "Ce lien de désabonnement est incomplet ou invalide. Vous pouvez nous contacter à terangaexchange@gmail.com.", false);
    }

    const expected = await expectedToken(email);
    if (t !== expected) {
      return page('Lien invalide', "Ce lien de désabonnement n'est pas valide. Vous pouvez nous contacter à terangaexchange@gmail.com.", false);
    }

    // upsert : re-cliquer sur le lien ne provoque pas d'erreur
    const { error } = await supabase
      .from('marketing_optouts')
      .upsert({ email: email.toLowerCase(), reason: 'unsubscribe_link' }, { onConflict: 'email' });
    if (error) throw error;

    console.log('Désabonnement marketing enregistré:', email.toLowerCase());
    return page(
      'Désabonnement confirmé',
      `L'adresse ${email} ne recevra plus nos emails marketing. Vous continuerez à recevoir les emails liés à vos transactions (confirmations, reçus).`,
      true
    );
  } catch (err) {
    console.error('marketing-unsubscribe error:', err);
    return page('Une erreur est survenue', "Impossible de traiter votre demande pour le moment. Réessayez plus tard ou contactez terangaexchange@gmail.com.", false);
  }
});
