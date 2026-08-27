import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/** Docblocks describe the designs they replaced, so they must not answer the
 *  tests. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the homepage carries no newsroom - /news is the newsroom", async () => {
  const [home, css] = await Promise.all([
    read("src/app/home/page.tsx"),
    read("src/app/globals.css"),
  ]);

  // Removed by request. The teaser had been kicked back three times for not
  // reading as a press release section, and the real fix turned out to be that
  // the homepage does not need one.
  assert.doesNotMatch(code(home), /NewsFeed|ANNOUNCEMENTS/);
  assert.doesNotMatch(home, /id="news"/);
  assert.doesNotMatch(home, /What.s new at CinPressa/);

  // The component and its styles went with it rather than lingering unused;
  // /news styles itself and never used these.
  assert.doesNotMatch(css, /news-feed|news-entry|news-empty|news-kind/);
});

test("the newsroom has one source of truth and /news reads it", async () => {
  const [lib, news] = await Promise.all([
    read("src/lib/news.ts"),
    read("src/app/news/page.tsx"),
  ]);

  assert.match(lib, /const REAL: Announcement\[\] = \[\];/);
  assert.match(news, /from "@\/lib\/news"/);
  assert.doesNotMatch(code(news), /const ANNOUNCEMENTS/);
  assert.doesNotMatch(code(news), /new Intl\.DateTimeFormat/);
});

test("dates are formatted the way a newsroom formats them", async () => {
  const lib = await read("src/lib/news.ts");

  assert.match(lib, /month: "long"/);
  assert.match(lib, /day: "numeric"/);
  assert.match(lib, /year: "numeric"/);
});

test("the shipped placeholders cannot be mistaken for announcements", async () => {
  const body = code(await read("src/lib/news.ts"));

  // Every row is stamped in the UI's own kind slot, where "Press release" sits.
  const categories = [...body.matchAll(/category: "([^"]+)"/g)].map((m) => m[1]);
  assert.ok(categories.length >= 3);
  for (const c of categories) assert.equal(c, "Sample");

  // None is phrased as a CinPressa announcement.
  assert.doesNotMatch(body, /"[^"]*CinPressa[^"]*"/);
  assert.doesNotMatch(body, /(Announces|Submits|Reports|Initiates)/);

  // The real list stays empty, so publishing the true state is a one-word swap.
  assert.match(body, /export const ANNOUNCEMENTS: Announcement\[\] = SAMPLE;/);
});

test("no em dashes in copy that reaches the screen", async () => {
  const lib = code(await read("src/lib/news.ts"));
  const strings = [...lib.matchAll(/"([^"]{12,})"/g)].map((m) => m[1]);

  for (const s of strings) {
    assert.ok(!s.includes("\u2014"), `em dash in rendered copy: "${s}"`);
  }
});
