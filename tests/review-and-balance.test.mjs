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
  // buy that width downstream instead - widening the complications into a grid,
  // then a justified band that read as a footer - and each was worse.
  assert.doesNotMatch(css, /max-width:\s*46ch/);
  assert.doesNotMatch(science, /risk-register|risk-rank|const RANKS|const COLUMNS/);
  assert.doesNotMatch(science, /grid-cols-\[minmax\(0,0\.66fr\)/);
  assert.doesNotMatch(css, /risk-register|risk-rank|risk-item|\.risk-tag/);
  // The caption ends in a colon and introduces the list, so the list follows it
  // immediately at the same measure - never in a column of its own.
  assert.match(science, /risk of serious complications:[\s\S]{0,400}?<ul className="risk-list mt-5 max-w-3xl">/);
  // Two columns: the only count that divides seven without stranding one.
  assert.match(css, /\.risk-list \{[\s\S]{0,300}?columns: 2/);
  assert.match(css, /break-inside: avoid/);
  assert.doesNotMatch(css, /columns: 3/);
});
