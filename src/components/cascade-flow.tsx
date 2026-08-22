"use client";

import { useEffect, useRef } from "react";

export type FlowTiming = {
  /** Seconds for one full pass, including the rest beat at the end. */
  cycle: number;
  /** Cycle fraction before the signal lights at the first station. */
  lead: number;
  /** Cycle fraction spent travelling from the first station to the last. */
  travel: number;
  /** Share of one station-to-station step that is held at the station. */
  dwell: number;
};

/**
 * Motion overlay for the RAAS cascade: a warm point of light that steps down
 * the spine, holding a beat on each node so the pathway reads as a sequence
 * rather than a list, and igniting each node as it lands.
 *
 * WHY THE CHOREOGRAPHY LIVES IN JS. The nodes are prose, so their heights
 * change with viewport, font loading and copy edits — a CSS keyframe cannot
 * know where the fourth dot is. Measuring lets the orb land exactly on centre
 * every time. Everything is driven through the Web Animations API rather than
 * a rAF loop: the whole system is created in one task, so every station's
 * flare shares a timeline origin with the orb and can never drift, and the
 * browser runs it off the main thread.
 *
 * The card renders complete and correct without any of this — the spine, the
 * nodes and their colours are server markup. This layer only adds light, so
 * no-JS, pre-hydration and reduced-motion all simply get the still diagram.
 */
export function CascadeFlow({ cycle, lead, travel, dwell }: FlowTiming) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const root = host?.parentElement;
    if (!host || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof Element.prototype.animate !== "function") return;

    const orb = root.querySelector<HTMLElement>("[data-orb]");
    const trail = root.querySelector<HTMLElement>("[data-trail]");
    const markers = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cascade-node]")
    );
    const flares = Array.from(
      root.querySelectorAll<HTMLElement>("[data-cascade-flare]")
    );
    if (!orb || !trail || markers.length < 2) return;

    const ms = cycle * 1000;
    const count = markers.length;
    const step = travel / (count - 1);
    const hold = step * dwell;
    /** Cycle fraction at which the signal reaches station k. */
    const arrival = (k: number) => lead + k * step;

    let anims: Animation[] = [];
    let visible = false;
    let frame = 0;

    /**
     * Layout position, summed up the offsetParent chain. Deliberately not
     * getBoundingClientRect: the Reveal system may still be running its
     * translate on these rows when this first measures, and offsetTop ignores
     * transforms where a rect would bake the in-flight offset in.
     */
    const offsetWithin = (el: HTMLElement) => {
      let y = 0;
      let node: HTMLElement | null = el;
      while (node && node !== root) {
        y += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return y;
    };

    const build = (resumeAt: number) => {
      anims.forEach((a) => a.cancel());
      anims = [];

      const ys = markers.map((m) => offsetWithin(m) + m.offsetHeight / 2);
      const head = ys[0];
      const span = ys[count - 1] - head;
      if (span <= 0) return;

      trail.style.top = `${head}px`;
      trail.style.height = `${span}px`;

      const orbAt = (y: number, s: number) =>
        `translate(-50%, ${y}px) scale(${s})`;
      const trailTo = (f: number) => `translateX(-50%) scaleY(${f})`;
      const reach = (k: number) => (ys[k] - head) / span;

      // Ease into and out of every station: the signal leaves slowly, crosses,
      // and decelerates onto the next dot. A linear crawl reads as a loading
      // bar; this reads as something arriving somewhere.
      const stride = "cubic-bezier(0.62, 0.02, 0.34, 1)";

      const orbFrames: Keyframe[] = [
        { offset: 0, transform: orbAt(head, 0.25), opacity: 0 },
        { offset: arrival(0), transform: orbAt(head, 1), opacity: 1 },
      ];
      const trailFrames: Keyframe[] = [
        { offset: 0, transform: trailTo(0), opacity: 0 },
        { offset: arrival(0), transform: trailTo(0), opacity: 1 },
      ];

      for (let k = 1; k < count; k++) {
        const leaves = arrival(k - 1) + hold;
        const lands = arrival(k);
        orbFrames.push(
          {
            offset: leaves,
            transform: orbAt(ys[k - 1], 1),
            opacity: 1,
            easing: stride,
          },
          { offset: lands, transform: orbAt(ys[k], 1), opacity: 1 }
        );
        trailFrames.push(
          {
            offset: leaves,
            transform: trailTo(reach(k - 1)),
            opacity: 1,
            easing: stride,
          },
          { offset: lands, transform: trailTo(reach(k)), opacity: 1 }
        );
      }

      const settled = Math.min(arrival(count - 1) + hold, 1);
      orbFrames.push(
        { offset: settled, transform: orbAt(ys[count - 1], 1), opacity: 1 },
        {
          offset: Math.min(settled + 0.06, 1),
          transform: orbAt(ys[count - 1], 0.25),
          opacity: 0,
        },
        { offset: 1, transform: orbAt(head, 0.25), opacity: 0 }
      );
      trailFrames.push(
        { offset: settled, transform: trailTo(1), opacity: 1 },
        { offset: Math.min(settled + 0.1, 1), transform: trailTo(1), opacity: 0 },
        { offset: 1, transform: trailTo(0), opacity: 0 }
      );

      const pass: KeyframeAnimationOptions = {
        duration: ms,
        iterations: Infinity,
        easing: "linear",
      };
      anims.push(orb.animate(orbFrames, pass), trail.animate(trailFrames, pass));

      // The stations. Equal time per step means every arrival lands on a known
      // fraction of the cycle, so these need no measurement — only a delay.
      markers.forEach((marker, k) => {
        const station: KeyframeAnimationOptions = {
          duration: ms,
          delay: arrival(k) * ms,
          iterations: Infinity,
        };
        anims.push(
          marker.animate(
            [
              { offset: 0, transform: "scale(1)" },
              {
                offset: 0.028,
                transform: "scale(1.3)",
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              },
              { offset: 0.14, transform: "scale(1)" },
              { offset: 1, transform: "scale(1)" },
            ],
            station
          )
        );
        const flare = flares[k];
        if (!flare) return;
        anims.push(
          flare.animate(
            [
              { offset: 0, opacity: 0, transform: "scale(0.6)" },
              {
                offset: 0.03,
                opacity: 1,
                transform: "scale(1.45)",
                easing: "cubic-bezier(0.16, 1, 0.3, 1)",
              },
              { offset: 0.24, opacity: 0, transform: "scale(2.7)" },
              { offset: 1, opacity: 0, transform: "scale(0.6)" },
            ],
            station
          )
        );
      });

      anims.forEach((a) => {
        a.currentTime = resumeAt;
        if (!visible) a.pause();
      });
    };

    const elapsed = () => {
      const t = anims[0]?.currentTime;
      return typeof t === "number" ? t : 0;
    };

    build(0);

    // Nothing runs while the card is off screen.
    const seen = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        anims.forEach((a) => (visible ? a.play() : a.pause()));
      },
      { rootMargin: "0px 0px -5% 0px" }
    );
    seen.observe(root);

    // Re-measure whenever the rows reflow: viewport changes, the webfont
    // swapping in, copy edits in dev.
    const sized = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => build(elapsed()));
    });
    sized.observe(root);

    return () => {
      seen.disconnect();
      sized.disconnect();
      cancelAnimationFrame(frame);
      anims.forEach((a) => a.cancel());
    };
  }, [cycle, lead, travel, dwell]);

  return (
    <>
      {/* Behind the nodes: the stretch of spine the signal has already covered,
          brightening downward toward the orb. */}
      <div
        ref={hostRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-6"
      >
        <span
          data-trail
          className="absolute left-1/2 w-[2px] origin-top rounded-full bg-[linear-gradient(to_bottom,rgba(249,168,26,0.04),rgba(249,168,26,0.5))] opacity-0"
          style={{ transform: "translateX(-50%) scaleY(0)" }}
        />
      </div>

      {/* In front of the nodes: the head of the signal, so it crosses each dot
          rather than disappearing behind it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-6"
      >
        <span
          data-orb
          className="absolute left-1/2 top-0 -mt-[7px] h-3.5 w-3.5 opacity-0"
          style={{ transform: "translate(-50%, 0) scale(0.25)" }}
        >
          <span
            aria-hidden
            className="absolute bottom-full left-1/2 h-14 w-[2px] -translate-x-1/2 bg-[linear-gradient(to_top,rgba(249,168,26,0.55),rgba(249,168,26,0))]"
          />
          <span
            aria-hidden
            className="absolute inset-0 rounded-full bg-[radial-gradient(circle,#ffffff_0%,#ffd884_40%,#f9a81a_74%)] shadow-[0_0_10px_2px_rgba(249,168,26,0.5),0_0_26px_9px_rgba(249,168,26,0.22)]"
          />
        </span>
      </div>
    </>
  );
}
