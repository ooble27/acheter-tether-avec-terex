-- Phase 2 (script 2/2) — Permissions par rôle métier
-- ⚠️ Exécuter APRÈS le script 1 (nouveaux rôles), dans une exécution séparée.
-- Ce script est idempotent et répare aussi la fondation Phase 1 si elle avait
-- échoué (elle référençait le rôle 'support' avant sa création dans l'enum).

-- ── Fondation Phase 1 (idempotent) ───────────────────────────────────────────
alter table public.orders
  add column if not exists assigned_to uuid,
  add column if not exists assigned_at timestamptz;

alter table public.international_transfers
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

drop policy if exists "Staff can view order events" on public.order_events;
create policy "Staff can view order events"
  on public.order_events for select
  using (
    has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'kyc_reviewer')
    or has_role(auth.uid(), 'operator') or has_role(auth.uid(), 'support')
  );

drop policy if exists "Staff can insert order events" on public.order_events;
create policy "Staff can insert order events"
  on public.order_events for insert
  with check (
    (
      has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'kyc_reviewer')
      or has_role(auth.uid(), 'operator') or has_role(auth.uid(), 'support')
    )
    and actor_id = auth.uid()
  );
-- Append-only : pas de politique UPDATE/DELETE → journal immuable.

-- ── Campagnes (si le script précédent n'était pas passé) ─────────────────────
create table if not exists public.marketing_optouts (
  email text primary key,
  user_id uuid,
  reason text default 'unsubscribe_link',
  created_at timestamptz not null default now()
);
alter table public.marketing_optouts enable row level security;

create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preview_text text, hero_title text, content text,
  cta_text text, cta_url text,
  segment text not null default 'all',
  recipients_count integer not null default 0,
  success_count integer not null default 0,
  error_count integer not null default 0,
  status text not null default 'sent',
  created_by uuid,
  created_at timestamptz not null default now()
);
alter table public.email_campaigns enable row level security;

-- ── OPÉRATEURS : accès aux commandes et virements ────────────────────────────
drop policy if exists "Operators can view all orders" on public.orders;
create policy "Operators can view all orders"
  on public.orders for select using (has_role(auth.uid(), 'operator'));

drop policy if exists "Operators can update orders" on public.orders;
create policy "Operators can update orders"
  on public.orders for update using (has_role(auth.uid(), 'operator'));

drop policy if exists "Operators can view all transfers" on public.international_transfers;
create policy "Operators can view all transfers"
  on public.international_transfers for select using (has_role(auth.uid(), 'operator'));

drop policy if exists "Operators can update transfers" on public.international_transfers;
create policy "Operators can update transfers"
  on public.international_transfers for update using (has_role(auth.uid(), 'operator'));

-- Les opérateurs voient les profils (nom du client sur les commandes)
drop policy if exists "Staff can view profiles" on public.profiles;
create policy "Staff can view profiles"
  on public.profiles for select
  using (
    has_role(auth.uid(), 'operator') or has_role(auth.uid(), 'marketing')
    or has_role(auth.uid(), 'hr') or has_role(auth.uid(), 'support')
  );

-- ── MARKETING : campagnes + désabonnements ───────────────────────────────────
drop policy if exists "Admins can view campaigns" on public.email_campaigns;
create policy "Admins can view campaigns"
  on public.email_campaigns for select
  using (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'marketing'));

drop policy if exists "Admins can insert campaigns" on public.email_campaigns;
create policy "Admins can insert campaigns"
  on public.email_campaigns for insert
  with check (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'marketing'));

drop policy if exists "Admins can view optouts" on public.marketing_optouts;
create policy "Admins can view optouts"
  on public.marketing_optouts for select
  using (has_role(auth.uid(), 'admin') or has_role(auth.uid(), 'marketing'));

-- ── RH : candidatures ────────────────────────────────────────────────────────
drop policy if exists "HR can manage applications" on public.job_applications;
create policy "HR can manage applications"
  on public.job_applications for all
  using (has_role(auth.uid(), 'hr'))
  with check (has_role(auth.uid(), 'hr'));
