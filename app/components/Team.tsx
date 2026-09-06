import Image from "next/image";

const STATS = [
  { value: "40+", label: "Projects delivered" },
  { value: "30+", label: "B2B brands" },
  { value: "30+", label: "Client reviews" },
] as const;

const PEOPLE = [
  {
    name: "Rahim Rad",
    role: "Founder",
    image: "/team/rahim-rad-v2.png",
  },
  {
    name: "Hussain Hamim",
    role: "Head of Sales",
    image: "/team/hussain-hamim-v2.png",
  },
  {
    name: "Rahmat Danish",
    role: "Project Manager",
    image: "/team/rahmat-danish-v2.png",
  },
  {
    name: "Samsoor Enzo",
    role: "Product Designer",
    image: "/team/samsoor-enzo-v2.png",
  },
] as const;

export default function Team() {
  return (
    <section className="team" id="team">
      <div className="team-inner">
        <p className="team-label">By the numbers</p>
      </div>

      <div className="team-stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="team-stat">
            <p className="team-stat-value">{stat.value}</p>
            <p className="team-stat-label">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="team-people">
        <h2 className="team-people-title">Meet our team</h2>
        <div className="team-people-grid">
        {PEOPLE.map((person) => (
          <article key={person.name} className="team-person">
            <span className="team-avatar">
              <Image
                src={person.image}
                alt=""
                width={212}
                height={212}
                className="team-avatar-image"
              />
            </span>
            <p className="team-person-name">{person.name}</p>
            <p className="team-person-role">{person.role}</p>
          </article>
        ))}
        </div>
      </div>
    </section>
  );
}
