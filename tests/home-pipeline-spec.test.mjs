import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
/** The docblocks name what was removed, so they must not answer the tests. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the homepage carries no pipeline section at all", async () => {
  const [home, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/globals.css"),
  ]);

  // It lost its words first, leaving a colour band, and then the band went too.
  assert.doesNotMatch(code(home), /PipelineBloom|ProgramSpec|A focused program|Visit Pipeline/);
  assert.doesNotMatch(code(home), /Our pipeline is centered on CIN-111/);
  assert.doesNotMatch(code(home), /h-24 lg:h-36/);

  // The pieces went with it rather than lingering unused.
  await assert.rejects(read("src/components/pipeline-bloom.tsx"));
  assert.doesNotMatch(css, /\.pipeline-bloom/);
  assert.doesNotMatch(css, /program-spec/);
  assert.doesNotMatch(code(home), /PipelineField/);
  assert.doesNotMatch(css, /pipeline-field(?!-|s)/);
});

test("the bloom choreography stays, because the contact bloom still uses it", async () => {
  const [css, contact] = await Promise.all([
    read("src/app/globals.css"),
    read("src/components/contact-bloom.tsx"),
  ]);

  assert.match(contact, /cb-enter/);
  assert.match(contact, /cb-drift/);
  assert.match(css, /\.cb-enter/);
  assert.match(css, /\.cb-drift/);
});
