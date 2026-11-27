import type { SVGProps } from "react";

export type IconName = "sprout" | "sun" | "moon";

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  /** Width/height in px. Defaults to 16. */
  size?: number;
}

/**
 * Inline SVG icon set. `sprout` is the garden logo mark (from the approved
 * prototype); `sun`/`moon` are the theme-toggle glyphs. All strokes use
 * `currentColor` so color comes from CSS (e.g. `color: var(--color-accent)`).
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
    default:
      return null;
  }
}
