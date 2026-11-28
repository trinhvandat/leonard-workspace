import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

/** Render tests for the `Button` action primitive (REGISTRY: atoms/Button). */
describe("Button", () => {
  it("renders a real <button> and fires onClick when no href is given", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);

    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn.tagName).toBe("BUTTON");

    btn.click();
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders a link to href with the ghost variant when href is set", () => {
    render(
      <Button href="/about" variant="ghost">
        About
      </Button>,
    );

    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveAttribute("href", "/about");
  });
});
