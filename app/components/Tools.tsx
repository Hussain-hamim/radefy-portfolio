import ScrollReveal from "./ScrollReveal";

const TOOLS = [
  {
    name: "Supabase",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.9 2.2c.5-.7 1.6-.3 1.6.6V10h5c.9 0 1.4 1.1.8 1.8l-8.3 9.9c-.5.7-1.6.3-1.6-.6V14H6.4c-.9 0-1.4-1.1-.8-1.8l8.3-10Z"
        />
      </svg>
    ),
  },
  {
    name: "NestJS",
    word: "nest",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12.2 2.1c.4-.2.8.1.8.5v3.4c3.6.4 6.4 2.6 6.4 6.3 0 4.4-3.7 7.3-7.4 9.4-.3.2-.7.2-1 0C7.3 19.6 3.6 16.7 3.6 12.3c0-3.7 2.8-5.9 6.4-6.3V2.6c0-.4.4-.7.8-.5l1.4 1Zm-1.4 5.6c-2.8.4-4.6 2.1-4.6 4.6 0 3.1 2.7 5.4 5.8 7.2 3.1-1.8 5.8-4.1 5.8-7.2 0-2.5-1.8-4.2-4.6-4.6v2.1c1.3.3 2.1 1.2 2.1 2.5 0 1.7-1.5 3-3.3 4.1-1.8-1.1-3.3-2.4-3.3-4.1 0-1.3.8-2.2 2.1-2.5V7.7Z"
        />
      </svg>
    ),
  },
  {
    name: "Swift",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.6 15.3c-1.6 2.6-4.4 4.4-8.3 4.8-5.2.5-10-2.4-12-6.8 2.1 1.7 4.6 3 7.4 3.6-2.8-2-5-4.7-6.3-8C4.6 11 7 13.4 10 15c-2.6-3-4.2-6.8-4.4-10.7 2.2 2.5 5 4.6 8.1 6.1C11.8 6.6 13.6 3 16.4 1.4c-.4 3.2.5 6.5 2.6 9.1 1 1.3 2.3 2.3 3.8 3 0 .6-.3 1.2-.8 1.8h-.4Z"
        />
      </svg>
    ),
  },
  {
    name: "Electron",
    word: "ELECTRON",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="1.7" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          transform="rotate(-60 12 12)"
        />
      </svg>
    ),
  },
  {
    name: "Redis",
    word: "redis",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M2.4 15.1 12 19.4l9.6-4.3v3.2L12 22.6 2.4 18.3v-3.2Zm0-5.4L12 14l9.6-4.3v3.2L12 17.2 2.4 12.9V9.7ZM12 1.4l9.6 4.3L12 10 2.4 5.7 12 1.4Z"
        />
      </svg>
    ),
  },
  {
    name: "PostgreSQL",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.7 3.2c1.8.4 3 1.7 3.2 3.6.2 2.2-.6 4.6-2.2 6.4.8 1.6 1.1 3.3.6 4.8-.6 1.8-2.2 2.8-4.2 2.6l-.4 2.2h-2l.5-2.6c-1.6.1-3-.5-3.7-1.8-.6-1.1-.5-2.5.2-4L6.2 12c-1.4-1.8-2-4-1.6-6C5 3.6 6.8 2.2 9.2 2c1.1-.1 3.8.2 5.2.8 1 .4 1.7.3 2.3.4Zm-7.3 1.4c-1.6.2-2.7 1.1-2.9 2.6-.3 1.6.3 3.4 1.5 4.8l.4.4.8-2.6c.2-.8.8-1.2 1.6-1.1l.3 1.8c.1.7.6 1 1.2.9.7-.1 1-.6.9-1.3l-.3-2c1.2.1 2 .8 2.2 1.8.1.7 0 1.5-.4 2.3 1.1-1.4 1.6-3.2 1.4-4.7-.2-1.6-1.3-2.6-3.1-3-1.2-.2-3.6-.3-3.6.1Z"
        />
      </svg>
    ),
  },
  {
    name: "Figma",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 2h4v6H8a3 3 0 0 1 0-6Zm4 6h4a3 3 0 1 1 0 6h-4V8Zm-4 6h4v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 2-2.83V14Zm0-6a3 3 0 1 0 0 6h4V8H8Z"
        />
      </svg>
    ),
  },
  {
    name: "Framer",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path fill="currentColor" d="M5 3h14v6H12l7 6H5V9h7L5 3Zm0 12h7v6l-7-6Z" />
      </svg>
    ),
  },
  {
    name: "Next.js",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.2 15.1-.7-1.2A8.3 8.3 0 0 0 12 16.2V7.8A8.2 8.2 0 0 1 19.4 14a8.1 8.1 0 0 1-3.2 3.1ZM8.4 8.9 16.7 20A10 10 0 0 1 4.7 8.2l3.7.7Z"
        />
      </svg>
    ),
  },
  {
    name: "React",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="2.1" fill="currentColor" />
        <ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          transform="rotate(60 12 12)"
        />
        <ellipse
          cx="12"
          cy="12"
          rx="10"
          ry="4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          transform="rotate(120 12 12)"
        />
      </svg>
    ),
  },
  {
    name: "Webflow",
    mark: (
      <svg viewBox="0 0 24 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M24 1.4 18.1 15H13.6L16.7 7 13.2 15H8.7l3.1-8L8.3 15H3.7L0 1.4h4.7l2.1 8.2L9.4 1.4h4.6L12 9.6 14.6 1.4H19l-2.1 8.2L19.4 1.4H24Z"
        />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    mark: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M3 3h18v18H3V3Zm9.4 14.6V11H10v-1.6h6.6V11h-2.4v6.6h-1.8ZM7.4 9.4h4.8V11H9.3v6.6H7.4V11H5.5V9.4h1.9Z"
        />
      </svg>
    ),
  },
] as const;

function ToolRow({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="tools-row" aria-hidden={hidden || undefined}>
      {TOOLS.map((tool) => (
        <span key={tool.name} className="tools-logo">
          <span className="tools-logo-mark">{tool.mark}</span>
          <span className="tools-logo-name">
            {"word" in tool ? tool.word : tool.name}
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Tools() {
  return (
    <section className="tools" id="tools">
      <ScrollReveal as="div" className="tools-heading">
        <h2 className="tools-title">Technology we build with</h2>
      </ScrollReveal>

      <ScrollReveal as="div" className="tools-pill" delay={100}>
        <div className="tools-track">
          <ToolRow />
          <ToolRow hidden />
        </div>
      </ScrollReveal>
    </section>
  );
}
