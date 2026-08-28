import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage hero switches between three treatments, A first", async () => {
  const hero = await read("src/components/home-hero.tsx");

  assert.match(hero, /^"use client";/);
  // A is the default and is the field that was on /pipeline.
  assert.match(hero, /useState<View>\("a"\)/);
  assert.match(hero, /import \{ OpenFlow \} from "@\/components\/open-flow"/);
  // B is the mark.
  assert.match(hero, /<ConvergenceMark key="mark"[^>]*variant="cascade"/);
  // Three treatments now, and no more: the four-way variant picker is not
  // coming back. C is the layered wave field from further down the page.
  const labels = [...hero.matchAll(/label: "([A-Z])"/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["A", "B", "C"]);
  // C is the SAME field as A with the thread switched off - one component and
  // one set of ribbons, so the two cannot drift from each other and the choice
  // between them is a choice about the thread.
  assert.match(hero, /<OpenFlow key="plain" thread=\{false\} className="absolute inset-0" \/>/);
  assert.doesNotMatch(hero, /Bleed/);
  const flow = await read("src/components/open-flow.tsx");
  assert.match(flow, /thread = true/);
  assert.match(flow, /if \(withThread\)/);
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
