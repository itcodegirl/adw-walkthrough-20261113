# Resume real identity tests after this blocked run

This run has no real Auth users or profiles. Gmail access and authorized A/B/C inbox identities must be supplied before the inbox path is executable. URL config is user-attested only; verify actual local/live redirect during real login. Built-in team-only sender and rate limits still apply; invitations and sends need the user's authorized addresses.

The order differs from a normal complete learner: 4.4's trigger is installed while 4.3's admin bootstrap is still blocked. When real A later signs up, the trigger should already create A's exact profile with is_admin=false. First verify A's actual authenticated UID and inspect that profile. Do not blindly replay the original lesson 4.3 admin INSERT: an existing profile would cause a duplicate-primary-key error. The owner should promote only the verified A profile by exact ID, or use the authored INSERT only if the profile is actually absent. This is a blocked-run sequencing adaptation, not a curriculum defect. B/C future signups should create their own false profiles through the trigger; there are no old B/C users to backfill.

Then execute the missing 4.2 inbox loops (twice local and once live), provider redirect, header, signout, UID/row match and persistence checks. Keep access/refresh/email tokens outside source/evidence in private mode 600 control files; record only actor labels/UIDs and outcomes.

Execute 4.3 real A profile read/draft/inbox/handled positive controls and real B nonadmin read/update refusals with owner reread. Execute 4.4 C signup-trigger proof, B/C respective owned submissions, paired personal views, own-positive/unfiltered/cross-owner/forged-owner/admin-mutation probes, A full inbox versus A personal-filter check. Refresh the final capstone matrix only after these actual requests; anonymous/catalog tests cannot fill these rows.

The current local launch is `npm run dev -- --host 127.0.0.1 --port 50795`. Saved redirect origins are `http://localhost:50795` and `http://127.0.0.1:50795`; the Site URL is `https://adw-walkthrough-20261113.vercel.app`. These settings were attested by the owner; real redirect behavior is still unverified. Do not assume Vite default port 5173 is allowed.

Also revisit the adviser EXECUTE warning on public.handle_new_user after obtaining real signup proof. Current anonymous RPC/direct-call diagnostics did not invoke it. If a minimal revoke is proposed, review it separately and verify the real signup trigger still creates exactly one false-admin profile before marking the warning resolved.
