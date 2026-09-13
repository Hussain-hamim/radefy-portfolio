"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollReveal from "./ScrollReveal";
import ServiceModule from "./ServiceModule";

const SERVICES = [
  {
    number: "01",
    title: "Brand identity",
    kind: "brand",
    points: ["Logo and wordmark", "Visual system", "Brand guidelines"],
    copy: "We craft B2B brand identities with a clear point of view, built to scale across every touchpoint.",
  },
  {
    number: "02",
    title: "Web design",
    kind: "design",
    points: ["UX and wireframes", "Visual design", "Design system"],
    copy: "We design websites that look sharp and convert, from first wireframe to final pixel.",
  },
  {
    number: "03",
    title: "Web engineering",
    kind: "engineering",
    points: ["Multi-CMS architecture", "Technical SEO and speed", "Built to scale"],
    copy: "We engineer large-scale sites: multi-CMS setups, clean technical SEO, and fast, maintainable architecture that holds up as you grow.",
  },
  {
    number: "04",
    title: "Growth",
    kind: "growth",
    points: ["SEO foundations", "Landing pages", "Content systems"],
    copy: "We help the brand and site grow with SEO, landing pages, and content your team can run.",
  },
  {
    number: "05",
    title: "Strategy",
    kind: "strategy",
    points: ["Positioning", "Messaging", "Roadmap"],
    copy: "We sharpen positioning and messaging so the brand says the right thing to the right buyer.",
  },
] as const;

export default function Services() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const list = listRef.current;
    if (!section || !list) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion) {
      section.classList.add("is-ready");
      return;
    }

    const items = Array.from(list.querySelectorAll(".service-item"));
    const spine = list.querySelector(".services-spine");
    const nodes = list.querySelectorAll(".service-node");
    const marks = list.querySelectorAll(".service-mark");
    const titles = list.querySelectorAll(".service-title-text");
    const numbers = list.querySelectorAll(".service-number");
    const docks = list.querySelectorAll(".service-dock");

    let played = false;
    let observer: IntersectionObserver | undefined;
    const tryPlay = () => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.86 && rect.bottom > 96) start();
    };
    const start = () => {
      if (played) return;
      played = true;
      observer?.disconnect();
      window.removeEventListener("scroll", tryPlay);
      playEntrance();
    };
    let playEntrance = () => {};

    const ctx = gsap.context(() => {
      items.forEach((item) => {
        gsap.set(item.querySelectorAll(".service-toggle, .service-body"), {
          clipPath: "inset(0 100% 0 0)",
        });
      });
      gsap.set(nodes, { scale: 0, opacity: 0 });
      gsap.set(marks, { opacity: 0 });
      gsap.set(titles, { yPercent: 110 });
      gsap.set(numbers, { opacity: 0 });
      gsap.set(docks, { opacity: 0 });
      if (spine) gsap.set(spine, { scaleY: 0, transformOrigin: "50% 0%" });

      playEntrance = () => {
        const tl = gsap.timeline({
          defaults: { ease: "cubic-bezier(0.22, 1, 0.36, 1)" },
          onComplete: () => section.classList.add("is-ready"),
        });

        // Stage 1 — the vertical axis becomes the shared direction.
        tl.addLabel("axis");
        if (spine) {
          tl.to(spine, { scaleY: 1, duration: 0.55 }, "axis");
        }

        // Stage 2 — modules dock onto the spine from the axis outward.
        items.forEach((item, index) => {
          const at = `axis+=${0.12 + index * 0.11}`;
          tl.to(
            item.querySelectorAll(".service-toggle, .service-body"),
            { clipPath: "inset(0 0% 0 0)", duration: 0.62 },
            at,
          );
          tl.to(
            nodes[index] ?? [],
            { scale: 1, opacity: 1, duration: 0.32 },
            `${at}+=0.08`,
          );
          tl.to(marks[index] ?? [], { opacity: 1, duration: 0.28 }, `${at}+=0.12`);
          tl.to(titles[index] ?? [], { yPercent: 0, duration: 0.48 }, `${at}+=0.16`);
          tl.to(numbers[index] ?? [], { opacity: 1, duration: 0.28 }, `${at}+=0.18`);
          tl.to(docks[index] ?? [], { opacity: 1, duration: 0.24 }, `${at}+=0.22`);
        });
      };

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) start();
        },
        { threshold: 0.14, rootMargin: "0px 0px -6% 0px" },
      );
      observer.observe(section);
      window.addEventListener("scroll", tryPlay, { passive: true });
      tryPlay();
    }, section);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", tryPlay);
      ctx.revert();
    };
  }, []);

  const handleToggle = (index: number) => {
    setActive((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services-sticky">
        <ScrollReveal as="header" className="services-header">
          <div className="services-heading">
            <h2 className="services-title">Services</h2>
          </div>
          <p className="services-lede">
            Brand, web, and the infrastructure behind it, handled end to end.
          </p>
        </ScrollReveal>

        <div className="services-list" ref={listRef}>
          <span className="services-spine" aria-hidden="true" />
          {SERVICES.map((service, index) => (
            <ServiceModule
              key={service.number}
              service={service}
              isOpen={index === active}
              onToggle={() => handleToggle(index)}
              itemRef={() => {}}
            />
          ))}
        </div>

        <ScrollReveal as="p" className="services-note" delay={120}>
          Need something more specific? Tell us and we will scope it.{" "}
          <a href="#book">Book a call</a>
        </ScrollReveal>
      </div>
    </section>
  );
}