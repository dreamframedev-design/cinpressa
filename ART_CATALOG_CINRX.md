# CinRx Art Catalog — the reference universe

> **Purpose:** the source-level inventory of every artistic piece on cinrx.com, so
> Cinpressa's art can be *familiar yet different* rather than a recolor.
> **Method:** read from `D:\cinrx\src` at commit `30d6d49`. No screenshots.
> **Depth key:** ⬛ = read in full, line by line · ◧ = read via its design docblock + call sites.
> **Written:** 2026-08-03

---

## 0. The governing document

`D:\cinrx\BRAND_DIRECTION.md` is the taste constitution and it matters more than any
single component. Its load-bearing claims:

- **The CEO is an art collector** — and specifically a *restrained conceptual* one:
  Agnes Martin grids, Brice Marden line work, Donald Judd boxes, Sugimoto seascapes,
  Ellsworth Kelly. "The art he loves does *one thing* with absolute discipline."
- **"Commissioned, not produced."** The site must read as an artist's response to the
  question *what does this company mean*, not an agency package.
- **What insults him, named explicitly:** generic biotech swirl, helix cliché,
  gradient-as-bandage, "anything that feels AI-generated."
- **Quality bar:** *Linear marketing site × Phaidon monograph × Vitsœ quiet confidence.*

Its seven Visual Language Principles are the rules every piece below obeys:

1. **Discipline over decoration.** If a layer doesn't *mean* something, cut it.
2. **The line is the brand.** Strokes, dashes, hairlines, axis lines — stronger than blurs.
3. **Gold is punctuation.** Never a surface. Never large text. A pencil tick on an architect's drawing.
4. **Motion is breath.** Slow continuous cycles (60–180s) are signature. Fast bouncy motion is banned.
5. **Scroll is narrative.** Sections don't appear — they *arrive*.
6. **Type is restraint.** One display family, three sizes, intentional tracking.
7. **The page is the gallery.** Whitespace is content.

**§4.5 also locks CinPressa's own palette as an external brand** — "never reinterpret,
lighten, or substitute." This is the single biggest constraint on Phase 2 and is
addressed head-on in the audit doc.

---

## 1. Design tokens (`src/app/globals.css`)

The whole cool ramp the artwork is drawn from:

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#050b1f` | near-black ground |
| `--color-navy` | `#0a1e5c` | deep ground |
| `--color-egyptian-blue` | `#1e3391` | deepest wave stratum |
| `--color-royal` | `#2b4dd1` | **the signature blue** |
| `--color-azure` | `#5b7df0` | mid |
| `--color-bright-ocean` | `#458cc2` | |
| `--color-cool-sky` | `#6ab3e7` | lightest active blue |
| `--color-sky` | `#e8eef7` | surface wash |
| `--color-gold` / `--color-bright-gold` | `#f4cc2d` / `#fdda25` | **punctuation only** |
| `--color-cinpressa` | `#6771b5` | CinPressa's indigo, as CinRx refers to it |

24 named `@keyframes`, all slow: `rotate-very-slow`, `drift`, `beam-sweep`,
`gold-sheen-sweep`, `hero-drift`, `particle-rise`, `om-ring-breath`.
**Not one bounce, spring, or sub-second loop in the entire stylesheet.**

---

## 2. THE BLUE WAVE — the piece Conner called out ⬛

**File:** `src/components/visual/hero-ribbon.tsx` (20.9 KB)
**Lives on:** every sub-page hero, via `src/components/site/page-hero.tsx`
**Technique:** hand-written **Canvas 2D**. No library. No WebGL. No SVG.

This is the reference. It deserves the most detail.

### The architecture

One shared brand language, expressed as **five structurally different compositions** —
one per page. The language is fixed:

- the mark ramp: Cool Sky `#6AB3E7` → Royal `#2B4DD1` → Egyptian `#1E3391`
- hairline strokes
- **exactly one gold punctuation accent** (`#D4A02A`)
- the **−8° house axis** (every variant sits in a band rotated `-8deg`)
- **quiet-left / vivid-right** — a CSS `maskImage` gradient keeps the copy column clear

The five variants:

| Variant | Page | Geometry |
|---|---|---|
| `current` | /portfolio, /brand | four **filled** wave strata, etched crests, gold thread riding above the royal layer |
| **`confluence`** | **/about** | the filled current, but strata **enter fanned apart and converge into one royal cable** — many CinCos, one engine |
| `signal` | /news | **no fills.** Three transmission traces with EKG spike packets traveling the wire; the middle spike flashes gold |
| `braid` | /team | **no fills.** Four strands oscillating about a shared axis, permanently crossing — threads woven into rope, plus a thin gold strand |
| `ripple` | /contact | **no fills, nothing but rings.** Concentric wavefronts expanding from where the message lands; innermost ring gold |

### The critical lesson (read this twice)

The docblock records a dated client rejection:

> *6/11/26 round 7, Conner: parameter variations of the same waves all read identical;
> each page gets its own geometry.*

**Recoloring one wave and changing its amplitude per page was explicitly rejected.**
Structural difference is the bar. This is the single most important constraint carried
into Cinpressa's strategy.

### How the wave is actually drawn

Each `Stratum` is a struct — not a bezier path, a **function**:

```ts
interface Stratum {
  baseL, baseR   // vertical position at left edge / right edge (fractions of height)
  a1, l1, p1     // amplitude, wavelength, period of the PRIMARY sine
  a2, l2, p2     // amplitude, wavelength, period of the SECONDARY sine
  ampDecay       // how much amplitude dies toward the right
  left, right    // gradient endpoints
  crest          // crest stroke color
  phase          // per-stratum phase offset
}
```

The surface is the **sum of two sine waves of coprime-ish wavelengths and opposite
travel directions**, sampled at 84 steps into a `Path2D`:

```ts
base * h + ampScale * (
  a1*h*sin(2πx/(l1*w) − 2πt/(p1*1000) + phase) +
  a2*h*sin(2πx/(l2*w) + 2πt/(p2*1000) + phase*2.3)
)
```

Two waves at different speeds *in opposite directions* is what stops it reading as a
mechanical sine. The `phase*2.3` on the second term ensures the two never re-sync.

**The confluence trick** is one field: `baseL ≠ baseR`. The four strata start at
`0.14 / 0.38 / 0.62 / 0.88` (fanned wide) and end at `0.50 / 0.575 / 0.65 / 0.73`
(gathered tight), with `ampDecay: 0.55–0.6` damping the waviness as they converge.
**The metaphor is executed in four numbers.** No morphing, no keyframes.

Fill is a left→right `createLinearGradient` per stratum; the crest is a 1.5px stroke
of the *same* path; the gold thread is the royal stratum's path re-stroked at
`offsetY: -9` with a gradient that fades in and back out.

### Performance discipline

- backing store capped: `min(devicePixelRatio, 1.5)` and `≤1500px` wide
- throttled to **~30fps** (`t - last > 33`), not 60
- `IntersectionObserver` pauses the loop entirely off-screen
- `prefers-reduced-motion` → draws **one static frame**, never starts the rAF loop
- `ResizeObserver` redraws on container resize

This perf envelope is the house standard. Match it.

---

## 3. Canvas 2D pieces

### UrchinBurst ⬛ — `visual/urchin-burst.tsx` (49.8 KB, the largest piece on the site)
**Lives on:** home hero, and /about "Why we're different" (anchored to the section's bottom edge)

A burst of ~380 foreground + ~160 background spines from a luminous anchor, each
tipped with a dot. Every spine is a **3D unit vector, uniform-sampled on a sphere**,
rotated and projected each frame, z-sorted, painted back-to-front.

Six independent motion systems layered on one field:

1. **Ambient sway** — bounded ±0.03 rad sinusoidal pitch/yaw. A global yaw was *removed*: "the whole sphere drift[ing] right as a single body… the user explicitly does not want."
2. **Spatial-wave pulse** — phase is `f(spine direction, time)`, so *neighboring spines pulse together and brightness waves propagate across the field*. Shaped by a power curve (`pulse01^0.2`) so spines spend ~80% of the cycle bright and only briefly dip.
3. **Per-spine lateral sway** — each tip arcs *perpendicular to its own screen-space direction* ("urchin arms searching").
4. **Ocean current** — a coherent spatial wave; near spines move together, far spines drift out of phase.
5. **Chaos wobble** — fast per-spine micro-drift on coprime divisors so no visible cadence emerges.
6. **Cursor articulation** — tips are **pushed away** from the cursor (not pulled toward), unit-direction × fixed pixel magnitude, quartic falloff over a 230px band, dual-rate easing (fast attack ~0.14s half-life, slow release ~0.3s).

Depth cuing: color lerps Royal (back) → Cool Sky (equator) → white (front); line alpha
and width rise with z. A hard clamp (`endY ≤ baseY − 2`) guarantees no spine ever
points downward regardless of cursor force.

Three themes (`aurora`, `solar`, `daylight`) each with a **24-stop hand-tuned radial
glow**. The comments narrate the tuning history in detail — this piece was iterated
against client feedback many times.

Perf notes: no `ctx.shadow*` (documented as "extremely slow per-stroke"); glow comes
from overlapping alphas. Touch/coarse-pointer and `<768px` get a **single static
frame** — phones never run the loop.

### TeamLineField ◧ — `visual/team-line-field.tsx` (12.5 KB)
Quiet cursor-reactive abstract line field behind each Team section. Renders a
**viewport-sized canvas slice** rather than the full section height; scroll moves the
slice and shifts the field at a slower rate → parallax depth without animating
offscreen lines.

### EmberNetwork ◧ — `visual/ember-network.tsx`
Glowing orange embers wired into a faint node network on a dark surface. The
**velocity/momentum model** is called out as "the working pattern": the cursor adds to
each ember's *velocity*, not position, so a drag flings them and they coast apart
before settling. The network visibly breaks and reforms.

### NewsroomArcs ◧ — `visual/newsroom-arcs.tsx`
Three concentric arcs anchored to the newsroom section's upper-right corner with a
**scroll-driven chromatic trace**. Reworked from cursor-Y to scroll: as the section
passes a reference line (~42% down the viewport), a focal band sweeps the arcs
top→bottom; where it crosses, that segment saturates royal → ocean → sky.
Pure `f(scroll progress)` — no hover required.

---

## 4. WebGL / three.js pieces

### MeshGradient ◧ — `visual/mesh-gradient.tsx` (11.2 KB)
A real **WebGL2 fragment shader**: inverse-distance-weighted blend of four anchor
colors, UVs warped by **two octaves of simplex noise** on a slow time uniform.
Single fullscreen triangle (not a quad — "saves a vertex and avoids the overdraw seam").
Docblock frames it as *"Stripe-parity, not Stripe-cosplay."*

### RadiantField ◧ — `visual/radiant-field.tsx`
The restraint case study. Composition is **one** mesh gradient + grain + edge fade.
The docblock records what was removed: *"The earlier 120-ray shimmer burst was the
'ping-ponging balls' — gone. Stripe's section backgrounds use a single slow-breathing
wash, not a layer cake."*

### MarkSolid3D ◧ — `brand/mark-solid-3d.tsx`
The only **three.js** piece. A genuine extrusion of the constellation mark path — one
mesh with real side walls, bevels, and through-holes, so "there is nothing to seal and
nothing to see through at any angle." Gold discs are physical coins; the traveling
edge-glow is an **orbiting light on the geometry**. Dynamically imported (`ssr: false`)
and desktop-gated so phones never download the chunk.

**This is the bar for reaching past canvas:** three.js was used because true
through-holes viewed edge-on are something 2D genuinely cannot fake.

### BrandRibbon ◧ — `visual/brand-ribbon.tsx`
One WebGL mesh gradient clipped to a tilted band via SVG `clipPath` in
`objectBoundingBox` units. The docblock documents *why* — CSS `path()` uses absolute
pixels and won't scale; CSS `polygon()` has no curves; SVG clipPath gives curves **and**
scales to the container's 0..1 range.

---

## 5. SVG pieces

### HeroVectorRibbons ⬛ — `site/hero-vector-ribbons.tsx`
Six overlapping closed bezier bands, **pure 2D SVG, no WebGL/canvas**. Two techniques
carry it:

- Every band uses `mix-blend-mode: multiply`, so overlaps **combine into deeper
  saturated tones** rather than one hiding the next — "translucent fabric stacked on
  white paper."
- **Fake depth of field via selective `feGaussianBlur`:** back bands `stdDeviation=22`
  (far, out of focus), middle bands **no blur** (the sharp focal plane), front bands
  `stdDeviation=6` (foreground bokeh).

Each gradient fades to `stopOpacity=0` at *both* ends so no band has a visible edge.

### WhyDifferentBackdrop ⬛ — `site/why-different-decor.tsx` (23 KB)
The "liquid silk" ribbon. Two stacked motion techniques:

1. **The fill flows** — `<linearGradient gradientUnits="userSpaceOnUse"
   spreadMethod="reflect">` with an `<animateTransform type="translate">` sliding it
   1520px over 19s. `reflect` means the color bands flow endlessly with **no seam**.
2. **The shape undulates** — Framer Motion morphs `d` between path keyframes generated
   by a function that only nudges control-point Y values, so every keyframe shares an
   **identical command structure** (`M,C,S,L,C,S,Z`). That identical structure is the
   hard requirement for smooth `d` interpolation.

Plus four blurred brand-tinted blobs on 28/32/36/40s loops with staggered delays —
a gradient mesh without a shader. Note the comments: purple and coral blobs were
**swapped out to navy and cream to stay inside the brand palette.**

### PillarIcon ⬛ — same file
Three hand-drawn 80×80 marks (engine / capital / infrastructure) using counter-rotating
rings at 50s and 28s, `strokeDasharray="3 30"` with animated `strokeDashoffset` for
traveling pulses, and hex lattices. Contains a subtle but important craft detail:
trig-derived coordinates are rounded to 3 decimals (`r3()`) because raw
`Math.cos/sin` can differ by 1 ULP between Node and browser and trigger a **hydration
mismatch**.

### SignalPulse ⬛ — inside `site/operating-model-journey.tsx`
The About page's finale, drawn in the *same viewBox* as the mark and stacked over it:
hub spark pulses → the pulse hops outward to each gold disc in slot-in order (0.34s
apart) → one unison beat from hub and all three spokes. Pure light — expanding stroked
circles and `mixBlendMode: screen` flashes. **No geometry changes.** Described as
*"'one optimized engine' rendered as a heartbeat."*

### Grain ◧ — `visual/grain.tsx`
A fixed `<feTurbulence>` pattern at ~4% opacity over every gradient surface. Its
purpose is technical, not decorative: **kills the stair-step banding** a soft gradient
shows across a wide retina display. Inlined so there's no extra request.

### CardArt ◧ — `visual/card-art.tsx`
Worth noting as a **documented reversal**. It replaced `@paper-design` WebGL shaders
that the client rejected on 6/1/26 as *"too flowey and diffuse — soft gradients."*
The replacement is flat mid-century-modern abstraction with **hard-defined inner
lines**, one color world per card, and only a whisper of motion. Three motifs tied to
meaning: `converge` (rings gathering to a core), `flow` (bars ascending right),
`lattice` (interlocked circles).

**The lesson: a shader lost to flat geometry because the shader had no edges.**

### Others ◧
`etched-outline.tsx` (12.1 KB), `mural-etch.tsx` (cursor-spotlit hairline lighting the
*internal* gradient joins inside murals), `cinco-murals.tsx` (per-company gradient
fields — deliberately simplified on 6/10/26 to "simple minimal abstract gradient
backgrounds," all shards and hairlines removed), `beam-connector`, `orbital-rings`,
`dot-grid`, `floating-shapes`, `gold-dust`, `aurora-backdrop`, `spotlight`.

---

## 6. CSS-only motion

### BrandHairline ⬛ — `visual/brand-hairline.tsx` (14.5 KB)
The purest expression of *"the line is the brand."* A **1px** gradient stroke whose
bright focal point tracks the cursor on an rAF lerp.

- Four palettes (`gold`, `royal`, `ocean`, `ember`), each defined as an HSL spec with
  `centerHue`, `edgeHue`, `flankOffset`, saturation, lightness.
- **Two independent hue cycles** on different time signatures (`sin(now/1800)*6` and
  `sin(now/700+1.3)*3`) so the stroke is never a static color *even when the cursor is
  still*.
- `autoTravel` — after ~1.3s of pointer idle, the focal point drives itself on a
  ping-pong sweep; a mouse move snaps control straight back.
- `vivid` mode tightens the focal stops from 26% to 16% so the accent reads as "a
  precise jeweled chip rather than a diffuse glow."
- Frame-rate-independent lerp: `1 - Math.exp(-dt * 7)`.

The `ember` palette carries a dated tuning note: hue pulled to 34 (deeper, less
yellow), saturation to **100**, lightness dropped 52→46, because *"the CEO still saw
the marquee seams as too faint."* **Precedent: when the client says washed out, the
fix was deeper + more saturated, not larger.**

### `hero-drift` — `globals.css` + `site/page-hero.tsx`
One soft cool-grey cloud shadow drifting slowly across the hero field. The docblock is
a masterclass in editing down: the previous cursor-reactive WebGL grid "read as dated
and is gone. What remains is deliberately quiet… the single element the client
responded to in the old treatment, kept at a whisper. **Type carries the hero.**"

### SiteAlleys ◧ — `visual/site-alleys.tsx`
One faint vertical hairline per side, full document height, anchored to the outer edge
of the content gutter via `max(24px, calc(50% - 640px + 24px))`. The global frame.

---

## 7. Scroll-driven storytelling

### OperatingModelJourney ⬛ — `site/operating-model-journey.tsx` (21.1 KB) — /about
The flagship. A sticky mark pinned beside two scrolling copy movements, with
everything scrubbed to `useScroll({ offset: ["start 0.55", "end 0.25"] })`:

- **One full 360° Y-rotation**, but **pace-shaped** with `cubicBezier(0.8, 0, 0.2, 1)`:
  barely moves on arrival, a quick decisive twirl mid-story, then glides back to
  front-facing. The note explains why: *"the disorienting 'always rotating' feel is
  gone, and the edge-on poses become brief flashes instead of long holds."*
- A **7° X-tilt** that rises mid-turn and settles flat — "sells the dimensionality
  without ever reading as 'tipped over'."
- Gold discs **scrub into empty sockets** across `[0.08, 0.68]`, reversible.
- **Ground-shadow physics:** `|cos(rotateY)|` drives `scaleX` (0.42→1) and opacity
  (0.5→0.8), so the shadow narrows to a slot when the solid is edge-on. Genuinely
  correct optics.
- At 82% progress, the one-shot `SignalPulse` fires.

### ChapterAttrition ◧ — `site/chapter-attrition.tsx` — home
Pinned ~3-viewport section telling the pharmaceutical attrition story through a
**10×10 dot grid synchronized to scroll**, in four phases of 25% each, starting from
"100 candidates." Data as narrative.

### ChapterMission ◧ — `site/chapter-mission.tsx` — home
Rebuilt after round 1's subtle 1px rail "read as no change at all." The three words
Capital · Expertise · Execution become **stations on a visible hub-line**, each tied by
a spoke tick — the hub-and-spoke brand drawn in miniature beside the words — with a
gold energy pulse descending the line, scroll-driven.

### LandingTitleDot ◧ — `visual/landing-title-dot.tsx`
The most Judd-like idea on the site. The gold period ending the Connect headline is the
**final beat of a gold-dot thread that guides the user down the whole homepage**
(hero hub → mission rail pulse → newsroom arc dot → here). It floats down and settles
into place "as if it has been traveling with the visitor the whole way and finally lands."

**One dot, four sections, one narrative.** This is the composition instinct to steal.

### Lenis
`motion/lenis-provider.tsx` — RAF-driven smooth scroll bound at the root, paired with
Framer Motion `useScroll`/`useTransform`.

---

## 8. What CinRx does NOT do

Equally instructive, and verified by searching the tree:

- **No Lottie.** No `lottie-web`, no `.json` animation exports.
- **No particle library.** No `tsparticles`, no `particles.js`.
- **No wave library.** Every wave is hand-authored math.
- **No stock imagery** in the art system.
- **No `@paper-design` shaders** — they were installed, then removed as "too flowey."
- **No motion faster than ~0.9s**, and no infinite loop shorter than ~2.6s.
- **No hover-only reveals** for anything load-bearing — the client repeatedly pushed
  effects from hover to *scroll* so they fire without interaction.

---

## 9. The seven transferable techniques

Ranked by what will serve Cinpressa best.

1. **One language, N structurally different geometries.** Not one geometry recolored. The rejection of "parameter variations" is on the record.
2. **Sum two out-of-phase, opposite-direction sines** to make a surface that never reads mechanical.
3. **Encode the metaphor in the parameters** — confluence is `baseL ≠ baseR` plus `ampDecay`. The idea lives in the numbers, not in a comment.
4. **Mask the copy column** so art can be genuinely bold where nobody is reading. Quiet-left / vivid-right is what *permits* boldness.
5. **`mix-blend-mode: multiply` + fade-to-zero-alpha at both ends** — overlaps deepen, no band has an edge.
6. **Selective blur as depth of field** — heavy back / sharp middle / slight front.
7. **Perf envelope as a design constraint** — 30fps, ≤1500px backing, DPR ≤1.5, IO-paused, one static frame under reduced motion, static on touch.

---

## 10. Familiar-yet-different: what Cinpressa must NOT reuse

For the "familiar yet different" test, these are CinRx's identity markers. Cinpressa
should inherit the *rigor*, not these:

| CinRx signature | Cinpressa must differ |
|---|---|
| The **−8° house axis** on every hero band | needs its own axis discipline |
| **Gold as the sole punctuation** | CinPressa's punctuation is **orange `#F9A81A`** (and per BRAND_DIRECTION §4.5, *orange belongs to CinCor* — so this needs a deliberate call) |
| **Horizontal wave strata** as the hero language | Cinpressa's own structural idea required |
| The **urchin/spine burst** | too identifiable; do not port |
| **Hub-and-spoke geometry** — a parent-company idea | Cinpressa is a single-asset company; the geometry must express *one program*, not a portfolio |
| Royal `#2B4DD1` cool ramp | CinPressa's ladder is cyan-forward: `#0473BB → #0783C6 → #1596D4 → #1EAEE5` |

The deepest structural difference available: **CinRx's art is about *many becoming
one*** (confluence, braid, constellation, hub-and-spoke). **CinPressa is one molecule,
one program, one mechanism** — its art should be about *duration, suppression, and a
line held flat over time*. That is a genuinely different subject, not a restyle.

---

*Next: `ART_AUDIT_CINPRESSA.md` — the placement audit. Then `ART_STRATEGY.md` for sign-off.*
