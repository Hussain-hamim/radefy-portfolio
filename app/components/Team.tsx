import Image from "next/image";
import RollingNumber from "./RollingNumber";
import ScrollReveal from "./ScrollReveal";

const STATS = [
  { value: "40+", label: "Projects delivered" },
  { value: "30+", label: "B2B brands" },
  { value: "30+", label: "Client reviews" },
] as const;

const PEOPLE = [
  {
    name: "Rahim Rad",
    role: "Founder",
    image: "/team/rahim-rad.jpg",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Hussain Hamim",
    role: "Full-stack Engineer",
    image: "/team/hussain-hamim.png",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Rahmat Danish",
    role: "DevOps Engineer",
    image: "/team/rahmat-danish.jpg",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Samsoor Enzo",
    role: "Full-stack Engineer",
    image: "/team/samsoor-enzo.jpg",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
] as const;

export default function Team() {
  return (
    <section className="team" id="team">
      <ScrollReveal as="div" className="team-inner">
        <p className="team-label">By the numbers</p>
      </ScrollReveal>

      <div className="team-stats">
        {STATS.map((stat, index) => (
          <ScrollReveal
            key={stat.label}
            as="div"
            className="team-stat"
            delay={index * 90}
          >
            <p className="team-stat-value">
              <RollingNumber value={stat.value} />
            </p>
            <p className="team-stat-label">{stat.label}</p>
          </ScrollReveal>
        ))}
      </div>

      <div className="team-people">
        <ScrollReveal as="h2" className="team-people-title">
          Meet our team
        </ScrollReveal>
        <div className="team-people-grid">
          {PEOPLE.map((person, index) => (
            <ScrollReveal
              key={person.name}
              as="article"
              className="team-person"
              delay={index * 80}
            >
              <span className="team-avatar">
                <Image
                  src={person.image}
                  alt=""
                  width={212}
                  height={212}
                  className="team-avatar-image"
                />
                <span className="team-socials">
                  <a
                    className="team-social"
                    href={person.x}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${person.name} on X`}
                  >
                    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M12.6 1.5h2.2L9.7 7.2 16 14.5h-4.9l-3.8-5-4.4 5H.7l5.5-6.3L0 1.5h5l3.5 4.6 4.1-4.6Zm-.8 11.7h1.2L4.3 2.7H3L11.8 13.2Z"
                      />
                    </svg>
                  </a>
                  <a
                    className="team-social"
                    href={person.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${person.name} on LinkedIn`}
                  >
                    <svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
                      <path
                        fill="currentColor"
                        d="M3.6 14.5H.9V5.4h2.7v9.1ZM2.2 4.1C1.3 4.1.6 3.4.6 2.5S1.3.9 2.2.9s1.6.7 1.6 1.6-.7 1.6-1.6 1.6ZM15.4 14.5h-2.7V10c0-1.1 0-2.4-1.5-2.4s-1.7 1.2-1.7 2.3v4.6H6.8V5.4h2.6v1.2h.1c.4-.7 1.3-1.5 2.6-1.5 2.8 0 3.3 1.8 3.3 4.2v5.2Z"
                      />
                    </svg>
                  </a>
                </span>
              </span>
              <p className="team-person-name">{person.name}</p>
              <p className="team-person-role">{person.role}</p>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
