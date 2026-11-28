import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./Container";
import styles from "./Container.module.css";

/** Render tests for the `Container` layout (REGISTRY: layouts/Container). */
describe("Container", () => {
  it("defaults to the content width", () => {
    const { container } = render(<Container>child</Container>);
    expect(container.firstChild).toHaveClass(styles.content);
  });

  it("applies the wide width when requested", () => {
    const { container } = render(<Container width="wide">child</Container>);
    expect(container.firstChild).toHaveClass(styles.wide);
  });

  it("applies the 1060px reading width for the note-detail grid", () => {
    const { container } = render(<Container width="reading">child</Container>);
    expect(container.firstChild).toHaveClass(styles.reading);
  });

  it("renders the given element type", () => {
    const { container } = render(<Container as="section">child</Container>);
    expect(container.firstChild?.nodeName).toBe("SECTION");
  });
});
