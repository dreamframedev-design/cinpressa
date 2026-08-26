import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("the homepage pipeline carries findings, not a decorative field", async () => {
  const [home, spec, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/components/program-spec.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.match(home, /import \{ ProgramSpec \}/);
  assert.match(home, /<Section tone="indigo"/);
  // The corner blob is gone for good.
  assert.doesNotMatch(home.replace(/\/\*[\s\S]*?\*\//g, ""), /PipelineField/);
  assert.doesNotMatch(css, /pipeline-field(?!-|s)/);

  // Provenance is not optional: findings without their study design are a boast.
  assert.match(home, /source="In hypertensive non-human primate studies"/);
  assert.match(spec, /program-spec-source/);

  // Exactly one accent in the section, on the differentiating claim.
  assert.equal((home.match(/accent: true/g) ?? []).length, 1);
  assert.match(home, /value: "More than three months",\s*\n\s*accent: true/);
});

test("the pipeline paragraph keeps the map's first and last sentences", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.match(
    home,
    /Our pipeline is centered on CIN-111, a long-acting AGT siRNA\s*\n\s*program for hypertension\./,
  );
  assert.match(
    home,
    /These data support a long-acting profile with infrequent\s*\n\s*administration\./,
  );
  // The middle sentence moved into the spec, so its prose form must not linger.
  assert.doesNotMatch(home, /has achieved near complete reductions in AGT/);
});

test("the pipeline spec is rows of hairlines, never a card", async () => {
  const css = await read("src/app/globals.css");

  assert.match(css, /\.program-spec \{[^}]*border-top: 1px solid var\(--color-pale\)/);
  assert.match(css, /\.program-spec-row \{[^}]*border-bottom: 1px solid var\(--color-pale\)/);
  assert.doesNotMatch(css, /\.program-spec[^{]*\{[^}]*border-radius/);
  assert.doesNotMatch(css, /\.program-spec[^{]*\{[^}]*box-shadow/);
});

test("the pipeline bloom is a crop, not a shape sitting in a box", async () => {
  const [bloom, css] = await Promise.all([
    read("src/components/pipeline-bloom.tsx"),
    read("src/app/globals.css"),
  ]);

  // The rule the old blob broke: every centre must be outside the 1440x620
  // frame, so only arcs enter and nothing has a findable middle.
  const centres = [...bloom.matchAll(/cx: (-?\d+), cy: (-?\d+)/g)].map((m) => [
    Number(m[1]),
    Number(m[2]),
  ]);
  assert.equal(centres.length, 5);
  for (const [cx, cy] of centres) {
    const outside = cx < 0 || cx > 1440 || cy < 0 || cy > 620;
    assert.ok(outside, `oval centre ${cx},${cy} sits inside the frame`);
  }

  // The saturated pair stay low enough to deepen the pale ovals rather than
  // read as blue and indigo shapes in their own right.
  const deep = [...bloom.matchAll(/color: "#(?:6771B5|2261AD)", alpha: ([\d.]+)/g)];
  assert.equal(deep.length, 2);
  for (const m of deep) assert.ok(Number(m[1]) <= 0.2, `deep oval alpha ${m[1]} too high`);

  // And it dissolves at the section seams instead of stopping at them.
  assert.match(css, /\.pipeline-bloom \{[\s\S]*?mask-image/);
});
