import { Bricolage_Grotesque, Newsreader, JetBrains_Mono } from "next/font/google";

/**
 * The three families from the approved prototype (design-system skill):
 * Bricolage Grotesque (display), Newsreader (body serif), JetBrains Mono
 * (meta/code). Each exposes a CSS variable that the typography token layer
 * (`src/system-design/tokens/typography.css`) consumes — components never
 * name a font family directly.
 */

export const fontDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const fontSerif = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

/** Space-joined variable class names to apply once on <html>. */
export const fontVariables = `${fontDisplay.variable} ${fontSerif.variable} ${fontMono.variable}`;
