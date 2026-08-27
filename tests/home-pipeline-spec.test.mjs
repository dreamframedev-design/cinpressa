import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/** The docblock names what was removed, so it must not answer the tests. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the homepage pipeline section is colour only", async () => {
  const [home, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/globals.css"),
  ]);

  // Every word was removed by request: the heading, both paragraphs, the link
  // and the findings spec. The field stays.
  assert.match(
    home,
    /<Section tone="indigo" art=\{<PipelineBloom className="absolute inset-0" \/>\}>\s*\n\s*<div aria-hidden className="h-24 lg:h-36" \/>\s*\n\s*<\/Section>/,
  );
  assert.doesNotMatch(code(home), /ProgramSpec|A focused program|Visit Pipeline/);
  assert.doesNotMatch(code(home), /Our pipeline is centered on CIN-111/);

  // The component and its styles went with it rather than lingering unused.
  assert.doesNotMatch(css, /program-spec/);

  // The corner blob is still gone for good.
  assert.doesNotMatch(code(home), /PipelineField/);
  assert.doesNotMatch(css, /pipeline-field(?!-|s)/);
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
  // Two, not five: one crossing is the minimum that can state the mark's
  // behaviour, and five said it five times until the section stopped reading.
  assert.equal(centres.length, 2);
  for (const [cx, cy] of centres) {
    const outside = cx < 0 || cx > 1440 || cy < 0 || cy > 620;
    assert.ok(outside, `oval centre ${cx},${cy} sits inside the frame`);
  }

  // Both sit below the frame, so the top of the section stays clean. That is
  // what blends it into the white section above.
  for (const [, cy] of centres) {
    assert.ok(cy > 620, `oval centre cy ${cy} reaches into the top of the frame`);
  }

  // Quiet. The first attempt ran half again this high and the note was that it
  // was too much.
  const alphas = [...bloom.matchAll(/alpha: ([\d.]+)/g)].map((m) => Number(m[1]));
  for (const a of alphas) assert.ok(a <= 0.45, `oval alpha ${a} too high`);

  // And it dissolves at the section seams instead of stopping at them.
  assert.match(css, /\.pipeline-bloom \{[\s\S]*?mask-image/);
});
