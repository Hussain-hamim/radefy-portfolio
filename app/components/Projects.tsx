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
    name: "IdeaHunt",
    category: "AI / Startup Research",
    focus: "AI Research",
    detail: "AI-powered research to discover and validate startup ideas",
    href: "https://www.ideahunt.pro/",
    image: "/projects/Screenshot 2026-09-19 at 12.47.06 PM.png",
  },
  {
    name: "Radefy English Academy",
    category: "Education / Academy Management",
    focus: "Education",
    detail: "Academy software for enrollments, fees, classes, and reporting",
    href: "https://course-rad-sys.vercel.app/",
    image: "/projects/radefy-english-academy.png",
  },
  {
    name: "Afghan Sarafi Management System",
    category: "Finance / Sarafi Management",
    focus: "Sarafi",
    detail: "Multi-currency cash, exchanges, hawala, and customer accounts",
    href: "/projects/file_0000000016b08246b946997f66b02d34.png",
    image: "/projects/file_0000000016b08246b946997f66b02d34.png",
  },
  {
    name: "BBL Business Management",
    category: "ERP / Business Operations",
    focus: "Business ERP",
    detail: "Sales, inventory, cash, and reporting in one business dashboard",
    href: "/projects/Image 9-19-26 at 12.31 PM (1).jpg",
    image: "/projects/Image 9-19-26 at 12.31 PM (1).jpg",
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
  const [skipDirection, setSkipDirection] = useState<"up" | "down">("down");
  const activeRef = useRef(0);
  const visualRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const ignoreScrollRef = useRef(false);
  const wheelLockRef = useRef(false);
  const wheelDirectionRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const animFrameRef = useRef(0);
  const animatingRef = useRef(false);
  const scrollFrameRef = useRef(0);
  const metricsRef = useRef({
    range: 0,
    stuckTop: 0,
    pinDocTop: 0,
    enabled: false,
  });
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origin: number;
    axis: "x" | "y" | null;
    dragging: boolean;
  } | null>(null);
  const touchScrubRef = useRef<{
    startX: number;
    startY: number;
    startScroll: number;
    origin: number;
    axis: "x" | "y" | null;
    active: boolean;
    passThrough: boolean;
  } | null>(null);
  const touchIgnoreTimerRef = useRef(0);
  const reduceMotionRef = useRef(false);

  const scrollToY = useCallback((top: number) => {
    const html = document.documentElement;
    const previous = html.style.scrollBehavior;
    html.style.scrollBehavior = "auto";
    window.scrollTo({ top, left: 0, behavior: "auto" });
    html.style.scrollBehavior = previous;
  }, []);

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
    ignoreScrollRef.current = false;
  }, []);

  const animateToIndex = useCallback(
    (index: number) => {
      const to = clamp(index, 0, LAST_INDEX);
      cancelAnimation();

      const { enabled, range, stuckTop, pinDocTop } = metricsRef.current;
      const canSyncScroll = enabled && range > 0;
      const targetScroll = canSyncScroll
        ? pinDocTop - stuckTop + (to / Math.max(1, LAST_INDEX)) * range
        : window.scrollY;

      if (reduceMotionRef.current || Math.abs(visualRef.current - to) < 0.001) {
        paintVisual(to);
        if (canSyncScroll) scrollToY(targetScroll);
        return;
      }

      const fromVisual = visualRef.current;
      const fromScroll = window.scrollY;
      const start = performance.now();
      animatingRef.current = true;
      ignoreScrollRef.current = true;

      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / SLIDE_DURATION_MS);
        const eased = easeOutCubic(t);

        paintVisual(fromVisual + (to - fromVisual) * eased, t >= 1);
        if (canSyncScroll) {
          scrollToY(fromScroll + (targetScroll - fromScroll) * eased);
        }

        if (t < 1) {
          animFrameRef.current = requestAnimationFrame(tick);
          return;
        }

        animFrameRef.current = 0;
        animatingRef.current = false;
        ignoreScrollRef.current = false;
        paintVisual(to);
        if (canSyncScroll) scrollToY(targetScroll);
      };

      animFrameRef.current = requestAnimationFrame(tick);
    },
    [cancelAnimation, paintVisual, scrollToY],
  );

  const goTo = useCallback(
    (index: number) => {
      const nextIndex = clamp(index, 0, LAST_INDEX);
      activeRef.current = nextIndex;
      setActive(nextIndex);
      animateToIndex(nextIndex);
    },
    [animateToIndex],
  );

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);
  const skipProjects = useCallback(() => {
    const pin = pinRef.current;
    if (!pin) return;

    cancelAnimation();

    const destination =
      skipDirection === "up"
        ? pin.previousElementSibling
        : pin.nextElementSibling;
    const target = destination
      ? window.scrollY + destination.getBoundingClientRect().top
      : skipDirection === "up"
        ? window.scrollY + pin.getBoundingClientRect().top
        : window.scrollY + pin.getBoundingClientRect().bottom;

    window.scrollTo({
      top: target,
      left: 0,
      behavior: reduceMotionRef.current ? "auto" : "smooth",
    });
  }, [cancelAnimation, skipDirection]);

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
        : Math.max(window.innerHeight * 0.5, 320);

      // Force layout read after height write.
      pin.style.height = `${sticky.offsetHeight + LAST_INDEX * travel}px`;
      const stuckTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const pinDocTop = window.scrollY + pin.getBoundingClientRect().top;
      const range = Math.max(0, pin.offsetHeight - sticky.offsetHeight);

      metricsRef.current = {
        enabled: range > 0,
        stuckTop,
        pinDocTop,
        range,
      };
    };

    const updateFromScroll = () => {
      if (dragRef.current?.dragging || touchScrubRef.current?.active) return;
      if (
        ignoreScrollRef.current ||
        wheelLockRef.current ||
        animatingRef.current
      ) {
        return;
      }

      const { range, stuckTop, pinDocTop, enabled } = metricsRef.current;
      if (!enabled || range <= 0) return;

      // scrollY-based progress is more stable on iOS than live rect math.
      const start = pinDocTop - stuckTop;
      const progress = clamp((window.scrollY - start) / range, 0, 1);
      paintVisual(progress * LAST_INDEX);
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (Math.abs(delta) > 1) {
        const nextDirection = delta < 0 ? "up" : "down";
        setSkipDirection((current) =>
          current === nextDirection ? current : nextDirection,
        );
      }

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

    lastScrollYRef.current = window.scrollY;
    measure();
    updateFromScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    desktopQuery.addEventListener("change", onResize);
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onScroll);

    const resizeObserver = new ResizeObserver(() => onResize());
    resizeObserver.observe(pin);
    resizeObserver.observe(sticky);

    return () => {
      if (scrollFrameRef.current) cancelAnimationFrame(scrollFrameRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      desktopQuery.removeEventListener("change", onResize);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onScroll);
      resizeObserver.disconnect();
      pin.style.height = "";
    };
  }, [paintVisual]);

  // Mobile touch: vertical scrub through the pin, horizontal swipe between cards.
  useEffect(() => {
    const node = coverflowRef.current;
    if (!node) return;

    const pinBounds = () => {
      const { enabled, range, stuckTop, pinDocTop } = metricsRef.current;
      if (!enabled || range <= 0) return null;
      const start = pinDocTop - stuckTop;
      return { start, end: start + range, range };
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchScrubRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        startScroll: window.scrollY,
        origin: visualRef.current,
        axis: null,
        active: false,
        passThrough: false,
      };
    };

    const onTouchMove = (event: TouchEvent) => {
      const scrub = touchScrubRef.current;
      if (!scrub || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const dx = touch.clientX - scrub.startX;
      const dy = scrub.startY - touch.clientY;
      const absX = Math.abs(dx);
      const absY = Math.abs(touch.clientY - scrub.startY);

      if (!scrub.axis) {
        if (absX < 8 && absY < 8) return;

        if (absX > absY) {
          scrub.axis = "x";
          scrub.active = true;
          cancelAnimation();
        } else {
          const bounds = pinBounds();
          const y = window.scrollY;
          const inPin =
            !!bounds && y >= bounds.start - 64 && y <= bounds.end + 64;
          scrub.axis = "y";
          scrub.active = true;
          if (!inPin || !bounds) {
            scrub.passThrough = true;
          } else {
            cancelAnimation();
          }
        }
      }

      if (!scrub.active || !scrub.axis) return;
      event.preventDefault();

      if (scrub.axis === "x") {
        paintVisual(scrub.origin - dx / 260, false);
        return;
      }

      if (scrub.passThrough) {
        scrollToY(scrub.startScroll + dy);
        return;
      }

      const bounds = pinBounds();
      if (!bounds) return;

      const nextScroll = clamp(
        scrub.startScroll + dy,
        bounds.start,
        bounds.end,
      );
      ignoreScrollRef.current = true;
      scrollToY(nextScroll);
      paintVisual(((nextScroll - bounds.start) / bounds.range) * LAST_INDEX);

      window.clearTimeout(touchIgnoreTimerRef.current);
      touchIgnoreTimerRef.current = window.setTimeout(() => {
        ignoreScrollRef.current = false;
      }, 50);
    };

    const onTouchEnd = () => {
      const scrub = touchScrubRef.current;
      touchScrubRef.current = null;
      ignoreScrollRef.current = false;
      window.clearTimeout(touchIgnoreTimerRef.current);
      if (!scrub?.active) return;
      if (scrub.passThrough) return;

      if (scrub.axis === "x") {
        const delta = visualRef.current - scrub.origin;
        if (Math.abs(delta) > 0.22) {
          goTo(clamp(Math.round(scrub.origin + Math.sign(delta)), 0, LAST_INDEX));
        } else {
          goTo(Math.round(scrub.origin));
        }
        return;
      }

      goTo(clamp(Math.round(visualRef.current), 0, LAST_INDEX));
    };

    node.addEventListener("touchstart", onTouchStart, { passive: true });
    node.addEventListener("touchmove", onTouchMove, { passive: false });
    node.addEventListener("touchend", onTouchEnd);
    node.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.clearTimeout(touchIgnoreTimerRef.current);
      node.removeEventListener("touchstart", onTouchStart);
      node.removeEventListener("touchmove", onTouchMove);
      node.removeEventListener("touchend", onTouchEnd);
      node.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [cancelAnimation, goTo, paintVisual, scrollToY]);

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

      const delta = horizontal
        ? event.deltaX
        : event.shiftKey
          ? event.deltaY
          : event.deltaY;

      // At either end, release vertical scrolling back to the page instead of
      // trapping the wheel inside the carousel.
      if (!horizontal) {
        const leavingUp = delta < 0 && visualRef.current <= 0.05;
        const leavingDown = delta > 0 && visualRef.current >= LAST_INDEX - 0.05;

        if (leavingUp || leavingDown) {
          cancelAnimation();
          wheelLockRef.current = false;
          wheelDirectionRef.current = 0;
          wheelAccumRef.current = 0;
          return;
        }
      }

      const incomingDirection = delta > 0 ? 1 : -1;
      if (
        wheelLockRef.current &&
        incomingDirection !== wheelDirectionRef.current
      ) {
        cancelAnimation();
        wheelLockRef.current = false;
        wheelAccumRef.current = 0;
      }

      event.preventDefault();

      wheelAccumRef.current += delta;

      if (wheelLockRef.current) return;
      if (Math.abs(wheelAccumRef.current) < 36) return;

      const direction = wheelAccumRef.current > 0 ? 1 : -1;
      wheelAccumRef.current = 0;
      wheelLockRef.current = true;
      wheelDirectionRef.current = direction;
      goTo(activeRef.current + direction);

      window.setTimeout(() => {
        wheelLockRef.current = false;
        wheelDirectionRef.current = 0;
        wheelAccumRef.current = 0;
      }, SLIDE_DURATION_MS + 20);
    };

    node.addEventListener("wheel", onWheel, { passive: false });
    return () => node.removeEventListener("wheel", onWheel);
  }, [cancelAnimation, goTo]);

  useEffect(() => () => cancelAnimation(), [cancelAnimation]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch is handled by the dedicated scrub listeners.
    if (event.pointerType === "touch") return;

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
            A selection of our work across business systems and digital
            products.
          </p>
          <p className="projects-hint">Scroll or swipe to explore our work.</p>
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
                    target={isCenter ? "_blank" : undefined}
                    rel={isCenter ? "noopener noreferrer" : undefined}
                  >
                    <span className="project-card-media">
                      <Image
                        src={project.image}
                        alt={`${project.name} application dashboard`}
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
                          {external ? "View project" : "View preview"}
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

            <button
              type="button"
              className="projects-skip"
              onClick={skipProjects}
            >
              <span>{skipDirection === "up" ? "Back to hero" : "Skip projects"}</span>
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                <path
                  fill="currentColor"
                  d={
                    skipDirection === "up"
                      ? "m3.2 10.2 4.8-4.8 4.8 4.8L14 9l-6-6-6 6 1.2 1.2Z"
                      : "m3.2 5.8 4.8 4.8 4.8-4.8L14 7l-6 6-6-6 1.2-1.2Z"
                  }
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
