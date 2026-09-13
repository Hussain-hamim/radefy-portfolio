"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { RADEFY_HOOK_PATH, RADEFY_LEG_PATH } from "./RadefyLogo";

const SIGNATURE_EVENT = "radefy:signature-complete";

if (typeof window !== "undefined") {
  gsap.registerPlugin(MotionPathPlugin);
}

/**
 * Timing is in seconds. Mobile uses a slightly tighter `timeScale`.
 */
const SIGNATURE = {
  ease: "cubic-bezier(0.22, 1, 0.36, 1)",
  snap: "power3.out",
  seedIn: 0.48,
  vector: 0.7,
  seedTravel: 0.95,
  tracks: 0.82,
  trackStagger: 0.09,
  joins: 0.42,
  joinStagger: 0.06,
  resolve: 0.58,
  lock: 0.68,
  hold: 0.42,
  yield: 0.72,
} as const;

function prepStroke(el: SVGGeometryElement) {
  const length = el.getTotalLength();
  gsap.set(el, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });
}

function completeHero(hero: Element) {
  hero.classList.remove("is-signature-playing");
  hero.classList.add("is-signature-complete");
  hero.dispatchEvent(new Event(SIGNATURE_EVENT));
}

export default function RadefySignature() {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest(".hero");
    if (!root || !hero) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const compact = window.matchMedia("(max-width: 700px)").matches;

    const q = <T extends Element>(sel: string) =>
      root.querySelector(sel) as T | null;
    const qa = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll(sel)) as T[];

    const stage = q<SVGGElement>(".sig-stage");
    const seed = q<SVGGElement>(".sig-seed-g");
    const vector = q<SVGPathElement>(".sig-vector");
    const tracks = qa<SVGPathElement>(".sig-track");
    const joins = qa<SVGPathElement>(".sig-join");
    const nodes = qa<SVGRectElement>(".sig-node");
    const hook = q<SVGPathElement>(".sig-hook");
    const leg = q<SVGPathElement>(".sig-leg");

    if (!stage || !seed || !vector || !hook || !leg) {
      completeHero(hero);
      return;
    }

    let disposed = false;
    const finish = () => {
      if (disposed) return;
      disposed = true;
      window.clearTimeout(safety);
      root.classList.add("is-done");
      completeHero(hero);
    };

    const safety = window.setTimeout(finish, 8000);

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        finish();
        return;
      }

      hero.classList.add("is-signature-playing");

      prepStroke(vector);
      tracks.forEach(prepStroke);
      joins.forEach(prepStroke);
      gsap.set([vector, ...tracks, ...joins], { opacity: 1 });

      gsap.set(seed, {
        x: 10,
        y: 10,
        scale: 0,
        opacity: 0,
        transformOrigin: "0px 0px",
      });
      gsap.set(nodes, {
        scale: 0,
        autoAlpha: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(hook, { opacity: 0, x: -6 });
      gsap.set(leg, { opacity: 0, x: 18, y: 18 });
      gsap.set(stage, { transformOrigin: "50% 50%" });

      const tl = gsap.timeline({
        defaults: { ease: SIGNATURE.ease },
        onComplete: finish,
        timeScale: compact ? 1.14 : 1,
      });

      // Stage 1 — only the aperture-shaped seed. An idea, not the logo.
      tl.addLabel("begin").to(seed, {
        opacity: 1,
        scale: 0.36,
        duration: SIGNATURE.seedIn,
      });

      // Stage 2 — the seed takes the mark’s 45° axis. Direction is set.
      tl.addLabel("direction", ">-0.06")
        .to(
          vector,
          { strokeDashoffset: 0, duration: SIGNATURE.vector },
          "direction",
        )
        .to(
          seed,
          {
            motionPath: {
              path: vector,
              align: vector,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
            },
            scale: 1,
            duration: SIGNATURE.seedTravel,
          },
          "direction+=0.06",
        );

      // Stage 3 — tracks drawn from the mark’s real edges.
      // Horizon, cut, spine, fold, thrust — disciplines as geometry.
      tl.addLabel("paths", ">-0.22");
      tracks.forEach((track, index) => {
        tl.to(
          track,
          { strokeDashoffset: 0, duration: SIGNATURE.tracks },
          `paths+=${index * SIGNATURE.trackStagger}`,
        );
      });

      // Stage 4 — intersections snap. Complexity becomes a measured system.
      tl.addLabel("structure", ">-0.36");
      joins.forEach((join, index) => {
        tl.to(
          join,
          { strokeDashoffset: 0, duration: SIGNATURE.joins },
          `structure+=${index * SIGNATURE.joinStagger}`,
        );
      });
      nodes.forEach((node, index) => {
        tl.to(
          node,
          { scale: 1, autoAlpha: 1, duration: 0.28, ease: SIGNATURE.snap },
          `structure+=${0.1 + index * 0.045}`,
        );
      });

      // Stage 5 — the system resolves into the authentic mark.
      // Hook settles from the spine; the diagonal leg locks from the
      // direction of travel (header hover language, arriving not tucking).
      tl.addLabel("resolve", "+=0.16")
        .to(
          [...tracks, ...joins, vector],
          { opacity: 0, duration: SIGNATURE.resolve },
          "resolve",
        )
        .to(nodes, { autoAlpha: 0, scale: 0.55, duration: 0.36 }, "resolve")
        .to(
          hook,
          { opacity: 1, x: 0, duration: SIGNATURE.resolve },
          "resolve+=0.06",
        )
        .to(
          leg,
          {
            opacity: 1,
            x: 0,
            y: 0,
            duration: SIGNATURE.lock,
            ease: SIGNATURE.snap,
          },
          "resolve+=0.16",
        )
        .to(seed, { opacity: 0, duration: 0.32 }, "resolve+=0.62");

      // Stage 6 — hold the resolved mark, then yield to the existing hero.
      tl.addLabel("yield", `+=${SIGNATURE.hold}`).to(stage, {
        opacity: 0,
        scale: 0.94,
        duration: SIGNATURE.yield,
      });
    }, root);

    return () => {
      disposed = true;
      window.clearTimeout(safety);
      ctx.revert();
      hero.classList.remove("is-signature-playing");
    };
  }, []);

  return (
    <div className="radefy-signature" ref={rootRef} aria-hidden="true">
      <svg
        className="radefy-signature-svg"
        viewBox="-30 -30 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="sig-stage">
          {/* Direction vector — 45° brand axis into the aperture. */}
          <path className="sig-vector" d="M10 10 L62.5 62.5" />

          {/* Construction tracks taken from the mark’s real edges. */}
          <path className="sig-track" d="M-20 0 H74" />
          <path className="sig-track" d="M74 0 L100 26 V50 H75" />
          <path className="sig-track" d="M25 -18 V50" />
          <path className="sig-track" d="M25 50 L50 75 V118" />
          <path className="sig-track" d="M50 50 H75 L100 75 L122 97" />

          {/* Joins at the 25-unit intersections, including the open crook. */}
          <path className="sig-join" d="M25 25 H50" />
          <path className="sig-join" d="M75 50 L50 25 H25" />
          <path className="sig-join" d="M26 100 L0 74" />
          <path className="sig-join" d="M50 75 H75" />

          <rect className="sig-node" x="23.25" y="23.25" width="3.5" height="3.5" />
          <rect className="sig-node" x="23.25" y="48.25" width="3.5" height="3.5" />
          <rect className="sig-node" x="48.25" y="48.25" width="3.5" height="3.5" />
          <rect className="sig-node" x="73.25" y="48.25" width="3.5" height="3.5" />
          <rect className="sig-node" x="48.25" y="73.25" width="3.5" height="3.5" />

          {/* Authentic mark — paths shared with RadefyLogo. */}
          <path className="sig-hook" d={RADEFY_HOOK_PATH} />
          <path
            className="sig-leg"
            fillRule="evenodd"
            d={RADEFY_LEG_PATH}
          />

          {/* Seed: group origin is the square’s center so travel stays on-axis. */}
          <g className="sig-seed-g">
            <rect
              className="sig-seed"
              x="-6"
              y="-6"
              width="12"
              height="12"
              rx="2"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
