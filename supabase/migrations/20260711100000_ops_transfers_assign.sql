-- Complément Phase 1 : la prise en charge fonctionne aussi pour les
-- virements internationaux (table séparée des commandes).
alter table public.international_transfers
  add column if not exists assigned_to uuid,
  add column if not exists assigned_at timestamptz;
