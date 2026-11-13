# Module 3 data checkpoint

Checkpoint venue: https://adw-walkthrough-20261113.vercel.app/ at reviewed app revision0e97ff4, 2026-11-13. Five passes swept before considering fixes. No new source defect requiring a patch was found. Authenticated dashboard-only inspection remains an environment limitation, separate from actual catalog/browser results.

## Pass 1 — schema versus napkin

Fresh25-root-catalog-baseline.json has exactly the14expected columns and two id primary keys. Types, nullability and defaults match the18napkin including its explicit3.3 amendment: offering sort_order is nullable with default0. No unexpected column. Both user_id columns remain nullable/unused; inquiry ownership awaits4.4, offering ownership reserved and unused. Scratch demonstration tables were removed in3.6. API catalog replaces visual dashboard table inspection.

## Pass 2 — locks and signed-out regression

Fresh catalog: both RLS flags true, exactly14 column grants and the same2policies. Public SELECT only title/description/sort_order/published of offerings, with published=true enforced; public INSERT only name/email/message of inquiries with checktrue. Other verbs remain DENIED as21grid records.

New25-hostile-results.json is a dated11row table/actor/row/action/expected/actual receipt from a fresh browser context without Auth session. Original8probes rerun; control200/nonempty and drafts200[]. Inquiry read and all5forbidden writes401/42501. Required allowed Probe insert201/empty response. Required insert with handledtrue401/42501 and Learner handled update401/42501. Owner full readback verifies original4offerings/6inquiries unchanged; exactly one allowed Probe added with false/null defaults, then deleted by exact ID and full baseline restored.25-root-after-hostile.json and25-root-probe-cleanup.json. The previously paper-only handled prediction from3.6 now has actual runtime proof, dated here, not retroactively at3.6. Screenshot25-hostile-receipt.png renders actual recorded browser responses; it does not expose headers or credentials.

## Pass 3 — every query now

| Query | Columns | Rows | Writes/error behavior |
| --- | --- | --- | --- |
| Home initOfferings main.js34 | title, description | published=true, sort_order ascending | no writes; returned error visibly handled, then empty/success |
| Contact submit main.js196 | no returned columns | inserts a new inquiry | explicit FIELDS maps only trimmed name/email/message; validation and pending guard; returned/thrown error retained, finally unlocks |
| Admin fetchOfferings admin.js95 | title, description, published, sort_order | ascending sort; Published adds equality, All removes it; policy still limits | no writes; returned/thrown error visible; request number rejects obsolete responses |

Count is3query sites, up from2in3.6. Status branches reuse one query builder; search filters fetched rows without a query. No stranger query, star or ignored error half. Defaults are conveniences; excluded protected fields are enforced by grants. Public text validation remains a client usability rule, not spam/format enforcement on hostile callers.

## Pass 4 — secrets and live config

25-scans.json reruns exact authored controls and patterns after24commit. Ignore rule positive, history control finds scaffold, client references found, build/dist control positive, all secret/JWT value-shaped searches empty. Source scan includes nonignored untracked files; history scans all reachable local refs. Actual current public API requests and rows render in deployed Home/admin, proving build config works end to end.24-root-host-env.json confirms needed public names for all environments. No secret consumer exists or value was retrieved; no incident required rotation.

Checklist: local config in ignored mode600.env.local; host public env names configured; browser shared client uses only publishable key; source/history/bundle secret-pattern searches empty after positive controls; no leaked secret to rotate. These checks do not validate every possible credential format. Authenticated key-management dashboard controls remain unverified from3.8.

Network note: route /rest/v1/offerings?select=title,description,published,sort_order with optional published=eq.true and ascending order; GET200, no payload, response two named-field published rows.25-live-admin.json shows status-control query change and no search request. Required direct browser POST /rest/v1/inquiries sends exactly name/email/message;201empty minimal body; owner confirms actual row, then cleanup. No Auth session supplied.25-hostile-results.json records exact failure bodies too; a401here with42501 is a missing-grant outcome, not a generic inference from status alone.

## Pass 5 — live admin and floor

25-live-admin.json passes find Portfolio refresh with mixed case,1of2count, no-request search, Enter retention, birthday0of2/no-match, keyboard clear, Published/All refetch and honest pending note. Fresh URL-guesser screenshot25-live-incognito.png dated2026-11-13; only public rows shown.25-live-floor and25-public-floor cover12page/theme/width combinations: headings/landmarks, labels/error association, visible keyboard focus, computed text contrast and no horizontal overflow. Physical phone and real screen-reader behavior remain unverified. Actual25-live-empty passes both themes with0of0 and persistent pending notes; root25-root-restored confirms original flags, and25-live-restored renders original two rows again.

## Decisions defended with receipts

1. Install default-deny protection before the first browser connection. A functioning page alone does not prove private data is closed, and shipping first would create an exposure window.19schema transaction enabled RLS/revoked browser privileges;20narrow grants preceded connection;21and25hostile receipts prove permitted and forbidden paths.
2. Keep public grants and named query columns narrow as the schema grows. A broad table grant plus star inherits future fields; exact query fields make review precise.22scratch proof returned internal_notes under broad access, then refused star after narrow grants; refreshed three-query table and25direct probes preserve that contract.

Forward look: identity will make drafts available to authorized admin users, open a properly protected inquiries inbox, and connect per-user inquiry rows. The present public page stays honest while those features wait.

History and receipts tell the ordering together:18napkin →19secured tables →20narrow grants then f61a85bconnection →21hostile proof →e0d95e4query audit →f47bf57admin →0e97ff4secrets. SQL provider actions are in dated receipts, not assumed present in Git history. Optional time/cost bonus omitted.
