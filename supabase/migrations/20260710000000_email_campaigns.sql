-- Système de campagnes email marketing professionnel
-- 1) marketing_optouts : liste de suppression (désabonnements) — respect légal
-- 2) email_campaigns  : historique des campagnes envoyées (audit + stats)

create table if not exists public.marketing_optouts (
  email text primary key,
  user_id uuid,
  reason text default 'unsubscribe_link',
  created_at timestamptz not null default now()
);

alter table public.marketing_optouts enable row level security;

-- Lecture réservée aux admins (l'écriture passe par les fonctions edge en service role)
create policy "Admins can view optouts"
  on public.marketing_optouts for select
  using (has_role(auth.uid(), 'admin'));

create table if not exists public.email_campaigns (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  preview_text text,
  hero_title text,
  content text,
  cta_text text,
  cta_url text,
  segment text not null default 'all',
  recipients_count integer not null default 0,
  success_count integer not null default 0,
  error_count integer not null default 0,
  status text not null default 'sent',
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.email_campaigns enable row level security;

create policy "Admins can view campaigns"
  on public.email_campaigns for select
  using (has_role(auth.uid(), 'admin'));

create policy "Admins can insert campaigns"
  on public.email_campaigns for insert
  with check (has_role(auth.uid(), 'admin'));
