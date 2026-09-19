import RollingNumber from "./RollingNumber";
import ScrollReveal from "./ScrollReveal";
import TeamSystem from "./TeamSystem";

const STATS = [
  { value: "Code", label: "Built around your business" },
  { value: "AI", label: "Assisted development" },
  { value: "Care", label: "Support beyond launch" },
] as const;

const PEOPLE = [
  {
    name: "Rahim Rad",
    role: "Founder",
    image: "/team/rahim-rad.png",
    website: "https://www.rahimrad.xyz/",
    github: "https://github.com/Rahimrad",
  },
  {
    name: "Hussain Hamim",
    role: "Full-stack Engineer",
    image: "/team/hussain-hamim-v2.png",
    website: "https://www.hussainhamim.xyz/",
    x: "https://x.com/erencode",
    linkedin: "https://www.linkedin.com/in/hussain-hamim/",
    github: "https://github.com/Hussain-hamim",
  },
  {
    name: "Rahmat Danish",
    role: "DevOps Engineer",
    image: "/team/rahmat-danish-v2.png",
    website: "https://mywebsite-bay-theta.vercel.app/",
    x: "https://x.com/rahmatdev",
    github: "https://github.com/Hood117",
    instagram: "https://instagram.com/itxzadrann",
  },
  {
    name: "Samsoor Enzo",
    role: "Full-stack Engineer",
    image: "/team/samsoor-enzo.png",
    website: "https://www.samsoor.xyz/",
    x: "https://x.com/ssamDev",
    linkedin: "https://www.linkedin.com/in/samsoor-hananzoi-264510257/",
    github: "https://github.com/samsoorsamander",
    instagram: "https://instagram.com/samsoorsamander",
  },
] as const;

export default function Team() {
  return (
    <section className="team" id="team">
      <ScrollReveal as="div" className="team-inner">
        <p className="team-label">Engineering at our core</p>
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
