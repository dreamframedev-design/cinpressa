import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the mechanism section moved to the homepage, two columns", async () => {
  const [home, science] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/science/page.tsx"),
  ]);

  assert.match(home, /eyebrow="Mechanism"/);
  assert.match(home, /title="Targeting AGT upstream"/);
  // The cascade was too large as a full-measure stack, so it sits beside its
  // own prose. The header sits IN that column rather than across the top: with
  // the control model gone back to /science the column ran 241px against a
  // 714px diagram, which is a heading over a hole. With it, 447 against 739.
  assert.match(
    home,
    /lg:grid-cols-\[minmax\(0,0\.86fr\)_minmax\(0,1\.14fr\)\]/,
  );
  assert.ok(
    home.indexOf('eyebrow="Mechanism"') < home.indexOf("AGT is the precursor"),
    "the header belongs to the prose column, above its paragraphs",
  );
  assert.ok(
    home.indexOf("AGT is the precursor") < home.indexOf("<RaasPathway />"),
    "the prose column comes before the diagram column",
  );
  // One figure per section: the control model went back to /science.
  assert.doesNotMatch(home, /ControlModel/);

  // It is a move, not a copy.
  assert.doesNotMatch(code(science), /RaasPathway|Mechanism/);
});

test("the mechanism copy is the map's, word for word", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.match(
    home,
    /AGT is the precursor in the RAAS pathway and is crucial for\s*\n\s*blood pressure regulation\. Standard RAAS inhibitors act\s*\n\s*downstream and do not completely suppress the RAAS pathway\./,
  );
  assert.match(
    home,
    /By targeting AGT synthesis in the liver via RNA interference,\s*\n\s*CIN-111 is designed to block the RAAS cascade upstream\./,
  );
});

test("the cascade is consolidated, not cut down", async () => {
  const raas = await read("src/components/raas-pathway.tsx");

  // Every step and both intervention tags survive the consolidation.
  assert.equal((raas.match(/name: "/g) ?? []).length, 5);
  assert.match(raas, /CIN-111 silences AGT here/);
  assert.match(raas, /ACE inhibitors . ARBs act here/);
  assert.match(raas, /Upstream/);
  assert.match(raas, /Downstream/);

  // What changed is the setting: tighter card, step, heading and tags.
  assert.match(raas, /bg-white p-5 [^"]*sm:p-7/);
  assert.match(raas, /isLast \? "pb-0" : "pb-7"/);
  assert.match(raas, /text-lg font-normal tracking-tight text-ink/);
  assert.doesNotMatch(raas, /pb-11|sm:p-10|text-xl font-normal/);
});
