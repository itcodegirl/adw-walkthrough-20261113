# Jenna Studio

A small portfolio site for a web developer who serves local businesses. It started as a two-page static page and grew, one reviewed task at a time, into a four-page app that reads services from a database, saves enquiries, and has the code paths for magic-link sign-in and an admin inbox.

This is a disposable learning project with a private repository and a publicly reachable [test deployment](https://adw-walkthrough-20261113.vercel.app). It has not completed the capstone or been shared with external reviewers. Read the verification limits below before relying on its signed-in paths.

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

Cloning requires access to the private repository. Use the lockfile with `npm ci`; then configure your own disposable project before running the app.

Other scripts:

```
npm run build     # build all four pages to dist/
npm run preview   # serve the build locally
npm test          # run the unit tests
```

The port matters. The project's Supabase Auth redirect allowlist was attested by the project owner to contain `http://localhost:50795` and `http://127.0.0.1:50795`, with the site URL set to the live alias. Those entries are configuration, not proof: no sign-in redirect has been verified at runtime. The Vite default port, 5173, has not been confirmed as allowed.

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

## What is verified and what is not

Verified with real data on the public paths: two published offerings load and search; a validated anonymous enquiry saves with exactly name, email, and message, a null user id, and handled defaulting to false; all four signed-out pages pass the contrast and keyboard floor in both themes at emulated widths of 390 and 1280 pixels; signed-out Manage shows the prompt and sends no private queries; direct anonymous reads and writes outside the public grants are refused while the public controls succeed.

Blocked because authorized test inboxes and working inbox access were unavailable. The Auth user and profile counts are zero. The following have code paths but have not been tested for real:

- Magic-link email delivery, local and live redirects, session persistence, header state, and sign-out.
- A real admin profile, admin views of drafts and the inbox, and Mark handled.
- Isolation between accounts B and C: own rows, cross-account reads, forged-owner inserts, and mutations.
- The signup trigger firing on a real signup.

Intercepted one-time-password UI tests were run against the login page. They show the form behaves, and nothing more: they do not prove email delivery or login. Of the ten capstone checks, the ones that depend on a real session are not met, so the capstone is not complete. Authenticated dashboard inspection, the public-repository condition, and sharing with two real reviewers are also outstanding. The [evidence note](docs/EVIDENCE.md) records every rubric row, including limitations of signed-out floor checks.

A final Supabase adviser also flags browser-role EXECUTE on the signup trigger function. Anonymous RPC and direct SQL probes could not invoke it; the remaining least-privilege follow-up and limits are documented in [the evidence note](docs/EVIDENCE.md). No privilege change was applied.

## Tests

`npm test` runs eleven pure-function tests in `src/validate.test.js` and `src/filter.test.js`: the contact validators and the title filter. They cover no DOM, network, auth, or database policy behaviour.

## Database setup

The six numbered `.sql` files in `sql/` are the exact taught schema, grants, policies, and signup trigger, kept for reproducibility. Apply them in numeric order to a new, empty, disposable Supabase project only. Do not replay them against the current project, which is already provisioned. They contain no real user id and no admin seed.

The trigger creates each new profile with `is_admin` false. Once a real account has signed in and its profile exists, promote that exact id; insert a profile by hand only if the trigger did not create one. The resume steps are in [docs/RESUME-AUTH.md](docs/RESUME-AUTH.md). Public content such as offerings must be seeded by the project owner (this run used the connected SQL API); the app does not edit offerings.

## Further reading

- [docs/DECISIONS.md](docs/DECISIONS.md) — why things were built the way they were.
- [docs/EVIDENCE.md](docs/EVIDENCE.md) — what was actually verified, and how.
- [docs/REVIEW.md](docs/REVIEW.md) — the six-question review record.
- [docs/RESUME-AUTH.md](docs/RESUME-AUTH.md) — how to pick up the blocked auth work.
