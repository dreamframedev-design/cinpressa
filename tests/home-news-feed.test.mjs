import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/** Assertions about what the file DOES must not be answerable by what it says
 *  about itself — the docblocks here explain the designs they replaced. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("homepage news uses the map's heading and the standard dated-list form", async () => {
  const [home, feed] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/components/news-feed.tsx"),
  ]);

  // Map copy, verbatim — the invented "What's ahead for CIN-111" is gone.
  assert.match(home, /title="What’s new at CinPressa"/);
  assert.match(
    home,
    /subtitle="Recent updates, key milestones, and the latest news from the company\."/,
  );
  assert.doesNotMatch(home, /What’s ahead for CIN-111/);

  // A list, not a calendar panel: no giant year, and the year rides the dates.
  const markup = code(feed);
  assert.doesNotMatch(markup, /forward calendar/i);
  assert.doesNotMatch(markup, />\s*2026\s*</);
  assert.match(markup, /when: "Mid-2026"/);
  assert.match(markup, /when: "Fall 2026"/);
  assert.match(markup, /<ol/);
});

test("news entries stay conditionally worded so they cannot read as announcements", async () => {
  const feed = await read("src/components/news-feed.tsx");

  assert.match(feed, /CinPressa plans to submit/);
  assert.match(feed, /is expected to commence/);
});

test("news rows are not links and carry no hover affordance", async () => {
  const [feed, css] = await Promise.all([
    read("src/components/news-feed.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.doesNotMatch(code(feed), /<Link/);
  assert.doesNotMatch(code(feed), /href=/);
  assert.doesNotMatch(css, /\.news-(entry|title|when|body):hover/);
});

test("the news CTA follows the list rather than floating in the header", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.ok(
    home.indexOf("<NewsFeed") < home.indexOf("Read the latest"),
    "the CTA should come after the feed",
  );
});
