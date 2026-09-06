"use client";

import { useState } from "react";

const SERVICES = [
  {
    number: "01",
    title: "Brand identity",
    points: ["Logo and wordmark", "Visual system", "Brand guidelines"],
    copy: "We craft B2B brand identities with a clear point of view, built to scale across every touchpoint.",
  },
  {
    number: "02",
    title: "Web design",
    points: ["UX and wireframes", "Visual design", "Design system"],
    copy: "We design websites that look sharp and convert, from first wireframe to final pixel.",
  },
  {
    number: "03",
    title: "Web engineering",
    points: ["Multi-CMS architecture", "Technical SEO and speed", "Built to scale"],
    copy: "We engineer large-scale sites: multi-CMS setups, clean technical SEO, and fast, maintainable architecture that holds up as you grow.",
  },
  {
    number: "04",
    title: "Growth",
    points: ["SEO foundations", "Landing pages", "Content systems"],
    copy: "We help the brand and site grow with SEO, landing pages, and content your team can run.",
  },
  {
    number: "05",
    title: "Strategy",
    points: ["Positioning", "Messaging", "Roadmap"],
    copy: "We sharpen positioning and messaging so the brand says the right thing to the right buyer.",
  },
] as const;

export default function Services() {
  const [open, setOpen] = useState(0);

  return (
    <section className="services" id="services">
      <header className="services-header">
        <div className="services-heading">
          <h2 className="services-title">Services</h2>
          <p className="services-count">({SERVICES.length})</p>
        </div>
        <p className="services-lede">
          Brand, web, and the infrastructure behind it, handled end to end.
        </p>
      </header>

      <div className="services-list">
        {SERVICES.map((service, index) => {
          const isOpen = open === index;
          return (
            <article
              key={service.number}
              className={`service-item${isOpen ? " is-open" : ""}`}
            >
              <button
                type="button"
                className="service-toggle"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? -1 : index)}
              >
                <span className="service-number">{service.number}</span>
                <span className="service-title">{service.title}</span>
                <span className="service-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      d="M6 9l6 6 6-6"
                    />
                  </svg>
                </span>
              </button>

              <div className="service-body">
                <ul className="service-points">
                  {service.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="service-copy">{service.copy}</p>
              </div>
            </article>
          );
        })}
      </div>

      <p className="services-note">
        Need something more specific? Tell us and we will scope it.{" "}
        <a href="#book">Book a call</a>
      </p>
    </section>
  );
}
