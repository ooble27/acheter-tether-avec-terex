-- Labo interne (admin uniquement) pour prototyper le paiement de factures
-- (Senelec/Woyofal/SDE/Canal+/crédit) réglé en USDT côté client, payé en
-- CFA côté fournisseur via un agrégateur (InTouch/PayDunya) — à intégrer
-- plus tard. Cette table est ENTIÈREMENT ISOLÉE de `orders` : elle ne
-- déplace aucun fond réel, ne touche pas le flux de production actuel.
-- Accès réservé au rôle 'admin' pour l'instant (le temps de valider le
-- workflow avant d'ouvrir aux opérateurs).

create table if not exists public.bill_payment_tests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  bill_type text not null check (bill_type in ('senelec', 'woyofal', 'sde', 'canalplus', 'credit_telephone', 'autre')),
  reference text not null,
  customer_label text,
  amount_cfa numeric not null check (amount_cfa > 0),
  spread_percentage numeric not null default 2,
  exchange_rate numeric not null,
  amount_usdt numeric not null,
  status text not null default 'draft' check (status in ('draft', 'awaiting_deposit', 'deposit_confirmed', 'bill_paid', 'cancelled')),
  notes text,
  created_by uuid,
  is_test boolean not null default true
);

create index if not exists bill_payment_tests_created_at_idx on public.bill_payment_tests (created_at desc);

alter table public.bill_payment_tests enable row level security;

drop policy if exists "Admins can manage bill payment tests" on public.bill_payment_tests;
create policy "Admins can manage bill payment tests"
  on public.bill_payment_tests for all
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));
