import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { makeNote } from "@/content/fixtures";
import { BacklinkList, type ConnectedNote } from "./BacklinkList";

/** Render tests for the `BacklinkList` molecule (REGISTRY: molecules/BacklinkList). */
describe("BacklinkList", () => {
  const connected: ConnectedNote[] = [
    { direction: "linksTo", note: makeNote({ slug: "beta", title: "Beta note" }) },
    { direction: "linkedFrom", note: makeNote({ slug: "alpha", title: "Alpha note" }) },
  ];

  it("variant='column' renders a direction + title card per connected note", () => {
    render(<BacklinkList connected={connected} variant="column" />);

    expect(screen.getByText("Connected notes")).toBeInTheDocument();

    const betaLink = screen.getByRole("link", { name: /links to.*Beta note/ });
    expect(betaLink).toHaveAttribute("href", "/notes/beta");

    const alphaLink = screen.getByRole("link", { name: /linked from.*Alpha note/ });
    expect(alphaLink).toHaveAttribute("href", "/notes/alpha");
  });

  it("variant='column' with no connections shows the seedling empty line", () => {
    render(<BacklinkList connected={[]} variant="column" />);
    expect(screen.getByText(/still a seedling/)).toBeInTheDocument();
  });

  it("variant='rail' renders a compact link per connected note", () => {
    render(<BacklinkList connected={connected} variant="rail" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/notes/beta");
    expect(links[1]).toHaveAttribute("href", "/notes/alpha");
  });

  it("variant='rail' with no connections renders nothing", () => {
    const { container } = render(<BacklinkList connected={[]} variant="rail" />);
    expect(container).toBeEmptyDOMElement();
  });
});
