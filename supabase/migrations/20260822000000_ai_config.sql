create table if not exists public.ai_config (
  key   text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.ai_config enable row level security;

create policy "Staff can read ai_config"
  on public.ai_config for select
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('admin','operator','marketing','hr','kyc_reviewer','support')
    )
  );

create policy "Admin can update ai_config"
  on public.ai_config for update
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    )
  );

create policy "Admin can insert ai_config"
  on public.ai_config for insert
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    )
  );
