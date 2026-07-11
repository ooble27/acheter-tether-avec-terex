-- Phase 1 — Fondation opérations multi-employés
-- 1) Prise en charge des commandes : orders.assigned_to / assigned_at
--    → un opérateur « prend » une commande, les autres la voient verrouillée
--      (impossible de traiter la même commande à deux).
-- 2) Journal d'activité : order_events (append-only)
--    → chaque action (prise en charge, changement de statut, email, note)
--      est tracée avec son auteur. On n'efface JAMAIS.

alter table public.orders
  add column if not exists assigned_to uuid,
  add column if not exists assigned_at timestamptz;

create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  actor_id uuid,
  actor_name text,
  action text not null,
  details text,
  created_at timestamptz not null default now()
);

create index if not exists order_events_order_id_idx on public.order_events (order_id, created_at);

alter table public.order_events enable row level security;

-- Lecture/écriture pour l'équipe (admins, vérificateurs KYC, support).
create policy "Staff can view order events"
  on public.order_events for select
  using (
    has_role(auth.uid(), 'admin')
    or has_role(auth.uid(), 'kyc_reviewer')
    or has_role(auth.uid(), 'support')
  );

create policy "Staff can insert order events"
  on public.order_events for insert
  with check (
    (
      has_role(auth.uid(), 'admin')
      or has_role(auth.uid(), 'kyc_reviewer')
      or has_role(auth.uid(), 'support')
    )
    and actor_id = auth.uid()
  );

-- Append-only : pas de politique UPDATE/DELETE → le journal est immuable.
