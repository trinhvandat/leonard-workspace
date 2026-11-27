import type { Metadata } from "next";
import { SiteFooter } from "@/system-design/organisms/SiteFooter";
import { SiteHeader } from "@/system-design/organisms/SiteHeader";
import { fontVariables } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leonard's Garden",
  description:
    "A digital garden where my engineering notes grow up — migration patterns, trade-offs, and code that survived production.",
};

/**
 * Sets `data-theme` before paint from the persisted choice, so the page
 * never flashes the wrong theme while hydrating. Failures (private window,
 * blocked storage) are swallowed — `prefers-color-scheme` governs instead.
 */
const themeInitScript = `
(function () {
  try {
    var theme = window.localStorage.getItem("garden-theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
