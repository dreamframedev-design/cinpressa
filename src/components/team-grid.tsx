import Image from "next/image";
import { Reveal } from "@/components/reveal";
import { PlaceholderNote } from "@/components/placeholder-note";

/**
 * Leadership grid.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ AWAITING REAL CONTENT: no names have been invented.                 │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * The About page's whole argument is that this team ran CinCor's baxdrostat
 * program through a $1.9B exit, but the site names nobody. Fill LEADERSHIP in
 * and the grid renders; until then it shows a wireframe so the gap is visible
 * rather than silently absent.
 *
 * Headshots go in /public/team/ as square crops, 800px minimum.
 */

type Member = {
  name: string;
  role: string;
  /** One or two sentences. Track record, not a CV. */
  bio: string;
  /** e.g. "/team/jane-doe.jpg". Omit and the card shows initials. */
  photo?: string;
};

const LEADERSHIP: Member[] = [];

/** How many wireframe cards to show while LEADERSHIP is empty. */
const WIREFRAME_SLOTS = 3;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function TeamGrid() {
  if (LEADERSHIP.length === 0) {
    return (
      <div>
        <PlaceholderNote>
          Leadership not yet supplied. Needs a name, role, one-line track
          record and a square headshot per person. No placeholder people have
          been invented.
        </PlaceholderNote>

        <div
          aria-hidden
          className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: WIREFRAME_SLOTS }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-dashed border-line bg-white/50 p-7"
            >
              <div className="h-16 w-16 rounded-full border border-dashed border-line bg-mist" />
              <div className="mt-6 h-3.5 w-1/2 rounded-full bg-mist" />
              <div className="mt-3 h-2.5 w-2/3 rounded-full bg-mist/80" />
              <div className="mt-6 space-y-2">
                <div className="h-2 w-full rounded-full bg-mist/70" />
                <div className="h-2 w-11/12 rounded-full bg-mist/70" />
                <div className="h-2 w-3/5 rounded-full bg-mist/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {LEADERSHIP.map((member, i) => (
        <Reveal
          key={member.name}
          variant="rise"
          delay={i * 80}
          className="lift rounded-2xl border border-line bg-white p-7"
        >
          {member.photo ? (
            <Image
              src={member.photo}
              alt=""
              width={160}
              height={160}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="flex h-16 w-16 items-center justify-center rounded-full bg-mist text-lg font-light tracking-wide text-blue"
            >
              {initials(member.name)}
            </span>
          )}
          <h3 className="mt-6 text-lg font-medium tracking-tight text-ink">
            {member.name}
          </h3>
          <p className="mt-1 text-[0.82rem] font-medium uppercase tracking-[0.16em] text-blue">
            {member.role}
          </p>
          <p className="mt-5 text-base leading-relaxed text-body">{member.bio}</p>
        </Reveal>
      ))}
    </div>
  );
}
