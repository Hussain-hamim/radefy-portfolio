"use client";

import { useEffect, useRef } from "react";

type TransitionValue = {
  type?: "tween" | "spring";
  duration?: number;
  ease?: string | number[];
};

type PixelDriftProps = {
  text?: string;
  colors?: string[];
  mode?: "onEnter" | "onHover";
  replay?: boolean;
  position?: "above" | "middle" | "below";
  particleSize?: number;
  particleCount?: number;
  mouseEnabled?: boolean;
  mouseRadius?: number;
  mouseForce?: number;
  fontSize?: number;
  autoFit?: boolean;
  transition?: TransitionValue;
  className?: string;
};

function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0;
    let hi = 1;
    let t = x;
    for (let i = 0; i < 12; i++) {
      const mid = (lo + hi) / 2;
      const sx = sampleX(mid);
      if (Math.abs(sx - x) < 1e-6) {
        t = mid;
        break;
      }
      if (sx < x) lo = mid;
      else hi = mid;
      t = mid;
    }
    return sampleY(t);
  };
}

function resolveEasingFn(trans: TransitionValue | undefined) {
  const linear = (t: number) => t;
  if (!trans || trans.type === "spring") return linear;

  const ease = trans.ease;
  if (
    Array.isArray(ease) &&
    ease.length === 4 &&
    ease.every((v) => typeof v === "number")
  ) {
    const [x1, y1, x2, y2] = ease as [number, number, number, number];
    return cubicBezier(x1, y1, x2, y2);
  }

  if (typeof ease === "string") {
    switch (ease) {
      case "easeIn":
      case "circIn":
        return (t: number) => t * t;
      case "easeOut":
      case "circOut":
        return (t: number) => 1 - (1 - t) * (1 - t);
      case "easeInOut":
      case "circInOut":
        return (t: number) =>
          t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      default:
        return linear;
    }
  }

  return linear;
}

function resolveDuration(trans: TransitionValue | undefined) {
  if (!trans || trans.type === "spring") return 1.2;
  const d = trans.duration;
  return typeof d === "number" && d > 0 ? d : 1.2;
}

function fitFontSize(
  measureCtx: CanvasRenderingContext2D,
  label: string,
  family: string,
  maxW: number,
  maxH: number,
  cap: number,
) {
  if (!label) return cap;
  let lo = 8;
  let hi = cap;
  let best = lo;
  for (let iter = 0; iter < 12; iter++) {
    const mid = (lo + hi) / 2;
    measureCtx.font = `700 ${mid}px ${family}`;
    const m = measureCtx.measureText(label);
    const w = m.width;
    const h =
      (m.actualBoundingBoxAscent || mid * 0.8) +
      (m.actualBoundingBoxDescent || mid * 0.2);
    if (w <= maxW && h <= maxH) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return Math.max(8, Math.floor(best));
}

const DEFAULTS = {
  text: "Radefy Systems",
  colors: ["#23214b", "#1a1838", "#2f2c5c"],
  mode: "onEnter" as const,
  replay: true,
  position: "above" as const,
  particleSize: 10,
  particleCount: 50,
  mouseEnabled: true,
  mouseRadius: 50,
  mouseForce: 30,
  fontSize: 120,
  autoFit: true,
  transition: {
    type: "tween" as const,
    duration: 1.4,
    ease: [0.22, 1, 0.36, 1] as number[],
  },
};

export default function PixelDrift({
  text = DEFAULTS.text,
  colors = DEFAULTS.colors,
  mode = DEFAULTS.mode,
  replay = DEFAULTS.replay,
  position = DEFAULTS.position,
  particleSize = DEFAULTS.particleSize,
  particleCount = DEFAULTS.particleCount,
  mouseEnabled = DEFAULTS.mouseEnabled,
  mouseRadius = DEFAULTS.mouseRadius,
  mouseForce = DEFAULTS.mouseForce,
  fontSize = DEFAULTS.fontSize,
  autoFit = DEFAULTS.autoFit,
  transition = DEFAULTS.transition,
  className = "",
}: PixelDriftProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -99999, y: -99999, active: false });
  const formValRef = useRef(0);
  const lastFrameRef = useRef<number | null>(null);
  const hiddenRef = useRef(false);
  const reverseRef = useRef(false);

  const colorsKey = colors.join("|");
  const transitionKey = JSON.stringify(transition ?? {});

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const palette = colors.length > 0 ? colors : DEFAULTS.colors;
    const fontFamily =
      getComputedStyle(document.body).getPropertyValue("--font-atures").trim() ||
      "Atures, system-ui, sans-serif";
    const fontStack = `${fontFamily}, system-ui, -apple-system, "Segoe UI", sans-serif`;

    let count = 0;
    let ox = new Float32Array(0);
    let oy = new Float32Array(0);
    let sx = new Float32Array(0);
    let sy = new Float32Array(0);
    let px = new Float32Array(0);
    let py = new Float32Array(0);
    let repX = new Float32Array(0);
    let repY = new Float32Array(0);
    let cIdx = new Uint8Array(0);

    let prevMx = -99999;
    let prevMy = -99999;
    let mouseSpeed = 0;
    let smoothX = -99999;
    let smoothY = -99999;
    let cssW = 0;
    let cssH = 0;
    let dpr = 1;

    const sampleText = () => {
      const W = cssW;
      const H = cssH;
      if (W <= 0 || H <= 0) return;

      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(W * dpr));
      off.height = Math.max(1, Math.floor(H * dpr));
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;
      offCtx.scale(dpr, dpr);

      const maxW = W * 0.96;
      const maxH = H * 0.92;
      let effectiveSize = Math.max(8, fontSize);

      if (autoFit) {
        effectiveSize = fitFontSize(
          offCtx,
          text,
          fontStack,
          maxW,
          maxH,
          Math.max(8, fontSize),
        );
      }

      offCtx.font = `700 ${effectiveSize}px ${fontStack}`;
      const gm = offCtx.measureText(text);
      const gW = gm.width || 1;
      const gH =
        (gm.actualBoundingBoxAscent || effectiveSize * 0.8) +
        (gm.actualBoundingBoxDescent || effectiveSize * 0.2);
      const fitScale = Math.min(1, maxW / gW, maxH / gH);
      if (fitScale < 1) effectiveSize = Math.max(8, effectiveSize * fitScale);

      offCtx.clearRect(0, 0, W, H);
      offCtx.fillStyle = "#fff";
      offCtx.font = `700 ${effectiveSize}px ${fontStack}`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, W / 2, H / 2 + H * 0.04);

      const img = offCtx.getImageData(
        0,
        0,
        Math.floor(W * dpr),
        Math.floor(H * dpr),
      );
      const data = img.data;
      const pCount = Math.max(1, Math.min(50, particleCount));
      const stride = Math.max(2, Math.round(150 / pCount));

      let candidates = 0;
      for (let y = 0; y < H; y += stride) {
        for (let x = 0; x < W; x += stride) {
          const ix = Math.floor(x * dpr);
          const iy = Math.floor(y * dpr);
          const idx = (iy * img.width + ix) * 4 + 3;
          if (data[idx] > 128) candidates += 1;
        }
      }

      const downsample =
        candidates > 30000 ? Math.ceil(candidates / 30000) : 1;
      const allocCount = Math.min(candidates, 30000);
      const newOx = new Float32Array(allocCount);
      const newOy = new Float32Array(allocCount);
      const newSx = new Float32Array(allocCount);
      const newSy = new Float32Array(allocCount);
      const newPx = new Float32Array(allocCount);
      const newPy = new Float32Array(allocCount);
      const newC = new Uint8Array(allocCount);

      let i = 0;
      let seen = 0;
      for (let y = 0; y < H && i < allocCount; y += stride) {
        for (let x = 0; x < W && i < allocCount; x += stride) {
          const ix = Math.floor(x * dpr);
          const iy = Math.floor(y * dpr);
          const idx = (iy * img.width + ix) * 4 + 3;
          if (data[idx] > 128) {
            if (seen % downsample === 0) {
              newOx[i] = x;
              newOy[i] = y;
              const ang = Math.random() * Math.PI * 2;
              const rad = Math.max(W, H) * (0.6 + Math.random() * 0.5);
              const rx = W / 2 + Math.cos(ang) * rad;
              const ry = H / 2 + Math.sin(ang) * rad;
              newSx[i] = rx;
              newSy[i] = ry;
              newPx[i] = rx;
              newPy[i] = ry;
              newC[i] = Math.floor(Math.random() * palette.length);
              i += 1;
            }
            seen += 1;
          }
        }
      }

      count = i;
      ox = newOx;
      oy = newOy;
      sx = newSx;
      sy = newSy;
      px = newPx;
      py = newPy;
      repX = new Float32Array(allocCount);
      repY = new Float32Array(allocCount);
      cIdx = newC;

      // Keep settled text settled after a resize; only fresh layouts start at 0.
      const wasFormed =
        !hiddenRef.current && formValRef.current >= 0.99 && !reverseRef.current;
      if (reduceMotion || wasFormed) {
        formValRef.current = 1;
        for (let p = 0; p < count; p++) {
          px[p] = ox[p];
          py[p] = oy[p];
        }
      } else {
        formValRef.current = 0;
      }
      lastFrameRef.current = null;
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w <= 0 || h <= 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cssW = w;
      cssH = h;
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sampleText();
    };

    reverseRef.current = false;
    hiddenRef.current = reduceMotion ? false : true;
    formValRef.current = reduceMotion ? 1 : 0;

    const formIn = () => {
      // Always restart the combine from dispersed particles.
      reverseRef.current = false;
      hiddenRef.current = false;
      formValRef.current = 0;
      lastFrameRef.current = null;
      for (let i = 0; i < count; i++) {
        px[i] = sx[i];
        py[i] = sy[i];
        repX[i] = 0;
        repY[i] = 0;
      }
    };
    const formOut = () => {
      reverseRef.current = true;
    };

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(container);

    const onMove = (e: PointerEvent) => {
      if (!mouseEnabled) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width > 0 ? cssW / rect.width : 1;
      const scaleY = rect.height > 0 ? cssH / rect.height : 1;
      const mx = (e.clientX - rect.left) * scaleX;
      const my = (e.clientY - rect.top) * scaleY;
      if (prevMx > -9000) {
        const ddx = mx - prevMx;
        const ddy = my - prevMy;
        mouseSpeed = Math.sqrt(ddx * ddx + ddy * ddy);
      }
      prevMx = mx;
      prevMy = my;
      pointerRef.current.x = mx;
      pointerRef.current.y = my;
      pointerRef.current.active = true;
    };

    const onLeave = () => {
      pointerRef.current.x = -99999;
      pointerRef.current.y = -99999;
      pointerRef.current.active = false;
      prevMx = -99999;
      prevMy = -99999;
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    let io: IntersectionObserver | null = null;
    let visible = false;

    if (mode === "onHover") {
      container.addEventListener("pointerenter", formIn);
      container.addEventListener("pointerleave", formOut);
    } else if (!reduceMotion) {
      // Observe the wordmark and the footer so scrolling into either starts
      // the particle combine.
      const observeTargets: Element[] = [container];
      const footer = container.closest("footer") ?? document.getElementById("contact");
      if (footer && footer !== container) observeTargets.push(footer);

      io = new IntersectionObserver(
        (entries) => {
          const anyVisible = entries.some((entry) => entry.isIntersecting);
          // Also check live geometry — footer can be partly on screen while
          // one observed target alone reports false.
          const footerVisible = (() => {
            if (!footer) return false;
            const r = footer.getBoundingClientRect();
            return r.top < window.innerHeight * 0.92 && r.bottom > 0;
          })();
          const wordmarkVisible = (() => {
            const r = container.getBoundingClientRect();
            return r.top < window.innerHeight * 0.9 && r.bottom > 0;
          })();
          const nextVisible = anyVisible || footerVisible || wordmarkVisible;

          if (nextVisible && !visible) {
            visible = true;
            formIn();
            if (!replay) io?.disconnect();
          } else if (!nextVisible && visible && replay) {
            visible = false;
            formOut();
          }
        },
        {
          threshold: [0, 0.1, 0.2],
          rootMargin: "0px 0px -8% 0px",
        },
      );

      observeTargets.forEach((el) => io?.observe(el));
    } else {
      formIn();
    }

    resize();

    const buckets: number[][] = palette.map(() => []);
    const easeFn = resolveEasingFn(transition);
    const formMs = Math.max(0, resolveDuration(transition) * 1000);

    const drawFrame = () => {
      ctx.clearRect(0, 0, cssW, cssH);

      const pr = pointerRef.current;
      const drawSize = Math.max(1, particleSize / 4);
      const half = drawSize / 2;
      const now = performance.now();
      const last = lastFrameRef.current ?? now;
      const dt = Math.min(64, Math.max(0, now - last));
      lastFrameRef.current = now;

      const reverse = reverseRef.current;
      const target = reverse ? 0 : 1;
      let v = formValRef.current;
      if (reduceMotion || formMs <= 0) {
        v = target;
      } else {
        const stepv = dt / formMs;
        if (v < target) v = Math.min(target, v + stepv);
        else if (v > target) v = Math.max(target, v - stepv);
      }
      formValRef.current = v;
      if (reverse && v <= 0) hiddenRef.current = true;
      if (hiddenRef.current) return;

      const forming = v < 1;
      const factor = easeFn(v);
      const hitSpeed = mouseSpeed;
      mouseSpeed *= 0.88;

      const active = !forming && mouseEnabled && pr.active;
      if (active) {
        const lerpFactor = Math.max(0.08, 0.3 - hitSpeed * 0.006);
        if (smoothX < -9000) {
          smoothX = pr.x;
          smoothY = pr.y;
        } else {
          smoothX += (pr.x - smoothX) * lerpFactor;
          smoothY += (pr.y - smoothY) * lerpFactor;
        }
      } else {
        smoothX = -99999;
        smoothY = -99999;
      }

      const mx = smoothX;
      const my = smoothY;
      const repCutoff = Math.max(1, mouseRadius);
      const repCutoffSq = repCutoff * repCutoff;

      for (let b = 0; b < buckets.length; b++) buckets[b].length = 0;

      for (let i = 0; i < count; i++) {
        const oxi = ox[i];
        const oyi = oy[i];

        if (forming) {
          px[i] = sx[i] + (oxi - sx[i]) * factor;
          py[i] = sy[i] + (oyi - sy[i]) * factor;
          buckets[cIdx[i]].push(i);
          continue;
        }

        let inZone = false;
        if (active) {
          const dx = oxi - mx;
          const dy = oyi - my;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < repCutoffSq) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const falloff = 1 - dist / repCutoff;
            const push = falloff * hitSpeed * mouseForce * 0.05;
            repX[i] += nx * push;
            repY[i] += ny * push;
            const targetRepX = nx * (repCutoff - dist);
            const targetRepY = ny * (repCutoff - dist);
            repX[i] += (targetRepX - repX[i]) * 0.06;
            repY[i] += (targetRepY - repY[i]) * 0.06;
            inZone = true;
          }
        }
        if (!inZone) {
          repX[i] *= 0.97;
          repY[i] *= 0.97;
        }

        px[i] = oxi + repX[i];
        py[i] = oyi + repY[i];
        buckets[cIdx[i]].push(i);
      }

      ctx.globalAlpha = forming ? Math.min(1, Math.max(0, factor)) : 1;
      for (let b = 0; b < buckets.length; b++) {
        const bucket = buckets[b];
        if (bucket.length === 0) continue;
        ctx.fillStyle = palette[b];
        for (let k = 0; k < bucket.length; k++) {
          const i = bucket[k];
          ctx.fillRect(px[i] - half, py[i] - half, drawSize, drawSize);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      container.removeEventListener("pointerenter", formIn);
      container.removeEventListener("pointerleave", formOut);
      io?.disconnect();
      ro.disconnect();
    };
  }, [
    mode,
    replay,
    position,
    text,
    colorsKey,
    particleSize,
    particleCount,
    mouseEnabled,
    mouseRadius,
    mouseForce,
    fontSize,
    autoFit,
    transitionKey,
    colors,
    transition,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pixel-drift${className ? ` ${className}` : ""}`}
    >
      <canvas ref={canvasRef} draggable={false} aria-hidden="true" />
      <p className="sr-only">{text}</p>
    </div>
  );
}
