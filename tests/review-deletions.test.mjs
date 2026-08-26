import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { access } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const gone = async (path) => {
  try {
    await access(new URL(`../${path}`, import.meta.url));
    return false;
  } catch {
    return true;
  }
};

/** Comments here explain what was removed, so they must not answer the tests. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the dose animation is the only headline above itself", async () => {
  const home = code(await read("src/app/home/page.tsx"));

  assert.doesNotMatch(home, /Designed to create a backbone of control/);
  assert.doesNotMatch(home, /Long-acting AGT silencing/);
  assert.doesNotMatch(home, /eyebrow="Our approach"/);
});

test("the homepage pipeline drops its tagline", async () => {
  const home = code(await read("src/app/home/page.tsx"));

  assert.doesNotMatch(home, /CIN-111 at the center/);
  assert.match(home, /title="A focused program"/);
});

test("the science solution deck sits on its paragraph, not under the headline", async () => {
  const science = await read("src/app/science/page.tsx");

  // Not a SectionHeader deck any more.
  assert.doesNotMatch(science, /deck="Long-acting control with infrequent dosing"/);
  // It leads the body instead, with a wider gap above than below.
  assert.match(
    science,
    /mt-11[^"]*">\s*\n\s*Long-acting control with infrequent dosing/,
  );
  assert.match(science, /mt-5 max-w-3xl text-base leading-relaxed text-body/);
});

test("the control model figure and its dependencies are gone", async () => {
  const [science, css] = await Promise.all([
    read("src/app/science/page.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.doesNotMatch(code(science), /ControlModel/);
  assert.ok(await gone("src/components/control-model.tsx"));
  assert.ok(await gone("src/components/foundation-flow.tsx"));
  // No orphaned choreography left behind.
  assert.doesNotMatch(css, /\.cm-(ping|orb|trail|bloom|hover)/);
});
