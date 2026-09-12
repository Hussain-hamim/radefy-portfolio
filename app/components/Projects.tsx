"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import ScrollReveal from "./ScrollReveal";

const PROJECTS = [
  {
    name: "Radefy English Academy",
    category: "Education / Academy Management",
    focus: "Education",
    detail: "Ops dashboard for enrollments, fees, and growth",
    href: "https://course-rad-sys.vercel.app/",
    image: "/projects/radefy-english-academy.png",
  },
  {
    name: "Kyzenn",
    category: "Amazon Growth / eCommerce",
    focus: "eCommerce",
    detail: "Brand and product systems built to convert",
    href: "#projects",
    image: "/projects/kyzenn.jpg",
  },
  {
    name: "SenseHawk",
    category: "Climate Tech / Enterprise SaaS",
    focus: "Climate SaaS",
    detail: "Enterprise web for field and climate ops",
    href: "#projects",
    image: "/projects/sensehawk.jpg",
  },
  {
    name: "Fluxora",
    category: "Payments / POS Solutions",
    focus: "Payments",
    detail: "Clear product story for POS and checkout",
    href: "#projects",
    image: "/projects/fluxora.jpg",
  },
  {
    name: "Finite",
    category: "Fintech / Brand Platform",
    focus: "Fintech",
    detail: "Identity and site for a sharper finance brand",
    href: "#projects",
    image: "/projects/finite.jpg",
  },
  {
    name: "Northline CRM",
    category: "B2B SaaS / Sales Ops",
    focus: "B2B SaaS",
    detail: "Product UI and marketing site for pipeline teams",
    href: "#projects",
    image: "/projects/sensehawk.jpg",
  },
] as const;

const SLIDE_DURATION_MS = 560;
const LAST_INDEX = PROJECTS.length - 1;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function paintSlide(el: HTMLElement, index: number, visual: number) {
  const distance = index - visual;
  const abs = Math.abs(distance);
  const sign = distance === 0 ? 0 : distance > 0 ? 1 : -1;
  const isCenter = abs < 0.45;

  el.style.setProperty("--slide-x", `${distance * 44}vw`);
  el.style.setProperty("--slide-z", `${-Math.min(abs, 3) * 140}px`);
  el.style.setProperty(
    "--slide-rotate",
    `${-sign * Math.min(abs, 2.2) * 32}deg`,
  );
  el.style.setProperty(
    "--slide-scale",
    `${Math.max(0.66, 1 - abs * 0.2)}`,
  );
  el.style.setProperty(
    "--slide-opacity",
    `${abs > 1.55 ? 0 : Math.max(0.45, 1 - abs * 0.32)}`,
  );
  el.style.zIndex = `${Math.round(40 - abs * 8)}`;
  el.style.pointerEvents = abs > 1.35 ? "none" : "auto";
  el.classList.toggle("is-center", isCenter);
}

export default function Projects() {
  const pinRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const coverflowRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const visualRef = useRef(0);
  const ignoreScrollRef = useRef(false);
  const wheelLockRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const animFrameRef = useRef(0);
  const animatingRef = useRef(false);
  const scrollFrameRef = useRef(0);
  const metricsRef = useRef({ range: 0, stuckTop: 0, enabled: false });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: number;
    axis: "x" | "y" | null;
    dragging: boolean;
  } | null>(null);
  const reduceMotionRef = useRef(false);

  const paintVisual = useCallback((value: number, syncActive = true) => {
    const next = clamp(value, 0, LAST_INDEX);
    visualRef.current = next;

    const slides = slideRefs.current;
    for (let i = 0; i < slides.length; i++) {
      const el = slides[i];
      if (el) paintSlide(el, i, next);
    }

    if (!syncActive) return;
    const nextActive = Math.round(next);
    if (nextActive !== activeRef.current) {
      activeRef.current = nextActive;
      setActive(nextActive);
    }
  }, []);

  const cancelAnimation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
    animatingRef.current = false;
  }, []);

  const animateVisualTo = useCallback(
    (index: number) => {
      const to = clamp(index, 0, LAST_INDEX);
      cancelAnimation();

      if (reduceMotionRef.current || Math.abs(visualRef.current - to) < 0.001) {
        paintVisual(to);
        return;
      }

      const from = visualRef.current;
      const start = performance.now();
      animatingRef.current = true;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_DURATION_MS);
        paintVisual(from + (to - from) * easeOutCubic(t), t >= 1);

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        animFrameRef.current = 0;
        animatingRef.current = false;
        paintVisual(to);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, paintVisual],
  );

  const syncScrollToIndex = useCallback((index: number) => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    const { enabled, range, stuckTop } = metricsRef.current;
    if (!pin || !sticky || !enabled || range <= 0) return;

    const pinDocTop = window.scrollY + pin.getBoundingClientRect().top;
    const target =
      pinDocTop - stuckTop + (index / Math.max(1, LAST_INDEX)) * range;

    ignoreScrollRef.current = true;
    window.scrollTo({ top: target, behavior: "auto" });
    window.setTimeout(() => {
      ignoreScrollRef.current = false;
    }, 80);
  }, []);

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = clamp(index, 0, LAST_INDEX);
      activeRef.current = nextIndex;
      setActive(nextIndex);
      animateVisualTo(nextIndex);
      syncScrollToIndex(nextIndex);
    },
    [animateVisualTo, syncScrollToIndex],
  );

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reduceMotionRef.current = query.matches;
    const onChange = () => {
      reduceMotionRef.current = query.matches;
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useLayoutEffect(() => {
    paintVisual(visualRef.current, false);
  }, [active, paintVisual]);

  // Pin metrics + scroll-driven coverflow on all viewports.
  useEffect(() => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    if (!pin || !sticky) return;

    const desktopQuery = window.matchMedia("(min-width: 768px)");

    const measure = () => {
      const desktop = desktopQuery.matches;
      const travel = desktop
        ? window.innerHeight * 0.72
        : window.innerHeight * 0.58;

      pin.style.height = `${sticky.offsetHeight + LAST_INDEX * travel}px`;
      metricsRef.current.enabled = true;
      metricsRef.current.stuckTop =
        parseFloat(getComputedStyle(sticky).top) || 0;
      metricsRef.current.range = Math.max(
        0,
        pin.offsetHeight - sticky.offsetHeight,
      );
    };

    const updateFromScroll = () => {
      if (!metricsRef.current.enabled || dragRef.current?.dragging) return;
      if (
        ignoreScrollRef.current ||
        wheelLockRef.current ||
        animatingRef.current
      ) {
        return;
      }

      const { range, stuckTop } = metricsRef.current;
      if (range <= 0) return;

      const pinTop = pin.getBoundingClientRect().top;
      const progress = clamp((stuckTop - pinTop) / range, 0, 1);
      paintVisual(progress * LAST_INDEX);
    };

    const onScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = requestAnimationFrame(() => {
        scrollFrameRef.current = 0;
        updateFromScroll();
      });
    };

    const onResize = () => {
      measure();
      updateFromScroll();
    };

    measure();
    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    desktopQuery.addEventListener("change", onResize);

    return () => {
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktopQuery.removeEventListener("change", onResize);
      pin.style.height = "";
    };
  }, [paintVisual]);

  // Trackpad / mouse wheel swipe over the coverflow.
  useEffect(() => {
    const node = coverflowRef.current;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      const horizontal = absX > absY * 0.55 && absX > 1.5;

      if (!horizontal && absY < 8) return;
      if (!horizontal && absY >= absX && !event.shiftKey) {
        if (!metricsRef.current.enabled) return;
        const sticky = stickyRef.current;
        if (!sticky) return;
        const rect = sticky.getBoundingClientRect();
        const isPinned =
          Math.abs(rect.top - metricsRef.current.stuckTop) < 2;
        if (!isPinned) return;
      }

      event.preventDefault();

      const delta = horizontal
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : event.deltaY;

      wheelAccumRef.current += delta;

      if (wheelLockRef.current) return;
      if (Math.abs(wheelAccumRef.current) < 36) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      wheelLockRef.current = true;
      goTo(activeRef.current + direction);

      window.setTimeout(() => {
        wheelLockRef.current = false;
        wheelAccumRef.current = 0;
      }, SLIDE_DURATION_MS + 20);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [goTo]);

  useEffect(() => () => cancelAnimation(), [cancelAnimation]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: visualRef.current,
      axis: null,
      dragging: false,
    };
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;

    if (!drag.axis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      // Vertical wins → let page scroll drive the pin like desktop.
      if (Math.abs(dy) >= Math.abs(dx)) {
        drag.axis = "y";
        return;
      }
      drag.axis = "x";
      drag.dragging = true;
      cancelAnimation();
      coverflowRef.current?.classList.add("is-dragging");
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    if (drag.axis !== "x" || !drag.dragging) return;
    paintVisual(drag.origin - dx / 280, false);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const wasDragging = drag.dragging;
    const delta = event.clientX - drag.startX;
    const origin = drag.origin;
    dragRef.current = null;
    coverflowRef.current?.classList.remove("is-dragging");

    if (!wasDragging) return;

    if (Math.abs(delta) > 56) {
      goTo(Math.round(origin) + (delta < 0 ? 1 : -1));
    } else {
      goTo(Math.round(visualRef.current));
    }
  };

  return (
    <section className="projects" id="projects" ref={pinRef}>
      <div className="projects-sticky" ref={stickyRef}>
        <ScrollReveal as="header" className="projects-header">
          <div className="projects-heading">
            <h2 className="projects-title">Projects</h2>
          </div>
          <p className="projects-lede">
            Case studies that show how brand, web, and growth come together for
            B2B teams.
          </p>
          <p className="projects-hint">Swipe or scroll — the center piece comes forward.</p>
        </ScrollReveal>

        <div className="projects-stage">
          <div
            className="projects-coverflow"
            ref={coverflowRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {PROJECTS.map((project, index) => {
              const external = project.href.startsWith("http");
              const isCenter = index === active;

              return (
                <article
                  key={project.name}
                  className="projects-slide"
                  ref={(node) => {
                    slideRefs.current[index] = node;
                  }}
                >
                  <a
                    className="project-card"
                    href={project.href}
                    tabIndex={isCenter ? 0 : -1}
                    aria-hidden={!isCenter}
                    onClick={(event) => {
                      if (Math.abs(index - visualRef.current) >= 0.45) {
                        event.preventDefault();
                        goTo(index);
                      }
                    }}
                    target={isCenter && external ? "_blank" : undefined}
                    rel={isCenter && external ? "noopener noreferrer" : undefined}
                  >
                    <span className="project-card-media">
                      <Image
                        src={project.image}
                        alt={`${project.name} website`}
                        fill
                        sizes="(max-width: 767px) 82vw, 520px"
                        className="project-card-image"
                        draggable={false}
                        priority={index < 2}
                      />
                      <span className="project-card-shine" aria-hidden="true" />
                    </span>
                    <span className="project-card-body">
                      <span className="project-card-copy">
                        <span className="project-card-name">{project.name}</span>
                        <span className="project-card-detail">{project.detail}</span>
                      </span>
                      <span className="project-card-aside">
                        <span className="project-card-tag">{project.category}</span>
                        <span className="project-card-cta">
                          View project
                          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                            <path
                              fill="currentColor"
                              d="M3 8h8.2L8.1 4.9l1-1L14 8l-4.9 4.1-1-1L11.2 8H3V8Z"
                            />
                          </svg>
                        </span>
                      </span>
                    </span>
                  </a>
                </article>
              );
            })}
          </div>

          <div className="projects-controls">
            <button
              type="button"
              className="projects-nav"
              aria-label="Previous project"
              onClick={prev}
              disabled={active <= 0}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10.2 3.2 5.4 8l4.8 4.8-1.2 1.2L3 8l6-6 1.2 1.2Z"
                />
              </svg>
            </button>

            <div className="projects-dots" role="tablist" aria-label="Project slides">
              {PROJECTS.map((project, index) => (
                <button
                  key={project.name}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={`Show ${project.name}`}
                  className={`projects-dot${index === active ? " is-active" : ""}`}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>

            <button
              type="button"
              className="projects-nav"
              aria-label="Next project"
              onClick={next}
              disabled={active >= LAST_INDEX}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M5.8 3.2 10.6 8 5.8 12.8l1.2 1.2L13 8l-6-6-1.2 1.2Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
