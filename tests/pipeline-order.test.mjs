import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
/** The docblock names the headline it replaced, so it must not answer the
 *  test that the headline is gone. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the pipeline bar is the first thing under the hero", async () => {
  const page = await read("src/app/pipeline/page.tsx");

  const hero = page.indexOf("<PageHero");
  // The headline over the bar is gone - the hero above already names the
  // programme - so the eyebrow is what marks the section now.
  const stage = page.indexOf("<PipelineDiagram />");
  const lead = page.indexOf("hypertension-related indications");
  const clinical = page.indexOf('title="From IND to first-in-human"');

  assert.ok(hero < stage, "the stage section must come after the hero");
  assert.ok(
    stage < lead,
    "the stage section must come before the lead-program prose it used to sit under",
  );
  assert.ok(lead < clinical, "clinical development stays last");
});

test("the hero deck and the bar's headline are gone", async () => {
  const page = await read("src/app/pipeline/page.tsx");

  assert.doesNotMatch(page, /Depth of knockdown and safety/);
  assert.doesNotMatch(code(page), /CIN-111 development stage/);
  assert.doesNotMatch(code(page), /A single, focused program advancing/);
  // The eyebrow stays, so the figure is still labelled.
  assert.match(page, /Pipeline[\s\S]{0,20}?<\/p>/);
  // A hero with neither deck nor subtitle sits shorter, so the bar is not
  // pushed down the screen by 307px of empty white.
  const hero = await read("src/components/page-hero.tsx");
  assert.match(hero, /const bare = !deck && !subtitle && !aside;/);
  assert.match(hero, /min-h-\[26rem\] pb-12 lg:min-h-\[30rem\] lg:pb-16/);
  // The phrase survives as prose in the body, which is where it belongs.
  assert.match(page, /depth of AGT knockdown, and safety/);
});
