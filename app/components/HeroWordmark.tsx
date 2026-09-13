"use client";

import { useEffect, useRef } from "react";
import {
  FLUID_UNIFORMS,
  FRAGMENT_SHADER,
  VERTEX_SHADER,
} from "../lib/fluid-shader";

type HeroWordmarkProps = {
  className?: string;
};

const BRAND = "Radefy";
const SUBLINE = "Systems";
const LABEL = `${BRAND} ${SUBLINE}`;

function compile(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createFluid(gl: WebGL2RenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    gl.STATIC_DRAW,
  );

  const loc = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uniforms = {
    colors: gl.getUniformLocation(program, "u_colors"),
    colorsLength: gl.getUniformLocation(program, "u_colors_length"),
    seed: gl.getUniformLocation(program, "u_seed"),
    speed: gl.getUniformLocation(program, "u_speed"),
    loop: gl.getUniformLocation(program, "u_loop"),
    scale: gl.getUniformLocation(program, "u_scale"),
    turbAmp: gl.getUniformLocation(program, "u_turbAmp"),
    turbFreq: gl.getUniformLocation(program, "u_turbFreq"),
    turbIter: gl.getUniformLocation(program, "u_turbIter"),
    waveFreq: gl.getUniformLocation(program, "u_waveFreq"),
    distBias: gl.getUniformLocation(program, "u_distBias"),
    jellify: gl.getUniformLocation(program, "u_jellify"),
    ditherMode: gl.getUniformLocation(program, "u_ditherMode"),
    dither: gl.getUniformLocation(program, "u_dither"),
    exposure: gl.getUniformLocation(program, "u_exposure"),
    contrast: gl.getUniformLocation(program, "u_contrast"),
    saturation: gl.getUniformLocation(program, "u_saturation"),
    time: gl.getUniformLocation(program, "u_time"),
    resolution: gl.getUniformLocation(program, "u_resolution"),
    deltaTime: gl.getUniformLocation(program, "u_deltaTime"),
    pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
    mousePosition: gl.getUniformLocation(program, "u_mousePosition"),
    mousePointerDown: gl.getUniformLocation(program, "u_mousePointerDown"),
    mouseHover: gl.getUniformLocation(program, "u_mouseHover"),
  };

  return { program, uniforms };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function HeroWordmark({
  className = "hero-wordmark",
}: HeroWordmarkProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glCanvas = document.createElement("canvas");
    const gl = glCanvas.getContext("webgl2", {
      alpha: false,
      antialias: false,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const fluid = createFluid(gl);
    if (!fluid) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let disposed = false;
    let visible = true;
    let last = performance.now();
    let time = 0;
    let hover = 0;
    let targetHover = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;

    const rootStyle = getComputedStyle(document.documentElement);
    const atures =
      rootStyle.getPropertyValue("--font-atures").trim() || "Atures, sans-serif";
    const poppins =
      rootStyle.getPropertyValue("--font-poppins").trim() ||
      "Poppins, sans-serif";

    const fitStack = (width: number, height: number) => {
      const gap = Math.max(2, height * 0.02);
      let brandSize = height * 0.56;
      let subSize = height * 0.5;

      ctx.letterSpacing = "-0.045em";
      ctx.font = `700 ${brandSize}px ${atures}`;
      while (ctx.measureText(BRAND).width > width * 0.98 && brandSize > 16) {
        brandSize *= 0.97;
        ctx.font = `700 ${brandSize}px ${atures}`;
      }

      ctx.letterSpacing = "0.04em";
      ctx.font = `700 ${subSize}px ${poppins}`;
      while (ctx.measureText(SUBLINE).width > width * 0.98 && subSize > 11) {
        subSize *= 0.97;
        ctx.font = `700 ${subSize}px ${poppins}`;
      }

      return { brandSize, subSize, gap };
    };

    const drawBoldText = (text: string, x: number, y: number, stroke: number) => {
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      ctx.lineWidth = stroke;
      ctx.strokeText(text, x, y);
      ctx.fillText(text, x, y);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.width = width;
      canvas.height = height;
      glCanvas.width = width;
      glCanvas.height = height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      gl.viewport(0, 0, width, height);
    };

    const onEnter = () => {
      targetHover = 1;
      wrap.classList.add("is-hover");
    };

    const onLeave = () => {
      targetHover = 0;
      targetX = 0.5;
      targetY = 0.5;
      wrap.classList.remove("is-hover");
    };

    const onMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      targetX = (event.clientX - rect.left) / Math.max(rect.width, 1);
      targetY = (event.clientY - rect.top) / Math.max(rect.height, 1);
      targetHover = 1;
      wrap.classList.add("is-hover");
    };

    wrap.addEventListener("pointerenter", onEnter);
    wrap.addEventListener("pointerleave", onLeave);
    wrap.addEventListener("pointermove", onMove);

    const renderFluid = (now: number, cssWidth: number, cssHeight: number) => {
      const delta = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduceMotion) time += delta * lerp(1, 1.85, hover);

      hover = lerp(hover, targetHover, 0.08);
      mouseX = lerp(mouseX, targetX, 0.12);
      mouseY = lerp(mouseY, targetY, 0.12);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      gl.useProgram(fluid.program);
      gl.uniform4fv(fluid.uniforms.colors, FLUID_UNIFORMS.colors.flat());
      gl.uniform1i(
        fluid.uniforms.colorsLength,
        FLUID_UNIFORMS.colors.length,
      );
      gl.uniform1f(fluid.uniforms.seed, FLUID_UNIFORMS.seed);
      gl.uniform1f(
        fluid.uniforms.speed,
        FLUID_UNIFORMS.speed * lerp(1, 1.7, hover),
      );
      gl.uniform1f(fluid.uniforms.loop, FLUID_UNIFORMS.loop);
      gl.uniform1f(fluid.uniforms.scale, FLUID_UNIFORMS.scale);
      gl.uniform1f(
        fluid.uniforms.turbAmp,
        FLUID_UNIFORMS.turbAmp * lerp(1, 1.45, hover),
      );
      gl.uniform1f(fluid.uniforms.turbFreq, FLUID_UNIFORMS.turbFreq);
      gl.uniform1f(fluid.uniforms.turbIter, FLUID_UNIFORMS.turbIter);
      gl.uniform1f(
        fluid.uniforms.waveFreq,
        FLUID_UNIFORMS.waveFreq * lerp(1, 1.2, hover),
      );
      gl.uniform1f(fluid.uniforms.distBias, FLUID_UNIFORMS.distBias);
      gl.uniform1f(fluid.uniforms.jellify, FLUID_UNIFORMS.jellify);
      gl.uniform1f(fluid.uniforms.ditherMode, FLUID_UNIFORMS.ditherMode);
      gl.uniform1f(fluid.uniforms.dither, FLUID_UNIFORMS.dither);
      gl.uniform1f(
        fluid.uniforms.exposure,
        FLUID_UNIFORMS.exposure * lerp(1, 1.12, hover),
      );
      gl.uniform1f(fluid.uniforms.contrast, FLUID_UNIFORMS.contrast);
      gl.uniform1f(
        fluid.uniforms.saturation,
        FLUID_UNIFORMS.saturation * lerp(1, 1.15, hover),
      );
      gl.uniform1f(fluid.uniforms.time, time);
      gl.uniform2f(fluid.uniforms.resolution, cssWidth, cssHeight);
      gl.uniform1f(fluid.uniforms.deltaTime, delta);
      gl.uniform1f(fluid.uniforms.pixelRatio, dpr);
      gl.uniform4f(
        fluid.uniforms.mousePosition,
        mouseX,
        1 - mouseY,
        mouseX,
        1 - mouseY,
      );
      gl.uniform1f(fluid.uniforms.mousePointerDown, 0);
      gl.uniform1f(fluid.uniforms.mouseHover, hover);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const draw = (now: number) => {
      if (disposed) return;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) {
        if (visible && !reduceMotion) frame = requestAnimationFrame(draw);
        return;
      }

      renderFluid(now, width, height);

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#111";
      ctx.strokeStyle = "#111";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const { brandSize, subSize, gap } = fitStack(width, height);
      const stackHeight = brandSize + gap + subSize;
      const brandY = (height - stackHeight) / 2 + brandSize / 2;
      const subY = brandY + brandSize / 2 + gap + subSize / 2;

      ctx.letterSpacing = "-0.045em";
      ctx.font = `700 ${brandSize}px ${atures}`;
      drawBoldText(BRAND, width / 2, brandY, Math.max(1.25, brandSize * 0.028));

      ctx.letterSpacing = "0.04em";
      ctx.font = `700 ${subSize}px ${poppins}`;
      drawBoldText(SUBLINE, width / 2, subY, Math.max(1.1, subSize * 0.03));

      ctx.globalCompositeOperation = "source-in";
      ctx.drawImage(glCanvas, 0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";

      if (visible && !reduceMotion) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      resize();
      draw(performance.now());
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(start);
    start();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion || !visible) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        const nextVisible = Boolean(entry?.isIntersecting);
        if (nextVisible === visible) return;
        visible = nextVisible;
        if (visible && !reduceMotion) {
          last = performance.now();
          frame = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(frame);
        }
      },
      { threshold: 0.05 },
    );
    visibilityObserver.observe(wrap);

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      wrap.removeEventListener("pointerenter", onEnter);
      wrap.removeEventListener("pointerleave", onLeave);
      wrap.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className={className} ref={wrapRef}>
      <canvas ref={canvasRef} draggable={false} aria-hidden="true" />
      {className === "hero-wordmark" ? (
        <h1 className="sr-only">{LABEL}</h1>
      ) : (
        <p className="sr-only">{LABEL}</p>
      )}
    </div>
  );
}
