# Capstone evidence

**10/10 numbered criteria passed** on the disposable Jenna Studio app by November 15, 2026. The November 13 run verified six. The hosted Auth and browser follow-ups verified criteria 2, 4, 5 and 9 on the same learner app revision, `183cd0a`. This was a simulated learner walkthrough. Feedback from two people is still pending. [Live app](https://adw-walkthrough-20261113.vercel.app)

## Ten live checks

| # | Criterion | Result and evidence |
| --- | --- | --- |
| 1 | Live public data and submission | **Pass.** Published services rendered. A signed-out form submission saved exactly one inquiry with a null owner and `handled = false`. [Request](evidence/live-submit.json) · [Database readback](evidence/owner-after-submit.json) |
| 2 | End-to-end login | **Pass.** A, B and C established hosted sessions from real email links. C signed out and saw the sign-in prompt on a fresh Manage visit. [Session checks](#hosted-auth-and-sign-out) |
| 3 | Signed-out access | **Pass.** Direct navigation to Manage showed the prompt and sent zero private queries. Anonymous API requests could read published offerings, saw no drafts and could not read inquiries. [Gate](evidence/signed-out-gate.json) · [Anonymous requests](evidence/anonymous-matrix.json) |
| 4 | Admin access and ordinary-user isolation | **Pass.** The 11 anonymous probes passed, A marked a private inquiry handled, and B and C could each read only their own inquiry. Both cross-account update attempts affected zero rows. [Anonymous readback](evidence/owner-after-hostile.json) · [Two-account results](#admin-and-ordinary-user-access) |
| 5 | Row-level security on every table | **Pass.** Dashboard inspection and a separate catalog read confirmed RLS enabled on `public.offerings`, `public.inquiries` and `public.profiles`. [Dashboard observation](#dashboard-verification) · [Initial catalog](evidence/catalog.json) |
| 6 | Scoped queries | **Pass.** All seven database call sites use named columns, the intended filters and narrowly scoped writes. Service-title filtering runs in the browser. [Source audit](QUERY-AUDIT.md) |
| 7 | Secrets | **Pass.** The ignore, Git history, source-reference and build checks passed their positive controls. The scans found no matching secret values. [Scan](evidence/secrets.json) |
| 8 | Automated tests | **Pass.** Eleven tests passed against the app's validators and title filter. [Test results](evidence/tests.json) |
| 9 | Design tokens and accessibility | **Pass.** All 16 signed-out and eight signed-in combinations passed. The deployed CSS matched the audited build byte for byte. The scan found zero stray hex colours, font families or spacing values. [Signed-out checks](evidence/floor-summary.json) · [Signed-in checks](#signed-in-visual-and-accessibility-checks) · [Token scan](evidence/tokens.json) |
| 10 | Repository and decisions | **Pass.** The commit history records the build, the README gives setup instructions, and the decisions note explains two architecture choices. The final review records a rejected proposal. [Decisions](DECISIONS.md) · [Six-question review](REVIEW.md) |

## Hosted Auth and sign-out

A, B and C are test-account labels. Each followed a real emailed link to the hosted app. The signup trigger created A's ordinary profile before the admin promotion. B and C remained distinct ordinary users.

On November 15 at 06:01 UTC, C activated Sign out on Manage. The header changed to Sign in and the page showed its sign-in prompt. Both states persisted on a fresh direct visit. In a separate admin test, the session survived a full reload with 11 private inquiries visible. Sign-out returned HTTP 204 and cleared the list. A fresh Manage visit showed zero private rows and made zero database requests.

## Admin and ordinary-user access

Admin A opened Manage, saw a private test inquiry and marked it handled. A database read confirmed that its flag changed from false to true. The test then restored the original value.

B and C each submitted an inquiry through the hosted form and saw their own entry in My inquiries. For the cross-account checks, database transactions used the authenticated role and each real account's verified user ID. Both target inquiries existed before the probes.

| Database operation | As B | As C |
| --- | ---: | ---: |
| Read own inquiry by ID | 1 row | 1 row |
| Read all visible inquiries without an owner filter | 1 own row | 1 own row |
| Read the other user's inquiry by ID | 0 rows | 0 rows |
| Mark the other inquiry handled | 0 rows updated | 0 rows updated |
| Edit the other inquiry's message | Permission denied, SQLSTATE `42501` | Permission denied, SQLSTATE `42501` |

An independent comparison found all 11 inquiry records identical before and after the denied writes. The November 13 anonymous read and write probes have their own before-and-after receipts. [Initial access matrix](evidence/anonymous-matrix.json) · [Cleanup](evidence/probe-cleanup.json) · [Policy mapping](POLICY-PAIRING.md)

## Dashboard verification

On November 15 at 06:00 UTC, the signed-in Supabase Policies dashboard showed a **Disable RLS** control under each of the three public tables. The setting was enabled for `offerings`, `inquiries` and `profiles`. A separate catalog query returned `rowsecurity = true` for all three. The initial audit also recorded 28 column grants and seven policies. [Catalog comparison](evidence/catalog-comparison.json)

## Signed-in visual and accessibility checks

A temporary QA account used a real password-authenticated session for these browser checks. It submitted an inquiry as an ordinary user before receiving the admin role for the Manage checks. Chromium exercised each view in light and dark themes at 390 and 1280 CSS pixels.

| View | Combinations passed | Visible keyboard stops per combination | Lowest measured text contrast | axe WCAG A/AA violations |
| --- | ---: | ---: | ---: | ---: |
| My inquiries | 4/4 | 11 | 6.196:1 | 0 |
| Manage | 4/4 | 19 | 7.477:1 | 0 |

Every visible control was keyboard-reachable in order with visible focus. Headings, landmarks, visible labels, linked validation errors and horizontal fit passed. Neither view contained images. Invalid personal-form submissions focused the first invalid field. Keyboard actions cleared admin search and displayed draft offerings and handled inquiries. The test account, profile and inquiry were removed. All 11 pre-existing inquiry records matched the baseline.

The initial signed-out checks covered all four pages in the same two themes and widths. The captures show Home with validation errors. [Light Home](evidence/home-light-390.png) · [Dark Home](evidence/home-dark-390.png)

## Testing checklist

| Required promise | Actual passing test name |
| --- | --- |
| An email the form must accept | accepts a normal email address |
| Missing @ rejected | rejects an address with no @ |
| Empty input rejected | rejects an empty address |
| Own rule: surrounding whitespace | accepts an email padded with surrounding whitespace |
| Helper edge case | an empty search returns every row in the same order |

The suite has six further validator/filter assertions; the [verbose current result](evidence/tests.json) lists all eleven. The learner's first padded-email assertion deliberately expected an error and failed against the real validator, then was corrected to its existing trim contract: [red run](evidence/test-red.json), [green run](evidence/test-green.json). A separate requested validator simplification stayed green, as the lesson permits. Row security, login and the admin gate are not covered by npm test.

## Remaining work

- **External feedback.** The owner will send the live app and repository to two people. Their feedback is pending. The two questions are “What is this page offering?” and “What would you do next, if anything?”
- **Earlier Auth lessons.** The local magic-link round trip and the full signed-in client request sequence, including the forged-owner insert, remain unverified. The cross-account probes above exercised the deployed database directly.
- **Signup-trigger privileges.** Supabase reported WARN 0028/0029 for browser-role `EXECUTE` on `public.handle_new_user()`. An anonymous RPC attempt returned 404/PGRST202. A direct SQL call as the anonymous role returned 0A000 because the function requires a trigger. Real signup created an ordinary profile with the current grants. Authenticated RPC behaviour and signup after any proposed grant restriction still need verification. [RPC attempt](evidence/trigger-rpc-result.json) · [SQL result](evidence/trigger-direct-sql.json) · [Readback](evidence/trigger-diagnostic-readback.json)

The November 13 checkpoint files, Auth test plan and share draft describe that earlier run. This note records the later results. The six SQL files reproduce the setup for a new, empty disposable project. [SQL copy hashes](evidence/sql-copy-map.json)
