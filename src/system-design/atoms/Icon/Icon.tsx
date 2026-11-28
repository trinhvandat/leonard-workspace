import type { SVGProps } from "react";

export type IconName =
  | "sprout"
  | "sun"
  | "moon"
  | "maturity-seedling"
  | "maturity-budding"
  | "maturity-evergreen"
  | "document"
  | "link"
  | "copy"
  | "github";

/** Bars filled (of 3) for each maturity stage's bar-chart glyph. */
const maturityBarsFilled: Record<
  "maturity-seedling" | "maturity-budding" | "maturity-evergreen",
  number
> = {
  "maturity-seedling": 1,
  "maturity-budding": 2,
  "maturity-evergreen": 3,
};

/** Three ascending bars (growth glyph); `filled` of them are solid, the rest outlined. */
function MaturityBars({ filled }: { filled: number }) {
  const bars = [
    { x: 3, y: 14, h: 7 },
    { x: 10, y: 9, h: 12 },
    { x: 17, y: 4, h: 17 },
  ];

  return (
    <>
      {bars.map((bar, index) => (
        <rect
          key={bar.x}
          x={bar.x}
          y={bar.y}
          width={4}
          height={bar.h}
          rx={1.2}
          fill="currentColor"
          fillOpacity={index < filled ? 1 : 0.22}
        />
      ))}
    </>
  );
}

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Width/height in px. Defaults to 16. */
  size?: number;
}

/**
 * Inline SVG icon set. `sprout` is the garden logo mark (from the approved
 * prototype); `sun`/`moon` are the theme-toggle glyphs; `copy` and `github`
 * are the `/about` contactrow glyphs (`github` is filled, not stroked). All
 * strokes use `currentColor` so color comes from CSS (e.g.
 * `color: var(--color-accent)`).
 */
export function Icon({ name, size = 16, ...rest }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": true as const,
    ...rest,
  };

  switch (name) {
    case "sprout":
      return (
        <svg {...common}>
          <path d="M12 21V10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path
            d="M12 12.5C12 8.5 9 6.5 5 6.5c0 4 3 6 7 6Z"
            fill="currentColor"
            fillOpacity={0.14}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M12 11.5c0-3.5 3-6 7-6 0 3.5-3 6-7 6Z"
            fill="currentColor"
            fillOpacity={0.14}
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "sun":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8l1.8-1.8M18 6l1.8-1.8" />
        </svg>
      );
    case "moon":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />
        </svg>
      );
    case "maturity-seedling":
    case "maturity-budding":
    case "maturity-evergreen":
      return (
        <svg {...common}>
          <MaturityBars filled={maturityBarsFilled[name]} />
        </svg>
      );
    case "document":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7 3h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
          <path d="M14 3v4h4" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case "link":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 14a4 4 0 0 1 0-5.66l2-2a4 4 0 0 1 5.66 5.66l-1 1" />
          <path d="M14 10a4 4 0 0 1 0 5.66l-2 2a4 4 0 0 1-5.66-5.66l1-1" />
        </svg>
      );
    case "copy":
      return (
        <svg
          {...common}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V5a2 2 0 0 1 2-2h10" />
        </svg>
      );
    case "github":
      return (
        <svg {...common}>
          <path
            fill="currentColor"
            d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5a4 4 0 0 1 1-2.7c-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6a4 4 0 0 1 1 2.7c0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.8v2.6c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
          />
        </svg>
      );
    default:
      return null;
  }
}
