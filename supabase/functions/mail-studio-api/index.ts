// Mail Studio API — CRUD templates + preview rendering
// Actions : list, get, save, delete, preview, send-test

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "npm:resend@2.0.0";
import { renderEmail } from '../_shared/mail-studio/renderer.ts';
import { BLOCK_REGISTRY } from '../_shared/mail-studio/blocks.ts';
import type { MailTemplate, BlockSpec } from '../_shared/mail-studio/renderer.ts';

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

async function requireStaff(admin: any, req: Request): Promise<{ ok: boolean; userId?: string }> {
  const token = (req.headers.get("Authorization") || "").replace("Bearer ", "");
  const { data: { user }, error } = await admin.auth.getUser(token);
  if (error || !user) return { ok: false };
  const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
  const ok = (roles || []).some((r: any) => r.role === "admin" || r.role === "marketing");
  return { ok, userId: user.id };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );

  const staff = await requireStaff(admin, req);
  if (!staff.ok) return json({ error: "Accès réservé au staff" }, 403);

  try {
    const body = await req.json();
    const action: string = body.action;

    // ── List templates ──────────────────────────────────────
    if (action === "list") {
      const { data, error } = await admin
        .from("mail_templates")
        .select("id, name, subject, category, is_draft, updated_at")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return json({ templates: data });
    }

    // ── Get single template ─────────────────────────────────
    if (action === "get") {
      const { data, error } = await admin
        .from("mail_templates")
        .select("*")
        .eq("id", body.id)
        .single();
      if (error) throw error;
      return json({ template: data });
    }

    // ── Save (insert or update) ─────────────────────────────
    if (action === "save") {
      const record = {
        name: body.name,
        subject: body.subject || '',
        preview_text: body.preview_text || '',
        blocks: body.blocks || [],
        category: body.category || 'marketing',
        is_draft: body.is_draft ?? true,
        created_by: staff.userId,
      };

      if (body.id) {
        const { data, error } = await admin
          .from("mail_templates")
          .update(record)
          .eq("id", body.id)
          .select()
          .single();
        if (error) throw error;
        return json({ template: data });
      } else {
        const { data, error } = await admin
          .from("mail_templates")
          .insert(record)
          .select()
          .single();
        if (error) throw error;
        return json({ template: data });
      }
    }

    // ── Delete ──────────────────────────────────────────────
    if (action === "delete") {
      const { error } = await admin
        .from("mail_templates")
        .delete()
        .eq("id", body.id);
      if (error) throw error;
      return json({ success: true });
    }

    // ── Preview — render blocks to HTML ─────────────────────
    if (action === "preview") {
      const template: MailTemplate = {
        subject: body.subject || 'Aperçu',
        previewText: body.preview_text || body.subject || '',
        blocks: (body.blocks || []) as BlockSpec[],
      };
      const html = renderEmail(template);
      return json({ html });
    }

    // ── Send test email ─────────────────────────────────────
    if (action === "send-test") {
      const resendKey = Deno.env.get("RESEND_API_KEY");
      if (!resendKey) return json({ error: "RESEND_API_KEY non configurée" }, 500);
      const resend = new Resend(resendKey);

      const template: MailTemplate = {
        subject: body.subject || 'Test Mail Studio',
        previewText: body.preview_text || body.subject || '',
        blocks: (body.blocks || []) as BlockSpec[],
      };
      const html = renderEmail(template);

      const { error } = await resend.emails.send({
        from: "Terex <noreply@terangaexchange.com>",
        reply_to: "terangaexchange@gmail.com",
        to: [body.to],
        subject: `[TEST] ${template.subject}`,
        html,
      });
      if (error) throw error;
      return json({ success: true, message: `Test envoyé à ${body.to}` });
    }

    // ── List available block types ──────────────────────────
    if (action === "block-types") {
      const types = Object.keys(BLOCK_REGISTRY);
      return json({ types });
    }

    return json({ error: `Action inconnue : ${action}` }, 400);
  } catch (e: any) {
    console.error("mail-studio-api error:", e);
    return json({ error: e?.message || "Erreur inconnue" }, 500);
  }
});
