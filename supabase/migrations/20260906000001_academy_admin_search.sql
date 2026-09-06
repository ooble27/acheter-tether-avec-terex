-- ============================================================
-- Admin user search — RPC functions for Academy enrollment
-- ============================================================

-- View for admin user search (joins auth.users + profiles)
CREATE OR REPLACE VIEW public.admin_user_search AS
SELECT
  u.id,
  u.email,
  p.full_name,
  p.phone,
  p.terex_id,
  p.country,
  p.created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id;

ALTER VIEW public.admin_user_search SET (security_invoker = true);
GRANT SELECT ON public.admin_user_search TO authenticated;

-- RPC: search users by email/name/terex_id/phone (admin only)
CREATE OR REPLACE FUNCTION public.admin_search_users(search_term text)
RETURNS TABLE(id uuid, email text, full_name text, phone text, terex_id text)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Accès non autorisé';
  END IF;

  RETURN QUERY
  SELECT
    u.id,
    u.email::text,
    p.full_name,
    p.phone,
    p.terex_id
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE
    u.email ILIKE '%' || search_term || '%'
    OR p.full_name ILIKE '%' || search_term || '%'
    OR p.terex_id ILIKE '%' || search_term || '%'
    OR p.phone ILIKE '%' || search_term || '%'
  LIMIT 10;
END;
$$;

-- RPC: get single user info (admin only)
CREATE OR REPLACE FUNCTION public.admin_get_user_info(user_uuid uuid)
RETURNS TABLE(email text, full_name text)
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Accès non autorisé';
  END IF;

  RETURN QUERY
  SELECT u.email::text, p.full_name
  FROM auth.users u
  LEFT JOIN public.profiles p ON p.id = u.id
  WHERE u.id = user_uuid;
END;
$$;
