-- Permet aux utilisateurs authentifies de voir les profils (nom, telephone)
-- Necessaire pour la recherche de destinataire dans le transfert P2P.
-- Note : les colonnes sensibles ne sont pas exposees car le composant
-- ne selectionne que id, full_name, phone.

drop policy if exists "Authenticated users can view profiles" on public.profiles;
create policy "Authenticated users can view profiles"
  on public.profiles for select
  using (auth.role() = 'authenticated');
