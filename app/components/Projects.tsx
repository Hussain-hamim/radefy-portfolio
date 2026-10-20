"use client";

import Image from "next/image";
import { useState } from "react";

const PROJECTS = [
  {
    name: "IdeaHunt",
    category: "AI / Startup Research",
    detail: "AI-powered research to discover and validate startup ideas",
    href: "https://www.ideahunt.pro/",
    // Cover source: https://unsplash.com/photos/seA-FPPXL-M (Unsplash License).
    image: "https://images.unsplash.com/photo-1637825891028-564f672aa42c?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Purple abstract waves — illustrative cover for IdeaHunt",
  },
  {
    name: "Radefy English Academy",
    category: "Education / Academy Management",
    detail: "Academy software for enrollments, fees, classes, and reporting",
    href: "https://course-rad-sys.vercel.app/",
    // Cover source: https://unsplash.com/photos/xYyJAC0IdyI (Unsplash License).
    image: "https://images.unsplash.com/photo-1683178861337-ca70ef8c0db3?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Library bookshelves — illustrative cover for the academy system",
  },
  {
    name: "Afghan Sarafi Management System",
    category: "Finance / Sarafi Management",
    detail: "Multi-currency cash, exchanges, hawala, and customer accounts",
    href: "/projects/file_0000000016b08246b946997f66b02d34.png",
    // Cover source: https://unsplash.com/photos/4Sh6TPeRJuI (Unsplash License).
    image: "https://images.unsplash.com/photo-1744740606214-7d16fd3d9c05?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Blue sculptural abstract form — illustrative cover for the Sarafi system",
  },
  {
    name: "BBL Business Management",
    category: "ERP / Business Operations",
    detail: "Sales, inventory, cash, and reporting in one business dashboard",
    href: "/projects/Image 9-19-26 at 12.31 PM (1).jpg",
    // Cover source: https://unsplash.com/photos/UOfHRacPDvE (Unsplash License).
    image: "https://images.unsplash.com/photo-1578538495992-8cb861684e3a?auto=format&fit=crop&w=1100&q=85",
    imageAlt: "Warm abstract texture — illustrative cover for BBL Business Management",
  },
] as const;

export default function Projects() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="projects projects-marquee-section" id="projects" aria-labelledby="projects-title">
      <header className="projects-header">
        <h2 className="projects-title" id="projects-title">Projects</h2>
        <p className="projects-lede">
          A selection of our work across business systems and digital products.
        </p>
        <button type="button" className="projects-marquee-toggle" aria-pressed={paused} onClick={() => setPaused(!paused)}>
          {paused ? "Play projects" : "Pause projects"}
        </button>
      </header>
      <div className="projects-marquee" data-paused={paused}>
        <div className="projects-marquee-track">
          {[0, 1].map((copy) => (
            <div className="projects-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
              {PROJECTS.map((project) => (
                <article className="projects-marquee-item" key={project.name}>
                  <a className="project-card" href={project.href} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : 0}>
                    <span className="project-card-media">
                      <Image src={project.image} alt={project.imageAlt} fill sizes="(max-width: 600px) 82vw, 440px" className="project-card-image" style={{ objectPosition: "center" }} />
                    </span>
                    <span className="project-card-body">
                      <span className="project-card-copy">
                        <span className="project-card-name">{project.name}</span>
                        <span className="project-card-detail">{project.detail}</span>
                      </span>
                      <span className="project-card-aside">
                        <span className="project-card-tag">{project.category}</span>
                        <span className="project-card-cta">
                          {project.href.startsWith("http") ? "View project" : "View preview"} ↗
                        </span>
                      </span>
                    </span>
                  </a>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
