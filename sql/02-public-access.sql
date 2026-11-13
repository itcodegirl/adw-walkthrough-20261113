begin;
-- Published offerings may be read by signed-out and signed-in visitors.
grant select (title, description, sort_order, published) on public.offerings to anon, authenticated;
create policy "public reads published offerings"
on public.offerings for select to anon, authenticated
using (published = true);

-- Visitors may submit an inquiry, but may not read or change one.
grant insert (name, email, message) on public.inquiries to anon, authenticated;
create policy "public submits inquiries"
on public.inquiries for insert to anon, authenticated
with check (true);
commit;
