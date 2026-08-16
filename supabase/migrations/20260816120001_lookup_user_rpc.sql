-- RPC securisee : chercher un utilisateur par terex_id ou email exact.
-- Retourne au maximum 1 resultat. Ne permet pas de lister tous les utilisateurs.

create or replace function public.lookup_user(identifier text)
returns table(id uuid, full_name text, terex_id text)
language plpgsql
security definer
set search_path = public
as $$
declare
  clean_id text := trim(identifier);
begin
  -- D'abord chercher par terex_id exact
  return query
    select p.id, p.full_name, p.terex_id
    from profiles p
    where p.terex_id = clean_id
    limit 1;

  if found then return; end if;

  -- Sinon chercher par email exact dans auth.users
  return query
    select p.id, p.full_name, p.terex_id
    from auth.users u
    join profiles p on p.id = u.id
    where lower(u.email) = lower(clean_id)
    limit 1;
end;
$$;
