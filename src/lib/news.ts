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
 * homepage teaser and /news render their empty states. Add entries here newest
 * first and the lists take over automatically — no layout work required.
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
export const ANNOUNCEMENTS: Announcement[] = [];

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
