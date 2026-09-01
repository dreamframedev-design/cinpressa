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
  // none of the three can drift from the others. C and D share the mount key
  // outright, because what is being compared across those two is the type, not
  // the art; A differs from them only in the thread.
  assert.match(hero, /<OpenFlow key="plain" thread=\{false\} className="absolute inset-0" \/>/);
  assert.match(hero, /view === "c" \|\| view === "d"/);
  // The gold band is gone from the whole codebase, not just unused.
  assert.doesNotMatch(hero, /goldBand/);
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

test("D is C, set smaller and higher", async () => {
  const hero = await read("src/components/home-hero.tsx");
  const flow = await read("src/components/open-flow.tsx");

  // D was the gold band; it is a typographic variant now. Same field as C, so
  // the only differences between the two are the ones being judged.
  assert.match(hero, /const compact = view === "d";/);
  assert.match(hero, /compact[\s\S]{0,40}text-\[clamp\(2rem/);
  assert.match(hero, /compact\s*\?\s*"self-start pt-24 lg:pb-28 lg:pt-40"/);
  // And the band is deleted rather than left dangling behind a false default.
  assert.doesNotMatch(flow, /goldBand|paintGold|GOLD_INDEX/);
});

test("provenance is a badge, and the badge is portable", async () => {
  const hero = await read("src/components/home-hero.tsx");
  const badge = await read("src/components/portfolio-badge.tsx");

  assert.match(hero, /<PortfolioBadge parent="CinRx" \/>/);
  // The old kicker is gone from the hero entirely.
  assert.doesNotMatch(hero, /portfolio company/);
  // Nothing in the component is CinPressa's: the parent and the link are both
  // props, so a sibling site lifts the file and changes one word.
  assert.match(badge, /parent = "CinRx"/);
  assert.match(badge, /href = "https:\/\/cinrx.com"/);
  assert.doesNotMatch(badge, /CinPressa Pharma|CIN-111/);
  // The name must never be case-transformed - CinRx is elephant case.
  const css = await read("src/app/globals.css");
  const rule = css.slice(css.indexOf(".portfolio-badge-name"), css.indexOf(".portfolio-badge-rule"));
  assert.doesNotMatch(rule, /text-transform/);
});
