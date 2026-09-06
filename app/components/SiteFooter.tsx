"use client";

import Image from "next/image";
import HeroWordmark from "./HeroWordmark";

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
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-gradient" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-top">
          <a className="footer-brand" href="#top" aria-label="Radefy Systems">
            <Image
              className="footer-logo"
              src="/logo.png"
              alt=""
              width={536}
              height={500}
            />
            <span className="footer-brand-copy">
              <span className="footer-brand-name">Radefy Systems</span>
              <span className="footer-brand-tag">
                defying the status quo
              </span>
            </span>
          </a>

          <div className="footer-cta" id="book">
            <p>Ready to start?</p>
            <SlideLink href="mailto:hello@radefysystems.com">
              Book a discovery call
            </SlideLink>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <span className="footer-col-label">Contact</span>
            <SlideLink href="mailto:hello@radefysystems.com">
              hello@radefysystems.com
            </SlideLink>
            <a href="mailto:hello@radefysystems.com">New projects welcome</a>
          </div>

          <div className="footer-col">
            <span className="footer-col-label">Explore</span>
            {LINKS.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-wordmark-wrap">
        <HeroWordmark word="Radefy" className="footer-wordmark" />
      </div>
    </footer>
  );
}
