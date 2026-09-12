"use client";

import { useEffect, useRef } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HeroGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const hero = node?.parentElement;
    if (!node || !hero) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      if (reduceMotion.matches) {
        node.style.setProperty("--hero-expand", "0");
        return;
      }

      const rect = hero.getBoundingClientRect();
      const travel = Math.max(rect.height * 0.75, window.innerHeight * 0.45);
      const progress = clamp(-rect.top / travel, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 1.85);

      // 0 = original bottom wash, 1 = full hero covered in brand blue
      node.style.setProperty("--hero-expand", `${eased}`);
    };

    const onScrollOrResize = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };

    update();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    reduceMotion.addEventListener("change", update);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      reduceMotion.removeEventListener("change", update);
    };
  }, []);

  return <div className="hero-gradient" ref={ref} aria-hidden="true" />;
}
