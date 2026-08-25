import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage news presents the two milestones as a 2026 forward calendar", async () => {
  const [home, calendar] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/components/milestone-strip.tsx"),
  ]);

  assert.match(home, /<Section id="news" tone="sky">/);
  assert.match(home, /title="What’s ahead for CIN-111"/);
  assert.match(calendar, /aria-label="2026 forward calendar"/);
  assert.match(calendar, /<ol/);
  assert.match(calendar, />\s*2026\s*</);
  assert.doesNotMatch(calendar, /What&rsquo;s ahead/);
  assert.ok(
    home.indexOf("<MilestoneStrip />") < home.indexOf("Read the latest"),
    "the news CTA should follow the calendar instead of floating in its header",
  );
});
