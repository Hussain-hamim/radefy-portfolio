const STEPS = [
  {
    title: "Discover",
    copy: "We learn your business, your buyer, and what the brand and site need to do.",
    progress: 25,
  },
  {
    title: "Design",
    copy: "We shape the brand and the site, testing directions until it is right.",
    progress: 50,
    accent: true,
  },
  {
    title: "Build",
    copy: "We build it fast and clean, ready for your team to run.",
    progress: 75,
  },
  {
    title: "Launch",
    copy: "We launch, hand over, and stay on to help it grow.",
    progress: 100,
  },
] as const;

export default function Flow() {
  return (
    <section className="flow" id="workflow">
      <header className="flow-header">
        <div className="flow-header-left">
          <h2 className="flow-title">Flow</h2>
          <p className="flow-meta">
            Process: <strong>4 steps</strong>
          </p>
        </div>
        <div className="flow-header-right">
          <p className="flow-lede">
            How we turn a brief into a brand and a site that performs.
          </p>
          <p className="flow-meta">
            Duration: <strong>~ 1 month</strong>
          </p>
        </div>
      </header>

      <ol className="flow-steps">
        {STEPS.map((step) => (
          <li
            key={step.title}
            className={`flow-step${"accent" in step ? " has-accent" : ""}`}
          >
            {"accent" in step ? (
              <span className="flow-step-accent" aria-hidden="true" />
            ) : null}
            <h3 className="flow-step-title">{step.title}</h3>
            <p className="flow-step-text">{step.copy}</p>
            <p className="flow-step-progress">{step.progress}%</p>
            <span
              className="flow-step-bar"
              style={{ width: `${step.progress}%` }}
              aria-hidden="true"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
