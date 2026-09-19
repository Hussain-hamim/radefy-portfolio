import ScrollReveal from "./ScrollReveal";
import ScrollHighlight from "./ScrollHighlight";

const SYSTEMS = [
  "Schools & academies",
  "Sarafi & exchange",
  "Clinics & healthcare",
  "Gyms & fitness",
  "Airlines & travel",
  "Government organizations",
  "Tailoring businesses",
  "Retail & inventory",
  "ERP & MIS systems",
  "Consumer apps",
  "Mobile apps",
  "Desktop applications",
];

// Consistent line icons for each sector, in the same order as SYSTEMS.
const ICON_PATHS = [
  "M3 9l9-5 9 5-9 5-9-5Zm4 3v5c3 2 7 2 10 0v-5M21 9v7",
  "M4 7h15l-4-4M20 17H5l4 4M4 7v5M20 17v-5M9 12h6",
  "M9 3h6v6h6v6h-6v6H9v-6H3V9h6V3Z",
  "M7 9h10M7 15h10M3 9v6M6 6v12M18 6v12M21 9v6",
  "m3 10 7 1 5-7c1-2 4-2 3 1l-3 7 5 5-2 2-6-3-4 4-2-1 2-5-5-2v-2Z",
  "m3 8 9-5 9 5H3ZM5 11v7M10 11v7M14 11v7M19 11v7M3 21h18",
  "M9 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm0 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 10l12 10M8 16 20 4",
  "m3 7 9-4 9 4-9 4-9-4Zm0 0v10l9 4 9-4V7M12 11v10M7 5l10 4",
  "M3 3h7v7H3V3ZM14 14h7v7h-7v-7ZM14 3h7v7h-7V3ZM3 14h7v7H3v-7Z",
  "M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM5 21v-3a7 7 0 0 1 14 0v3M9 17h6",
  "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2ZM10 5h4M11 19h2",
  "M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM8 21h8M12 17v4M2 13h20",
];

export default function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <h2 className="about-title" id="about-title">About us</h2>
      <div className="about-inner">
        <p className="about-label">Who we are</p>
        <ScrollHighlight text="Radefy Systems is an independent software company based in Khost, Afghanistan. We work directly with businesses to turn operational challenges into dependable software. We combine hands-on engineering with AI-assisted development to move projects forward efficiently." />
      </div>

      <div className="about-inner">
        <p className="about-label">Our ambition</p>
        <ScrollHighlight text="Alongside client projects, we build and continue to develop our own consumer applications. Our ambition is to grow this product portfolio and build larger software platforms that support businesses and everyday life across Afghanistan and beyond." />
      </div>

      <div className="about-brands">
        <ScrollReveal>
          <p className="about-brands-label">
            Software for businesses, organizations, and everyday life
          </p>
        </ScrollReveal>
        <ul className="about-brands-list">
          {SYSTEMS.map((name, index) => (
            <ScrollReveal
              key={name}
              as="li"
              className="about-brand about-industry"
              delay={index * 60}
            >
              <span className="about-brand-mark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICON_PATHS[index]} />
                </svg>
              </span>
              <span className="about-brand-name">{name}</span>
            </ScrollReveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
