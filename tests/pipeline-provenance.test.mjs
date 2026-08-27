import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/**
 * The approved site map's section bodies, verbatim (Google Doc, "Home").
 * Every word a figure puts on screen must come from its own body — this file is
 * the guard against one quietly paraphrasing its source.
 *
 * The pipeline spec that used to be checked here is gone: the homepage pipeline
 * section is colour only now, by request, so there is no text left in it to
 * verify. MAP.pipeline stays because the removed strings must not come back
 * anywhere else, and the last test still checks the two that were caught.
 */
const MAP = {
  pipeline:
    "Our pipeline is centered on CIN-111, a long-acting AGT siRNA program for " +
    "hypertension. In hypertensive non-human primate studies, CIN-111 has " +
    "achieved near complete reductions in AGT and substantial, sustained " +
    "reductions in systolic blood pressure, with effects maintained for more " +
    "than three months. These data support a long-acting profile with " +
    "infrequent administration.",
  challenge:
    "1.4 billion people globally live with hypertension, and more than 700 " +
    "million remain uncontrolled or untreated. Seventy percent of treated " +
    "patients do not achieve target blood pressure levels, despite numerous " +
    "approved therapies. Medication non-adherence is the leading cause of poor " +
    "blood pressure control, and hypertension is largely asymptomatic, " +
    "resulting in poor long-term adherence and treatment persistence.",
};

/** The JSX for one component instance, so each figure is checked against its
 *  own map body rather than against the whole page. */
const block = (home, tag) => {
  const start = home.indexOf(`<${tag}`);
  assert.notEqual(start, -1, `${tag} not found`);
  const end = home.indexOf("/>", home.indexOf("]}", start));
  return home.slice(start, end);
};

const strings = (jsx) => [
  ...[...jsx.matchAll(/label: "([^"]+)"/g)].map((m) => m[1]),
  ...[...jsx.matchAll(/value: "([^"]+)"/g)].map((m) => m[1]),
  ...[...jsx.matchAll(/source="([^"]+)"/g)].map((m) => m[1]),
];

test("the challenge rail quotes its map body rather than paraphrasing it", async () => {
  const jsx = block(await read("src/app/home/page.tsx"), "BurdenRail");
  const labels = [...jsx.matchAll(/label:\s*\n?\s*"([^"]+)"/g)].map((m) => m[1]);
  const hay = MAP.challenge.toLowerCase();

  assert.equal(labels.length, 3);
  for (const s of labels) {
    assert.ok(hay.includes(s.toLowerCase()), `"${s}" is not in the map body`);
  }
});

test("the paraphrases that were found cannot come back", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.doesNotMatch(home, /label: "AGT reduction"/);
  assert.doesNotMatch(home, /label: "Effect maintained"/);
  assert.doesNotMatch(home, /people live with hypertension worldwide/);

  // And the spec they belonged to is gone entirely.
  assert.doesNotMatch(home, /ProgramSpec/);
  assert.ok(MAP.pipeline.length > 0);
});
