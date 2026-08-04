# Cinpressa Art Strategy

> **Status:** revised per Dispatch rulings 2026-08-03. Awaiting approve/redirect. No code written.
> **Reads with:** `ART_CATALOG_CINRX.md` (reference universe) · `ART_AUDIT_CINPRESSA.md` (current state)

---

## 0. Rulings applied — and three deltas that need a human

Dispatch ruled on four open questions. **Three reverse answers Conner gave directly in
the same session.** I've implemented Dispatch's calls; the deltas are logged here so
nobody discovers them in a review.

| # | Conner said | Dispatch ruled | Status |
|---|---|---|---|
| 1 | 1–2 dark showpieces | 1–2 dark showpieces, **reserved for showpieces not utility surfaces** | ✅ agree — refined placement |
| 2 | *"don't go too insane here but you can do option 1"* (= **no new hex**, derived neutrals only) | Treat docs as updatable; **propose formal hex amendment**. Follow-up: **build Tier A only**, Tier B logged pending Jason | ⚠ partially reversed — **Tier A built, Tier B documented not implemented**. Net effect matches Conner's answer. |
| 3 | Stay hand-rolled | **Framer Motion** where React interop matters; no site-wide Lenis | ⚠ **reversed** — implemented, see §3 |
| 4 | *"it should be clear what cinpressa's colors are vs cinrx. we're working on cinpressa"* (= orange stays) | **Indigo governs site-wide art**; orange contained to dose semantics **and any direct quotation of the mark's petal set** | ⚠ **reversed** — implemented, see §4 |

Everything contested is built to be **cheap to reverse**: the accent is one token, the
palette shift is one token block, and Framer Motion touches exactly one file.

---

## 1. The through-line *(unchanged)*

> **CinRx's art is about many becoming one** — confluence, braid, constellation,
> hub-and-spoke. Every piece resolves a plurality into a center. That's a holding
> company's self-image.
>
> **CinPressa is one molecule, one target, one program.** No plurality to resolve. Its
> subject is **duration** — a line held flat over 119 days, suppression at the source, a
> year collapsed into two doses.

Nothing in CinRx's vocabulary is about time. That's the familiar-yet-different answer at
the level of *subject*, not styling.

**Two primitives:** the **lens** (the mark's four parent ovals, already recovered by
least-squares conic fit in `MARK_OVALS`, overlaps generating color via `multiply`) and
the **held line**.

**House rule:** quiet-under-copy / full-strength-in-the-open. A mask takes art to
near-zero under the copy column so it can run at 100% everywhere else. This is what
*permits* boldness — the current site is faint everywhere.

---

## 2. Palette — formal brand-direction amendment

**Ruled:** propose specific hex shifts with per-color rationale, as an amendment rather
than working around stale docs.

### ⚠ One caveat that isn't a docs problem

`PRODUCT.md` and `BRAND_DIRECTION.md` are ours and can be amended freely. But
`BRAND_DIRECTION.md` §4.5 isn't inventing CinPressa's palette — it's **transcribing the
official CINPRESSA Logo Spec Sheet**, and that PDF is sitting in this repo
(`CINPRESSA Logo Spec Sheet (3).pdf`). The core four and the icon ladder are the values
the mark is actually drawn from — `MARK_PETALS` in `geometry.tsx` is those exact hexes.

So the amendment splits into two tiers with different approval paths:

- **Tier A — ours.** Derived neutrals, section tones, opacity rules. Amend and go.
- **Tier B — the client's.** The core four + ladder. Changing these means the logo
  artwork and the spec sheet disagree. **Needs the brand owner (Jason), not a doc edit.**

Tier A alone delivers most of the boldness. Tier B is proposed below as requested, held
pending brand-owner sign-off. Shifts are deliberately moderate — they read as the same
colors with conviction, per Conner's *"don't go too insane."*

### Tier A — ours, amend now

| Token | Current | Proposed | Rationale |
|---|---|---|---|
| `--color-line` | `#DCE7F1` | **`#CBDCEB`** | *"The hairline is the brand"* — but at `#DCE7F1` on white it's invisible. Highest-leverage token on the list. |
| `--color-ink` | `#14304F` | **`#0E2440`** | Headline ink reads hazy. Deeper, still blue-family, not black. |
| `--color-deep` | `#0D2342` | **`#08192F`** | The dark ground. Showpieces need contrast headroom the current value doesn't give. |
| `--color-mist` | `#F4F8FC` | **`#EDF4FA`** | Currently indistinguishable from white. |
| `--color-body` | `#46586B` | unchanged | Contrast is good. |
| `--color-muted` | `#5B6E83` | unchanged | Same. |

**Section tones** (`section.tsx`) — where "washed out" is manufactured:

| Tone | Current end-stop | Proposed |
|---|---|---|
| `sky` | `#E6F1FA` | **`#D8E9F7`** |
| `green` | `#E9F6EF` | **`#DDEFE4`** |
| `indigo` | `#EDEFF9` | **`#E1E5F4`** |
| `deep` | `#0D2342` | **`#08192F`** |

**The opacity rule — biggest single lever.** Structural art draws at **0.45–1.0** in
open space, masking down only under copy. Nothing on the site currently exceeds 0.42
anywhere. That one number *is* the boss's complaint.

### Tier B — spec-sheet colors · RECOMMENDED, NOT IMPLEMENTED

> **Status:** requires brand-owner (Jason) approval. Conner will run that conversation
> when ready. **Nothing in this table is in the code** — the build ships Tier A only, and
> nothing downstream depends on Tier B landing.

| Color | Current | Proposed | Rationale |
|---|---|---|---|
| Core blue | `#2261AD` | **`#0D57A8`** | s 67%→86%, l 41%→35%. Same hue, real conviction. The workhorse — this shift is felt everywhere. |
| Core green | `#AFDBBC` | **`#79C79A`** | The washiest color in the set (s 36%, l 77%). Surface-only, so deepening costs no legibility and gains a lot of presence. |
| Core indigo | `#6771B5` | **`#4E58A8`** | Now carrying site-wide accent duty per §4 — needs more weight to function as punctuation. |
| Sky | `#3AAED8` | **`#1D9FD0`** | Wordmark color; currently the palest "real" blue. |
| Pale | `#BED7EC` | **`#A6C9E4`** | Used constantly as borders/chips at low alpha; near-white today. |
| Core orange | `#F9A81A` | unchanged | Already saturated; scope-limited per §4. |
| Stone | `#A3ABAE` | unchanged | Neutral, doing its job. |
| Ladder (`#0473BB`…`#AADBF6`) | — | unchanged | Already the saturated end. The fix is *using* them as mass, not changing them. |

**Doc updates required on approval:** `PRODUCT.md` §Design Principles 2–3 ·
`D:\cinrx\BRAND_DIRECTION.md` §4.5 · `README.md` §Brand · `MARK_PETALS` in
`geometry.tsx` if Tier B lands (the mark artwork itself would need regenerating).

### The six the brief asked for

| Role | Value |
|---|---|
| primary | `#0D57A8` *(Tier B)* / `#2261AD` *(today)* |
| primary-deep | `#0473BB` deployed as **mass**, on `#08192F` ground |
| accent | **`#4E58A8` indigo** *(changed — see §4)* |
| accent-deep | `#95DAF8` frost on dark grounds *(see §4 problem)* |
| ink | `#0E2440` |
| ground | `#08192F` dark / `#FFFFFF` light |

---

## 3. Motion stack

**Ruled:** Framer Motion where React interop matters; hand-roll CSS + rAF for simple
things; Lenis only if a piece genuinely needs sub-pixel scroll smoothness.

Applying that rule honestly to these five pieces:

| Piece | Verdict |
|---|---|
| 1 · The Held Line | **Hand-rolled.** Canvas 2D + rAF. No React state, no interop. FM adds nothing. |
| 2 · Four Lenses | **Static SVG.** No motion at all. |
| 3 · The Horizon | **CSS.** One keyframe, reusing the proven `mark-light-band` technique. |
| 4 · The Ground | **CSS tokens.** No motion. |
| 5 · Source | **Framer Motion.** ✅ Genuine interop case — scroll-scrubbed progress into React render state. `useScroll` + `useTransform` is cleaner and less bug-prone than a hand-rolled scroll listener + rAF + IntersectionObserver. |

**Net: Framer Motion adopted, scoped to one file.** Tree-shaken to the scroll hooks.
**No Lenis** — correct call; it's the strongest stylistic tie to CinRx and adopting it
site-wide would close exactly the gap we're trying to hold open. Piece 5 is scrubbed to
native scroll and doesn't need sub-pixel smoothing.

---

## 4. Accent — indigo governs, orange contained

**Ruled:** purple/indigo governs site-wide art; orange `#F9A81A` stays a product-level
semantic for the dose specifically and doesn't leak into hero art, gradients, or
transitions.

**Implemented as a single token** — `--color-accent: #4E58A8`. Every piece references
the token, never a literal. Reversal is one line.

**Orange is retained in exactly two cases** (refined ruling):

1. **Dose semantics** — `DosingCadence` (the 1–2 annual doses), `DuplexBinding` where
   the dose is depicted.
2. **Any direct quotation of the mark's petal set** — `ConvergenceMark`, `SiteLogo`,
   `MarkArt variant="brand"`. Orange is physically `MARK_PETALS[1]`; suppressing it while
   rendering the mark would misrepresent the artwork.

**Removed everywhere else:** all five new pieces, ambient hero art, wave gradients,
section seams, and the footer accent rule (`site-footer.tsx:94`, currently `bg-orange`).

The line: **is this the mark, or is it the dose? Then orange. Otherwise indigo.**

### ⚠ A real problem this creates

Removing orange removes the palette's **only warm, complementary accent**. Everything
remaining is one blue-violet family, so "punctuation" now has to be produced by value
contrast alone rather than hue contrast. Two consequences:

1. **On light grounds** indigo `#4E58A8` works, but reads as *quieter* punctuation than
   orange did. Acceptable.
2. **On dark grounds it fails.** `#4E58A8` against `#08192F` has too little separation
   to function as a mark. **Mitigation:** dark-ground pieces use frost `#95DAF8` as the
   accent instead — bright enough to punctuate, still in-family.

This is the one ruling where I think the cost is real and Conner's instinct was
defensible: orange is one of the four core colors on CinPressa's *own* spec sheet and it
is physically in the mark (`MARK_PETALS[1]`). CinRx's "orange belongs to CinCor" note
governs CinRx's own portfolio-card tinting — `--color-cincor` / `--color-cinpressa` are
CinRx's tokens for its children's cards, not a rule about how CinPressa's site paints
itself. **Flagging, not relitigating** — built as ruled, reversible in one line.

---

## 5. Dark showpiece placement

**Ruled:** reserve dark for genuine showpieces, not utility sections — suggested a
science/pipeline hero plus one below-fold moment.

Taking that steer:

| Surface | Dark? | Note |
|---|---|---|
| **Pipeline hero** | ✅ **new** | The lead-program page. Boldest available single move. |
| **Science / Mechanism** | ✅ **new** | The below-fold moment. |
| Footer | already dark | `bg-deep` today — improving an existing dark surface, not a new one. |

Two *new* dark grounds, within budget.

### ⚠ Added scope: nav theming

`site-nav.tsx` is hardcoded light — `bg-white/88` when solid, ink links, and a
`from-white/92` scrim over the hero. **On a dark hero the lockup and links are
illegible.** A dark hero requires adding a dark variant to the nav, the way CinRx's
`SiteNav` does section-adaptive theming (light/dark based on what's behind it).

That's real work not in the original five: roughly a `tone` prop, a dark token set, and
a light-mark variant of `SiteLogo`. **Call it a sixth work item, not a sixth art piece.**

**If that scope isn't wanted,** the fallback is dropping the dark Pipeline hero and
letting the footer + Science/Mechanism carry the dark treatment — zero nav work, and the
footer is already dark so nothing regresses. Your call.

---

## 6. The five pieces

---

### PIECE 1 — **The Held Line**
*The blue-wave translation.*

**Location** — `components/hero-field.tsx`, behind `PageHero`. Affects **/about,
/science, /pipeline, /news, /contact**. Replaces the pale wash + logo crop entirely.

**Concept** — CinRx's `confluence` gathers many strata into one cable. CinPressa's band
shows strata that **enter turbulent on the left and flatten into a single held
horizontal on the right** — variable, uncontrolled pressure resolving into durable
control. Same wave-band family (familiar), opposite behavior and meaning.

The metaphor lives in the parameters: an **amplitude envelope decaying to near-zero**
across the width. One number carries the idea, exactly as confluence lives in
`baseL ≠ baseR`.

**Technique** — hand-written Canvas 2D. Each stratum is the sum of two sines at
coprime-ish wavelengths travelling in *opposite* directions, sampled to a `Path2D`; the
new term is the flatness envelope. Masked band, copy column near-zero.

**Five structurally different variants** — non-negotiable, per CinRx round 7
(*"parameter variations of the same waves all read identical"*). One engine, five
configurations:

| Page | Variant | Geometry |
|---|---|---|
| /science | `source` | strata originate from a **single point** left, fan right, flattening — suppression at the source |
| /pipeline | `interval` | band **segmented** by vertical hairline gaps into stages; flattening progresses across them. **Rendered on the dark ground.** |
| /about | `lineage` | **two** strata enter independently, converge to parallel, travel flat together |
| /news | `cadence` | flat held line with **discrete marks** along it — events on a stable baseline |
| /contact | `open` | the quietest — **one** held line, immense negative space |

**Palette** — near-zero left → full strength right: `#0473BB` → `#0783C6` → `#1596D4`
→ `#1EAEE5`. Crests `#CBDCEB`. One indigo `#4E58A8` tick per variant where the line
first goes flat (frost `#95DAF8` on the dark `interval`).

**Motion** — strata drift slowly leftward (~40–90s), so turbulence moves while **the
flat right-hand section barely does.** The stillness is the point; the eye reads restless
left against held right. ~30fps, IO-paused, one static frame under reduced motion,
static on touch.

**Why it isn't slop** — geometry authored per page, each configuration meaning something
specific to that page's argument. No library, no preset, no recolored duplicate. Five
pages that currently open with the same logo crop each get a different composition.

**CinRx reference** — `HeroRibbon`. Echoes: canvas band, axis discipline,
quiet-left/vivid-right, five variants. Differs: flattening not converging, duration not
confluence, cyan ladder not royal ramp, and the flat zone is the subject.

---

### PIECE 2 — **Four Lenses**

**Location** — `app/home/page.tsx`, the field around the hero mark. `ConvergenceMark`
**untouched** — it's the best thing on the site. This replaces the four blurred blobs.

**Concept** — the blobs are candidly the exact soft-gradient pattern that reads as
AI-generated. Replace with the mark's **own four parent ovals, oversized as hairline
outlines**, at true recovered geometry, extending past the mark and off the hero's
edges. The mark becomes **the dense core of a much larger optical system**. Overlaps
fill at low alpha with `mix-blend-mode: multiply` so the field **generates its own
deeper colors the way the logo does** — the brand's internal logic, scaled up.

**Technique** — static hand-authored SVG driven by the existing `MARK_OVALS` constants
(cx, cy, rx, ry, angle, path). ~4 KB. No canvas, no JS, no dependency.

**Palette** — hairlines `#0473BB` / `#1596D4` at **0.28–0.38** (vs. today's 0.11–0.16).
Overlap fills 0.08–0.12 multiply in `#95DAF8` / `#AADBF6` / green. Indigo on the
lower-right oval.

**Motion** — **none.** Deliberate. `ConvergenceMark` already performs a full assembly;
more motion is noise. A still field around a moving core reads as confidence. This is
the piece where restraint *is* the craft.

**Why it isn't slop** — generated from the brand's own recovered geometry, static, and
it deletes the single most generic element on the site. No template could produce it,
because the ovals only exist because someone conic-fit them out of flattened artwork.

**CinRx reference** — closest to `SiteAlleys`: architectural line-work as frame. Differs
in that CinRx's frame is orthogonal (vertical rules on the page grid) while CinPressa's
is **elliptical and tilted**, derived from its own mark.

---

### PIECE 3 — **The Horizon**

**Location** — `components/site-footer.tsx`. Already `bg-deep`; currently rings at 0.09
and the mark at **0.07**.

**Concept** — one line, held, across a deep field, in mostly negative space. The Agnes
Martin / Brice Marden gesture stated plainly — and per `BRAND_DIRECTION` §1 the CEO buys
Agnes Martin.

Critically the line is **not perfectly straight** — a few tenths of a percent of
authored, deterministic drift. A mathematically perfect rule reads as a border; an
almost-straight line reads as *held*, maintained against pressure. **That distinction is
the piece**, and it's exactly the edge quality a collector notices and a template can't
fake.

**Not a chart.** No axis, labels, or numbers — nothing implying a clinical result
(`EfficacyChart` carries a placeholder-data warning; nothing here should read as data).

**Technique** — hand-authored SVG path with an authored coordinate list, plus one slow
luminance band reusing the proven `mark-light-band` technique (`mix-blend-mode:
soft-light`, luminance-only so hues never shift).

**Palette** — ground `#08192F`. Line ramps `#0783C6` → `#1EAEE5` → `#95DAF8` at
**0.7–0.9** — an order of magnitude bolder than the 0.07 it replaces. One frost
`#95DAF8` mark where the line begins. *(Was orange; changed per §4.)*

**Motion** — one soft luminance pass along the line every ~34s, fading in and out within
its pass so light "arrives and leaves like weather." Nothing else. It earns its place by
making a still line feel *maintained* rather than printed.

**Why it isn't slop** — one element, enormous negative space, no gradient wash, no
particles. Risk is that it's too quiet, not too loud; mitigated by full-strength color
and an otherwise empty footer.

**CinRx reference** — `BrandHairline` / `LandingTitleDot`. Echoes: 1px discipline,
travelling luminance, single terminal accent. Differs: CinRx's hairlines are *reactive*
(cursor-tracked, four palettes, always responding). CinPressa's is **indifferent** — it
holds regardless of the viewer. Which is the drug's thesis: control that doesn't depend
on the patient showing up.

---

### PIECE 4 — **The Ground** *(systemic)*

**Location** — `components/section.tsx` + every section boundary.

**Concept** — honest framing: not an art piece, the prepared canvas. But it's where
"washed out" lives, and the other four underperform on a near-white ground. Three parts:

1. **Tones deepened** per §2.
2. **A hairline seam at every section boundary** at the revised `#CBDCEB`. The site has
   hard color seams and nothing else. `PRODUCT.md` declares *"the hairline is the
   brand"* and then doesn't deliver it.
3. **The `deep` tone** available as an inverted ground for Pieces 1-`interval` and 5.

**Technique** — CSS only. Token edits plus one seam element. Effectively free.

**Motion** — none.

**Why it isn't slop** — it removes decoration rather than adding it. The only additive
element is a 1px rule the brand already claims as its language.

**CinRx reference** — `SiteAlleys` + the `hero-drift` philosophy (*"Type carries the
hero"*). Differs: CinRx frames vertically down the gutters; CinPressa punctuates
**horizontally at the joints**, because its whole visual argument is horizontal.

---

### PIECE 5 — **Source**

**Location** — `app/science/page.tsx`, the **Mechanism** section. Inverts to `deep`.

**Concept** — the page's argument is that ACE inhibitors and ARBs act *downstream* and
let the pathway rebound, while CIN-111 acts **upstream, at the source.** The art states
that as an absence.

A dense field of fine vertical hairlines fills the dark section — continuous, ambient,
faintly restless. That's angiotensinogen production: the default state. As the section
scrolls, **the field goes quiet from a single point outward** — lines *shortening* to
nothing, spreading, leaving clean dark space. Not fading; shortening. Production
stopping at the source.

By the end most of the field is silence, with faint lines persisting at the far edges —
honest that suppression is deep but not absolute (~88–100%).

**Art about removal, not addition.** Every CinRx piece adds light, energy, or
convergence. This one takes texture away, and the negative space is the subject. The
most collector-legible idea in the set.

**Technique** — Canvas 2D for the field, **Framer Motion `useScroll`/`useTransform`**
for the scrub (the one genuine React-interop case). Deterministic lattice — authored
spacing with fixed-seed jitter, never `Math.random()`, which breaks SSR hydration.
Scroll progress drives a radial quiet-front; each stroke's length is a function of its
distance from that front.

**Motion** — **scroll-driven, and the motion *is* the mechanism.** Nothing on hover,
nothing loops. Reversible, plays without interaction — the same cursor→scroll move CinRx
made repeatedly on client feedback. Reduced motion renders one static frame at ~70%
suppressed, which still reads correctly.

**Palette** — ground `#08192F`. Active lines `#1EAEE5` / `#95DAF8` at 0.5–0.75.
Suppressed remainder `#0783C6` at 0.12. One frost `#95DAF8` mark at the origin — the
intervention. *(Was orange; changed per §4.)*

**Why it isn't slop** — the motion has a referent, it's reversible and non-decorative,
it does something stock effects can't (a field that *un-draws* from a point), and it
doesn't duplicate `RaasPathway` nearby — one explains the cascade, this is the
atmosphere it lives in.

**CinRx reference** — `ChapterAttrition` (scroll-synced grid in phases) and
`UrchinBurst` (canvas field of fine strokes). Echoes: canvas field, scroll as narrative.
Differs fundamentally: CinRx's fields **bloom and reach**; this one **goes quiet.** Same
medium, inverted gesture.

---

## 7. Summary

| # | Piece | Where | Technique | Motion | Est. |
|---|---|---|---|---|---|
| 1 | **The Held Line** | 5 interior headers | Canvas 2D, 5 variants | drift; flat zone still | ~7 KB |
| 2 | **Four Lenses** | Home hero field | Static SVG | **none** | ~4 KB |
| 3 | **The Horizon** | Footer *(dark)* | SVG + CSS luminance | one 34s pass | ~2 KB |
| 4 | **The Ground** | Site-wide | CSS tokens | none | ~0 KB |
| 5 | **Source** | Science / Mechanism *(dark)* | Canvas 2D + Framer Motion | scroll-scrubbed | ~5 KB |
| 6* | *Nav theming* | `site-nav.tsx` | *enabling work, not art* | — | ~1 KB |

**Own code ≈ 19 KB.** Plus Framer Motion (~30 KB, one file, tree-shaken to scroll hooks).
Two of five pieces have no motion at all.

### How this answers the brief

- **"Same repeated logo"** — Pieces 1 and 2 remove the mark from seven of nine
  placements. It stays in the nav, home hero, brand page, and a whisper in the footer.
- **"Too washed out"** — deepened grounds, the 0.45–1.0 opacity rule replacing a 0.42
  ceiling, two new dark surfaces, and a hairline that can finally be seen.
- **"More bold"** — full-strength cyan ladder as mass, dark Pipeline hero, Tier A/B
  palette amendment.
- **"Familiar yet different"** — same rigor, hairline discipline, perf envelope,
  one-accent rule. Different subject: duration, not confluence. Lenis deliberately
  declined to keep the gap open.
- **"Elegant individual placements"** — five pieces, each owning one location.
- **"Not AI slop"** — no library does the work in any piece (Framer Motion drives a
  scroll value, not an effect). Two pieces don't move. Every geometry is either derived
  from the mark's own recovered conics or authored against a specific argument.

### Build order

1. **Piece 4** (The Ground) — everything is judged against it.
2. **Piece 1** (The Held Line) — largest win, five pages.
3. **Item 6** (nav theming) — unblocks the dark hero.
4. **Piece 3** (The Horizon) — small, high polish, proves the dark treatment.
5. **Piece 2** (Four Lenses) — static, low risk.
6. **Piece 5** (Source) — most complex; last, on settled ground.

### Risks

- **Piece 3 may read too quiet.** One line in a large dark space. Intended, but most
  likely to need a second pass.
- **Piece 5 sits between two light sections.** Transitions need care or it reads as a
  hole rather than a showpiece.
- **Five variants of Piece 1 is the bulk of the work.** If scope must be cut, the honest
  reduction is three variants (`source`, `interval`, `open`, with /about and /news
  sharing `open`) — **not** five recolors of one geometry, the failure CinRx documented.
- **Losing orange costs the palette its only hue-contrast accent** (§4). Watch whether
  punctuation still reads on light grounds once built.

---

## 8. Open items

**Needs a human, not me:**
- Tier B palette shifts — brand owner (Jason), since they'd desync the mark artwork from
  the official spec sheet.
- The orange/indigo reversal (§4) — Conner ruled the other way on the same question.

**Doesn't block the build:**
- Gotham licensing (Montserrat is a stand-in; type carries a lot here).
- `EfficacyChart` placeholder curves · `TeamGrid` names — both flagged in code, both gate
  launch, neither is art scope.

**On approval:** feature branch, build in the order above, verify desktop/tablet/mobile,
hold the CinRx perf envelope (~30fps, DPR ≤1.5, IO-paused, static frame under reduced
motion, static on touch), commit per piece. No push to main, no deploy.
