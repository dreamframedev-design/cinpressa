import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

/** Assertions about what a file DOES must not be answerable by what it says
 *  about itself — these docblocks describe the designs they replaced. */
const code = (source) => source.replace(/\/\*[\s\S]*?\*\//g, "");

test("the homepage news teaser is an announcements list, not a milestone list", async () => {
  const feed = code(await read("src/components/news-feed.tsx"));

  assert.match(feed, /from "@\/lib\/news"/);
  assert.match(feed, /ANNOUNCEMENTS/);

  // The milestones that kept it from reading as a press release section are
  // gone: no hardcoded entries, no vague future "dates".
  assert.doesNotMatch(feed, /Mid-2026/);
  assert.doesNotMatch(feed, /Fall 2026/);
  assert.doesNotMatch(feed, /U\.S\. IND submission/);
  assert.doesNotMatch(feed, /First-in-human study/);
});

test("entries render in press-release form when releases exist", async () => {
  const feed = code(await read("src/components/news-feed.tsx"));

  assert.match(feed, /<time dateTime=\{item\.date\}/);
  assert.match(feed, /formatAnnouncementDate\(item\.date\)/);
  assert.match(feed, /\{item\.category\}/);
  assert.match(feed, /\{item\.title\}/);
  assert.match(feed, /\{item\.summary\}/);
  assert.match(feed, /Read the release/);
});

test("dates are formatted the way a newsroom formats them", async () => {
  const lib = await read("src/lib/news.ts");

  assert.match(lib, /month: "long"/);
  assert.match(lib, /day: "numeric"/);
  assert.match(lib, /year: "numeric"/);
});

test("the newsroom has one source of truth", async () => {
  const [lib, news, feed] = await Promise.all([
    read("src/lib/news.ts"),
    read("src/app/news/page.tsx"),
    read("src/components/news-feed.tsx"),
  ]);

  assert.match(lib, /export const ANNOUNCEMENTS: Announcement\[\] = \[\];/);
  assert.match(news, /from "@\/lib\/news"/);
  assert.match(feed, /from "@\/lib\/news"/);
  assert.doesNotMatch(code(news), /const ANNOUNCEMENTS/);
  assert.doesNotMatch(code(news), /new Intl\.DateTimeFormat/);
});

test("the empty state is honest and sits on the same rails as the list", async () => {
  const [feed, css] = await Promise.all([
    read("src/components/news-feed.tsx"),
    read("src/app/globals.css"),
  ]);

  assert.match(feed, /has not issued any announcements yet/);
  assert.match(feed, /Visit the newsroom/);
  assert.match(css, /\.news-feed \{[^}]*border-top: 1px solid var\(--color-pale\)/);
  assert.match(css, /\.news-empty \{[^}]*border-bottom: 1px solid var\(--color-pale\)/);
});

test("the section keeps the map's headline and no subhead", async () => {
  const home = await read("src/app/home/page.tsx");

  assert.match(home, /title="What’s new at CinPressa"/);
  assert.doesNotMatch(home, /Recent updates, key milestones/);
  assert.doesNotMatch(home, /What’s ahead for CIN-111/);
  // The section CTA only appears alongside real entries — with nothing to
  // list, the feed's own link is the single way through.
  assert.match(home, /\{ANNOUNCEMENTS\.length > 0 \? \(/);
  assert.ok(
    home.indexOf("<NewsFeed") < home.indexOf("Read the latest"),
    "the CTA should come after the feed",
  );
});
