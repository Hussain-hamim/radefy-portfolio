"use client";

import Image from "next/image";
import { useState } from "react";

const LINKS = [
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "Solutions", href: "#workflow" },
  { label: "Contact", href: "#contact" },
] as const;

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header${open ? " is-open" : ""}`}>
      <div className="site-header-bar">
          <a className="site-brand" href="#top" aria-label="Radefy Systems">
          <Image
            className="site-logo"
            src="/logo.png"
            alt=""
            width={536}
            height={500}
            priority
          />
          <span className="site-slogan">defying the status quo</span>
        </a>

        <nav className="site-nav-desktop" aria-label="Main navigation">
          {LINKS.map((link) => (
            <a key={link.href} className="nav-link" href={link.href}>
              <span className="nav-link-label">
                <span>{link.label}</span>
                <span aria-hidden="true">{link.label}</span>
              </span>
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <nav className="site-menu" aria-label="Mobile navigation" hidden={!open}>
        {LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
