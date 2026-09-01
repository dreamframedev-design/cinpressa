import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage hero switches between four treatments, A first", async () => {
  const hero = await read("src/components/home-hero.tsx");

  assert.match(hero, /^"use client";/);
  // A is the default and is the field that was on /pipeline.
  assert.match(hero, /useState<View>\("a"\)/);
  assert.match(hero, /import \{ OpenFlow \} from "@\/components\/open-flow"/);
  // B is the mark.
  assert.match(hero, /<ConvergenceMark key="mark"[^>]*variant="cascade"/);
  const labels = [...hero.matchAll(/label: "([A-Z])"/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["A", "B", "C", "D"]);
  // A, C and D are the SAME field - one component and one set of ribbons, so
  // none of the three can drift from the others and the choice between them is
  // only ever a choice about where the gold is: a thread, nothing, or a band.
  assert.match(hero, /<OpenFlow key="plain" thread=\{false\} className="absolute inset-0" \/>/);
  assert.match(hero, /key="gold"[\s\S]{0,80}thread=\{false\}[\s\S]{0,40}goldBand/);
  assert.doesNotMatch(hero, /Bleed/);
  const flow = await read("src/components/open-flow.tsx");
  assert.match(flow, /thread = true/);
  assert.match(flow, /if \(withThread\)/);
  assert.match(flow, /goldBand = false/);
  assert.match(hero, /aria-pressed=\{v\.id === view\}/);
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

  // The two traded places: the open flow is the homepage's treatment A...
  assert.match(hero, /<OpenFlow key="flow" className="absolute inset-0" \/>/);
  assert.doesNotMatch(hero, /HeroChurn/);
  // ...and the churn is back on /pipeline.
  assert.match(pipeline, /field=\{<HeroChurn className="absolute inset-0" \/>\}/);
  assert.doesNotMatch(pipeline, /OpenFlow/);
  // /science keeps no field of its own; PageHero falls back to its own mark.
  assert.doesNotMatch(science, /OpenFlow/);
});

test("the gold band is bedded, not multiplied into the blue", async () => {
  const flow = await read("src/components/open-flow.tsx");
  const code = flow.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  // Gold and blue are near-complementary, so multiplying one into the other
  // lands in olive - the failure the thread already hit once. The band goes
  // down as a warm-white bed FIRST and the gold is laid on that ground, and
  // NEITHER pass multiplies: as gold thins, multiply can only darken, so it
  // cannot lift red past a ground that is still faintly blue and the fade has
  // to pass through sage. Measured at rgb(184,182,138) before this changed.
  const band = code.slice(code.indexOf("function paintGold"), code.indexOf("function render("));
  const bed = band.indexOf("rgba(255,251,242");
  const gold = band.indexOf("GOLD;");
  assert.ok(bed > 0 && gold > bed, "the bed must be laid before the gold");
  assert.doesNotMatch(band, /globalCompositeOperation = "multiply"/);
  assert.match(band, /globalCompositeOperation = "source-over"/);

  // And it is painted after the whole blue stack, or the bed has nothing to
  // lighten and the ribbons drawn later multiply straight back over it.
  const loop = code.indexOf("for (let i = 0; i < RIBBONS.length");
  const call = code.indexOf("if (withGoldBand) paintGold");
  assert.ok(loop > 0 && call > loop);

  // One ribbon changes, not the table: A, C and D must stay the same geometry.
  assert.equal((flow.match(/const RIBBONS: Ribbon\[\] = \[/g) || []).length, 1);
  assert.match(code, /const GOLD_INDEX = 2;/);
});
