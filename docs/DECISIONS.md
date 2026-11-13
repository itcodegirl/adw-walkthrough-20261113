# Architecture decisions and remaining work

Jenna Studio is a small site for a web developer helping local businesses understand available website services and send an enquiry. This disposable walkthrough app adds database-backed services, a public enquiry form, and implemented account/admin views to a synthetic two-page Course 1 portfolio.

## 1. Put column privileges and row policies in place before connecting the browser

The browser receives public configuration, so the UI cannot be the data boundary. The database restricts both the fields a caller may name and the rows that caller may reach; queries still name their columns and state the view's intent. Public visitors can read published services and insert only the three enquiry fields. Ordinary signed-in ownership and the admin exception are expressed separately.

The fresh anonymous matrix proves the public positive controls and private-read/admin-write refusals, and the owner comparison proves denied writes left existing rows unchanged. The current catalog has 28 column-grant rows and 7 policies, with RLS enabled on all 3 app tables. These receipts support the anonymous boundary; they do not replace the still-missing real admin/B/C tests. See [the evidence note](EVIDENCE.md), [anonymous matrix](evidence/anonymous-matrix.json), and [catalog](evidence/catalog.json).

## 2. Keep the palette and shared shell central

The same header/footer and semantic layout are reused across all four pages. Colors, spacing and typography come from shared CSS tokens; dark mode changes palette values instead of duplicating component styles. This lets a feature such as service search inherit the established focus, spacing and contrast treatment.

The final live floor checked the signed-out states of Home, About, Manage and Login at 390 and 1280 widths in both themes. Its computed-style and keyboard receipts, plus the zero-stray-value search, are linked in the [evidence note](EVIDENCE.md). These are browser-emulated checks, not physical-device or screen-reader research.

## Review changed what shipped

During the explicit rejection drill, an alternative proposal replaced the hero with “Nova Studio” and an inline hot-pink color. I declined it because it changed the brief and bypassed the token system; the source hashes stayed unchanged. The tighter re-brief added a useful search hint instead. A separate real feature review caught Clear search appearing only for no-match results and corrected it before the edit was accepted. See [the review artifact](REVIEW.md).

## What is still unfinished

This is not an all-ten-yes capstone or a public launch. Real inbox delivery, local/live redirects, sessions, sign-out, signup-trigger firing, admin actions and B/C ownership isolation remain unverified because no authorized test inboxes/accounts were available. The repository is intentionally private; no two-person share has been sent. See [the exact resume sequence](RESUME-AUTH.md), especially the already-installed trigger and later admin-profile promotion.

The checkpoints made anonymous grants/policies, token checks, tests and Git deployment familiar to repeat. Real identity verification remained the substantial unfinished work; source review and intercepted UI responses cannot resolve it. Optional Google login, custom SMTP, saved offerings and production payments were not added. The next step is to complete the missing identity and reviewer evidence before expanding the product.

A final adviser warning about browser-role EXECUTE on the signup trigger function remains a least-privilege follow-up. Anonymous RPC and direct SQL did not invoke it, and rows were unchanged; real authenticated/signup verification is still missing. See the final investigation in [EVIDENCE.md](EVIDENCE.md). This is a known open review item, so no zero-debt launch claim is made.
