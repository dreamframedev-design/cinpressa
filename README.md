# CinPressa Pharma

Website for **CinPressa Pharma**, a CinRx portfolio company advancing **CIN-111**,
a best-in-class, long-acting AGT siRNA for hypertension.

## Structure

The public **splash** (`/`) is a password gate. Entering the access code unlocks
the full build, which is held behind that gate until launch:

- `/home`: challenge, approach, pipeline + news teasers
- `/about`: leadership, track record, the CinRx model
- `/science`: unmet need, mechanism (RAAS pathway diagram)
- `/pipeline`: CIN-111 preclinical data, Phase 1 plan, capital & timeline
- `/news`: pre-launch newsroom
- `/contact`: inquiry form (`/api/contact`)

## Access gate

A soft "coming soon" lock, not real auth. It keeps the in-progress build private.

- Set the password with the `SITE_PASSWORD` environment variable
  (`.env.local` locally; a Vercel Environment Variable in production).
- The default fallback is `msc123`. **Override it with a private value before
  wide sharing.** Rotating `SITE_PASSWORD` logs everyone out.
- The typed password is never stored in the browser: a correct entry sets an
  httpOnly cookie holding an opaque token derived from the password.
- `src/proxy.ts` protects every full-build route and redirects locked visitors
  back to the splash; `src/lib/access.ts` holds the shared logic.

When the site is ready to go public, remove the route matchers in
`src/proxy.ts` (or delete the file) and point `/` at the full home.

## Stack

- Next.js 16 (App Router, RSC, Turbopack)
- Tailwind CSS v4
- Montserrat (Gotham stand-in per the brand spec sheet)

## Brand

Colors and the mark follow the official CINPRESSA Logo Spec Sheet (locked, never
reinterpret):

- Core blue `#2261AD` · Sky (wordmark) `#3AAED8` · Orange `#F9A81A` (punctuation only)
- "The hairline is the brand": 1px rules, dashed orbits, no thick decorative borders.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

Deployed on Vercel.
