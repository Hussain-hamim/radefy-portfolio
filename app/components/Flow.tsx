import ScrollReveal from "./ScrollReveal";
import type { CSSProperties } from "react";

const STEPS = [
  {
    title: "Discover",
    copy: "We review your goals, existing workflows, and user needs to agree on a clear scope and priorities.",
    progress: 25,
  },
  {
    title: "Plan",
    copy: "We define the user experience, system architecture, and delivery milestones before development begins.",
    progress: 50,
    accent: true,
  },
  {
    title: "Build",
    copy: "We develop and test in stages, sharing progress for your review. AI assists delivery; our engineers own the decisions and quality.",
    progress: 75,
  },
  {
    title: "Launch",
    copy: "We prepare the release, help your team get started, and agree on the support and improvements your software needs next.",
    progress: 100,
  },
] as const;

export default function Flow() {
  return (
    <section className="flow" id="workflow">
      <ScrollReveal as="header" className="flow-header">
        <div className="flow-header-left">
          <h2 className="flow-title">Flow</h2>
          <p className="flow-meta">
            Process: <strong>4 steps</strong>
          </p>
        </div>
        <div className="flow-header-right">
          <p className="flow-lede">
            A clear process. Direct communication. Progress you can review.
          </p>
          <p className="flow-meta">
            Delivery: <strong>agreed milestones</strong>
          </p>
        </div>
      </ScrollReveal>

      <ol className="flow-steps">
        {STEPS.map((step, index) => (
          <ScrollReveal
            key={step.title}
            as="li"
            className={`flow-step${"accent" in step ? " has-accent" : ""}`}
            delay={index * 100}
            style={
              {
                ["--flow-progress"]: `${step.progress}%`,
              } as CSSProperties
            }
          >
            {"accent" in step ? (
              <span className="flow-step-accent" aria-hidden="true" />
            ) : null}
            <h3 className="flow-step-title">{step.title}</h3>
            <p className="flow-step-text">{step.copy}</p>
            <p className="flow-step-progress">{step.progress}%</p>
            <span className="flow-step-bar" aria-hidden="true" />
          </ScrollReveal>
        ))}
      </ol>
    </section>
  );
}
