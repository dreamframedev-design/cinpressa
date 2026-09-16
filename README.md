# CinPressa Pharma

Website for **CinPressa Pharma**, a CinRx portfolio company advancing **CIN-111**,
a best-in-class, long-acting AGT siRNA for hypertension.

## Structure

The site is live. Every route is public:

- `/`: redirects to `/home`
- `/home`: challenge, approach, pipeline + news teasers
- `/about`: leadership, track record, the CinRx model
- `/science`: unmet need, mechanism (RAAS pathway diagram)
- `/pipeline`: CIN-111 preclinical data, Phase 1 plan, capital & timeline
- `/news`: pre-launch newsroom
- `/contact`: inquiry form (`/api/contact`)

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
