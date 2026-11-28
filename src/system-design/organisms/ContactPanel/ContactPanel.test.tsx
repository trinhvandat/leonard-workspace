import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Contact } from "@/content/about";
import { ContactPanel } from "./ContactPanel";

const contacts: Contact[] = [
  { kind: "email", value: "leonard@leonards.garden", label: "leonard@leonards.garden" },
  { kind: "github", value: "https://github.com/leonard", label: "GitHub" },
  { kind: "cv", value: "https://leonards.garden/cv.pdf", label: "Download CV" },
];

/** Render tests for `ContactPanel` (REGISTRY: organisms/ContactPanel). */
describe("ContactPanel", () => {
  it("renders the heading and copy", () => {
    render(<ContactPanel contacts={contacts} />);

    expect(
      screen.getByRole("heading", { name: /open to freelance & contract backend work/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/copy either and say hi/i)).toBeInTheDocument();
  });

  it("renders exactly one control per contact", () => {
    render(<ContactPanel contacts={contacts} />);

    expect(screen.getAllByRole("link").length + screen.getAllByRole("button").length).toBe(
      contacts.length,
    );
  });

  it("renders the github contact as an external anchor with the right href", () => {
    render(<ContactPanel contacts={contacts} />);

    const link = screen.getByRole("link", { name: /github/i });
    expect(link).toHaveAttribute("href", "https://github.com/leonard");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders email and cv contacts as buttons", () => {
    render(<ContactPanel contacts={contacts} />);

    expect(
      screen.getByRole("button", { name: /copy leonard@leonards.garden/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy download cv/i })).toBeInTheDocument();
  });
});
