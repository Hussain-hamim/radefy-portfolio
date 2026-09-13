type ServiceKind =
  | "brand"
  | "design"
  | "engineering"
  | "growth"
  | "strategy";

export type ServiceData = {
  number: string;
  title: string;
  points: readonly string[];
  copy: string;
  kind: ServiceKind;
};

function CapabilityMark({ kind }: { kind: ServiceKind }) {
  return (
    <svg
      className="service-mark"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
      {kind === "brand" ? (
        <path d="M3 3H12L15 6V15H3Z" />
      ) : null}
      {kind === "design" ? (
        <>
          <path d="M4 4H8V8H4Z" />
          <path d="M10 4H14V8H10Z" />
          <path d="M4 10H8V14H4Z" />
          <path d="M10 10H14V14H10Z" />
        </>
      ) : null}
      {kind === "engineering" ? (
        <>
          <path d="M3 9H15" />
          <path d="M6 4L9 9L6 14" />
          <path d="M12 4L9 9L12 14" />
        </>
      ) : null}
      {kind === "growth" ? (
        <>
          <path d="M4 14L9 4L14 14" />
          <path d="M6.8 10H11.2" />
        </>
      ) : null}
      {kind === "strategy" ? (
        <>
          <path d="M3 15L15 3" />
          <path d="M8 3H15V10" />
        </>
      ) : null}
    </svg>
  );
}

export default function ServiceModule({
  service,
  isOpen,
  onToggle,
  itemRef,
}: {
  service: ServiceData;
  isOpen: boolean;
  onToggle: () => void;
  itemRef: (node: HTMLElement | null) => void;
}) {
  return (
    <article
      ref={itemRef}
      className={`service-item${isOpen ? " is-open" : ""}`}
    >
      <span className="service-node" aria-hidden="true" />

      <button
        type="button"
        className="service-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <span className="service-id">
          <CapabilityMark kind={service.kind} />
          <span className="service-number">{service.number}</span>
        </span>
        <span className="service-title">
          <span className="service-title-text">{service.title}</span>
        </span>
        <span className="service-dock" aria-hidden="true" />
      </button>

      <div className="service-body">
        <div className="service-body-inner">
          <ul className="service-points">
            {service.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <p className="service-copy">{service.copy}</p>
        </div>
      </div>
    </article>
  );
}
