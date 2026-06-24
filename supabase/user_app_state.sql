-- Kodmigo user_app_state tablosu
-- Supabase Dashboard → SQL Editor'da çalıştırın.

create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users (id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  user_progress jsonb not null default '{}'::jsonb,
  learning_progress jsonb not null default '{}'::jsonb,
  streak_progress jsonb not null default '{}'::jsonb,
  onboarding_profile jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_user_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_app_state_updated_at on public.user_app_state;

create trigger user_app_state_updated_at
before update on public.user_app_state
for each row
execute function public.set_user_app_state_updated_at();

alter table public.user_app_state enable row level security;

-- API erişimi için gerekli izinler (RLS tek başına yetmez)
grant usage on schema public to authenticated;
grant select, insert, update, delete on table public.user_app_state to authenticated;

drop policy if exists "Users can select own app state" on public.user_app_state;
drop policy if exists "Users can insert own app state" on public.user_app_state;
drop policy if exists "Users can update own app state" on public.user_app_state;
drop policy if exists "Users can delete own app state" on public.user_app_state;

create policy "Users can select own app state"
on public.user_app_state
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own app state"
on public.user_app_state
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own app state"
on public.user_app_state
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own app state"
on public.user_app_state
for delete
to authenticated
using (auth.uid() = user_id);
