import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the mechanism section is a centred stack over a compact cascade", async () => {
  const [home, science] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/science/page.tsx"),
  ]);

  assert.match(home, /eyebrow="Mechanism"/);
  assert.match(home, /title="Targeting AGT upstream"/);

  // Header and both paragraphs sit above the diagram. The LINES read left -
  // centred lines cost legibility on a paragraph this long - while the COLUMN
  // is held to the cascade's own measure and centred, so copy and diagram share
  // one left edge and one right edge.
  assert.match(home, /<div className="mx-auto max-w-2xl">/);
  assert.match(home, /deck="RAAS modulation at the source"[\s\S]{0,40}?className="max-w-none!"/);
  assert.doesNotMatch(home, /align="center"/);
  assert.ok(
    home.indexOf('title="Targeting AGT upstream"') < home.indexOf("AGT is the precursor"),
    "the header comes before its paragraphs",
  );
  assert.ok(
    home.indexOf("AGT is the precursor") < home.indexOf("<RaasPathway />"),
    "the copy comes before the diagram",
  );

  // The cascade stays compact and centred; it is not allowed to widen.
  assert.match(home, /className="mx-auto mt-12 max-w-2xl"/);
  // ...and this section specifically is not a grid any more. Scoped, because
  // the dose section above it legitimately uses one.
  const mech = home.slice(home.indexOf('eyebrow="Mechanism"'), home.indexOf("<RaasPathway />"));
  assert.doesNotMatch(mech, /grid-cols/);

  // One figure per section: the control model lives on /science.
  assert.doesNotMatch(home, /ControlModel/);
  // And this is a move, not a copy.
  assert.doesNotMatch(code(science), /RaasPathway|Mechanism/);
});

test("the mechanism copy is the map's, word for word", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.match(
    home,
    /AGT is the precursor in the RAAS pathway and is crucial for[\s\S]{0,140}?suppress the RAAS pathway\./,
  );
  assert.match(
    home,
    /By targeting AGT synthesis in the liver via RNA interference,[\s\S]{0,90}?block the RAAS cascade upstream\./,
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

test("the cascade is gold down its whole length", async () => {
  const raas = await read("src/components/raas-pathway.tsx");

  // One colour, matching the CinRx pathway: gold dots on a gold line, lit by a
  // gold signal. It used to descend the logo ladder - amber, deep blue, azure,
  // pale blue, violet - so the travelling light passed through nodes drawn in
  // colours it never was.
  const accents = [...raas.matchAll(/accent: "(#[0-9a-fA-F]{6})"/g)].map((m) => m[1]);
  assert.equal(accents.length, 5);
  for (const a of accents) assert.equal(a, "#f9a81a");

  // The spine sits well back from the dots it connects.
  assert.match(raas, /background: "rgba\(249,168,26,0\.42\)"/);

  // Gold is 2.0:1 on white and the spec sheet keeps orange off type, so no
  // heading may take an accent as its colour.
  assert.doesNotMatch(raas, /color: node\.accent/);
  // Every node is a ring with a dot in it now, including the last.
  assert.doesNotMatch(code(raas), /node\.outcome/);
});
