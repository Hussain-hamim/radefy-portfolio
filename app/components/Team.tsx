import RollingNumber from "./RollingNumber";
import ScrollReveal from "./ScrollReveal";
import TeamSystem from "./TeamSystem";

const STATS = [
  { value: "40+", label: "Projects delivered" },
  { value: "30+", label: "B2B brands" },
  { value: "30+", label: "Client reviews" },
] as const;

const PEOPLE = [
  {
    name: "Rahim Rad",
    role: "Founder",
    image: "/team/rahim-rad.png",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Hussain Hamim",
    role: "Full-stack Engineer",
    image: "/team/hussain-hamim-v2.png",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Rahmat Danish",
    role: "DevOps Engineer",
    image: "/team/rahmat-danish.png",
    x: "https://x.com/",
    linkedin: "https://www.linkedin.com/",
  },
  {
    name: "Samsoor Enzo",
    role: "Full-stack Engineer",
    image: "/team/samsoor-enzo.png",
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

      <TeamSystem people={PEOPLE} />
    </section>
  );
}
