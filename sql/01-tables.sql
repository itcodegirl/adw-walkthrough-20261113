begin;
create table offerings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  description text,
  sort_order integer default 0,
  published boolean not null default false,
  user_id uuid
);

create table inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  message text not null,
  handled boolean not null default false,
  user_id uuid
);

-- Secure both tables in the same transaction as their creation.
alter table public.offerings enable row level security;
alter table public.inquiries enable row level security;
revoke all on table public.offerings, public.inquiries from public, anon, authenticated;
commit;
