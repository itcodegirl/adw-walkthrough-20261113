# Jenna Studio

A small portfolio site for a web developer who serves local businesses. It started as a two-page static page and grew, one reviewed task at a time, into a four-page app that reads services from a database, saves enquiries, and lets customers sign in by email to see their own enquiries. An admin can review and mark enquiries handled.

The hosted app passed **10/10 AI Developer Workflow capstone criteria** by November 15, 2026. The separate two-person feedback step is pending. [Try the live demo](https://adw-walkthrough-20261113.vercel.app) · [Read the ten checks and their results](docs/EVIDENCE.md)

## Stack

- Vite 8 for dev server and build, with plain HTML, CSS, and JavaScript ES modules. No framework.
- Supabase JS 2 as the browser client for data and auth.
- Vitest 5 for unit tests.
- Local development was done on Node 22 and npm 10.

## Clone, install, run

```
git clone https://github.com/itcodegirl/adw-walkthrough-20261113.git adw-walkthrough
cd adw-walkthrough
npm ci
# Configure the two variables listed below before starting.
npm run dev -- --host 127.0.0.1 --port 50795
```

Use the lockfile with `npm ci` and configure your own disposable Supabase project before starting Vite.

Other scripts:

```
npm run build     # build all four pages to dist/
npm run preview   # serve the build locally
npm test          # run the unit tests
```

For local login, add the origin you use to your project's Supabase Auth redirect allowlist. The walkthrough configured `http://localhost:50795` and `http://127.0.0.1:50795`, with the hosted app as its Site URL. The email-link round trip was verified on the hosted app. The local round trip remains untested.

## Environment variables

The browser client in `src/supabase.js` reads two variables. Vite exposes them because of the `VITE_` prefix.

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Set them in a gitignored `.env.local` for local work and in the hosting provider's settings for each deployed target. No values appear in this repository. Both values ship to every visitor's browser, so they are public identifiers; what a holder can do is limited to what the database policies allow an anonymous or signed-in user. The project's secret service key is not used anywhere in this app.

## Pages

**Home, `index.html`.** Hero, selected work, services, process, FAQ, about, contact. Services are read from the `offerings` table, published rows only, ordered by sort order, and shown with a count. A search field filters those loaded rows by title in the browser, ignoring case, with no request while typing; Clear search restores the list and returns focus. The contact form validates name, email, and message, then inserts exactly those three fields. If a session exists at submit time the insert also carries that session's user id; signed out, the key is absent. A My inquiries section appears only for a signed-in session and lists that account's own rows, newest first, as Received or Answered.

**About, `about.html`.** About Jenna and the same FAQ.

**Manage, `admin.html`.** Gated on the shared session. Signed out, it shows a sign-in prompt and makes no private queries. Signed in, it reads the account's own `profiles` row for `is_admin` and shows the role honestly, including missing-profile and error cases. Offerings are listed with title search and a Published/All control that refetches. For an admin the page also lists inquiries newest first with an Unhandled/All filter and a Mark handled button that updates one row by id and reports success only when that row comes back. The gate is a UX gate; the database policies are what protect the data.

**Login, `login.html`.** One email field. Submit calls `signInWithOtp` with a redirect to the current origin, shows pending, success, and error states, and then disables the button for a cooldown before a resend. A provider rate limit is reported honestly with a longer wait.

**Shared shell.** `src/shell.js` renders the header, nav, and footer on every page. `src/auth.js` holds one auth subscription per page, reads the initial session once with a revision guard, and exposes the state to the rest of the page. The header shows Sign in when signed out and an email greeting with Sign out when signed in.

## What the walkthrough verified

- Signed-out visitors read published offerings and submit an enquiry. Manage shows its sign-in prompt, and direct anonymous requests cannot read private inquiries or drafts.
- Three test accounts signed in through real emailed links. An admin read the private inbox and marked an inquiry handled. Two ordinary users each submitted and saw their own inquiry. With each verified user's database permissions, reading or updating the other inquiry by ID returned zero rows in both directions.
- Signing out cleared the header and restored the Manage sign-in prompt on a fresh visit. A separate admin check also confirmed that a reload preserved the active session and signing out cleared the private list.
- The Supabase dashboard showed row-level security enabled on all three public tables. Browser checks passed in light and dark themes at 390 and 1280 CSS pixels, across 16 signed-out and eight signed-in combinations.

The evidence note records the test methods, the signup-trigger permission follow-up, and the earlier lesson checks still open. The walkthrough used emulated viewport widths. Two-person feedback is pending. [Capstone evidence](docs/EVIDENCE.md)

## Tests

`npm test` runs eleven pure-function tests in `src/validate.test.js` and `src/filter.test.js`: the contact validators and the title filter. They cover no DOM, network, auth, or database policy behaviour.

## Database setup

The six numbered `.sql` files in `sql/` are the exact taught schema, grants, policies, and signup trigger, kept for reproducibility. Apply them in numeric order to a new, empty, disposable Supabase project only. Do not replay them against the current project, which is already provisioned. They contain no real user id and no admin seed.

The trigger creates each new profile with `is_admin` false. Once a real account has signed in and its profile exists, promote that exact id; insert a profile by hand only if the trigger did not create one. Public content such as offerings must be seeded by the project owner (this run used the connected SQL API); the app does not edit offerings.

## Further reading

- [docs/DECISIONS.md](docs/DECISIONS.md) — why things were built the way they were.
- [docs/EVIDENCE.md](docs/EVIDENCE.md) — what was actually verified, and how.
- [docs/REVIEW.md](docs/REVIEW.md) — the six-question review record.
- [Original Auth test plan](docs/RESUME-AUTH.md) — the November 13 plan for the later hosted checks.
