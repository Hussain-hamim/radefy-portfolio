const BRANDS = [
  {
    name: "Finite",
    style: "finite",
    mark: (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 1.2 18 5.8v8.4L10 18.8 2 14.2V5.8L10 1.2Zm0 3.4L5.6 7.2v5.6L10 15.4l4.4-2.6V7.2L10 4.6Z"
        />
      </svg>
    ),
  },
  {
    name: "Kyzenn",
    style: "kyzenn",
    mark: null,
  },
  {
    name: "SenseHawk",
    style: "sensehawk",
    mark: (
      <svg viewBox="0 0 22 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M1 10.2c4.2-6 10.2-9 16.8-9.6-4 2.6-6.6 6.8-7 11.6 5-4 11.2-5.6 17.4-4.6-6.6 3-11.2 8.8-12.4 15.6"
          transform="scale(0.72) translate(-1 -1)"
        />
      </svg>
    ),
  },
  {
    name: "Fluxora",
    style: "fluxora",
    mark: (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M9 1a8 8 0 1 1 0 16A8 8 0 0 1 9 1Zm4.2 6.2-2.4 2.2H5.4V8h4.2L8.4 6.8 9.6 5.6l3.6 3.2-3.6 3.2-1.2-1.2 1.2-1.2"
        />
      </svg>
    ),
  },
  {
    name: "Cardo",
    style: "cardo",
    mark: (
      <svg viewBox="0 0 20 16" aria-hidden="true">
        <path fill="currentColor" d="M10 1 18 14H2L10 1Zm0 4.4L6.4 12h7.2L10 5.4Z" />
      </svg>
    ),
  },
  {
    name: "DealDesk",
    style: "dealdesk",
    mark: (
      <svg viewBox="0 0 18 18" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 3h5.2v2.2H5.2v7.6H3V3Zm6.8 0H15v2.2h-3v2.2h2.6V9.6H12v2.2h3V15H9.8V3Z"
        />
      </svg>
    ),
  },
  {
    name: "FlyCode",
    style: "flycode",
    mark: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path fill="currentColor" d="M2 8h8.2L7.4 4.2 8.8 2.8 14 8l-5.2 5.2-1.4-1.4L10.2 8H2V8Z" />
      </svg>
    ),
  },
  {
    name: "Baladi",
    style: "baladi",
    mark: (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="8" cy="8" r="2.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    name: "Enso",
    style: "enso",
    mark: null,
  },
] as const;

export default function About() {
  return (
    <section className="about" id="about">
      <div className="about-inner">
        <p className="about-label">Who we are</p>
        <p className="about-copy">
          The people who scope your brand and architecture are the same people
          who design, build, and ship it, then stay on to help you grow. No
          account managers, no junior handoffs.
        </p>
        <p className="about-index">01</p>
      </div>

      <div className="about-brands">
        <div className="about-brands-stars" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="about-brands-label">
          Some of the brands we collaborate with
        </p>
        <ul className="about-brands-list">
          {BRANDS.map((brand) => (
            <li key={brand.name} className={`about-brand about-brand-${brand.style}`}>
              {brand.mark ? (
                <span className="about-brand-mark">{brand.mark}</span>
              ) : null}
              <span className="about-brand-name">{brand.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
