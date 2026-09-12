"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
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
  {
    name: "Harbor Health",
    category: "Healthcare / Patient Portal",
    focus: "Healthcare",
    detail: "Calm brand system and booking experience",
    href: "#projects",
    image: "/projects/kyzenn.jpg",
  },
  {
    name: "Atlas Logistics",
    category: "Supply Chain / Operations",
    focus: "Logistics",
    detail: "Dashboard and site for freight visibility",
    href: "#projects",
    image: "/projects/fluxora.jpg",
  },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function Projects() {
  const pinRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const dragRef = useRef<{
    startX: number;
    lastX: number;
    dragging: boolean;
  } | null>(null);
  const lastIndex = PROJECTS.length - 1;

  const goTo = useCallback(
    (index: number) => {
      setActive(clamp(index, 0, lastIndex));
      setDragOffset(0);
    },
    [lastIndex],
  );

  const prev = useCallback(() => goTo(active - 1), [active, goTo]);
  const next = useCallback(() => goTo(active + 1), [active, goTo]);

  // Desktop: page scroll through the pinned section drives the coverflow.
  useEffect(() => {
    const pin = pinRef.current;
    const sticky = stickyRef.current;
    if (!pin || !sticky) return;

    let frame = 0;
    const desktopQuery = window.matchMedia("(min-width: 768px)");

    const measure = () => {
      if (!desktopQuery.matches) {
        pin.style.height = "";
        return;
      }
      // One viewport of sticky space + travel for each extra project.
      pin.style.height = `${sticky.offsetHeight + lastIndex * window.innerHeight * 0.72}px`;
    };

    const update = () => {
      if (!desktopQuery.matches || dragRef.current?.dragging) return;
      const range = pin.offsetHeight - sticky.offsetHeight;
      if (range <= 0) return;
      const pinTop = pin.getBoundingClientRect().top;
      const stuckTop = parseFloat(getComputedStyle(sticky).top) || 0;
      const progress = clamp((stuckTop - pinTop) / range, 0, 1);
      const nextActive = Math.round(progress * lastIndex);
      setActive((current) => (current === nextActive ? current : nextActive));
      setDragOffset(0);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        measure();
        update();
      });
    };

    measure();
    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    desktopQuery.addEventListener("change", onScrollOrResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      desktopQuery.removeEventListener("change", onScrollOrResize);
      pin.style.height = "";
    };
  }, [lastIndex]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      startX: event.clientX,
      lastX: event.clientX,
      dragging: true,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag?.dragging) return;
    const delta = event.clientX - drag.startX;
    drag.lastX = event.clientX;
    setDragOffset(delta / 280);
  };

  const onPointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag?.dragging) return;
    const delta = event.clientX - drag.startX;
    drag.dragging = false;
    dragRef.current = null;

    if (Math.abs(delta) > 56) {
      goTo(active + (delta < 0 ? 1 : -1));
    } else {
      setDragOffset(0);
    }
  };

  const visualActive = clamp(active - dragOffset, 0, lastIndex);

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
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          >
            {PROJECTS.map((project, index) => {
              const distance = index - visualActive;
              const abs = Math.abs(distance);
              const sign = Math.sign(distance) || 0;
              const external = project.href.startsWith("http");
              const isCenter = abs < 0.45;

              return (
                <article
                  key={project.name}
                  className={`projects-slide${isCenter ? " is-center" : ""}`}
                  style={{
                    ["--slide-x" as string]: `${distance * 58}%`,
                    ["--slide-z" as string]: `${-Math.min(abs, 3) * 140}px`,
                    ["--slide-rotate" as string]: `${-sign * Math.min(abs, 2.2) * 32}deg`,
                    ["--slide-scale" as string]: `${Math.max(0.58, 1 - abs * 0.2)}`,
                    ["--slide-opacity" as string]: `${Math.max(0.28, 1 - abs * 0.32)}`,
                    ["--slide-blur" as string]: `${abs < 0.35 ? 0 : Math.min(abs * 1.4, 3)}px`,
                    zIndex: Math.round(40 - abs * 8),
                  }}
                >
                  <a
                    className="project-card"
                    href={project.href}
                    tabIndex={isCenter ? 0 : -1}
                    aria-hidden={!isCenter}
                    onClick={(event) => {
                      if (!isCenter) {
                        event.preventDefault();
                        goTo(index);
                        return;
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
                      />
                      <span className="project-card-shine" aria-hidden="true" />
                    </span>
                    <span className="project-card-body">
                      <span className="project-card-tag">{project.category}</span>
                      <span className="project-card-name">{project.name}</span>
                      <span className="project-card-detail">{project.detail}</span>
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
              disabled={active >= lastIndex}
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
