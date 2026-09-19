"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollReveal from "./ScrollReveal";
import ServiceModule from "./ServiceModule";

const SERVICES = [
  {
    number: "01",
    title: "Custom software",
    kind: "brand",
    points: ["Business systems", "Client portals", "Internal tools"],
    copy: "Bring your operations into one connected system. We develop business applications that help your team manage information, coordinate work, and reduce repetitive tasks.",
  },
  {
    number: "02",
    title: "AI & automation",
    kind: "design",
    points: ["Workflow automation", "AI integration", "Connected systems"],
    copy: "Put automation to work in your everyday operations. We connect your tools and integrate AI into defined workflows, with human oversight where decisions matter.",
  },
  {
    number: "03",
    title: "Web platforms",
    kind: "engineering",
    points: ["Web applications", "Company websites", "APIs and databases"],
    copy: "Give customers and teams a better way to interact with your business. We build responsive websites, portals, and web applications with the infrastructure to support them.",
  },
  {
    number: "04",
    title: "App development",
    kind: "growth",
    points: ["Mobile apps", "Desktop apps", "Cross-platform products"],
    copy: "Make your services accessible wherever people work. We develop mobile and desktop applications with clear interfaces and consistent experiences across devices.",
  },
  {
    number: "05",
    title: "Product engineering",
    kind: "strategy",
    points: ["Product discovery", "MVP development", "Long-term improvement"],
    copy: "Take your product from concept to release. We help define the scope, develop an initial version, and plan improvements around feedback from the people using it.",
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
            From daily operations to your next product launch, we build the
            software your business needs.
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
          Let’s define the right approach for your project.{" "}
          <a href="#book">Discuss your requirements</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
