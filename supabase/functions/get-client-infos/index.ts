import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClientInfo {
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    // 1) Authentifier l'appelant
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) throw new Error('User not authenticated');

    // 2) Vérifier que l'appelant est admin (table user_roles)
    const { data: roles } = await admin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);
    const isAdmin = (roles || []).some((r: any) => ['admin', 'kyc_reviewer', 'operator', 'support'].includes(r.role));
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'forbidden' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3) Lire les user_ids demandés
    const body = await req.json().catch(() => ({}));
    const userIds: string[] = Array.isArray(body?.userIds)
      ? Array.from(new Set(body.userIds.filter((x: any) => typeof x === 'string' && x)))
      : [];
    if (userIds.length === 0) {
      return new Response(JSON.stringify({ infos: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4) Profils (nom + téléphone) en batch
    const { data: profiles } = await admin
      .from('profiles')
      .select('id, full_name, first_name, last_name, phone')
      .in('id', userIds);
    const profileMap = new Map<string, any>();
    for (const p of profiles || []) profileMap.set(p.id, p);

    // 5) Compléter email + nom via l'API admin auth (nécessite le service role)
    const infos: ClientInfo[] = await Promise.all(
      userIds.map(async (uid) => {
        const p = profileMap.get(uid) || {};
        let email: string | undefined;
        let metaName: string | undefined;
        let metaPhone: string | undefined;
        try {
          const { data } = await admin.auth.admin.getUserById(uid);
          const u: any = data?.user;
          email = u?.email || undefined;
          const m = u?.user_metadata || {};
          metaName = m.full_name || m.name
            || [m.first_name, m.last_name].filter(Boolean).join(' ') || undefined;
          metaPhone = m.phone || m.phone_number || undefined;
        } catch (_) { /* ignore, fallback below */ }

        const composedProfileName = p.full_name
          || [p.first_name, p.last_name].filter(Boolean).join(' ')
          || undefined;

        return {
          user_id: uid,
          full_name: composedProfileName || metaName || undefined,
          email,
          phone: p.phone || metaPhone || undefined,
        };
      })
    );

    return new Response(JSON.stringify({ infos }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('get-client-infos error:', e);
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
