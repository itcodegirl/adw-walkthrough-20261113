# Current gate and policy pairing

| App surface | Named enforcement behind the UI |
| --- | --- |
| Public services and client-side search | Named offering column grants plus `public reads published offerings`; typing only filters already permitted rows. |
| Anonymous inquiry form | INSERT grants for name, email, message and `public submits inquiries`; defaults supply handled false and null owner. Browser validation is not a server spam/format rule. |
| Signed-in inquiry form | Authenticated INSERT additionally permits user_id; `public submits inquiries` checks the actual caller's UID. Admin exception does not permit forged owners in this INSERT policy. |
| My inquiries | Authenticated SELECT grants and `users read own inquiries`; client owner filter expresses the personal view even for an admin with broader access. |
| Manage drafts | `admins read all offerings`, with own-profile is_admin lookup and named SELECT grants. |
| Admin inbox and Mark handled | `admins read inquiries` and `admins update inquiries`; only handled UPDATE is granted. Update is scoped to an exact inquiry ID and returns only id. |
| Profile role lookup | Named id/is_admin SELECT and `users read own profile`; no browser profile mutation grant/policy. |
| Login and header state | Supabase Auth verifies inbox possession and maintains session; UI success or a greeting does not grant table access. |
| Static files, other offerings mutations | Files are public. Offering writes are denied by missing browser grants/policies. |

The catalog has all seven listed table policies. Anonymous controls and denied-write readbacks are real. Every authenticated actor path still needs the real A/B/C requests listed in RESUME-AUTH.md; catalog and source review cannot establish their runtime outcomes.
