import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const home = readFileSync(new URL("../src/app/home/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
/* The hero moved into its own client component when it gained the A/B
   switch; the measurements below are still its measurements. */
const hero = readFileSync(new URL("../src/components/home-hero.tsx", import.meta.url), "utf8");
/** The docblock quotes the copy it replaced, so it must not answer the test.
 *  "persistence." also survives legitimately in "treatment persistence." */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the homepage hinge carries the replacement copy, as a crescendo", () => {
  // The old copy and every rule written for it are gone: there is no
  // "not X / it is Y" pair left for ink to migrate across.
  assert.doesNotMatch(code(home), /The unmet need in hypertension|It is <span/);
  assert.doesNotMatch(home, /verdict-(turn|set|answer|key)/);
  assert.doesNotMatch(code(css), /\.verdict-/);

  assert.match(home, /className="crescendo max-w-5xl"/);
  assert.match(home, /In hypertension, the challenge is not whether blood pressure/);
  assert.match(home, /The challenge is whether it can remain/);
  assert.match(home, /<span className="crescendo-key">controlled over time\.<\/span>/);
});

test("the verdict uses the site container without a custom grid", () => {
  assert.match(
    home,
    /<div className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-16">/,
  );
  assert.doesNotMatch(home, /verdict-(inner|conclusion|negation)/);
  assert.doesNotMatch(css, /\.verdict-(inner|conclusion|negation)/);
  assert.doesNotMatch(home, /verdict-layout/);
  // Widened from 4xl: the hinge was stopping two thirds across a frame its
  // neighbours fill. Still the plain container, still no custom grid.
  assert.match(home, /<div className="max-w-5xl">/);
});

test("the final hierarchy uses one supporting scale and a tighter desktop hero", () => {
  assert.match(hero, /min-h-\[88vh\][^"]*lg:min-h-\[76vh\]/);
  assert.doesNotMatch(home, /min-h-\[92vh\]/);
  // One supporting scale, shared by the premise — the value moved when the
  // hinge was widened; what matters is that there is still only one of it.
  assert.match(
    home,
    /<p className="[^"]*text-\[clamp\(1rem,1\.3vw,1\.2rem\)\][^"]*">\s*Daily oral therapy/,
  );
  assert.equal((home.match(/text-\[clamp\(1rem,1\.3vw,1\.2rem\)\]/g) ?? []).length, 1);
  assert.match(home, /className="crescendo-turn"/);
  assert.match(home, /className="crescendo-key"/);
  assert.doesNotMatch(home, /text-\[clamp\(1\.15rem,1\.8vw,1\.5rem\)\]/);
});
