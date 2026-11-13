-- Module 3 granted only the public operations. Add the authenticated
-- table privileges these admin policies need before testing them.
grant select (id, created_at, title, description, sort_order, published, user_id)
  on public.offerings to authenticated;
grant select (id, created_at, name, email, message, handled, user_id)
  on public.inquiries to authenticated;
grant update (handled) on public.inquiries to authenticated;

-- "Signed-in admins may read ALL offerings, drafts included."
create policy "admins read all offerings"
on offerings for select
to authenticated
using (
  exists (select 1 from profiles
          where id = (select auth.uid()) and is_admin = true)
);

-- "Signed-in admins may read and update inquiries."
create policy "admins read inquiries"
on inquiries for select
to authenticated
using (
  exists (select 1 from profiles
          where id = (select auth.uid()) and is_admin = true)
);

create policy "admins update inquiries"
on inquiries for update
to authenticated
using (
  exists (select 1 from profiles
          where id = (select auth.uid()) and is_admin = true)
);
