create table if not exists public.business_kyb (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text,
  legal_form text,
  rccm_number text,
  ninea_number text,
  country text default 'Sénégal',
  city text,
  address text,
  sector text,
  rep_name text,
  rep_role text,
  rep_phone text,
  rep_id_document_url text,
  rccm_document_url text,
  ninea_document_url text,
  address_proof_url text,
  status text default 'pending' check (status in ('pending','submitted','under_review','approved','rejected')),
  rejection_reason text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id)
);

alter table public.business_kyb enable row level security;

create policy "users view own kyb" on public.business_kyb for select using (auth.uid() = user_id);
create policy "users insert own kyb" on public.business_kyb for insert with check (auth.uid() = user_id);
create policy "users update own kyb" on public.business_kyb for update using (auth.uid() = user_id);
