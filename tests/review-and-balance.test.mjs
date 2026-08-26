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
  // The burden section takes its width from its figure, NOT from splitting the
  // prose. An earlier cut paired the paragraph with the list's caption to fill
  // the frame, which orphaned a sentence ending in a colon.
  assert.doesNotMatch(science, /lg:grid-cols-2/);
  // The seven are the section's figure, at the same 5xl measure every other
  // figure on the page uses. Two ranks of equal columns, so both share a left
  // and a right edge and neither leaves an empty cell.
  assert.match(science, /<div className="risk-register mt-8 max-w-5xl">/);
  // Ranks chunk by the grid's column count, so the second rank's dots land
  // under the first's. Halving the list breaks that the moment it is not 8.
  assert.match(science, /const COLUMNS = 4;/);
  assert.match(science, /complications\.slice\(r \* COLUMNS, r \* COLUMNS \+ COLUMNS\)/);
  assert.match(css, /\.risk-rank \{[^}]*border-top: 1px solid var\(--color-pale\)/);
  assert.doesNotMatch(science, /flex-wrap gap-2/);
  // No box: the note back was that they read as buttons.
  assert.doesNotMatch(css, /\.risk-tag/);
  assert.doesNotMatch(css, /\.risk-item \{[^}]*border/);
  assert.doesNotMatch(css, /\.risk-item \{[^}]*border-radius/);
  assert.match(science, /className="mt-14 max-w-5xl">\s*\n\s*<ControlModel/);

  // The dose card must stay on its own measure: its grid divides the width, so
  // widening it coarsens the dots rather than adding any.
  assert.doesNotMatch(home, /max-w-5xl">\s*\n\s*<Reveal variant="rise">\s*\n\s*<DoseMigration/);
});
