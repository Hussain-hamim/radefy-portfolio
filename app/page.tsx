import BookButton from "./components/BookButton";
import HeroGradient from "./components/HeroGradient";
import HeroIntro from "./components/HeroIntro";
import HeroWordmark from "./components/HeroWordmark";
import RadefySignature from "./components/RadefySignature";
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
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Radefy Systems",
    url: "https://www.radefysystems.com/",
    logo: "https://www.radefysystems.com/logo.png",
    email: "hello@radefysystems.com",
    description:
      "A software company in Khost, Afghanistan building custom software, AI-powered systems, web platforms, and apps for businesses.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Khost",
      addressCountry: "AF",
    },
    knowsAbout: [
      "Custom software development",
      "Artificial intelligence",
      "Web application development",
      "Mobile application development",
      "Business automation",
    ],
  };

  return (
    <main id="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <SiteHeader />

      <section className="hero" aria-label="Hero">
        <HeroGradient />
        <RadefySignature />
        <div className="hero-main">
          <HeroWordmark />

          <HeroIntro>
            <p className="hero-copy-text">
              Software that moves your business forward. We develop custom
              systems, web platforms, and applications that simplify operations
              and bring new products to market.
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
