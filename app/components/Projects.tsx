import Image from "next/image";

const PROJECTS = [
  {
    name: "Finite",
    category: "Bitcoin / Talent Intelligence",
    href: "#projects",
    image: "/projects/finite.jpg",
  },
  {
    name: "Kyzenn",
    category: "Amazon Growth / eCommerce",
    href: "#projects",
    image: "/projects/kyzenn.jpg",
  },
  {
    name: "SenseHawk",
    category: "Climate Tech / Enterprise SaaS",
    href: "#projects",
    image: "/projects/sensehawk.jpg",
  },
  {
    name: "Fluxora",
    category: "Payments / POS Solutions",
    href: "#projects",
    image: "/projects/fluxora.jpg",
  },
] as const;

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <header className="projects-header">
        <div className="projects-heading">
          <h2 className="projects-title">Projects</h2>
        </div>
        <p className="projects-lede">
          Case studies that show how brand, web, and growth come together for
          B2B teams.
        </p>
      </header>

      <div className="projects-row">
        {PROJECTS.map((project) => (
          <a key={project.name} className="project-card" href={project.href}>
            <span className="project-card-media">
              <Image
                src={project.image}
                alt={`${project.name} website`}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className="project-card-image"
              />
            </span>
            <span className="project-card-meta">
              <span className="project-card-name">{project.name}</span>
              <span className="project-card-tag">{project.category}</span>
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
