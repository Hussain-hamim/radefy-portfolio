"use client";

import { useEffect, useRef } from "react";

export default function HeroIntro({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const hero = node.closest(".hero");
    const reveal = () => node.classList.add("is-ready");

    if (
      !hero ||
      hero.classList.contains("is-signature-complete") ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frame = window.requestAnimationFrame(reveal);
      return () => window.cancelAnimationFrame(frame);
    }

    hero.addEventListener("radefy:signature-complete", reveal);
    return () =>
      hero.removeEventListener("radefy:signature-complete", reveal);
  }, []);

  return (
    <div className="hero-copy" ref={ref}>
      {children}
    </div>
  );
}
