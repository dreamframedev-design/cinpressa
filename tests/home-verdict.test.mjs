import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const home = readFileSync(new URL("../src/app/home/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");

test("the homepage verdict keeps 'not efficacy' together", () => {
  assert.match(
    home,
    /<span className="whitespace-nowrap">\s*not <span className="verdict-set">efficacy\.<\/span>\s*<\/span>/,
  );
  assert.match(home, /className="verdict-answer"/);
  assert.doesNotMatch(home, /verdict-word/);
});

test("the verdict uses the site container without a custom grid", () => {
  assert.match(
    home,
    /<div className="relative mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 lg:py-16">/,
  );
  assert.doesNotMatch(home, /verdict-(inner|conclusion|negation)/);
  assert.doesNotMatch(css, /\.verdict-(inner|conclusion|negation)/);
  assert.doesNotMatch(home, /verdict-layout/);
  assert.match(home, /<div className="max-w-4xl">/);
});

test("the final hierarchy uses one supporting scale and a tighter desktop hero", () => {
  assert.match(home, /min-h-\[88vh\][^"]*lg:min-h-\[76vh\]/);
  assert.doesNotMatch(home, /min-h-\[92vh\]/);
  assert.match(
    home,
    /<p className="[^"]*text-\[clamp\(1rem,1\.25vw,1\.12rem\)\][^"]*">\s*Daily oral therapy/,
  );
  assert.match(home, /className="verdict-turn"/);
  assert.match(home, /className="verdict-key"/);
  assert.doesNotMatch(home, /text-\[clamp\(1\.15rem,1\.8vw,1\.5rem\)\]/);
});
