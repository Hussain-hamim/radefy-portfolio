"use client";

import {
  type CSSProperties,
  type ElementType,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

type ScrollRevealProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
  style?: CSSProperties;
  [key: string]: unknown;
};

export default function ScrollReveal({
  as: Tag = "div",
  children,
  className = "",
  delay = 0,
  once = true,
  style,
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("is-inview");
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        node.classList.add("is-inview");
        if (once) observer.unobserve(node);
      },
      {
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.12,
      },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      className={`reveal${className ? ` ${className}` : ""}`}
      style={{
        ...style,
        ["--reveal-delay" as string]: `${delay}ms`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
