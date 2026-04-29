-- CookPlan schema
-- Run this once in the Supabase SQL editor (or via supabase db push).

create table if not exists persons (
  id    uuid primary key default gen_random_uuid(),
  name  text not null,
  color text not null
);

create table if not exists meals (
  id          uuid primary key default gen_random_uuid(),
  name        text    not null,
  description text,
  tags        text[]  not null default '{}'
);

create table if not exists assignments (
  id          uuid    primary key default gen_random_uuid(),
  date        text    not null,
  person_id   text    not null,
  meal_id     text,
  meal_name   text,
  note        text,
  completed   boolean not null default false
);

-- Row Level Security
-- The API uses the service_role key which bypasses RLS, so these policies
-- are a safety net for any accidental anon/authenticated access.
alter table persons    enable row level security;
alter table meals      enable row level security;
alter table assignments enable row level security;

-- No public access; all reads/writes go through the service_role key on the server.
