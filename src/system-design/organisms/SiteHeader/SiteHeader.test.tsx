import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SiteHeader } from "./SiteHeader";

/**
 * Render test for `SiteHeader` (REGISTRY: organisms/SiteHeader). It embeds the
 * `ThemeToggle` client molecule, which reads `matchMedia` on mount — jsdom has
 * no `matchMedia`, so it is stubbed here.
 */
describe("SiteHeader", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the wordmark, the primary nav links, and the theme toggle", () => {
    render(<SiteHeader />);

    expect(screen.getByText("Leonard's Garden")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Notes" })).toHaveAttribute("href", "/notes");
    expect(screen.getByRole("link", { name: "Topics" })).toHaveAttribute("href", "/topics");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("button", { name: /theme/i })).toBeInTheDocument();
  });
});
