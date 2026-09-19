"use client";

import { GradientAvatar } from "@outpacelabs/avatars";
import { useEffect, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const QUOTES = [
  {
    name: "Ahmad Zia",
    company: "Sample testimonial · Illustrative name and quote",
    before:
      "Their work easily rivals branding and web agencies. They integrated seamlessly with our team and have been a key player in our rebrand and digital transformation. ",
    highlight: "The brand and site finally feel like one company.",
    after: " Clear, fast, and always on the mark.",
  },
  {
    name: "Farid Ahmad",
    company: "Sample testimonial · Illustrative name and quote",
    before:
      "Radefy is in the top 1% at taking high-level direction and executing to completion. Their visual and product design sense is incredible, and ",
    highlight:
      "the ability to ship the final build was fast and always on the mark.",
    after: "",
  },
  {
    name: "Maryam Ahmadi",
    company: "Sample testimonial · Illustrative name and quote",
    before:
      "They built our website flawlessly in just three weeks. Professional, knowledgeable, and ",
    highlight: "one of the best web teams I have ever worked with.",
    after: "",
  },
  {
    name: "Abdul Rahman",
    company: "Sample testimonial · Illustrative name and quote",
    before:
      "An invaluable resource to our team. Their mastery of design and engineering, paired with a deep understanding of our brand, ",
    highlight: "consistently delivers seamless, impactful work.",
    after: "",
  },
] as const;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const quote = QUOTES[index];

  const prev = () => setIndex((i) => (i === 0 ? QUOTES.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === QUOTES.length - 1 ? 0 : i + 1));

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      setIndex((i) => (i === QUOTES.length - 1 ? 0 : i + 1));
    }, 3000);

    return () => window.clearInterval(timer);
  }, [index]);

  return (
    <section className="testimonials" id="testimonials">
      <ScrollReveal as="div" className="testimonials-card">
        <header className="testimonials-header">
          <h2 className="testimonials-title">What clients say</h2>
          <div className="testimonials-nav">
            <button
              type="button"
              className="testimonials-arrow"
              aria-label="Previous testimonial"
              onClick={prev}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M10.2 3.2 5.4 8l4.8 4.8-1.2 1.2L3 8l6-6 1.2 1.2Z"
                />
              </svg>
            </button>
            <button
              type="button"
              className="testimonials-arrow"
              aria-label="Next testimonial"
              onClick={next}
            >
              <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M5.8 3.2 10.6 8 5.8 12.8l1.2 1.2L13 8l-6-6-1.2 1.2Z"
                />
              </svg>
            </button>
          </div>
        </header>

        <article className="testimonials-body" key={quote.name}>
          <div className="testimonials-quote">
            <p>
              “{quote.before}
              <strong>{quote.highlight}</strong>
              {quote.after}”
            </p>
          </div>
          <div className="testimonials-person">
            <div className="testimonials-photo" aria-hidden="true">
              <GradientAvatar
                seed={`${quote.name}-${quote.company}`}
                size={64}
                radius="inherit"
                style={{ display: "block", width: "100%", height: "100%" }}
                pattern="mesh"
              />
            </div>
            <div>
              <p className="testimonials-name">{quote.name}</p>
              <p className="testimonials-company">{quote.company}</p>
            </div>
          </div>
        </article>
      </ScrollReveal>
    </section>
  );
}
