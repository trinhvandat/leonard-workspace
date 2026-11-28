import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HandDrawnUnderline } from "./HandDrawnUnderline";

/** Render test for `HandDrawnUnderline` (REGISTRY: atoms/HandDrawnUnderline). */
describe("HandDrawnUnderline", () => {
  it("renders the emphasized text with a decorative, aria-hidden underline", () => {
    const { container } = render(
      <HandDrawnUnderline className="extra">grow up</HandDrawnUnderline>,
    );

    expect(screen.getByText("grow up")).toBeInTheDocument();

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
