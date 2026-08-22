-- Mail Studio — table des templates email par blocs
-- Chaque template est un JSON { blocks: [{ type, props }] } assemblé
-- par le renderer côté serveur au moment de l'envoi.

create table if not exists public.mail_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subject text not null default '',
  preview_text text not null default '',
  blocks jsonb not null default '[]'::jsonb,
  category text not null default 'marketing'
    check (category in ('marketing', 'transactional', 'onboarding', 'reactivation')),
  is_draft boolean not null default true,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.mail_templates enable row level security;

create policy "Staff can view mail_templates"
  on public.mail_templates for select
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('admin', 'marketing')
    )
  );

create policy "Staff can insert mail_templates"
  on public.mail_templates for insert
  with check (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('admin', 'marketing')
    )
  );

create policy "Staff can update mail_templates"
  on public.mail_templates for update
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role in ('admin', 'marketing')
    )
  );

create policy "Admin can delete mail_templates"
  on public.mail_templates for delete
  using (
    exists (
      select 1 from public.user_roles
      where user_roles.user_id = auth.uid()
        and user_roles.role = 'admin'
    )
  );

create or replace function public.update_mail_templates_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_mail_templates_updated_at
  before update on public.mail_templates
  for each row execute function public.update_mail_templates_updated_at();
