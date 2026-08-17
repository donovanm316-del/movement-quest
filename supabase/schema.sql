-- Run this once in your Supabase project's SQL editor
-- (Project -> SQL Editor -> New query -> paste -> Run).
--
-- Stores each user's whole game profile as a single JSON blob, keyed by
-- their auth user id. Row Level Security ensures a user can only ever
-- read or write their own row.

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);
