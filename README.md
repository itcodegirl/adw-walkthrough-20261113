# Jenna Studio

A small portfolio site for a web developer serving local businesses. Built with Vite, plain HTML, CSS, and JavaScript, with Supabase for data.

## Pages

- `index.html` — home: hero, selected work, services (read from the database), process, FAQ, about, and a contact form that saves inquiries.
- `about.html` — about Jenna and the FAQ.
- `admin.html` — read-only manage view of offerings. Public page; data access is limited by database policy.

## Configuration

The browser client is created in `src/supabase.js` from two environment variables. Vite exposes them because of the `VITE_` prefix.

Create a file named `.env.local` in the project root (it is gitignored) with placeholders replaced by your own project's values from the Supabase dashboard:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The real values are never committed. This README uses placeholders on purpose.

### What these values can do

Both values ship to every visitor's browser, so treat them as public identifiers, not secrets. Anyone holding them can do exactly what an anonymous visitor can do and nothing more: read published offerings and insert an inquiry. Everything else is refused by row-level security policies and column grants on the database.

The project's secret service key is not used anywhere in this app. It belongs server-side only, and this app has no trusted server yet.

## Scripts

```
npm run dev       # start the dev server
npm run build     # build to dist/
npm run preview   # serve the build locally
```
