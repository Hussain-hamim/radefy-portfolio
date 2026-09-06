import BookButton from "./components/BookButton";
import HeroIntro from "./components/HeroIntro";
import HeroWordmark from "./components/HeroWordmark";
import About from "./components/About";
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

          <HeroIntro>
            <p className="hero-copy-text">
              A senior B2B brand and web studio. We design brands and the
              websites that carry them, built to the standard of the best work
              on the web, then help both grow.
            </p>

            <div className="hero-actions">
              <StartButton />
              <BookButton />
            </div>
          </HeroIntro>
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
