import About from "./components/About";
import HeroWordmark from "./components/HeroWordmark";
import Projects from "./components/Projects";
import Services from "./components/Services";
import SiteHeader from "./components/SiteHeader";
import StartButton from "./components/StartButton";
import Team from "./components/Team";
import Tools from "./components/Tools";
import Flow from "./components/Flow";
import Testimonials from "./components/Testimonials";
import SiteFooter from "./components/SiteFooter";

export default function Home() {
  return (
    <main id="top">
      <SiteHeader />

      <section className="hero" aria-label="Hero">
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-main">
          <HeroWordmark />

          <div className="hero-copy">
            <p>
              A senior B2B brand and web studio. We design brands and the
              websites that carry them, built to the standard of the best work
              on the web, then help both grow.
            </p>

            <div className="hero-actions">
              <StartButton />
              <a className="book-btn" href="#book">
                <span className="book-btn-label">
                  <span>Book a call</span>
                  <span aria-hidden="true">Book a call</span>
                </span>
                <span className="book-btn-arrow" aria-hidden="true">
                  <svg viewBox="0 0 16 16" width="14" height="14">
                    <path
                      fill="currentColor"
                      d="M3 8h8.2L8.1 4.9 9.5 3.5 13.9 8l-4.4 4.5-1.4-1.4L11.2 9H3z"
                    />
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Projects />
      <About />
      <Team />
      <Services />
      <Tools />
      <Flow />
      <Testimonials />
      <SiteFooter />
    </main>
  );
}
