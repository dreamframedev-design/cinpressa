import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the pipeline bar is the first thing under the hero", async () => {
  const page = await read("src/app/pipeline/page.tsx");

  const hero = page.indexOf("<PageHero");
  const stage = page.indexOf('title="CIN-111 development stage"');
  const lead = page.indexOf("hypertension-related indications");
  const clinical = page.indexOf('title="From IND to first-in-human"');

  assert.ok(hero < stage, "the stage section must come after the hero");
  assert.ok(
    stage < lead,
    "the stage section must come before the lead-program prose it used to sit under",
  );
  assert.ok(lead < clinical, "clinical development stays last");
});

test("the hero deck is gone", async () => {
  const page = await read("src/app/pipeline/page.tsx");

  assert.doesNotMatch(page, /Depth of knockdown and safety/);
  // The phrase survives as prose in the body, which is where it belongs.
  assert.match(page, /depth of AGT knockdown, and safety/);
});
