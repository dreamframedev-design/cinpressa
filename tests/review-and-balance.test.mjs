import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
/** Comments explain what was removed, so they must not answer the tests. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("review cuts: nothing above the dose animation, no pipeline tagline", async () => {
  const home = code(await read("src/app/home/page.tsx"));

  assert.doesNotMatch(home, /Designed to create a backbone of control/);
  assert.doesNotMatch(home, /Long-acting AGT silencing/);
  assert.doesNotMatch(home, /eyebrow="Our approach"/);
  assert.doesNotMatch(home, /CIN-111 at the center/);
  assert.match(home, /title="A focused program"/);
});

test("the science solution keeps its figure — the deck moved, the animation stayed", async () => {
  const science = await read("src/app/science/page.tsx");

  // The animation is the point of the section and was explicitly kept.
  assert.match(code(science), /<ControlModel \/>/);
  // The deck leads the body now instead of stacking under the headline.
  assert.doesNotMatch(science, /deck="Long-acting control with infrequent dosing"/);
  assert.match(
    science,
    /mt-11[^"]*">\s*\n\s*Long-acting control with infrequent dosing/,
  );
});

test("no section is left stranded at two thirds of its frame", async () => {
  const [home, science, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/science/page.tsx"),
    read("src/app/globals.css"),
  ]);

  // The four sections that used to stop short are paired or widened.
  assert.match(home, /<div className="max-w-5xl">/); // verdict
  assert.match(home, /lg:grid-cols-\[minmax\(0,1\.55fr\)_minmax\(0,1fr\)\]/); // dose card + copy
  assert.match(science, /className="crescendo max-w-5xl"/);
  // The burden section takes its width from the STATEMENT, which used to be
  // capped at 46ch and opened it at under half the frame. Five cuts tried to
  // buy that width downstream instead - a grid, then a band justified edge to
  // edge - and every one read worse than the tags they replaced.
  assert.doesNotMatch(css, /max-width:\s*46ch/);
  assert.doesNotMatch(science, /risk-register|risk-rank|risk-list|const RANKS|const COLUMNS/);
  assert.doesNotMatch(css, /risk-register|risk-rank|risk-list|risk-item/);
  // Tags, at the prose measure: wider and the seven break 6+1, stranding one.
  assert.match(science, /<ul className="mt-5 flex max-w-3xl flex-wrap gap-2">/);
  assert.match(css, /\.risk-tag \{/);
  // The lead-in ends in a colon and introduces the tags, so they follow it
  // immediately at the same measure - never in a column of its own.
  assert.match(science, /risk of serious complications:[\s\S]{0,400}?<ul className="mt-5 flex max-w-3xl/);
  // Measured rag fixes, not guesses: the lede broke 967px then 224px, and the
  // body paragraph's last line was 182px of a 768px measure.
  assert.match(css, /\.crescendo-lede,[\s\S]{0,900}?text-wrap: balance/);
  // pretty leaves a two-word stub ("treatment persistence." at 182px of 768);
  // balance breaks the same paragraph 492/477/529.
  // The element defaults must sit in @layer base or they outrank the utility:
  // unlayered CSS beats Tailwind's layers, so text-balance silently lost to
  // `p { text-wrap: pretty }` and read as a class that did nothing.
  assert.match(css, /@layer base \{[\s\S]{0,200}?text-wrap: pretty/);
  assert.match(science, /max-w-3xl text-balance[\s\S]{0,90}?Medication non-adherence/);
  assert.match(science, /text-pretty/);
  // "controlled over time." collided with the line above at 0.35rem.
  assert.match(css, /\.crescendo-point \{[\s\S]*?margin-top: 0\.8rem/);
});
