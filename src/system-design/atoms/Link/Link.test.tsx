import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link";

/** Render tests for the `Link` atom (REGISTRY: atoms/Link). */
describe("Link", () => {
  it("renders an internal link to href without a target", () => {
    render(<Link href="/notes">Notes</Link>);

    const link = screen.getByRole("link", { name: "Notes" });
    expect(link).toHaveAttribute("href", "/notes");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens an external link in a new tab with a safe rel", () => {
    render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );

    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
