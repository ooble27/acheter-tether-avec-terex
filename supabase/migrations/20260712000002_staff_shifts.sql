-- Pointage horaire de l'équipe (punch in / punch out) — pour la gestion de paie.
-- Idempotent. À exécuter chez Lovable quand les crédits reviennent.

create table if not exists public.staff_shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor_name text,
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists staff_shifts_user_idx on public.staff_shifts (user_id, clock_in desc);
-- Un seul pointage ouvert par personne à la fois (clock_out null).
create unique index if not exists staff_shifts_one_open_per_user
  on public.staff_shifts (user_id) where clock_out is null;

alter table public.staff_shifts enable row level security;

-- Chaque membre voit SES pointages ; l'owner (admin) voit ceux de TOUTE l'équipe.
drop policy if exists "Shifts select own or admin" on public.staff_shifts;
create policy "Shifts select own or admin"
  on public.staff_shifts for select
  using (user_id = auth.uid() or has_role(auth.uid(), 'admin'));

-- Chacun ne peut pointer que pour lui-même.
drop policy if exists "Shifts insert own" on public.staff_shifts;
create policy "Shifts insert own"
  on public.staff_shifts for insert
  with check (user_id = auth.uid());

-- Chacun ne ferme que ses propres pointages.
drop policy if exists "Shifts update own" on public.staff_shifts;
create policy "Shifts update own"
  on public.staff_shifts for update
  using (user_id = auth.uid());
-- Pas de DELETE : historique de présence infalsifiable.
