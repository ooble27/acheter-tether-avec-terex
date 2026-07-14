-- Index de performance pour la montée en charge (scalabilité).
-- Sans index, PostgreSQL parcourt toute la table à chaque requête : ça passe à
-- quelques milliers de lignes, ça rame à 100 000+. Ces index rendent les
-- requêtes du back-office quasi instantanées quel que soit le volume.
-- 100% idempotent (IF NOT EXISTS) — sans danger, relançable.

-- ── Table orders ────────────────────────────────────────────────────────────
-- Requête principale du portail : commandes visibles, triées par date.
create index if not exists orders_visible_created_idx
  on public.orders (created_at desc)
  where admin_hidden is not true;

-- Fiche client 360° : toutes les commandes d'un client.
create index if not exists orders_user_idx
  on public.orders (user_id, created_at desc);

-- File de traitement / Comptabilité : filtrage par statut.
create index if not exists orders_status_idx
  on public.orders (status);

-- Prise en charge par un opérateur (anti-double-traitement).
create index if not exists orders_assigned_idx
  on public.orders (assigned_to)
  where assigned_to is not null;

-- Corbeille.
create index if not exists orders_deleted_idx
  on public.orders (is_deleted)
  where is_deleted is true;

-- ── Table international_transfers ───────────────────────────────────────────
create index if not exists transfers_visible_created_idx
  on public.international_transfers (created_at desc)
  where admin_hidden is not true;

create index if not exists transfers_user_idx
  on public.international_transfers (user_id, created_at desc);

create index if not exists transfers_status_idx
  on public.international_transfers (status);

create index if not exists transfers_assigned_idx
  on public.international_transfers (assigned_to)
  where assigned_to is not null;
