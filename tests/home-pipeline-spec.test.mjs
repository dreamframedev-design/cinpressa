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
  assert.match(home, /<Section tone="indigo">/);
  // The blob is gone, and so is the section-level art slot it sat in.
  assert.doesNotMatch(home.replace(/\/\*[\s\S]*?\*\//g, ""), /PipelineField/);
  assert.doesNotMatch(css, /pipeline-field/);

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
