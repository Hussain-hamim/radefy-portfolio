"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export type TeamPerson = {
  name: string;
  role: string;
  image: string;
  x: string;
  linkedin: string;
};

const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function prepStroke(el: SVGGeometryElement | null) {
  if (!el) return;
  const length = el.getTotalLength();
  gsap.set(el, { strokeDasharray: length, strokeDashoffset: length });
}

function TeamCorners() {
  return (
    <svg className="team-corners" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M0 16V0H16" />
      <path d="M84 0H100V16" />
      <path d="M100 84V100H84" />
      <path d="M16 100H0V84" />
    </svg>
  );
}

function SocialIconX() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.6 1.5h2.2L9.7 7.2 16 14.5h-4.9l-3.8-5-4.4 5H.7l5.5-6.3L0 1.5h5l3.5 4.6 4.1-4.6Zm-.8 11.7h1.2L4.3 2.7H3L11.8 13.2Z"
      />
    </svg>
  );
}

function SocialIconLinkedin() {
  return (
    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.6 14.5H.9V5.4h2.7v9.1ZM2.2 4.1C1.3 4.1.6 3.4.6 2.5S1.3.9 2.2.9s1.6.7 1.6 1.6-.7 1.6-1.6 1.6ZM15.4 14.5h-2.7V10c0-1.1 0-2.4-1.5-2.4s-1.7 1.2-1.7 2.3v4.6H6.8V5.4h2.6v1.2h.1c.4-.7 1.3-1.5 2.6-1.5 2.8 0 3.3 1.8 3.3 4.2v5.2Z"
      />
    </svg>
  );
}

export default function TeamSystem({ people }: { people: readonly TeamPerson[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;

    const q = <T extends Element>(sel: string) =>
      root.querySelector(sel) as T | null;
    const qa = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll(sel)) as T[];

    const stage = q<HTMLElement>(".team-system-stage");
    const scaffold = q<SVGSVGElement>(".team-scaffold");
    const datum = q<SVGLineElement>(".team-datum");
    const seed = q<SVGRectElement>(".team-seed");
    const links = qa<SVGLineElement>(".team-link");
    const members = qa<HTMLElement>(".team-member");
    const avatars = qa<HTMLElement>(".team-avatar");
    const corners = qa<SVGPathElement>(".team-corners path");
    const names = qa<HTMLElement>(".team-person-name");
    const roles = qa<HTMLElement>(".team-person-role");
    const indexes = qa<HTMLElement>(".team-index");
    const title = root.querySelector(".team-people-title");

    if (!stage || !scaffold || !datum || !seed || !members.length) return;

    const pointOf = (node: Element) => {
      const system = stage.getBoundingClientRect();
      const rect = node.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - system.left,
        y: rect.top + rect.height / 2 - system.top,
        left: rect.left - system.left,
        right: rect.right - system.left,
        top: rect.top - system.top,
        bottom: rect.bottom - system.top,
      };
    };

    const layoutScaffold = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;

      scaffold.setAttribute("viewBox", `0 0 ${width} ${height}`);
      const centers = avatars.map(pointOf);
      if (!centers.length) return;

      const row = centers.every(
        (center) => Math.abs(center.y - (centers[0]?.y ?? 0)) < 24,
      );
      const baseline = (centers[0]?.bottom ?? 0) + 12;
      datum.dataset.hidden = row ? "false" : "true";

      datum.setAttribute("x1", "0");
      datum.setAttribute("y1", `${baseline}`);
      datum.setAttribute("x2", `${width}`);
      datum.setAttribute("y2", `${baseline}`);

      const twoByTwo = !row && centers.length === 4;
      const mobileLinks = new Set(["0-1", "2-3", "0-2", "1-3"]);

      links.forEach((link) => {
        const key = link.dataset.link ?? "0-1";
        const [from, to] = key.split("-").map(Number);
        const a = centers[from ?? 0];
        const b = centers[to ?? 1];
        if (!a || !b) return;

        const stacked = Math.abs(a.y - b.y) > 24;
        const hide = row ? stacked : twoByTwo ? !mobileLinks.has(key) : false;
        link.dataset.hidden = hide ? "true" : "false";

        if (hide) {
          link.setAttribute("x1", `${a.x}`);
          link.setAttribute("y1", `${a.y}`);
          link.setAttribute("x2", `${a.x}`);
          link.setAttribute("y2", `${a.y}`);
          return;
        }

        if (stacked) {
          const down = b.top > a.bottom;
          link.setAttribute("x1", `${a.x}`);
          link.setAttribute("y1", `${down ? a.bottom + 3 : a.top - 3}`);
          link.setAttribute("x2", `${b.x}`);
          link.setAttribute("y2", `${down ? b.top - 3 : b.bottom + 3}`);
          return;
        }

        const rightward = b.left > a.right;
        link.setAttribute("x1", `${rightward ? a.right + 4 : a.left - 4}`);
        link.setAttribute("y1", `${a.y}`);
        link.setAttribute("x2", `${rightward ? b.left - 4 : b.right + 4}`);
        link.setAttribute("y2", `${b.y}`);
      });

      return { centers, baseline };
    };

    const moveSeed = (index: number | null) => {
      const mapped = layoutScaffold();
      if (!mapped) return;
      const home = mapped.centers[index ?? 0];
      if (!home) return;
      gsap.to(seed, {
        x: home.x - 3.5,
        y: home.top - 14,
        duration: reduceMotion ? 0 : 0.45,
        ease: EASE,
        overwrite: "auto",
      });
    };

    const setActive = (index: number | null) => {
      if (index === null) {
        root.dataset.active = "";
        members.forEach((member) => member.classList.remove("is-active"));
        links.forEach((link) => link.classList.remove("is-hot"));
        return;
      }

      root.dataset.active = String(index);
      members.forEach((member, i) => {
        member.classList.toggle("is-active", i === index);
      });
      links.forEach((link) => {
        const [from, to] = (link.dataset.link ?? "").split("-");
        const hot = from === String(index) || to === String(index);
        link.classList.toggle("is-hot", hot);
      });
      moveSeed(index);
    };

    const listeners = members.map((member, index) => {
      const onEnter = () => {
        if (!canHover) return;
        setActive(index);
      };
      const onLeave = () => {
        if (!canHover) return;
        setActive(null);
      };
      const onTap = (event: Event) => {
        if (canHover) return;
        const target = event.target as HTMLElement | null;
        if (target?.closest("a")) return;
        const next = root.dataset.active === String(index) ? null : index;
        setActive(next);
      };
      const onFocus = () => setActive(index);

      member.addEventListener("pointerenter", onEnter);
      member.addEventListener("pointerleave", onLeave);
      member.addEventListener("click", onTap);
      member.addEventListener("focusin", onFocus);

      return () => {
        member.removeEventListener("pointerenter", onEnter);
        member.removeEventListener("pointerleave", onLeave);
        member.removeEventListener("click", onTap);
        member.removeEventListener("focusin", onFocus);
      };
    });

    const onRootFocusOut = (event: FocusEvent) => {
      if (!root.contains(event.relatedTarget as Node | null)) {
        if (!canHover) return;
        setActive(null);
      }
    };
    root.addEventListener("focusout", onRootFocusOut);

    const resizeObserver = new ResizeObserver(() => {
      const current = root.dataset.active;
      layoutScaffold();
      if (current !== "") moveSeed(Number(current));
    });
    resizeObserver.observe(stage);

    let cleanupObserver: (() => void) | undefined;

    const ctx = gsap.context(() => {
      layoutScaffold();
      gsap.set(seed, { x: -20, y: -20, opacity: 0 });

      if (reduceMotion) {
        root.classList.add("is-ready");
        return;
      }

      prepStroke(datum);
      links.forEach(prepStroke);
      corners.forEach(prepStroke);

      gsap.set(title, { opacity: 0, y: 14 });
      gsap.set(avatars, { clipPath: "inset(100% 0 0 0)" });
      gsap.set(names, { opacity: 0, y: 8 });
      gsap.set(roles, { opacity: 0, y: 6 });
      gsap.set(indexes, { opacity: 0 });
      gsap.set([datum, ...links], { opacity: 1 });
      gsap.set(corners, { opacity: 1 });

      const play = () => {
        const first = layoutScaffold()?.centers[0];
        const tl = gsap.timeline({
          defaults: { ease: EASE },
          onComplete: () => root.classList.add("is-ready"),
        });

        // Stage 1 — the datum line. A measured baseline, not a UI chrome.
        tl.addLabel("grid")
          .to(title, { opacity: 1, y: 0, duration: 0.55 }, "grid")
          .to(datum, { strokeDashoffset: 0, duration: 0.7 }, "grid+=0.08")
          .to(seed, { opacity: 1, duration: 0.3 }, "grid+=0.2");

        if (first) {
          tl.to(
            seed,
            { x: first.x - 3.5, y: first.top - 14, duration: 0.55 },
            "grid+=0.22",
          );
        }

        // Stage 2 — frames assemble, then portraits rise into them.
        tl.addLabel("frames", ">-0.15");
        members.forEach((_, index) => {
          const marks = qa<SVGPathElement>(
            `.team-member[data-index="${index}"] .team-corners path`,
          );
          const avatar = avatars[index];
          marks.forEach((mark, markIndex) => {
            tl.to(
              mark,
              { strokeDashoffset: 0, duration: 0.42 },
              `frames+=${index * 0.14 + markIndex * 0.04}`,
            );
          });
          if (avatar) {
            tl.to(
              avatar,
              { clipPath: "inset(0% 0 0 0)", duration: 0.7 },
              `frames+=${index * 0.14 + 0.12}`,
            );
          }
        });

        // Stage 3 — members connect, then identity settles.
        tl.addLabel("system", ">-0.28");
        links.forEach((link, index) => {
          if (link.dataset.hidden === "true") return;
          tl.to(
            link,
            { strokeDashoffset: 0, duration: 0.5 },
            `system+=${index * 0.08}`,
          );
        });
        tl.to(indexes, { opacity: 1, duration: 0.35, stagger: 0.06 }, "system+=0.1");
        tl.to(names, { opacity: 1, y: 0, duration: 0.45, stagger: 0.07 }, "system+=0.16");
        tl.to(roles, { opacity: 1, y: 0, duration: 0.4, stagger: 0.07 }, "system+=0.28");
      };

      let played = false;
      const start = () => {
        if (played) return;
        played = true;
        observer.disconnect();
        window.removeEventListener("scroll", tryPlay);
        play();
      };
      const tryPlay = () => {
        const rect = root.getBoundingClientRect();
        const viewport = window.innerHeight;
        if (rect.top < viewport * 0.88 && rect.bottom > 96) start();
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) start();
        },
        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
      );
      observer.observe(root);
      window.addEventListener("scroll", tryPlay, { passive: true });
      tryPlay();
      cleanupObserver = () => {
        observer.disconnect();
        window.removeEventListener("scroll", tryPlay);
      };
    }, root);

    return () => {
      cleanupObserver?.();
      ctx.revert();
      resizeObserver.disconnect();
      root.removeEventListener("focusout", onRootFocusOut);
      listeners.forEach((unbind) => unbind());
    };
  }, [people]);

  return (
    <div className="team-people" ref={rootRef}>
      <h2 className="team-people-title">Meet our team</h2>

      <div className="team-system-stage">
        <svg className="team-scaffold" aria-hidden="true">
          <line className="team-datum" />
          <line className="team-link" data-link="0-1" />
          <line className="team-link" data-link="1-2" />
          <line className="team-link" data-link="2-3" />
          <line className="team-link" data-link="0-2" />
          <line className="team-link" data-link="1-3" />
          <rect className="team-seed" width="7" height="7" rx="1.2" />
        </svg>

        <div className="team-people-grid">
          {people.map((person, index) => (
            <article
              key={person.name}
              className="team-member"
              data-index={index}
              tabIndex={0}
            >
              <div className="team-frame">
                <span className="team-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <TeamCorners />
                <span className="team-avatar">
                  <Image
                    src={person.image}
                    alt=""
                    width={400}
                    height={400}
                    className="team-avatar-image"
                  />
                  <span className="team-socials">
                    <a
                      className="team-social"
                      href={person.x}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${person.name} on X`}
                    >
                      <SocialIconX />
                    </a>
                    <a
                      className="team-social"
                      href={person.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${person.name} on LinkedIn`}
                    >
                      <SocialIconLinkedin />
                    </a>
                  </span>
                </span>
              </div>
              <p className="team-person-name">{person.name}</p>
              <p className="team-person-role">{person.role}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
