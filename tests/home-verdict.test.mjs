import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const home = readFileSync(new URL("../src/app/home/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
/* The hero has its own component; its approved measurements stay fixed. */
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

  // The full statement reads before its supporting evidence, at every width.
  const headline = home.match(/<h2 className="crescendo max-w-none">([\s\S]*?)<\/h2>/)?.[1];
  assert.ok(headline, "the statement is one semantic heading");
  assert.match(headline, /crescendo-lede[\s\S]*crescendo-turn[\s\S]*crescendo-key/);
  assert.match(home, /In hypertension, the challenge is not whether blood pressure/);
  assert.match(home, /The challenge is whether it can remain/);
  assert.match(home, /<span className="crescendo-key">controlled over time\.<\/span>/);
});

test("the hinge is one block with the cause and the consequence", () => {
  // The "Control that lasts remains elusive" headline is deleted and the two
  // sections it split are joined - they were always one thought.
  assert.doesNotMatch(code(home), /Control that lasts remains elusive/);
  assert.doesNotMatch(code(home), /verdict-(inner|conclusion|negation|layout)/);
  assert.doesNotMatch(code(css), /\.verdict-/);

  // Statement, then cause, then consequence, in one Section.
  const block = home.slice(home.indexOf("crescendo max-w-none"), home.indexOf("</Section>", home.indexOf("crescendo max-w-none")));
  assert.match(block, /Medication non-adherence is the leading cause/);
  assert.match(block, /risk of serious complications for/);
  assert.match(block, /COMPLICATIONS_RUN/);
  assert.ok(block.indexOf("controlled over time.") < block.indexOf("Medication non-adherence"));
  assert.ok(block.indexOf("Medication non-adherence") < block.indexOf("Persistent uncontrolled"));
  assert.doesNotMatch(block, /grid-cols|order-\d/);
});


test("the final hierarchy uses one supporting scale and a tighter desktop hero", () => {
  assert.match(hero, /min-h-\[88vh\][^"]*lg:min-h-\[76vh\]/);
  assert.doesNotMatch(home, /min-h-\[92vh\]/);
  // The premise paragraph is gone, and its supporting scale went with it -
  // nothing else on the page was using that clamp.
  assert.doesNotMatch(code(home), /Daily oral therapy/);
  assert.equal((home.match(/text-\[clamp\(1rem,1\.3vw,1\.2rem\)\]/g) ?? []).length, 0);
  // The crescendo is the whole block now, so it carries no top margin.
  assert.doesNotMatch(home, /delay=\{110\} className="mt-9 lg:mt-11"/);
  assert.match(home, /className="crescendo-turn"/);
  assert.match(home, /className="crescendo-key"/);
  assert.doesNotMatch(home, /text-\[clamp\(1\.15rem,1\.8vw,1\.5rem\)\]/);
});
