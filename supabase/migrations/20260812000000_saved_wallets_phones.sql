-- Adresses USDT et numéros Mobile Money enregistrés par le client.
-- Permet de rappeler ses adresses/numéros favoris au lieu de retaper à chaque
-- commande. RLS strict : chaque client ne voit et ne modifie que les siens.

-- ── Adresses USDT ──────────────────────────────────────────────────────────
create table if not exists public.saved_wallets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  network     text not null,                    -- TRC20, BEP20, Polygon, Solana, Arbitrum, Base
  label       text,                             -- « Mon Trust Wallet », etc. (facultatif)
  address     text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists saved_wallets_user_network_idx
  on public.saved_wallets (user_id, network);

-- Une seule adresse par défaut par (user, network).
create unique index if not exists saved_wallets_default_unique
  on public.saved_wallets (user_id, network)
  where is_default is true;

-- Anti-doublon : la même adresse ne peut être enregistrée qu'une fois par
-- (user, network).
create unique index if not exists saved_wallets_unique_address
  on public.saved_wallets (user_id, network, address);

alter table public.saved_wallets enable row level security;

drop policy if exists "saved_wallets_own_select" on public.saved_wallets;
create policy "saved_wallets_own_select" on public.saved_wallets
  for select using (auth.uid() = user_id);

drop policy if exists "saved_wallets_own_insert" on public.saved_wallets;
create policy "saved_wallets_own_insert" on public.saved_wallets
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved_wallets_own_update" on public.saved_wallets;
create policy "saved_wallets_own_update" on public.saved_wallets
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "saved_wallets_own_delete" on public.saved_wallets;
create policy "saved_wallets_own_delete" on public.saved_wallets
  for delete using (auth.uid() = user_id);

-- ── Numéros Mobile Money ───────────────────────────────────────────────────
create table if not exists public.saved_phones (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  provider    text not null,                    -- wave, orange
  label       text,                             -- « Mon perso », « Numéro business »
  phone       text not null,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists saved_phones_user_provider_idx
  on public.saved_phones (user_id, provider);

create unique index if not exists saved_phones_default_unique
  on public.saved_phones (user_id, provider)
  where is_default is true;

create unique index if not exists saved_phones_unique_phone
  on public.saved_phones (user_id, provider, phone);

alter table public.saved_phones enable row level security;

drop policy if exists "saved_phones_own_select" on public.saved_phones;
create policy "saved_phones_own_select" on public.saved_phones
  for select using (auth.uid() = user_id);

drop policy if exists "saved_phones_own_insert" on public.saved_phones;
create policy "saved_phones_own_insert" on public.saved_phones
  for insert with check (auth.uid() = user_id);

drop policy if exists "saved_phones_own_update" on public.saved_phones;
create policy "saved_phones_own_update" on public.saved_phones
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "saved_phones_own_delete" on public.saved_phones;
create policy "saved_phones_own_delete" on public.saved_phones
  for delete using (auth.uid() = user_id);
