import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import {
  hero, ctaButton, noticeBox, wrapEmail,
} from '../send-email-notification/_templates/html-utils.ts';

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SITE_URL = "https://terangaexchange.com";

function verificationEmailHtml(name: string, confirmUrl: string): string {
  const title = name ? `Bonjour ${name}, confirme ton compte` : 'Confirme ton compte Terex';
  const subtitle = "Tu as créé un compte sur Terex mais tu n'as pas encore confirmé ton adresse email. " +
    "Clique sur le bouton ci-dessous pour activer ton compte et accéder à la plateforme.";

  const rows =
    hero({ eyebrow: 'Confirmation de compte', title, subtitle }) +
    ctaButton('Confirmer mon compte', confirmUrl) +
    noticeBox("Une fois ton compte activé, tu pourras acheter et vendre des USDT en toute simplicité avec Wave ou Orange Money.") +
    noticeBox("Si tu n'as pas créé de compte sur Terex, ignore simplement cet email.", 'warning');

  return wrapEmail(
    'Confirme ton compte Terex',
    rows,
    undefined,
    'Vous recevez cet e-mail parce que vous avez créé un compte sur Terex.'
  );
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const admin = createClient(supabaseUrl, serviceKey);

    const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const isAdmin = (roles || []).some((r: any) => r.role === "admin");
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Accès réservé aux administrateurs" }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const mode: string = body.mode || 'list';

    if (mode === 'test') {
      const { data: linkData } = await admin.auth.admin.generateLink({
        type: 'signup',
        email: user.email!,
        options: { redirectTo: `${SITE_URL}/auth/callback` },
      });
      const confirmUrl = linkData?.properties?.action_link || `${SITE_URL}/auth/callback`;
      const html = verificationEmailHtml('Aïssatou', confirmUrl);
      const { error: sendErr } = await resend.emails.send({
        from: "Terex <noreply@terangaexchange.com>",
        to: [user.email!],
        subject: "[TEST] Confirme ton compte Terex",
        html,
      });
      if (sendErr) throw sendErr;

      return new Response(JSON.stringify({
        success: true,
        message: `Email de test envoyé à ${user.email}`,
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const allUsers: any[] = [];
    let page = 1;
    for (;;) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (error) throw new Error(`listUsers: ${error.message}`);
      allUsers.push(...data.users);
      if (data.users.length < 1000) break;
      page++;
    }

    const unconfirmed = allUsers.filter(u => u.email && !u.email_confirmed_at);

    const { data: infos } = await admin.from("client_infos")
      .select("user_id, full_name, first_name")
      .in("user_id", unconfirmed.map(u => u.id));
    const infoMap = new Map<string, any>();
    for (const i of infos || []) infoMap.set(i.user_id, i);

    const getName = (u: any): string => {
      const info = infoMap.get(u.id);
      return info?.first_name || info?.full_name?.split(" ")[0] ||
             u.user_metadata?.first_name || u.user_metadata?.name?.split(" ")[0] ||
             u.user_metadata?.full_name?.split(" ")[0] || "";
    };

    if (mode === 'list') {
      const list = unconfirmed.map(u => ({
        id: u.id,
        email: u.email!,
        name: getName(u),
        created_at: u.created_at,
      })).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return new Response(JSON.stringify({
        success: true,
        total_users: allUsers.length,
        confirmed: allUsers.length - unconfirmed.length,
        unconfirmed: unconfirmed.length,
        users: list,
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    if (mode === 'send_one') {
      const targetId = body.userId;
      if (!targetId) throw new Error("userId requis");
      const target = unconfirmed.find(u => u.id === targetId);
      if (!target) throw new Error("Utilisateur non trouvé ou déjà confirmé");

      const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
        type: 'signup',
        email: target.email!,
        options: { redirectTo: `${SITE_URL}/auth/callback` },
      });
      if (linkErr) throw linkErr;

      const confirmUrl = linkData?.properties?.action_link || `${SITE_URL}/auth/callback`;
      const html = verificationEmailHtml(getName(target), confirmUrl);

      const { error: sendErr } = await resend.emails.send({
        from: "Terex <noreply@terangaexchange.com>",
        to: [target.email!],
        subject: "Confirme ton compte Terex",
        html,
      });
      if (sendErr) throw sendErr;

      return new Response(JSON.stringify({
        success: true,
        message: `Email de vérification envoyé à ${target.email}`,
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    if (mode === 'send_all') {
      let sent = 0;
      let errors = 0;
      const errorDetails: string[] = [];

      for (let i = 0; i < unconfirmed.length; i++) {
        const u = unconfirmed[i];
        try {
          const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
            type: 'signup',
            email: u.email!,
            options: { redirectTo: `${SITE_URL}/auth/callback` },
          });
          if (linkErr) throw linkErr;

          const confirmUrl = linkData?.properties?.action_link || `${SITE_URL}/auth/callback`;
          const html = verificationEmailHtml(getName(u), confirmUrl);

          const { error: sendErr } = await resend.emails.send({
            from: "Terex <noreply@terangaexchange.com>",
            to: [u.email!],
            subject: "Confirme ton compte Terex",
            html,
          });
          if (sendErr) throw sendErr;
          sent++;
        } catch (e: any) {
          errors++;
          errorDetails.push(`${u.email}: ${e?.message || String(e)}`);
        }

        if ((i + 1) % 8 === 0 && i + 1 < unconfirmed.length) {
          await new Promise(r => setTimeout(r, 1100));
        }
      }

      return new Response(JSON.stringify({
        success: true,
        message: `${sent} email(s) de vérification envoyé(s)`,
        stats: { total: unconfirmed.length, sent, errors, errorDetails: errorDetails.slice(0, 10) },
      }), { headers: { ...CORS, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Mode invalide. Utilisez: list, send_one, send_all, test" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } });

  } catch (e: any) {
    console.error("resend-verification error:", e);
    return new Response(JSON.stringify({ error: e?.message || "Erreur serveur" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
