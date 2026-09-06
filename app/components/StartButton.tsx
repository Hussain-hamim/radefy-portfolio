"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StartButton() {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const faceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const face = faceRef.current;
    if (!btn || !face) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const rotX = gsap.quickTo(face, "rotationX", {
      duration: 0.45,
      ease: "power3.out",
    });
    const rotY = gsap.quickTo(face, "rotationY", {
      duration: 0.45,
      ease: "power3.out",
    });
    const z = gsap.quickTo(face, "z", {
      duration: 0.4,
      ease: "power3.out",
    });

    gsap.set(face, { transformPerspective: 700, transformOrigin: "50% 50%" });

    const onMove = (event: PointerEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      rotY(x * 14);
      rotX(-y * 10);
      z(18);
    };

    const onEnter = () => {
      gsap.to(face, {
        scale: 1.04,
        duration: 0.4,
        ease: "power3.out",
      });
      z(18);
    };

    const onLeave = () => {
      rotX(0);
      rotY(0);
      z(10);
      gsap.to(face, {
        scale: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    };

    const onDown = () => {
      gsap.to(face, {
        z: 4,
        scale: 0.98,
        duration: 0.15,
        ease: "power2.out",
      });
    };

    const onUp = () => {
      gsap.to(face, {
        z: 18,
        scale: 1.04,
        duration: 0.25,
        ease: "power2.out",
      });
    };

    btn.addEventListener("pointermove", onMove);
    btn.addEventListener("pointerenter", onEnter);
    btn.addEventListener("pointerleave", onLeave);
    btn.addEventListener("pointerdown", onDown);
    btn.addEventListener("pointerup", onUp);

    return () => {
      btn.removeEventListener("pointermove", onMove);
      btn.removeEventListener("pointerenter", onEnter);
      btn.removeEventListener("pointerleave", onLeave);
      btn.removeEventListener("pointerdown", onDown);
      btn.removeEventListener("pointerup", onUp);
      gsap.killTweensOf(face);
    };
  }, []);

  return (
    <a className="start-btn" href="#contact" ref={btnRef}>
      <span className="start-btn-depth" aria-hidden="true" />
      <span className="start-btn-face" ref={faceRef}>
        <span className="start-btn-label">
          <span>Start a project</span>
          <span aria-hidden="true">Start a project</span>
        </span>
      </span>
    </a>
  );
}
