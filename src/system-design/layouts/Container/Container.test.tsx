import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";

/** Render tests for the `Container` layout (REGISTRY: layouts/Container). */
describe("Container", () => {
  it("renders a div by default and honors the `as` override", () => {
    const { rerender } = render(<Container>inside</Container>);
    expect(screen.getByText("inside").tagName).toBe("DIV");

    rerender(
      <Container as="main" width="wide">
        inside
      </Container>,
    );
    expect(screen.getByText("inside").tagName).toBe("MAIN");
  });

  it("merges an extra className onto the wrapper", () => {
    render(<Container className="extra">x</Container>);
    expect(screen.getByText("x")).toHaveClass("extra");
  });
});
