// Campagnes email marketing Terex — version professionnelle.
// - Réservé aux ADMINS (vérification JWT + user_roles)
// - Segments d'audience : all / active_clients / never_ordered / inactive_30d
// - Exclusion automatique des désabonnés (marketing_optouts)
// - Lien de désabonnement signé (HMAC) dans chaque email
// - Pagination complète des utilisateurs (l'ancienne version perdait tout au-delà de 50)
// - Modes : count (compter les destinataires), preview (HTML), test (envoi à soi), send
// - Historique : chaque campagne est enregistrée dans email_campaigns

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { marketingEmailHtml } from './_templates/marketing-email.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, serviceKey);

const UNSUB_ENDPOINT = `${supabaseUrl}/functions/v1/marketing-unsubscribe`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type Segment = 'all' | 'active_clients' | 'never_ordered' | 'inactive_30d';

interface CampaignRequest {
  mode?: 'send' | 'test' | 'count' | 'preview';
  segment?: Segment;
  subject: string;
  previewText?: string;
  heroTitle?: string;
  /** Corps : paragraphes séparés par des sauts de ligne. */
  content?: string;
  highlightLabel?: string;
  highlightValue?: string;
  highlightSub?: string;
  ctaText?: string;
  ctaUrl?: string;
  testEmail?: string;
}

interface Recipient { email: string; name: string }

// ── Token de désabonnement signé (HMAC-SHA256, clé dérivée du service role) ──
async function unsubToken(email: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(serviceKey.slice(0, 64)),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(email.toLowerCase()));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
}

async function unsubscribeUrlFor(email: string): Promise<string> {
  const t = await unsubToken(email);
  const e = btoa(email).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${UNSUB_ENDPOINT}?e=${e}&t=${t}`;
}

// ── Résolution de l'audience ──────────────────────────────────────────────────
async function fetchAllUsers(): Promise<Array<{ id: string; email: string; name?: string }>> {
  const users: Array<{ id: string; email: string; name?: string }> = [];
  let page = 1;
  // Pagination complète (perPage max 1000)
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(`listUsers: ${error.message}`);
    for (const u of data.users) {
      if (u.email && u.email_confirmed_at) {
        const meta: any = u.user_metadata || {};
        users.push({ id: u.id, email: u.email, name: meta.full_name || meta.name || undefined });
      }
    }
    if (data.users.length < 1000) break;
    page++;
  }
  return users;
}

async function resolveRecipients(segment: Segment): Promise<Recipient[]> {
  const users = await fetchAllUsers();

  // Noms depuis les profils (prioritaires sur les métadonnées)
  const { data: profiles } = await supabase.from('profiles').select('id, full_name');
  const nameMap = new Map<string, string>();
  for (const p of profiles || []) if ((p as any).full_name) nameMap.set((p as any).id, (p as any).full_name);

  // Désabonnés — exclus de TOUT envoi marketing
  const { data: optouts } = await supabase.from('marketing_optouts').select('email');
  const optoutSet = new Set((optouts || []).map((o: any) => String(o.email).toLowerCase()));

  // Activité commandes pour les segments
  const { data: orders } = await supabase.from('orders').select('user_id, created_at');
  const lastOrder = new Map<string, number>();
  for (const o of orders || []) {
    const t = new Date((o as any).created_at).getTime();
    const prev = lastOrder.get((o as any).user_id) || 0;
    if (t > prev) lastOrder.set((o as any).user_id, t);
  }
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

  return users
    .filter(u => !optoutSet.has(u.email.toLowerCase()))
    .filter(u => {
      const last = lastOrder.get(u.id);
      switch (segment) {
        case 'active_clients': return last !== undefined;                          // a déjà commandé
        case 'never_ordered':  return last === undefined;                          // jamais commandé
        case 'inactive_30d':   return last !== undefined && last < thirtyDaysAgo;  // a commandé, plus rien depuis 30 j
        case 'all':
        default: return true;
      }
    })
    .map(u => ({ email: u.email, name: nameMap.get(u.id) || u.name || '' }));
}

// ── Vérification admin ────────────────────────────────────────────────────────
async function requireAdmin(req: Request): Promise<{ ok: boolean; userId?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return { ok: false };
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return { ok: false };
  const { data: roles } = await supabase.from('user_roles').select('role').eq('user_id', user.id);
  const isAdmin = (roles || []).some((r: any) => r.role === 'admin');
  return { ok: isAdmin, userId: user.id };
}

// ── Rendu ─────────────────────────────────────────────────────────────────────
function splitParagraphs(content: string): string[] {
  return content.split(/\n+/).map(s => s.trim()).filter(Boolean);
}

async function renderFor(req: CampaignRequest, recipient: Recipient): Promise<string> {
  return marketingEmailHtml({
    userName: recipient.name || undefined,
    previewText: req.previewText || req.subject,
    heroTitle: req.heroTitle || req.subject,
    paragraphs: splitParagraphs(req.content || ''),
    highlight: req.highlightValue
      ? { label: req.highlightLabel || 'À la une', value: req.highlightValue, sub: req.highlightSub }
      : undefined,
    ctaText: req.ctaText || 'Accéder à mon compte',
    ctaUrl: req.ctaUrl || 'https://terangaexchange.com/dashboard',
    unsubscribeUrl: await unsubscribeUrlFor(recipient.email),
  });
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Sécurité : campagnes réservées aux admins.
    const admin = await requireAdmin(req);
    if (!admin.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Accès réservé aux administrateurs' }), {
        status: 403, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const body: CampaignRequest = await req.json();
    const mode = body.mode || (body.testEmail ? 'test' : 'send');
    const segment: Segment = body.segment || 'all';

    // — Compter les destinataires d'un segment (pour l'interface admin)
    if (mode === 'count') {
      const recipients = await resolveRecipients(segment);
      return new Response(JSON.stringify({ success: true, segment, count: recipients.length }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // — Aperçu HTML (iframe de l'admin)
    if (mode === 'preview') {
      const html = await renderFor(body, { email: 'apercu@terangaexchange.com', name: 'Aïssatou Diallo' });
      return new Response(JSON.stringify({ success: true, html }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!body.subject) throw new Error('Sujet manquant');

    // — Envoi test (à soi-même)
    if (mode === 'test') {
      if (!body.testEmail) throw new Error('Email de test manquant');
      const html = await renderFor(body, { email: body.testEmail, name: '' });
      const { error } = await resend.emails.send({
        from: "Terex <noreply@terangaexchange.com>",
        to: [body.testEmail],
        subject: `[TEST] ${body.subject}`,
        html,
      });
      if (error) throw error;
      return new Response(JSON.stringify({ success: true, message: `Test envoyé à ${body.testEmail}` }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // — Envoi réel au segment
    const recipients = await resolveRecipients(segment);
    if (recipients.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'Aucun destinataire dans ce segment' }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];
    const batchSize = 10;

    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      const results = await Promise.all(batch.map(async (r) => {
        try {
          const html = await renderFor(body, r);
          const { error } = await resend.emails.send({
            from: "Terex <noreply@terangaexchange.com>",
            to: [r.email],
            subject: body.subject,
            html,
          });
          if (error) throw error;
          return { ok: true as const };
        } catch (e: any) {
          return { ok: false as const, email: r.email, error: e?.message || String(e) };
        }
      }));
      for (const res of results) {
        if (res.ok) successCount++;
        else { errorCount++; errors.push(`${res.email}: ${res.error}`); }
      }
      // Respect du débit Resend
      if (i + batchSize < recipients.length) await new Promise(r => setTimeout(r, 1100));
    }

    // Historique de campagne
    try {
      await supabase.from('email_campaigns').insert({
        subject: body.subject,
        preview_text: body.previewText || null,
        hero_title: body.heroTitle || null,
        content: body.content || null,
        cta_text: body.ctaText || null,
        cta_url: body.ctaUrl || null,
        segment,
        recipients_count: recipients.length,
        success_count: successCount,
        error_count: errorCount,
        status: errorCount === 0 ? 'sent' : 'sent_with_errors',
        created_by: admin.userId || null,
      });
    } catch (e) {
      console.error('Enregistrement campagne impossible:', e);
    }

    console.log(`Campagne "${body.subject}" [${segment}] : ${successCount} envoyés, ${errorCount} erreurs`);

    return new Response(JSON.stringify({
      success: true,
      totalSent: successCount,
      message: `Campagne envoyée à ${successCount} destinataire(s)`,
      stats: { total: recipients.length, success: successCount, errors: errorCount, errorDetails: errors.slice(0, 10) },
    }), { headers: { "Content-Type": "application/json", ...corsHeaders } });

  } catch (error: any) {
    console.error("Erreur campagne:", error);
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
