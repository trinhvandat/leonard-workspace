import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

/** Render tests for the `Avatar` gradient initial square (REGISTRY: atoms/Avatar). */
describe("Avatar", () => {
  it("renders the initial and hides it from assistive tech", () => {
    render(<Avatar initial="L" />);

    const avatar = screen.getByText("L");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute("aria-hidden", "true");
  });

  it("defaults to a 46px size", () => {
    render(<Avatar initial="L" />);

    expect(screen.getByText("L")).toHaveStyle({ "--avatar-size": "46px" });
  });

  it("applies a custom size", () => {
    render(<Avatar initial="L" size={72} />);

    expect(screen.getByText("L")).toHaveStyle({ "--avatar-size": "72px" });
  });
});
