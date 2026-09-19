"use client";

import { Fragment, useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollHighlight({ text }: { text: string }) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (!paragraph) return;

    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const words = paragraph.querySelectorAll("[data-highlight-word]");
      const animation = gsap.fromTo(words, { color: "rgba(35, 33, 75, 0.25)" }, {
        paused: true,
        color: getComputedStyle(paragraph).color,
        duration: 1,
        stagger: 0.1,
        ease: "none",
      });
      let frame = 0;
      let disposed = false;
      const paint = () => {
        frame = 0;
        // Measure the live position: the preceding carousel changes its height
        // after mount and on resize, invalidating cached document offsets.
        const { top, height } = paragraph.getBoundingClientRect();
        const viewport = window.innerHeight;
        const progress = (viewport * 0.8 - top) / (height + viewport * 0.4);
        animation.progress(Math.max(0, Math.min(1, progress)));
      };
      const schedule = () => {
        if (!disposed && !frame) frame = requestAnimationFrame(paint);
      };
      const observer = new ResizeObserver(schedule);
      observer.observe(document.body);
      observer.observe(paragraph);
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", schedule);
      window.visualViewport?.addEventListener("resize", schedule);
      void document.fonts.ready.then(schedule);
      paint();
      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        window.removeEventListener("scroll", schedule);
        window.removeEventListener("resize", schedule);
        window.visualViewport?.removeEventListener("resize", schedule);
      };
    }, paragraph);

    return () => {
      media.revert();
    };
  }, [text]);

  const words = text.trim().split(/\s+/);
  return (
    <p ref={paragraphRef} className="about-copy">
      {words.map((word, index) => (
        <Fragment key={index}>
          <span data-highlight-word style={{ display: "inline-block" }}>{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </p>
  );
}
