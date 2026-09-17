import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage ships the approved golden-thread hero without review controls", async () => {
  const hero = await read("src/components/home-hero.tsx");
  const flow = await read("src/components/open-flow.tsx");

  assert.match(hero, /<OpenFlow key="flow" className="absolute inset-0" \/>/);
  assert.match(flow, /thread = true/);
  assert.match(flow, /if \(withThread\)/);
  assert.doesNotMatch(hero, /useState|setView|ConvergenceMark|hero-switch|aria-pressed|<button|navMark/);
  assert.doesNotMatch(hero, /thread=\{false\}/);
});
test("the field feathers to the colour the boundary actually is", async () => {
  const hero = await read("src/components/home-hero.tsx");

  // PageHero fades its fields to white because the sections under it are
  // white. This hero's own gradient ends on mist and the section below opens
  // on mist, so a white feather painted the last pixel row white against a
  // mist neighbour - a hard rule across the full width at the seam.
  assert.match(hero, /linear-gradient\(0deg, var\(--color-mist\) 0%, rgba\(244,248,252,0\) 100%\)/);
  assert.doesNotMatch(hero, /linear-gradient\(0deg, #ffffff/);
  assert.match(hero, /to-mist/);
});

test("the review scaffolding is gone from the hero", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.doesNotMatch(home, /MarkPreview/);
  await assert.rejects(read("src/components/mark-preview.tsx"));
  // The picker's labels were publicly visible on the hero for weeks.
  const hero = await read("src/components/home-hero.tsx");
  assert.doesNotMatch(hero, /Cascade|Bloom \(|Orbit|Replay/);
});

test("the hero fields swapped pages", async () => {
  const [pipeline, science, hero] = await Promise.all([
    read("src/app/pipeline/page.tsx"),
    read("src/app/science/page.tsx"),
    read("src/components/home-hero.tsx"),
  ]);

  // The approved homepage keeps the open flow...
  assert.match(hero, /<OpenFlow key="flow" className="absolute inset-0" \/>/);
  assert.doesNotMatch(hero, /HeroChurn/);
  // ...and the churn is back on /pipeline.
  assert.match(pipeline, /field=\{<HeroChurn className="absolute inset-0" \/>\}/);
  assert.doesNotMatch(pipeline, /OpenFlow/);
  // /science keeps no field of its own; PageHero falls back to its own mark.
  assert.doesNotMatch(science, /OpenFlow/);
});

test("provenance is a badge, and the badge is portable", async () => {
  const hero = await read("src/components/home-hero.tsx");
  const badge = await read("src/components/portfolio-badge.tsx");

  assert.match(hero, /<PortfolioBadge parent="CinRx" \/>/);
  assert.match(badge, /"line" \| "accent" \| "solid" \| "dark"/);
  // The approved phrasing is "a CinRx portfolio company", so the article has to
  // survive the split across the plate's two zones.
  assert.match(badge, /article = "A"/);
  // C is the neutral cut by definition: no warm anywhere on it but the beam.
  const css2 = await read("src/app/globals.css");
  assert.match(css2, /\.portfolio-badge-accent \{/);
  // Brand orange is 1.9:1 on the accent plate. The relationship text uses the
  // darker amber the news tags already use, which clears AA at 11px.
  assert.match(css2, /\.portfolio-badge-accent \.portfolio-badge-kind \{\s*color: #9a5f00;/);

  // THE SOLID CUT IS THE EXACT BRAND VALUE, not a tint of it and not a wash.
  // The plate reads the token straight and nothing dilutes it.
  const solid = css2.slice(css2.indexOf(".portfolio-badge-solid {"), css2.indexOf(".portfolio-badge-dark {"));
  assert.match(solid, /background: var\(--color-orange\);/);
  assert.doesNotMatch(solid, /rgba\(249, 168, 26/);
  // White is 2.0:1 on that ground and the accent cut's amber drops to 2.7:1, so
  // every mark on the solid plate is ink, which measures 6.8:1.
  assert.match(solid, /portfolio-badge-name,[\s\S]{0,120}color: var\(--color-ink\);/);
  assert.doesNotMatch(solid, /#ffffff|#9a5f00/i);
  // The name never goes amber - it is the thing that has to be read first.
  const accent = css2.slice(css2.indexOf(".portfolio-badge-accent {"), css2.indexOf(".portfolio-badge-solid {"));
  assert.doesNotMatch(accent, /\.portfolio-badge-name/);
  // The old kicker is gone from the hero entirely.
  assert.doesNotMatch(hero, /portfolio company/);
  // Nothing in the component is CinPressa's: the parent and the link are both
  // props, so a sibling site lifts the file and changes one word.
  assert.match(badge, /parent = "CinRx"/);
  assert.match(badge, /href = "https:\/\/cinrx.com"/);
  assert.doesNotMatch(badge, /CinPressa Pharma|CIN-111/);
  // NOTHING BUT THE TWO TEXT RUNS. The glyph and the divider are removed, not
  // hidden: the name is 14.72px semibold ink and the qualifier is 10.88px
  // tracked caps in grey, which is three differences doing that separating job
  // before any rule is drawn.
  assert.doesNotMatch(badge, /portfolio-badge-glyph|portfolio-badge-rule|<svg/);
  assert.doesNotMatch(css2, /portfolio-badge-glyph|portfolio-badge-rule/);

  // The name must never be case-transformed - CinRx is elephant case.
  const nameRule = css2.slice(
    css2.indexOf(".portfolio-badge-name {"),
    css2.indexOf(".portfolio-badge-kind {")
  );
  assert.doesNotMatch(nameRule, /text-transform/);
});
