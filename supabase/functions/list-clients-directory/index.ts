import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Annuaire clients — pour le picker de destinataires de la messagerie.
 * Renvoie tous les comptes confirmés avec id + email + prénom + nom.
 * Réservé au staff (admin, marketing, support, operator, kyc_reviewer, hr).
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Non authentifié" }),
        { status: 401, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
    const ok = ["admin", "marketing", "support", "operator", "kyc_reviewer", "hr"];
    const isStaff = (roles || []).some((r: any) => ok.includes(r.role));
    if (!isStaff) {
      return new Response(JSON.stringify({ error: "Accès réservé au staff" }),
        { status: 403, headers: { ...CORS, "Content-Type": "application/json" } });
    }

    // Récupère tous les utilisateurs confirmés depuis auth.admin (seule API
    // qui expose les emails côté serveur), puis merge avec les profils
    // client_infos pour les noms/téléphones.
    const users: any[] = [];
    let page = 1;
    while (page <= 20) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) break;
      if (!data?.users?.length) break;
      users.push(...data.users);
      if (data.users.length < 200) break;
      page++;
    }

    const userIds = users.map(u => u.id);
    const [{ data: infos }, { data: profiles }] = await Promise.all([
      admin.from("client_infos").select("user_id, full_name, first_name, last_name").in("user_id", userIds),
      admin.from("profiles").select("id, full_name").in("id", userIds),
    ]);

    const infoByUid = new Map<string, any>();
    for (const i of infos || []) infoByUid.set(i.user_id, i);
    const profileByUid = new Map<string, any>();
    for (const p of profiles || []) profileByUid.set(p.id, p);

    // Cherche le prénom dans plusieurs sources, sans jamais retomber sur le préfixe d'email
    // (le préfixe donnerait des « bonjour » ou « a » comme prénom, ce qui pollue les messages).
    const pickFirstName = (u: any, info: any, profile: any): string => {
      const sources = [
        info?.first_name,
        info?.full_name?.split(" ")[0],
        profile?.full_name?.split(" ")[0],
        u?.user_metadata?.first_name,
        u?.user_metadata?.name?.split(" ")[0],
        u?.user_metadata?.full_name?.split(" ")[0],
      ];
      for (const s of sources) {
        const v = (s || "").trim();
        if (v) return v;
      }
      return "";
    };

    const pickFullName = (u: any, info: any, profile: any, first: string): string => {
      const last = info?.last_name || info?.full_name?.split(" ").slice(1).join(" ") ||
                   profile?.full_name?.split(" ").slice(1).join(" ") || "";
      const built = [first, last].filter(Boolean).join(" ").trim();
      if (built) return built;
      // Aucune trace de nom réel — on tombe sur l'email pour l'affichage annuaire uniquement
      return u.email!;
    };

    const directory = users
      .filter(u => u.email && u.email_confirmed_at)
      .map(u => {
        const info = infoByUid.get(u.id);
        const profile = profileByUid.get(u.id);
        const first = pickFirstName(u, info, profile);
        const fullName = pickFullName(u, info, profile, first);
        return {
          id: u.id,
          email: u.email!,
          firstName: first,
          fullName,
        };
      })
      .sort((a, b) => a.fullName.localeCompare(b.fullName));

    return new Response(JSON.stringify({ success: true, clients: directory }),
      { headers: { ...CORS, "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Erreur inconnue" }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } });
  }
});
