import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TwoColumnReading } from "./TwoColumnReading";
import styles from "./TwoColumnReading.module.css";

/** Render tests for the `TwoColumnReading` layout (REGISTRY: layouts/TwoColumnReading). */
describe("TwoColumnReading", () => {
  it("renders the main slot in a main column and the rail slot in an aside", () => {
    render(<TwoColumnReading main={<p>main content</p>} rail={<p>rail content</p>} />);

    expect(screen.getByText("main content")).toBeInTheDocument();
    const aside = screen.getByText("rail content").closest("aside");
    expect(aside).not.toBeNull();
  });

  it("applies the notegrid class that collapses to one column ≤900px", () => {
    const { container } = render(<TwoColumnReading main="m" rail="r" />);
    expect(container.firstChild).toHaveClass(styles.grid);
  });
});
