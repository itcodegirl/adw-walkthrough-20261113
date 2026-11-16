-- after 05-signup-profile.sql: the trigger function is SECURITY DEFINER and
-- only auth's insert trigger should run it, so browser roles get no EXECUTE.
-- triggers do not check EXECUTE when they fire, so signup still creates profiles.
-- not a lesson receipt: added after the capstone to clear Supabase lints 0028/0029.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
