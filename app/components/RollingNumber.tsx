"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type RollingNumberProps = {
  value: string;
  className?: string;
  /** Extra full 0–9 spins before landing on the target digit */
  spins?: number;
  staggerMs?: number;
  durationMs?: number;
};

function parseValue(value: string) {
  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  if (!match) {
    return { prefix: "", digits: [] as number[], suffix: value };
  }

  return {
    prefix: match[1] ?? "",
    digits: match[2].split("").map((d) => Number(d)),
    suffix: match[3] ?? "",
  };
}

function buildReel(digit: number, spins: number) {
  const reel: number[] = [];
  for (let spin = 0; spin < spins; spin += 1) {
    for (let n = 0; n <= 9; n += 1) reel.push(n);
  }
  for (let n = 0; n <= digit; n += 1) reel.push(n);
  return reel;
}

export default function RollingNumber({
  value,
  className = "",
  spins = 2,
  staggerMs = 140,
  durationMs = 2400,
}: RollingNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const { prefix, digits, suffix } = useMemo(() => parseValue(value), [value]);

  const reels = useMemo(
    () => digits.map((digit) => buildReel(digit, spins)),
    [digits, spins],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setActive(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.35,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={`rolling-number${className ? ` ${className}` : ""}`}
      aria-label={value}
    >
      {prefix ? <span className="rolling-number-static">{prefix}</span> : null}
      {reels.map((reel, index) => {
        const steps = reel.length - 1;
        const delay = index * staggerMs;
        const duration = durationMs + index * 180;

        return (
          <span key={`${index}-${digits[index]}`} className="rolling-digit" aria-hidden="true">
            <span
              className="rolling-digit-track"
              style={{
                transform: active
                  ? `translate3d(0, ${-steps}em, 0)`
                  : "translate3d(0, 0, 0)",
                transitionDuration: `${duration}ms`,
                transitionDelay: active ? `${delay}ms` : "0ms",
              }}
            >
              {reel.map((n, glyphIndex) => (
                <span key={`${glyphIndex}-${n}`} className="rolling-digit-glyph">
                  {n}
                </span>
              ))}
            </span>
          </span>
        );
      })}
      {suffix ? <span className="rolling-number-static">{suffix}</span> : null}
    </span>
  );
}
