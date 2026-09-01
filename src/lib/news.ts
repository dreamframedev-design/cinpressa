/**
 * The newsroom's single source of truth.
 *
 * WHY THIS MODULE EXISTS. The homepage teaser and /news were carrying separate
 * copies of what counts as news, and they had drifted into saying different
 * things: /news correctly kept announcements (press releases, none yet) apart
 * from milestones (forward-looking, their own section), while the homepage put
 * the milestones straight into the announcements slot. That is the whole reason
 * the homepage section kept reading as "not a press release section". It was
 * not one. Milestones are not news, and a list of things that have not happened
 * cannot be restyled into a release feed.
 *
 * Both surfaces now read from here, so they cannot drift again, and the first
 * real release drops into both at once.
 */

export type Announcement = {
  /** ISO date. Drives both the <time> attribute and the displayed date. */
  date: string;
  /** "Press release", "Corporate", "Publication" — shown as the entry's kind. */
  category: string;
  title: string;
  summary: string;
  /** Omit until the release itself is hosted somewhere. */
  href?: string;
};

/**
 * The real list. CinPressa has issued no releases, so it is genuinely empty
 * rather than staged. Add entries here newest first and the lists take over
 * automatically, with no layout work.
 *
 * A real entry looks like a real release: a full date, a kind, and a headline
 * written the way a wire headline is written.
 *
 *   {
 *     date: "2026-06-15",
 *     category: "Press release",
 *     title:
 *       "CinPressa Pharma Submits Investigational New Drug Application for CIN-111",
 *     summary: "…",
 *     href: "…",
 *   }
 */
const REAL: Announcement[] = [];

/**
 * PLACEHOLDER CONTENT, SHIPPED ON PURPOSE AND TEMPORARY.
 *
 * These are on the deployed site so the populated design can be reviewed while
 * the newsroom is still empty. They are not press releases and are built so
 * that nobody can take them for any:
 *
 *   - Every entry's category is "Sample", which renders in the row's own kind
 *     slot, exactly where "Press release" would sit. Any screen showing one is
 *     stamped on every row.
 *   - Not one headline is phrased as a CinPressa announcement. They describe
 *     themselves as placeholders and say what they are demonstrating.
 *   - The site itself is behind the pre-launch password gate.
 *
 * It is realistic in LENGTH only, because the thing being judged is how a real
 * headline wraps at this measure and how one row sits in the page.
 *
 * THERE IS ONE, NOT THREE. Three were here to show the dividers, the date
 * column and the ragged case in a stack; with the layout settled, three
 * identical stand-ins on a newsroom that has published nothing read as three
 * announcements at a glance, which is worse than reading as none. The one that
 * stayed is the one that exercises the most: a full-length headline that has to
 * wrap, a two-line summary, and a release link.
 *
 * TO SHIP FOR REAL: change SAMPLE to REAL on the export below. That is the
 * whole removal, and a test will confirm the real list is still empty.
 */
const SAMPLE: Announcement[] = [
  {
    date: "2026-09-14",
    category: "Sample",
    title:
      "Placeholder headline of about this length, long enough to show how a real wire headline wraps across this column",
    summary:
      "The summary sits here and runs to roughly two lines at this measure, which is about what a release abstract needs. Replace this array with real entries in the file above.",
    href: "#",
  },
];

/**
 * The list both surfaces read.
 *
 * Currently SAMPLE, for design review. Swap to REAL to publish the true
 * (empty) state, or once real releases exist.
 */
export const ANNOUNCEMENTS: Announcement[] = SAMPLE;

const FORMATTER = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** "June 15, 2026" — the form every newsroom on earth uses. */
export function formatAnnouncementDate(iso: string): string {
  return FORMATTER.format(new Date(iso));
}
