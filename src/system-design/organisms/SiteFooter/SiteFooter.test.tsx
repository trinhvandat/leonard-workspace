import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteFooter } from "./SiteFooter";

/** Render test for `SiteFooter` (REGISTRY: organisms/SiteFooter). */
describe("SiteFooter", () => {
  it("renders the footer tagline inside a contentinfo landmark", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(/grown locally in plain Markdown/);
  });
});
