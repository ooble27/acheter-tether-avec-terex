# ✅ À faire exécuter par Lovable

Tout le **code** est déjà déployé sur la plateforme. Il ne reste qu'**une seule
action base de données** à faire tourner chez Lovable pour activer la dernière
fonctionnalité. À faire quand les crédits reviennent.

---

## 1. Activer le pointage horaire de l'équipe (Présences)

**Fonctionnalité :** chaque employé pointe son arrivée et son départ ; toi
(owner) tu vois dans l'onglet **Présences** à quelle heure chacun est arrivé,
reparti, et combien de temps il a travaillé — pour la gestion de la paie.

**Ce que Lovable doit faire :** exécuter la migration SQL ci-dessous
(fichier : `supabase/migrations/20260712000002_staff_shifts.sql`).
Elle est **idempotente** — sans danger même si on la relance.

```sql
-- Pointage horaire de l'équipe (punch in / punch out) — pour la gestion de paie.
create table if not exists public.staff_shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor_name text,
  clock_in timestamptz not null default now(),
  clock_out timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists staff_shifts_user_idx on public.staff_shifts (user_id, clock_in desc);
create unique index if not exists staff_shifts_one_open_per_user
  on public.staff_shifts (user_id) where clock_out is null;

alter table public.staff_shifts enable row level security;

drop policy if exists "Shifts select own or admin" on public.staff_shifts;
create policy "Shifts select own or admin"
  on public.staff_shifts for select
  using (user_id = auth.uid() or has_role(auth.uid(), 'admin'));

drop policy if exists "Shifts insert own" on public.staff_shifts;
create policy "Shifts insert own"
  on public.staff_shifts for insert
  with check (user_id = auth.uid());

drop policy if exists "Shifts update own" on public.staff_shifts;
create policy "Shifts update own"
  on public.staff_shifts for update
  using (user_id = auth.uid());
-- Pas de DELETE : historique de présence infalsifiable.
```

**Une fois la migration passée :** le bouton de pointage (en haut du portail
admin) et l'onglet **Présences** s'activent tout seuls. Rien d'autre à faire.

---

## 2. Index de performance (scalabilité) — recommandé

**Pourquoi :** sans index, la base parcourt toute la table à chaque requête.
Ça va bien à quelques milliers de commandes, mais ça ralentit fortement à
100 000+. Ces index gardent le back-office rapide quel que soit le volume.

**Ce que tu dois faire :** exécuter la migration
`supabase/migrations/20260714000000_orders_scale_indexes.sql` (contenu
ci-dessous). **Idempotente**, sans danger, relançable.

```sql
-- Table orders
create index if not exists orders_visible_created_idx
  on public.orders (created_at desc) where admin_hidden is not true;
create index if not exists orders_user_idx
  on public.orders (user_id, created_at desc);
create index if not exists orders_status_idx
  on public.orders (status);
create index if not exists orders_assigned_idx
  on public.orders (assigned_to) where assigned_to is not null;
create index if not exists orders_deleted_idx
  on public.orders (is_deleted) where is_deleted is true;

-- Table international_transfers
create index if not exists transfers_visible_created_idx
  on public.international_transfers (created_at desc) where admin_hidden is not true;
create index if not exists transfers_user_idx
  on public.international_transfers (user_id, created_at desc);
create index if not exists transfers_status_idx
  on public.international_transfers (status);
create index if not exists transfers_assigned_idx
  on public.international_transfers (assigned_to) where assigned_to is not null;
```

---

_Le reste (temps réel incrémental anti-lag, pagination complète, anti-flash,
reçus PDF, base de connaissances, signature email, etc.) est déjà en ligne
côté code._
