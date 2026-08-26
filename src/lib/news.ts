/**
 * The newsroom's single source of truth.
 *
 * WHY THIS MODULE EXISTS. The homepage teaser and /news were carrying separate
 * copies of what counts as news, and they had drifted into saying different
 * things: /news correctly kept ANNOUNCEMENTS (press releases, none yet) apart
 * from MILESTONES (forward-looking, their own section), while the homepage put
 * the milestones straight into the announcements slot. That is the whole reason
 * the homepage section kept reading as "not a press release section" — it was
 * not one. Milestones are not news. A list of things that have not happened,
 * dated "Mid-2026" and "Fall 2026", cannot be made to look like a release feed
 * by restyling it, because the problem is the content and not the format.
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
 * Genuinely empty, not staged. CinPressa has issued no releases, so both the
 * homepage teaser and /news render their empty states. Add entries to REAL
 * below, newest first, and the lists take over automatically — no layout work
 * required.
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
 * PREVIEW ONLY — NEVER SHIPS.
 *
 * These exist so the populated list can be looked at while the newsroom is
 * still empty. They are not press releases and must never be mistaken for any:
 * every one carries the category "Sample", which renders in the entry's own
 * kind slot, so any screen showing them is visibly stamped as a sample on every
 * row. The headlines are written at realistic length because the point is to
 * judge the layout, and the layout is what wraps.
 *
 * Gated on an env var that exists only in a developer's .env.local. Production
 * has no such variable, so it gets `REAL`, which is empty. There is no code
 * path that puts these in front of the public — and a test asserts it.
 *
 * To look at the populated design:  NEXT_PUBLIC_NEWS_PREVIEW=1 in .env.local
 * To go back to the true state:     remove it, or set it to 0
 */
const SAMPLE: Announcement[] = [
  {
    date: "2026-09-14",
    category: "Sample",
    title:
      "Sample entry — a headline of about this length, long enough to show how a real wire headline wraps in this column",
    summary:
      "The summary sits here and runs to roughly two lines at this measure, which is what a release abstract usually needs. Replace this whole array with real entries in the file above.",
    href: "#",
  },
  {
    date: "2026-07-02",
    category: "Sample",
    title: "Sample entry — a shorter headline, to show the ragged case",
    summary:
      "A one-line summary, so the row height difference between entries is visible.",
  },
  {
    date: "2026-05-20",
    category: "Sample",
    title:
      "Sample entry — the third row, present so the dividers and the date column can be judged in a stack",
    summary:
      "The homepage teaser shows the three most recent entries; the newsroom shows all of them.",
    href: "#",
  },
];

/**
 * The list both surfaces read. Empty in production, always.
 */
export const ANNOUNCEMENTS: Announcement[] =
  process.env.NEXT_PUBLIC_NEWS_PREVIEW === "1" ? SAMPLE : REAL;

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
