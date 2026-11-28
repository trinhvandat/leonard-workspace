import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./Text";

/** Render tests for the `Text` typographic primitive (REGISTRY: atoms/Text). */
describe("Text", () => {
  it("defaults to a <p> for the body variant", () => {
    render(<Text>hello</Text>);
    expect(screen.getByText("hello").tagName).toBe("P");
  });

  it("picks the default element from the variant (display → h2, mono → span)", () => {
    const { rerender } = render(<Text variant="display">title</Text>);
    expect(screen.getByText("title").tagName).toBe("H2");

    rerender(<Text variant="mono">code</Text>);
    expect(screen.getByText("code").tagName).toBe("SPAN");
  });

  it("honors the `as` override and merges a size step + extra className", () => {
    render(
      <Text as="h1" variant="display" size="h1" className="extra">
        heading
      </Text>,
    );
    const el = screen.getByText("heading");
    expect(el.tagName).toBe("H1");
    expect(el).toHaveClass("extra");
  });
});
