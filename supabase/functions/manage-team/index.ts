// Gestion de l'équipe — réservé à l'administrateur complet (owner).
// Actions :
//  - list   : membres du staff (tous les rôles ≠ 'user'), avec nom + email
//  - add    : { email, role } → attribue un rôle à un compte EXISTANT
//  - remove : { userId, role } → retire un rôle (impossible de retirer son propre rôle admin)

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(supabaseUrl, serviceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STAFF_ROLES = ['admin', 'operator', 'kyc_reviewer', 'marketing', 'hr', 'support'];

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function requireOwner(req: Request): Promise<{ ok: boolean; userId?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) return { ok: false };
  const { data: { user }, error } = await admin.auth.getUser(authHeader.replace('Bearer ', ''));
  if (error || !user) return { ok: false };
  const { data: roles } = await admin.from('user_roles').select('role').eq('user_id', user.id);
  return { ok: (roles || []).some((r: any) => r.role === 'admin'), userId: user.id };
}

async function findUserByEmail(email: string): Promise<{ id: string; email: string } | null> {
  const target = email.trim().toLowerCase();
  let page = 1;
  for (;;) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const hit = data.users.find(u => (u.email || '').toLowerCase() === target);
    if (hit) return { id: hit.id, email: hit.email! };
    if (data.users.length < 1000) return null;
    page++;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const caller = await requireOwner(req);
    if (!caller.ok) return json({ success: false, error: "Réservé à l'administrateur complet" }, 403);

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    // ── Liste des membres ────────────────────────────────────────────────────
    if (action === 'list') {
      const { data: allRows, error } = await admin
        .from('user_roles')
        .select('id, user_id, role, created_at')
        .order('created_at', { ascending: true });
      if (error) throw error;
      const rows = (allRows || []).filter((r: any) => r.role !== 'user');

      const userIds = Array.from(new Set((rows || []).map((r: any) => r.user_id)));
      const { data: profiles } = await admin
        .from('profiles').select('id, full_name').in('id', userIds.length ? userIds : ['00000000-0000-0000-0000-000000000000']);
      const nameMap = new Map((profiles || []).map((p: any) => [p.id, p.full_name]));

      const members = await Promise.all((rows || []).map(async (r: any) => {
        let email = '';
        try {
          const { data } = await admin.auth.admin.getUserById(r.user_id);
          email = data?.user?.email || '';
        } catch { /* compte supprimé */ }
        return {
          roleRowId: r.id,
          userId: r.user_id,
          role: r.role,
          name: nameMap.get(r.user_id) || '',
          email,
          since: r.created_at,
        };
      }));

      return json({ success: true, members });
    }

    // ── Ajouter un rôle à un compte existant ─────────────────────────────────
    if (action === 'add') {
      const email = String(body?.email || '');
      const role = String(body?.role || '');
      if (!email.includes('@')) return json({ success: false, error: 'Email invalide' }, 400);
      if (!STAFF_ROLES.includes(role)) return json({ success: false, error: 'Rôle invalide' }, 400);

      const target = await findUserByEmail(email);
      if (!target) {
        return json({
          success: false,
          error: "Aucun compte avec cet email. La personne doit d'abord créer son compte sur Terex (inscription normale), puis vous lui attribuez son rôle ici.",
        }, 404);
      }

      // Déjà ce rôle ?
      const { data: existing } = await admin
        .from('user_roles').select('id').eq('user_id', target.id).eq('role', role).maybeSingle();
      if (existing) return json({ success: false, error: 'Ce membre a déjà ce rôle' }, 409);

      const { error: insErr } = await admin
        .from('user_roles').insert({ user_id: target.id, role });
      if (insErr) {
        // Rôle absent de l'enum → la migration « script 1 » n'a pas été exécutée
        if (String(insErr.message || '').includes('invalid input value for enum')) {
          return json({
            success: false,
            error: `Le rôle « ${role} » n'existe pas encore dans la base. Faites exécuter le script SQL n°1 (nouveaux rôles) par Lovable, puis réessayez.`,
          }, 400);
        }
        throw insErr;
      }

      console.log(`Équipe: rôle ${role} attribué à ${target.email} par ${caller.userId}`);
      return json({ success: true, message: `Rôle attribué à ${target.email}` });
    }

    // ── Retirer un rôle ──────────────────────────────────────────────────────
    if (action === 'remove') {
      const userId = String(body?.userId || '');
      const role = String(body?.role || '');
      if (!userId || !STAFF_ROLES.includes(role)) return json({ success: false, error: 'Paramètres invalides' }, 400);

      // Garde-fou : impossible de se retirer soi-même le rôle admin (lock-out)
      if (userId === caller.userId && role === 'admin') {
        return json({ success: false, error: 'Vous ne pouvez pas retirer votre propre rôle administrateur.' }, 400);
      }

      const { error: delErr } = await admin
        .from('user_roles').delete().eq('user_id', userId).eq('role', role);
      if (delErr) throw delErr;

      console.log(`Équipe: rôle ${role} retiré de ${userId} par ${caller.userId}`);
      return json({ success: true, message: 'Rôle retiré' });
    }

    return json({ success: false, error: 'Action inconnue' }, 400);
  } catch (e: any) {
    console.error('manage-team error:', e?.message, e?.stack || e);
    return json({ success: false, error: e?.message || String(e) }, 500);
  }
});
