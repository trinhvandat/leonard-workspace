import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Icon, type IconName } from "./Icon";

/** Render tests for the inline `Icon` set (REGISTRY: atoms/Icon). */
describe("Icon", () => {
  it("renders an aria-hidden svg at the default size for the sprout mark", () => {
    const { container } = render(<Icon name="sprout" />);

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "16");
  });

  it("applies a custom size to the theme glyphs", () => {
    const { container: moon } = render(<Icon name="moon" size={24} />);
    expect(moon.querySelector("svg")).toHaveAttribute("width", "24");

    const { container: sun } = render(<Icon name="sun" />);
    expect(sun.querySelector("svg")).not.toBeNull();
  });

  it("fills one bar for seedling, two for budding, three for evergreen", () => {
    const fullBars = (name: IconName): number => {
      const { container } = render(<Icon name={name} size={14} />);
      return [...container.querySelectorAll("rect")].filter(
        (r) => r.getAttribute("fill-opacity") === "1",
      ).length;
    };

    expect(fullBars("maturity-seedling")).toBe(1);
    expect(fullBars("maturity-budding")).toBe(2);
    expect(fullBars("maturity-evergreen")).toBe(3);
  });

  it("renders nothing for an unknown icon name", () => {
    const { container } = render(<Icon name={"nope" as IconName} />);
    expect(container.querySelector("svg")).toBeNull();
  });

  it("renders the document and link glyphs used by the section-mini headings", () => {
    const { container: doc } = render(<Icon name="document" size={17} />);
    expect(doc.querySelector("svg")).toHaveAttribute("width", "17");

    const { container: link } = render(<Icon name="link" size={17} />);
    expect(link.querySelector("svg")).not.toBeNull();
  });

  it("renders the contactrow glyphs without throwing", () => {
    const { container: copy } = render(<Icon name="copy" />);
    expect(copy.querySelector("svg")).not.toBeNull();

    const { container: github } = render(<Icon name="github" />);
    expect(github.querySelector("svg")).not.toBeNull();
  });
});
