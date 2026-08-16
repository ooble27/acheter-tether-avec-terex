-- P2P transferts : workflow complet.
-- Sender paye comme un achat → Terex conserve brievement → Receveur claime
-- vers son wallet externe ou Binance. Terex ne detient pas les fonds long-terme.

-- Etendre la table p2p_transfers avec les colonnes du workflow
alter table public.p2p_transfers
  add column if not exists fee_cfa numeric not null default 0,
  add column if not exists message text,
  add column if not exists payment_method text,
  add column if not exists payment_reference text,
  add column if not exists delivery_type text,
  add column if not exists delivery_network text,
  add column if not exists delivery_address text,
  add column if not exists delivery_binance_id text,
  add column if not exists claimed_at timestamptz,
  add column if not exists completed_at timestamptz;

-- Elargir les statuts autorises
alter table public.p2p_transfers drop constraint if exists p2p_transfers_status_check;
alter table public.p2p_transfers add constraint p2p_transfers_status_check
  check (status in ('pending_payment', 'pending_claim', 'claimed', 'processing', 'completed', 'cancelled', 'refunded'));

alter table public.p2p_transfers alter column status set default 'pending_payment';

-- Index sur le receveur pour trouver rapidement les transferts a claimer
create index if not exists p2p_transfers_receiver_status_idx
  on public.p2p_transfers (receiver_id, status);

-- Policy : le receveur peut MAJ son propre transfert quand il claime
drop policy if exists "Receivers can claim transfers" on public.p2p_transfers;
create policy "Receivers can claim transfers"
  on public.p2p_transfers for update
  using (auth.uid() = receiver_id)
  with check (auth.uid() = receiver_id);
