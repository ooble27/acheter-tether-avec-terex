-- Transferts P2P entre utilisateurs Terex
-- Permet d'envoyer des USDT d'un utilisateur à un autre sans passer
-- par la blockchain. Tout est interne (écriture en base uniquement).

create table if not exists public.p2p_transfers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  sender_id uuid not null references auth.users(id),
  receiver_id uuid not null references auth.users(id),
  amount_usdt numeric not null check (amount_usdt > 0),
  amount_cfa numeric not null check (amount_cfa > 0),
  exchange_rate numeric not null,
  note text,
  status text not null default 'completed' check (status in ('completed', 'cancelled')),
  constraint different_users check (sender_id != receiver_id)
);

create index if not exists p2p_transfers_sender_idx on public.p2p_transfers (sender_id, created_at desc);
create index if not exists p2p_transfers_receiver_idx on public.p2p_transfers (receiver_id, created_at desc);

alter table public.p2p_transfers enable row level security;

drop policy if exists "Users can see their own transfers" on public.p2p_transfers;
create policy "Users can see their own transfers"
  on public.p2p_transfers for select
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "Users can create transfers" on public.p2p_transfers;
create policy "Users can create transfers"
  on public.p2p_transfers for insert
  with check (auth.uid() = sender_id);

drop policy if exists "Admins can manage all transfers" on public.p2p_transfers;
create policy "Admins can manage all transfers"
  on public.p2p_transfers for all
  using (has_role(auth.uid(), 'admin'))
  with check (has_role(auth.uid(), 'admin'));
