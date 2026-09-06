"use client";

import { FormEvent } from "react";
import HeroWordmark from "./HeroWordmark";

const PROJECTS = [
  { name: "Finite", href: "#projects" },
  { name: "Kyzenn", href: "#projects" },
  { name: "SenseHawk", href: "#projects" },
] as const;

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Workflow", href: "#workflow" },
  { label: "Projects", href: "#projects" },
  { label: "Testimonials", href: "#testimonials" },
] as const;

function SlideLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <a className="footer-slide" href={href}>
      <span className="footer-slide-label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </a>
  );
}

export default function SiteFooter() {
  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();
  };

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-inner">
        <div className="footer-subscribe">
          <p>Subscribe for new projects and insights, once a month.</p>
          <form className="footer-form" onSubmit={onSubscribe}>
            <label className="sr-only" htmlFor="footer-email">
              Email
            </label>
            <input
              id="footer-email"
              type="email"
              name="email"
              required
              placeholder="Email"
              autoComplete="email"
            />
            <button type="submit">Submit</button>
          </form>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            {PROJECTS.map((project) => (
              <a key={project.name} className="footer-project" href={project.href}>
                <span>{project.name}</span>
                <span>View project</span>
              </a>
            ))}
          </div>

          <div className="footer-col">
            <SlideLink href="mailto:hello@radefysystems.com">
              hello@radefysystems.com
            </SlideLink>
            <SlideLink href="#book">Book a call</SlideLink>
          </div>

          <div className="footer-col">
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-wordmark-wrap" id="book">
        <HeroWordmark word="Radefy" className="footer-wordmark" />
      </div>
    </footer>
  );
}
