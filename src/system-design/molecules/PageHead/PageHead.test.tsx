import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHead } from "./PageHead";

/** Render tests for `PageHead` (REGISTRY: molecules/PageHead). */
describe("PageHead", () => {
  it("renders crumb items with hrefs as links and the last item as plain text", () => {
    render(
      <PageHead crumb={[{ label: "garden", href: "/" }, { label: "about" }]} title="Leonard" />,
    );

    expect(screen.getByRole("link", { name: "garden" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "about" })).not.toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
  });

  it("renders the title as a level-1 heading", () => {
    render(<PageHead crumb={[{ label: "garden" }]} title="Leonard" />);
    expect(screen.getByRole("heading", { level: 1, name: "Leonard" })).toBeInTheDocument();
  });

  it("renders the sub line only when provided", () => {
    const { rerender } = render(
      <PageHead crumb={[{ label: "garden" }]} title="Leonard" sub="Backend engineer" />,
    );
    expect(screen.getByText("Backend engineer")).toBeInTheDocument();

    rerender(<PageHead crumb={[{ label: "garden" }]} title="Leonard" />);
    expect(screen.queryByText("Backend engineer")).not.toBeInTheDocument();
  });

  it("renders the media slot when passed", () => {
    render(
      <PageHead
        crumb={[{ label: "garden" }]}
        title="Leonard"
        media={<span data-testid="avatar">L</span>}
      />,
    );
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });
});
