"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollReveal from "./ScrollReveal";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const SERVICES = [
  {
    number: "01",
    title: "Brand identity",
    points: ["Logo and wordmark", "Visual system", "Brand guidelines"],
    copy: "We craft B2B brand identities with a clear point of view, built to scale across every touchpoint.",
  },
  {
    number: "02",
    title: "Web design",
    points: ["UX and wireframes", "Visual design", "Design system"],
    copy: "We design websites that look sharp and convert, from first wireframe to final pixel.",
  },
  {
    number: "03",
    title: "Web engineering",
    points: ["Multi-CMS architecture", "Technical SEO and speed", "Built to scale"],
    copy: "We engineer large-scale sites: multi-CMS setups, clean technical SEO, and fast, maintainable architecture that holds up as you grow.",
  },
  {
    number: "04",
    title: "Growth",
    points: ["SEO foundations", "Landing pages", "Content systems"],
    copy: "We help the brand and site grow with SEO, landing pages, and content your team can run.",
  },
  {
    number: "05",
    title: "Strategy",
    points: ["Positioning", "Messaging", "Roadmap"],
    copy: "We sharpen positioning and messaging so the brand says the right thing to the right buyer.",
  },
] as const;

const HEADER_OFFSET = 64;
const STEP_COUNT = SERVICES.length;

function stepFromProgress(progress: number) {
  return Math.min(
    STEP_COUNT - 1,
    Math.max(0, Math.round(progress * (STEP_COUNT - 1))),
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
      if (STEP_COUNT <= 1) return trigger.start;
      return (
        trigger.start +
        (index / (STEP_COUNT - 1)) * (trigger.end - trigger.start)
      );
    };

    const setStep = (index: number) => {
      stepRef.current = index;
      setActive(index);
    };

    const animateToStep = (index: number) => {
      const next = Math.max(0, Math.min(STEP_COUNT - 1, index));
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
      const leavingDown = direction > 0 && stepRef.current >= STEP_COUNT - 1;

      // Free the page only when exiting past the first/last step.
      if (leavingUp || leavingDown) {
        if (state.animating) event.preventDefault();
        state.wheelAcc = 0;
        return;
      }

      // Always own the wheel inside 01–05 — even tiny trackpad deltas.
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
      const leavingDown = direction > 0 && stepRef.current >= STEP_COUNT - 1;

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
      end: () => `+=${(STEP_COUNT - 1) * window.innerHeight}`,
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
        setStep(STEP_COUNT - 1);
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
    const trigger = triggerRef.current;
    stepRef.current = index;
    setActive(index);

    if (!scrollDriven || !trigger) return;

    gsap.to(window, {
      scrollTo: {
        y:
          trigger.start +
          (index / (STEP_COUNT - 1)) * (trigger.end - trigger.start),
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
            {SERVICES.map((service, index) => {
              const isOpen = index === active;
              return (
                <article
                  key={service.number}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className={`service-item${isOpen ? " is-open" : ""}`}
                >
                  <button
                    type="button"
                    className="service-toggle"
                    aria-expanded={isOpen}
                    onClick={() => handleToggle(index)}
                  >
                    <span className="service-number">{service.number}</span>
                    <span className="service-title">{service.title}</span>
                    <span className="service-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          d="M6 9l6 6 6-6"
                        />
                      </svg>
                    </span>
                  </button>

                  <div className="service-body">
                    <div className="service-body-inner">
                      <ul className="service-points">
                        {service.points.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                      <p className="service-copy">{service.copy}</p>
                    </div>
                  </div>
                </article>
              );
            })}
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
