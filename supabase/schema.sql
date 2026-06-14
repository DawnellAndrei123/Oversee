-- Oversee Supabase backend schema
-- Run this in Supabase Dashboard > SQL Editor before starting server.js with Supabase credentials.

create or replace function public.oversee_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.oversee_accounts (
  id text primary key,
  email text not null unique,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oversee_pending_signups (
  email text primary key,
  data jsonb not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oversee_sessions (
  token text primary key,
  account_id text,
  data jsonb not null,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oversee_invites (
  token text primary key,
  email text,
  created_by text,
  accepted_by text,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oversee_audit_log (
  id text primary key,
  action text,
  data jsonb not null,
  at timestamptz not null default now()
);

create table if not exists public.oversee_app_data (
  account_id text primary key,
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.oversee_gathered_app_data (
  account_id text primary key,
  account_email text,
  account_name text,
  saved_by_account_id text,
  saved_by_email text,
  saved_by_name text,
  data jsonb not null default '{}'::jsonb,
  data_summary jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists oversee_accounts_email_idx on public.oversee_accounts (email);
create index if not exists oversee_pending_signups_expires_idx on public.oversee_pending_signups (expires_at);
create index if not exists oversee_sessions_account_idx on public.oversee_sessions (account_id);
create index if not exists oversee_sessions_expires_idx on public.oversee_sessions (expires_at);
create index if not exists oversee_invites_email_idx on public.oversee_invites (email);
create index if not exists oversee_audit_log_at_idx on public.oversee_audit_log (at desc);
create index if not exists oversee_app_data_updated_idx on public.oversee_app_data (updated_at desc);
create index if not exists oversee_gathered_app_data_email_idx on public.oversee_gathered_app_data (account_email);
create index if not exists oversee_gathered_app_data_updated_idx on public.oversee_gathered_app_data (updated_at desc);

drop trigger if exists oversee_accounts_touch_updated_at on public.oversee_accounts;
create trigger oversee_accounts_touch_updated_at
before update on public.oversee_accounts
for each row execute function public.oversee_touch_updated_at();

drop trigger if exists oversee_pending_signups_touch_updated_at on public.oversee_pending_signups;
create trigger oversee_pending_signups_touch_updated_at
before update on public.oversee_pending_signups
for each row execute function public.oversee_touch_updated_at();

drop trigger if exists oversee_sessions_touch_updated_at on public.oversee_sessions;
create trigger oversee_sessions_touch_updated_at
before update on public.oversee_sessions
for each row execute function public.oversee_touch_updated_at();

drop trigger if exists oversee_invites_touch_updated_at on public.oversee_invites;
create trigger oversee_invites_touch_updated_at
before update on public.oversee_invites
for each row execute function public.oversee_touch_updated_at();

drop trigger if exists oversee_app_data_touch_updated_at on public.oversee_app_data;
create trigger oversee_app_data_touch_updated_at
before update on public.oversee_app_data
for each row execute function public.oversee_touch_updated_at();

drop trigger if exists oversee_gathered_app_data_touch_updated_at on public.oversee_gathered_app_data;
create trigger oversee_gathered_app_data_touch_updated_at
before update on public.oversee_gathered_app_data
for each row execute function public.oversee_touch_updated_at();

alter table public.oversee_accounts enable row level security;
alter table public.oversee_pending_signups enable row level security;
alter table public.oversee_sessions enable row level security;
alter table public.oversee_invites enable row level security;
alter table public.oversee_audit_log enable row level security;
alter table public.oversee_app_data enable row level security;
alter table public.oversee_gathered_app_data enable row level security;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'oversee-estimate-plans',
  'oversee-estimate-plans',
  false,
  12582912,
  array['application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

comment on table public.oversee_accounts is 'Oversee account records. The Node backend writes via the Supabase service role key.';
comment on table public.oversee_pending_signups is 'Temporary Oversee signup records waiting for OTP verification.';
comment on table public.oversee_sessions is 'Oversee session tokens generated by the Node backend.';
comment on table public.oversee_invites is 'Oversee account invitation links and accepted status.';
comment on table public.oversee_audit_log is 'Oversee account and auth audit events.';
comment on table public.oversee_app_data is 'Shared owner-workspace Oversee data including projects, SWA, estimates, procurement, accounting, templates, and material price lists.';
comment on table public.oversee_gathered_app_data is 'Readable owner-workspace app data snapshots with the email and full name of the user who last saved the data.';
