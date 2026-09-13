"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";
import ServiceModule from "./ServiceModule";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

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

const HEADER_OFFSET = 64;
/** Only the first two services open on scroll; the rest stay closed for click. */
const SCROLL_STEPS = 2;

function stepFromProgress(progress: number) {
  return Math.min(
    SCROLL_STEPS - 1,
    Math.max(0, Math.round(progress * (SCROLL_STEPS - 1))),
  );
}

export default function Services() {
  const [active, setActive] = useState(0);
  const [scrollDriven, setScrollDriven] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const stepRef = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setScrollDriven(true);
    section.classList.add("services--scroll");

    const STEP_COOLDOWN_MS = 480;
    const WHEEL_THRESHOLD = 40;

    const state = {
      inZone: false,
      animating: false,
      lockedUntil: 0,
      touchY: 0,
      wheelAcc: 0,
    };

    const yForStep = (index: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return window.scrollY;
      if (SCROLL_STEPS <= 1) return trigger.start;
      return (
        trigger.start +
        (index / (SCROLL_STEPS - 1)) * (trigger.end - trigger.start)
      );
    };

    const setStep = (index: number) => {
      stepRef.current = index;
      setActive(index);
    };

    const animateToStep = (index: number) => {
      const next = Math.max(0, Math.min(SCROLL_STEPS - 1, index));
      state.animating = true;
      state.wheelAcc = 0;
      state.lockedUntil = performance.now() + STEP_COOLDOWN_MS;
      setStep(next);

      gsap.to(window, {
        scrollTo: { y: yForStep(next), autoKill: false },
        duration: 0.4,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          state.animating = false;
        },
      });
    };

    const normalizeWheelDelta = (event: WheelEvent) => {
      let dy = event.deltaY;
      let dx = event.deltaX;

      // lines → pixels, pages → viewport
      if (event.deltaMode === 1) {
        dy *= 16;
        dx *= 16;
      } else if (event.deltaMode === 2) {
        dy *= window.innerHeight;
        dx *= window.innerWidth;
      }

      // Legacy wheel events (some built-in / OEM mice)
      const legacy = event as WheelEvent & {
        wheelDelta?: number;
        wheelDeltaY?: number;
      };
      if (dy === 0 && dx === 0) {
        if (typeof legacy.wheelDeltaY === "number") dy = -legacy.wheelDeltaY;
        else if (typeof legacy.wheelDelta === "number") dy = -legacy.wheelDelta;
      }

      return Math.abs(dy) >= Math.abs(dx) ? dy : dx;
    };

    const isInZone = () =>
      Boolean(state.inZone || triggerRef.current?.isActive);

    const onWheel = (event: WheelEvent) => {
      if (!isInZone()) return;

      const delta = normalizeWheelDelta(event);
      if (delta === 0) return;

      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      const leavingUp = direction < 0 && stepRef.current <= 0;
      const leavingDown = direction > 0 && stepRef.current >= SCROLL_STEPS - 1;

      // Free the page only when exiting past the first/last scroll step.
      if (leavingUp || leavingDown) {
        if (state.animating) event.preventDefault();
        state.wheelAcc = 0;
        return;
      }

      // Always own the wheel inside scroll steps — even tiny trackpad deltas.
      // (Skipping preventDefault on small deltas was breaking built-in mice.)
      event.preventDefault();
      event.stopPropagation();

      const now = performance.now();
      if (state.animating || now < state.lockedUntil) {
        state.wheelAcc = 0;
        return;
      }

      state.wheelAcc += delta;

      if (Math.abs(state.wheelAcc) < WHEEL_THRESHOLD) return;

      const stepDirection: 1 | -1 = state.wheelAcc > 0 ? 1 : -1;
      state.wheelAcc = 0;
      animateToStep(stepRef.current + stepDirection);
    };

    const onTouchStart = (event: TouchEvent) => {
      state.touchY = event.touches[0]?.clientY ?? 0;
      state.lockedUntil = 0;
      state.wheelAcc = 0;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!isInZone()) return;
      const y = event.touches[0]?.clientY ?? 0;
      const delta = state.touchY - y;
      if (Math.abs(delta) < 42) return;

      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      const leavingUp = direction < 0 && stepRef.current <= 0;
      const leavingDown = direction > 0 && stepRef.current >= SCROLL_STEPS - 1;

      if (leavingUp || leavingDown) {
        if (state.animating) event.preventDefault();
        return;
      }

      event.preventDefault();
      if (state.animating || performance.now() < state.lockedUntil) return;

      state.touchY = y;
      animateToStep(stepRef.current + direction);
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      pin,
      start: `top top+=${HEADER_OFFSET}`,
      end: () => `+=${(SCROLL_STEPS - 1) * window.innerHeight}`,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: (self) => {
        state.inZone = true;
        state.wheelAcc = 0;
        state.lockedUntil = performance.now() + STEP_COOLDOWN_MS;
        setStep(stepFromProgress(self.progress));
      },
      onEnterBack: (self) => {
        state.inZone = true;
        state.wheelAcc = 0;
        state.lockedUntil = performance.now() + STEP_COOLDOWN_MS;
        setStep(stepFromProgress(self.progress));
      },
      onLeave: () => {
        state.inZone = false;
        state.wheelAcc = 0;
        setStep(SCROLL_STEPS - 1);
      },
      onLeaveBack: () => {
        state.inZone = false;
        state.wheelAcc = 0;
        setStep(0);
      },
    });

    triggerRef.current = trigger;
    state.inZone = trigger.isActive;
    if (trigger.isActive) setStep(stepFromProgress(trigger.progress));

    // Capture on document so built-in mice still work no matter what
    // element is under the cursor (Windows routes wheel to hover target).
    const wheelOpts: AddEventListenerOptions = { passive: false, capture: true };
    document.addEventListener("wheel", onWheel, wheelOpts);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener("wheel", onWheel, wheelOpts);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      gsap.killTweensOf(window);
      trigger.kill();
      triggerRef.current = null;
      section.classList.remove("services--scroll");
      setScrollDriven(false);
    };
  }, []);

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

  useEffect(() => {
    if (!scrollDriven) return;

    const viewport = viewportRef.current;
    const list = listRef.current;
    if (!viewport || !list) return;

    // Use closed-row heights only so every step lifts the same way,
    // without a second correction pass that made early steps feel jumpy.
    let target = 0;
    for (let i = 0; i < active; i += 1) {
      const prev = itemRefs.current[i];
      const toggle = prev?.querySelector(".service-toggle") as HTMLElement | null;
      target += toggle?.offsetHeight ?? prev?.offsetHeight ?? 0;
    }

    const maxTranslate = Math.max(0, list.scrollHeight - viewport.clientHeight);
    target = Math.min(target, maxTranslate);

    gsap.to(list, {
      y: -target,
      duration: 0.45,
      ease: "power2.out",
      overwrite: true,
    });
  }, [active, scrollDriven]);

  useEffect(() => {
    return () => {
      if (listRef.current) gsap.killTweensOf(listRef.current);
    };
  }, []);

  const handleToggle = (index: number) => {
    // Items beyond the scroll pair are click-only: open or close on demand.
    if (index >= SCROLL_STEPS) {
      setActive((prev) => (prev === index ? stepRef.current : index));
      return;
    }

    stepRef.current = index;
    setActive(index);

    const trigger = triggerRef.current;
    if (!scrollDriven || !trigger) return;

    gsap.to(window, {
      scrollTo: {
        y:
          SCROLL_STEPS <= 1
            ? trigger.start
            : trigger.start +
              (index / (SCROLL_STEPS - 1)) * (trigger.end - trigger.start),
        autoKill: false,
      },
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  };

  return (
    <section className="services" id="services" ref={sectionRef}>
      <div className="services-sticky" ref={pinRef}>
        <ScrollReveal as="header" className="services-header">
          <div className="services-heading">
            <h2 className="services-title">Services</h2>
          </div>
          <p className="services-lede">
            Brand, web, and the infrastructure behind it, handled end to end.
          </p>
        </ScrollReveal>

        <div className="services-list-viewport" ref={viewportRef}>
          <div className="services-list" ref={listRef}>
            <span className="services-spine" aria-hidden="true" />
            {SERVICES.map((service, index) => (
              <ServiceModule
                key={service.number}
                service={service}
                isOpen={index === active}
                onToggle={() => handleToggle(index)}
                itemRef={(node) => {
                  itemRefs.current[index] = node;
                }}
              />
            ))}
            <div className="services-list-spacer" aria-hidden="true" />
          </div>
        </div>

        <ScrollReveal as="p" className="services-note" delay={120}>
          Need something more specific? Tell us and we will scope it.{" "}
          <a href="#book">Book a call</a>
        </ScrollReveal>
      </div>
    </section>
  );
}
