-- Run this in Supabase SQL Editor.
-- Creates app tables for user profiles and generated document reports.

create extension if not exists pgcrypto;

create table if not exists public.app_users (
  email text primary key,
  name text not null,
  picture text not null default '',
  last_login timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.generated_reports (
  id uuid primary key default gen_random_uuid(),
  user_email text references public.app_users(email) on delete set null,
  document_type text not null,
  report_title text,
  status text not null default 'blueprint_generated',
  clause_count integer not null default 0,
  high_risk_count integer not null default 0,
  medium_risk_count integer not null default 0,
  low_risk_count integer not null default 0,
  export_format text,
  form_data jsonb not null default '{}'::jsonb,
  blueprint jsonb,
  full_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  exported_at timestamptz
);

create index if not exists generated_reports_user_email_idx
  on public.generated_reports(user_email);

create index if not exists generated_reports_document_type_idx
  on public.generated_reports(document_type);

create index if not exists generated_reports_created_at_idx
  on public.generated_reports(created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_users_set_updated_at on public.app_users;
create trigger app_users_set_updated_at
before update on public.app_users
for each row execute function public.set_updated_at();

drop trigger if exists generated_reports_set_updated_at on public.generated_reports;
create trigger generated_reports_set_updated_at
before update on public.generated_reports
for each row execute function public.set_updated_at();

