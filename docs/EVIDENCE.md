# Capstone evidence — 13 November 2026

The app has real anonymous data paths and a repeatable local-to-hosted workflow. It has **not** earned an all-ten-yes capstone. This is a simulated learner execution from a synthetic prerequisite portfolio, not representative human validation. All evidence below is dated; browser interactions use Chromium automation, not physical devices or screen-reader research.

## Ten live checks

A No means the full authored condition is not proven; it does not by itself mean the implementation failed.

| # | Full condition met? | What the receipts establish |
| --- | --- | --- |
| 1 | Yes | Live public services render. A real signed-out form POST saved exactly one inquiry with a null owner and false handled flag. [Request](evidence/live-submit.json), [owner readback](evidence/owner-after-submit.json). |
| 2 | No — blocked | No authorized test inboxes were available. No real magic-link delivery, established session or sign-out proof. |
| 3 | Yes | Direct navigation to Manage shows the sign-in prompt and sends zero private queries. Independent anonymous requests outside the UI gate read published rows, return no drafts, and cannot read inquiries. [Gate](evidence/signed-out-gate.json), [matrix](evidence/anonymous-matrix.json). |
| 4 | No — partial | All 11 fresh anonymous probes match predictions. Owner readback proves existing rows unchanged; only the allowed Probe was added, then deleted by exact ID. Real A positive controls and B/C isolation are still blocked. [Owner comparison](evidence/owner-after-hostile.json), [cleanup](evidence/probe-cleanup.json). |
| 5 | No — inspection method | Dated authenticated SQL catalog shows RLS true on all three app tables. The literal dashboard-inspection step was unavailable. [Catalog](evidence/catalog.json). |
| 6 | Yes — source scope | All seven database call sites use named columns and intended filters/minimal writes. Authenticated paths were reviewed but lack runtime identity proof. [Query audit](QUERY-AUDIT.md). |
| 7 | Yes | Ignore, history, references and dist positive controls succeed; authored secret-value searches return no matches. These are bounded pattern checks, not a universal guarantee. [Scan](evidence/secrets.json). |
| 8 | Yes | Eleven pure-function tests pass. They import actual validators/filter logic; no Auth, RLS or DOM coverage is claimed. [Current run](evidence/tests.json). |
| 9 | No — partial | All 16 signed-out page/theme/width combinations pass keyboard, text contrast, labels, landmarks/headings and overflow assertions; no token strays. Authenticated admin/personal-view interactions remain unverified. [Floor](evidence/floor-summary.json), [tokens](evidence/tokens.json). |
| 10 | Yes — private artifact | Narrated commits, runnable README, two defended architecture decisions and a documented refusal are present. [Decisions](DECISIONS.md), [final review](REVIEW.md). Access to this intentionally private repo is required. |

The challenge's broader public-repository and share-to-two requirements are not met. [Share text](SHARE-DRAFT.md) is drafted but unsent; no recipients were supplied. No identity, session or human reviewer response was invented to fill these gaps.

## Fresh five-pass audit

1. **Schema:** 16 columns, four constraints, the signup trigger/function, and zero Auth users/profiles/admins were inspected. Current table grants exactly match the 4.4 list: 28 tuples; all seven policies match that receipt. [Exact comparison](evidence/catalog-comparison.json).
2. **Locks:** Two published rows are the read positive control; the allowed inquiry insert is the write positive control. Eight forbidden requests return permission error 42501; draft read returns an empty array. The full owner baseline of four offerings and nine inquiries is restored after deleting only the temporary Probe. This proves anonymous outcomes, not A/B/C outcomes.
3. **Queries:** The source audit identifies every selected field, view filter, minimal payload and error branch. Service search adds no database request while typing. Authenticated query execution is still pending.
4. **Secrets:** Named environment references, ignored local configuration, committed history and built bundle were checked with positive controls. No secret/service-role key was fetched or used by this app.
5. **Admin flows:** The actual signed-out gate is verified. Admin drafts, inbox filtering and handled updates require a real admin identity; those remain blocked. The earlier public read-only Manage filtering/empty-state loops do not count as current authenticated admin proof.

## Auth checklist

- **Blocked:** A new address signs in from a real inbox with the magic link (the first sign-in creates the account), and the header shows the signed-in state.
- **Blocked:** Sign out returns the header to signed-out, and the admin page shows its sign-in prompt again.
- **Pass:** Signed out, the admin page shows no drafts and no inquiries; typing the admin address by hand gets the same result as clicking to it.
- **Blocked:** Second account: its direct inquiry read returns only its own rows, never anyone else's.
- **Blocked:** Second account: marking an inquiry handled changes nothing (re-read the row to confirm).
- **Blocked:** Admin account: drafts and the inquiry inbox load, and mark handled works.
- **Source/catalog pass; real actor proof pending:** Every gated thing in the app has a named policy behind it; the page gate is courtesy, the policy is the lock. [Current pairing table](POLICY-PAIRING.md).

The login UI was exercised with the real SDK but intercepted Auth transport, including pending, error, cooldown and simulated success responses. Those tests prove UI behavior only. Provider delivery, real redirects, persistence and account isolation require [the resume procedure](RESUME-AUTH.md).

## Testing checklist

| Required promise | Actual passing test name |
| --- | --- |
| An email the form must accept | accepts a normal email address |
| Missing @ rejected | rejects an address with no @ |
| Empty input rejected | rejects an empty address |
| Own rule: surrounding whitespace | accepts an email padded with surrounding whitespace |
| Helper edge case | an empty search returns every row in the same order |

The suite has six further validator/filter assertions; the [verbose current result](evidence/tests.json) lists all eleven. The learner's first padded-email assertion deliberately expected an error and failed against the real validator, then was corrected to its existing trim contract: [red run](evidence/test-red.json), [green run](evidence/test-green.json). A separate requested validator simplification stayed green, as the lesson permits. Row security, login and the admin gate are not covered by npm test.

## Visual receipts and limits

[Light Home](evidence/home-light-390.png) and [dark Home](evidence/home-dark-390.png) show the final public layout and associated validation errors. The summary preserves visible keyboard-stop counts and measured text contrast for all four pages at 390 and 1280 pixels. Hidden admin labels/headings may appear in raw DOM inventory; they are not claimed as authenticated interaction evidence. There are no images in this minimal app, so image-alternative checks are vacuous.

The exact taught setup SQL is archived with a [hash map](evidence/sql-copy-map.json). It is for a new empty disposable project, not a migration to re-run on the current database. The final function-adviser investigation and remaining privilege follow-up are recorded below; these table receipts alone are not a clean-adviser claim.

## Remaining least-privilege follow-up

The final Supabase adviser raised WARN 0028/0029 because anon and authenticated have EXECUTE on the SECURITY DEFINER `public.handle_new_user()` function. The catalog identifies it as a trigger-returning function with fixed search_path. A real anonymous RPC attempt returned 404/PGRST202 after a successful public-read positive control; a separate direct SQL call under the anon role returned 0A000, “trigger functions can only be called as triggers.” The diagnostic readback confirmed the owner role restored, no browser-role CREATE in public, zero Auth users/profiles and all existing rows unchanged. No privileges were changed.

This is an open least-privilege follow-up, not a demonstrated data-exposure vulnerability or a confirmed blocking curriculum defect. Authenticated RPC behavior and real signup compatibility of any future revoke remain unverified. Preserve the warning; investigate a minimal EXECUTE restriction and test real signup before treating it as resolved. [Anonymous RPC receipt](evidence/trigger-rpc-result.json), [direct SQL receipt](evidence/trigger-direct-sql.json), [unchanged readback](evidence/trigger-diagnostic-readback.json).
