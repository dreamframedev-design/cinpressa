# Cinpressa Art Audit — current inventory + placement map

> **Purpose:** establish what art exists today, verify the boss's two complaints at the
> code level, and map every location that could host a considered piece.
> **Method:** read from `D:\cinpressa\src` at commit `b3a5eaf` (branch `main`, clean tree).
> **Written:** 2026-08-03
> **Companion:** `ART_CATALOG_CINRX.md`

---

## 1. Both complaints are literally true. Here is the proof.

### Complaint A — "the only art we have is the same repeated logo over and over"

Correct, and it is structural rather than incidental. `MarkArt` (in `geometry.tsx`)
renders the real 13-petal mark as oversized background art. It or its siblings appear
in **nine** places:

| # | Location | File : line | Form |
|---|---|---|---|
| 1 | Splash / access gate | `app/page.tsx:145` | `MarkArt variant="brand" animate` |
| 2 | Home hero | `app/home/page.tsx:119` | `ConvergenceMark` (the mark, animated) |
| 3 | Home § "Our approach" | `app/home/page.tsx:170` | `MarkArt`, rotated 18°, opacity `.13` |
| 4 | Science § "CinPressa solution" | `app/science/page.tsx:97` | `MarkArt`, rotated 12°, opacity `.14` |
| 5 | News empty state | `app/news/page.tsx:125` | `MarkArt variant="outline"` |
| 6 | Brand page | `app/brand/page.tsx:167` | `MarkArt variant="brand"` |
| 7 | Footer | `site-footer.tsx:83` | `MarkArt`, cropped off right edge, opacity `.07` |
| 8 | Nav (every page) | `site-nav.tsx:78` → `site-logo.tsx:156` | `MarkArt` inside the lockup |
| 9 | **Every interior page header** | `page-hero.tsx:17` → `hero-field.tsx:54` | `MarkArt`, opacity `.30–.42` |

Row 9 is the real problem. `PageHero` → `HeroField` is used by **/about, /science,
/pipeline, /news, /contact** — so five of the six interior pages open with *the same
crop of the same logo in the same lower-right position.*

`hero-field.tsx`'s own docblock states the reasoning plainly:

> *"Interior headers had nothing on the right, so any wash there read as an amorphous
> pale smear. This anchors them instead with an oversized crop of the real mark."*

The mark was reached for **because there was no art to reach for.** It is a
placeholder that hardened into the system. That is exactly the gap to fill.

**Net: the site has one visual idea (the mark) deployed nine times, and zero
commissioned pieces.**

### Complaint B — "the colors are too washed out"

Also correct, and measurable. The palette itself is not the problem — the **deployment
opacity** is.

Every section background is a 6–10% tint of an already-light color:

```css
sky:    #ffffff → #f1f7fd → #e6f1fa   /* section.tsx:24 */
green:  #ffffff → #f5fbf7 → #e9f6ef   /* section.tsx:25 */
indigo: #ffffff → #f6f7fc → #edeff9   /* section.tsx:26 */
```

`#f5fbf7` is **97% luminance**. At a glance these are indistinguishable from white —
the "stack of grey boxes" the comment says they were meant to avoid.

Then the art on top is set at:

| Element | Opacity |
|---|---|
| Home § approach mark | `0.13` |
| Science § solution mark | `0.14` |
| Footer mark | `0.07` |
| Interior header mark | `0.30 / 0.42` |
| Hero radial wash | `0.55` of an already-pale `#BED7EC` |
| Orbit rings | `strokeOpacity 0.11–0.16`, `strokeWidth 0.14` |

**Nothing on the site is drawn above 42% opacity except type and buttons.** The site
is a white page with faint blue-grey ghosting. That is precisely "washed out," and it
is a *usage* problem, not a *palette* problem.

Compounding it: the components lean hardest on the **lightest** third of the ladder —
`pale #BED7EC`, `frost #95DAF8`, `cloud #AADBF6`, `green #AFDBBC`, `stone #A3ABAE`.
The **saturated** end — `cobalt #0473BB`, `ocean #0783C6`, `azure #1596D4`,
`cyan #1EAEE5` — appears almost exclusively as small text accents and diagram strokes,
never as surface or mass.

---

## 2. ⚠ The constraint that must be resolved before Phase 2

Two governing documents forbid changing the palette:

- `D:\cinpressa\PRODUCT.md` §2: *"Never invent a color outside the sheet."*
- `D:\cinrx\BRAND_DIRECTION.md` §4.5: CinPressa's palette is a **"locked external
  brand — never reinterpret, lighten, or substitute."*

The boss wants bolder. The spec sheet is locked. These appear to conflict.

**They don't, and this is the strategic key to the whole project:**

> The brand does not need new colors. It needs its **existing deep colors used at full
> strength, as mass instead of as tint.**

`#0473BB`, `#0783C6`, `#1596D4`, `#2261AD`, `#6771B5` are genuinely saturated colors
sitting unused in the token file. A section grounded in full-strength `#0D2342` with
`#1EAEE5` drawn at 100% on top is dramatically bolder than anything on the site today —
**and adds no hex that isn't already on the spec sheet.**

There is direct precedent for this exact fix in CinRx: the `ember` hairline palette was
retuned when *"the CEO still saw the marquee seams as too faint"* — the answer was
**deeper hue, +saturation, −lightness**, not a new color.

The only tokens I'd propose actually revising are the **derived neutrals**
(`--color-ink`, `--color-deep`, `--color-mist`, `--color-line`), which `PRODUCT.md`
explicitly calls "derived support only" and are therefore *not* spec-sheet-locked.
Specific values will be in `ART_STRATEGY.md`.

**This needs Conner's explicit yes**, because it reframes "bolder palette" as "bolder
deployment of the locked palette." I believe it's the only reading that satisfies both
the boss and the brand lock — but it's his call, not mine.

---

## 3. What already exists and is genuinely good

Important for scope: this site is **not** starting from nothing. There is real
hand-coded craft here that should be protected, not replaced.

| Piece | File | Assessment |
|---|---|---|
| **ConvergenceMark** | `convergence-mark.tsx` (12.8 KB) | Excellent. The four parent ovals were **recovered by least-squares conic fits** to the flattened fragment boundaries, then animated as ovals converging with `mix-blend-mode: multiply` so interior colors are created *optically by the overlaps*. Hover pulls it back apart on a damped rAF follow. This is commissioned-grade work. **Keep.** |
| **DosingCadence** | `dosing-cadence.tsx` (13.7 KB) | The argument *is* the image: 365 daily dots vs. 1–2 annual dots at identical scale. Cascades in calendar order. Has a JS spring particle field. Conceptually the strongest thing on the site. **Keep.** |
| **DuplexBinding** | `duplex-binding.tsx` | mRNA draws in → bases appear → guide strand docks → duplex **zips closed left-to-right** because "hybridisation nucleates and zippers, it does not snap shut." Correct science expressed as correct motion. **Keep.** |
| **EfficacyChart** | `efficacy-chart.tsx` | Solid. ⚠ **Carries a loud PLACEHOLDER CURVES banner — do not publish as-is.** Only four figures are real. |
| **RaasPathway** | `raas-pathway.tsx` | Clean cascade diagram descending the petal ladder. **Keep.** |
| **Mark light sweep** | `globals.css:560` | Soft-light band panning each parent oval's major axis clockwise, one pass / 28s. Luminance-only so brand hues never shift. Genuinely refined. |
| **Reveal system** | `reveal.tsx` + `globals.css` | Well-built: content ships **visible**, `.reveal-pending` is added by JS only below the fold. Nothing depends on JS. Reduced-motion fully honored across ~15 rules. |

**The problem is not quality. It is that every one of these lives in the page *body* as
a diagram, and the page *architecture* — heroes, section grounds, transitions, footer —
is carried entirely by faint logo ghosts.**

That's the actual gap: Cinpressa has good *illustration* and no *art direction*.

---

## 4. Placement map — every candidate location

Ranked by opportunity. `PageHero`/`HeroField` counts once but affects five pages.

### Tier 1 — highest impact

| # | Location | Current state | Why it's the opportunity |
|---|---|---|---|
| **P1** | **Interior page header** (`hero-field.tsx`) — /about /science /pipeline /news /contact | Pale radial wash + logo crop at .30–.42 | **Five pages, one component.** Fixing this alone kills the "repeated logo" complaint. Direct structural analog of CinRx's `HeroRibbon` — and where the blue-wave translation belongs. |
| **P2** | **Home hero** (`home/page.tsx:41–123`) | `ConvergenceMark` + 4 blooms + one pale radial | Mark is excellent but sits on near-empty white. The *field around it* is the washout. |
| **P3** | **Footer** (`site-footer.tsx`) | `bg-deep #0D2342` + rings at .09 + mark at **.07** | **The only dark surface on the entire site** and it's wasted at 7% opacity. Highest contrast headroom available. |

### Tier 2 — strong candidates

| # | Location | Current state | Note |
|---|---|---|---|
| **P4** | Section grounds (`section.tsx` TONES) | Three 6–10% tints | Where "washed out" is *manufactured*. A dark/inverted tone is the single biggest lever. |
| **P5** | Science § RNA interference / Mechanism | `DuplexBinding`, `RaasPathway` on `indigo`/`sky` | The most science-rich page; art could carry the *mechanism* concept behind the diagrams. |
| **P6** | Pipeline § "From IND to first-in-human" | Plain `dl` table on `indigo` tint | Terminal section, no art at all. Time/duration lives here. |
| **P7** | Section transitions (between every `<Section>`) | Hard color seams | CinRx uses hairlines + feather-fades. Cinpressa has nothing. Cheap, high-polish. |
| **P8** | Home § "The challenge" (`tone="sky"`) | `StatBand` — 1.4B / 700M / ~70% | The problem statement. Currently three numerals on near-white. |

### Tier 3 — lower priority

| # | Location | Note |
|---|---|---|
| P9 | News empty state | Logo outline placeholder; low traffic |
| P10 | About § disciplines | Eight colored dots — already a small palette moment |
| P11 | Splash / access gate | Pre-launch only; removed at go-live |
| P12 | Contact page | `HeroField mark={false}` — inherits P1's fix automatically |
| P13 | Brand page | Correctly logo-centric; leave alone |

---

## 5. Brand facts to build on

- **Type:** Montserrat as a **Gotham stand-in** (spec sheet calls for Gotham Book/Medium). A real Stem font source is sitting unused at `stem-font-source.zip` / `src/fonts/stem-extralight.woff2`, used only for the wordmark.
- **The mark's structure is an asset:** four overlapping ovals flattened into 13 boolean fragments, with the four parents recovered numerically in `MARK_OVALS` (center, semi-axes, tilt, and an arc-pair path for each). **Overlap-as-meaning is already the brand's native idea** — and `multiply` blending is already proven in `ConvergenceMark`.
- **Orange `#F9A81A` is punctuation only**, one moment per view. ⚠ But CinRx's `BRAND_DIRECTION.md` §4.5 asserts *"orange belongs to CinCor, purple to CinPressa."* The orange is in CinPressa's own locked spec sheet (it's the dose petal), so I read the CinRx note as portfolio-card guidance rather than a ban — **flagging for Conner to confirm.**
- **The subject matter is different from CinRx's**, and that's the "familiar yet different" answer: CinRx's art is *many becoming one*. CinPressa is **one molecule, one target, one program** — its subject is **duration**: a line held flat over 119 days, suppression at the source, a year collapsed to two doses. Nothing in CinRx's vocabulary is about time.

---

## 6. Constraints carried into Phase 2

- **Perf envelope** (CinRx house standard): ~30fps, backing ≤1500px, DPR ≤1.5, `IntersectionObserver`-paused off-screen, one static frame under `prefers-reduced-motion`, static on touch/coarse pointer.
- **No-JS baseline:** the Reveal system ships content visible. Any new piece must not regress this.
- **Contrast law** (`PRODUCT.md` §3): blue 6.6:1 and indigo 4.6:1 clear AA; cobalt 5.0:1; azure/ocean large-text only; **sky, green, and lighter are surface-only, never text on white.**
- **Bundle:** a piece that could be a 4KB SVG must not ship 30KB.
- **Stack:** Next.js 16 App Router + Tailwind v4. ⚠ **No Framer Motion, no Lenis** in `package.json` — unlike CinRx. Every current animation is CSS + small rAF islands. Adding a motion library is a real decision, not a default.
- **Do not publish:** `EfficacyChart` placeholder curves, `TeamGrid` (no real names). Both correctly marked. Not art-scope, but they gate launch.

---

## 7. Open questions for Conner

1. **Palette lock** — confirm the reframe in §2: deploy the *existing* deep tokens at full strength rather than inventing hexes, plus revising the four derived neutrals. This is the whole basis of the "bolder" answer.
2. **Orange** — CinPressa's own spec sheet has `#F9A81A`; CinRx's doc says orange belongs to CinCor. Which governs?
3. **Dark surfaces** — is CinPressa allowed to go dark beyond the footer? `PRODUCT.md` says *"this brand lives in daylight blues on white."* A dark section is the biggest available bolder-lever, but it contradicts that line. **Needs a ruling.**
4. **Motion library** — add Framer Motion (matches CinRx, ~30KB) or stay hand-rolled CSS + rAF (matches Cinpressa's current build, 0KB)? My lean is **stay hand-rolled**; it's also the stronger anti-slop story.
5. **Gotham** — is a real Gotham license available? Type is doing a lot of work in this system.

---

*Next deliverable: `ART_STRATEGY.md` — 4–7 proposed pieces, after sign-off on §7.*
