-- Terex ID : identifiant court unique par utilisateur (8 chiffres).
-- Permet aux utilisateurs de s'identifier entre eux pour les transferts P2P
-- sans exposer la liste complete des profils.

alter table public.profiles add column if not exists terex_id text unique;

-- Generer un ID 8 chiffres pour tous les profils existants
update public.profiles
set terex_id = lpad(floor(random() * 100000000)::bigint::text, 8, '0')
where terex_id is null;

-- Rendre la colonne NOT NULL apres le remplissage
alter table public.profiles alter column terex_id set not null;
alter table public.profiles alter column terex_id set default lpad(floor(random() * 100000000)::bigint::text, 8, '0');

-- Mettre a jour le trigger d'inscription pour generer le terex_id
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, full_name, terex_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data ->> 'name', new.email),
      lpad(floor(random() * 100000000)::bigint::text, 8, '0')
    )
    on conflict (id) do nothing;
    return new;
exception
    when others then
        raise warning 'Erreur creation profil pour %: %', new.id, sqlerrm;
        return new;
end;
$$;

-- Supprimer la policy "tout le monde voit tout" (plus necessaire)
drop policy if exists "Authenticated users can view profiles" on public.profiles;

-- Nouvelle policy : un utilisateur peut voir SON propre profil
-- + chercher un profil par terex_id ou email exact (via RPC)
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);
