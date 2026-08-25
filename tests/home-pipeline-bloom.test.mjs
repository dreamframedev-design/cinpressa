import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage pipeline carries an asymmetric cropped brand field", async () => {
  const [home, bloom, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/components/pipeline-field.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.match(home, /import \{ PipelineField \}/);
  assert.match(home, /<Section tone="indigo" art=\{<PipelineField/);
  assert.equal((bloom.match(/color: "#/g) ?? []).length, 3);
  assert.match(bloom, /FORMS\.map/);
  assert.match(bloom, /#AFDBBC/);
  assert.match(bloom, /#95DAF8/);
  assert.match(bloom, /#2261AD/);
  assert.match(bloom, /mixBlendMode: "multiply"/);
  assert.match(css, /\.pipeline-field-drift/);
  assert.match(css, /prefers-reduced-motion:[\s\S]*\.pipeline-field-drift/);
});
