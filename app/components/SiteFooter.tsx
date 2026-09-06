"use client";

import HeroWordmark from "./HeroWordmark";
import RadefyLogo from "./RadefyLogo";
import ScrollReveal from "./ScrollReveal";

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
        <ScrollReveal as="div" className="footer-top">
          <a className="footer-brand" href="#top" aria-label="Radefy Systems">
            <RadefyLogo className="footer-logo" />
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
        </ScrollReveal>

        <ScrollReveal as="div" className="footer-grid" delay={100}>
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
        </ScrollReveal>
      </div>

      <ScrollReveal as="div" className="footer-wordmark-wrap" delay={160}>
        <HeroWordmark word="Radefy" className="footer-wordmark" />
      </ScrollReveal>
    </footer>
  );
}
