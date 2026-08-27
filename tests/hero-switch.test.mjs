import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage hero switches between two treatments, A first", async () => {
  const hero = await read("src/components/home-hero.tsx");

  assert.match(hero, /^"use client";/);
  // A is the default and is the field that was on /pipeline.
  assert.match(hero, /useState<View>\("a"\)/);
  assert.match(hero, /import \{ HeroChurn \} from "@\/components\/hero-fields"/);
  // B is the mark.
  assert.match(hero, /<ConvergenceMark key="mark"[^>]*variant="cascade"/);
  // Two controls, no more: the four-way variant picker is not coming back.
  const labels = [...hero.matchAll(/label: "([AB])"/g)].map((m) => m[1]);
  assert.deepEqual(labels, ["A", "B"]);
  assert.match(hero, /aria-pressed=\{v\.id === view\}/);
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

  // /science's open flow went to /pipeline...
  assert.match(pipeline, /field=\{<OpenFlow className="absolute inset-0" \/>\}/);
  assert.doesNotMatch(pipeline, /HeroChurn/);
  // ...and /pipeline's churn went to the homepage hero as treatment A.
  assert.match(hero, /<HeroChurn key="churn" className="absolute inset-0" \/>/);
  // /science keeps no field of its own; PageHero falls back to its own mark.
  assert.doesNotMatch(science, /OpenFlow/);
});
