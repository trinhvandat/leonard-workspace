import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MaturityBadge } from "./MaturityBadge";

/** Render tests for the `MaturityBadge` atom (REGISTRY: atoms/MaturityBadge). */
describe("MaturityBadge", () => {
  it.each(["seedling", "budding", "evergreen"] as const)(
    "renders the %s label with its growth glyph",
    (maturity) => {
      const { container } = render(<MaturityBadge maturity={maturity} />);

      expect(screen.getByText(maturity)).toBeInTheDocument();
      expect(container.querySelector("svg")).not.toBeNull();
    },
  );
});
