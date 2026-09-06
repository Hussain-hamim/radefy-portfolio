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

    const frame = window.requestAnimationFrame(() => {
      node.classList.add("is-ready");
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="hero-copy" ref={ref}>
      {children}
    </div>
  );
}
