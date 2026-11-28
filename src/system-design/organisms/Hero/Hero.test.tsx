import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

/** Render test for the home `Hero` (REGISTRY: organisms/Hero). */
describe("Hero", () => {
  it("renders the eyebrow, the headline with the underlined phrase, and the intro card name", () => {
    render(<Hero />);

    expect(screen.getByText(/Hi, I'm Leonard/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/engineering notes/i);
    // The intro card renders the name as its own standalone paragraph.
    expect(screen.getByText("Leonard", { selector: "p" })).toBeInTheDocument();
  });
});
