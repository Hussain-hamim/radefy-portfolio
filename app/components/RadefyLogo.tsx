export const RADEFY_HOOK_PATH =
  "M3.4 0H74L100 26V50H75L50 25H25V50L50 75V100H26L0 74V3.4C0 1.5 1.5 0 3.4 0Z";

export const RADEFY_LEG_PATH =
  "M50 50H75L100 75V97.2C100 98.7 98.7 100 97.2 100H75L50 75V50ZM58.5 56.5H66.5A2 2 0 0 1 68.5 58.5V66.5A2 2 0 0 1 66.5 68.5H58.5A2 2 0 0 1 56.5 66.5V58.5A2 2 0 0 1 58.5 56.5Z";

type RadefyLogoProps = {
  className?: string;
  title?: string;
};

/**
 * Geometric Radefy "R" mark — separate paths for animation:
 * .logo-hook  top bar + left spine
 * .logo-leg   diagonal bottom-right bar (square cut via evenodd)
 */
export default function RadefyLogo({
  className = "",
  title,
}: RadefyLogoProps) {
  return (
    <svg
      className={`radefy-logo ${className}`.trim()}
      viewBox="0 0 100 100"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
    >
      {title ? <title>{title}</title> : null}

      <g className="logo-mark">
        <path className="logo-hook" d={RADEFY_HOOK_PATH} />
        <path
          className="logo-leg"
          fillRule="evenodd"
          d={RADEFY_LEG_PATH}
        />
      </g>
    </svg>
  );
}
