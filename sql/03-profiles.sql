-- the app's first role: a flag on a minimal profiles table
create table profiles (
  id uuid primary key references auth.users(id),
  is_admin boolean not null default false
);
alter table profiles enable row level security;
revoke all on public.profiles from public, anon, authenticated;
grant select (id, is_admin) on public.profiles to authenticated;

create policy "users read own profile"
on profiles for select
to authenticated
using ((select auth.uid()) = id);

