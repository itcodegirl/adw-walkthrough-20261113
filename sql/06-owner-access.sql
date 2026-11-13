-- Signed-in submissions name user_id; Module 3's column grant did not include it.
-- Signed-out visitors keep Module 3's grant, so the form omits the key for them.
grant insert (user_id) on public.inquiries to authenticated;

-- "A signed-in user may read her own inquiries."
create policy "users read own inquiries"
on inquiries for select
to authenticated
using ((select auth.uid()) = user_id);

-- and tighten the insert to verify ownership claims:
drop policy "public submits inquiries" on inquiries;
create policy "public submits inquiries"
on inquiries for insert
to anon, authenticated
with check ((user_id = (select auth.uid()) or user_id is null) and handled = false);
