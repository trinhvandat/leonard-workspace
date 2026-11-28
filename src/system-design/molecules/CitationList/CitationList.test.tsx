import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CitationList } from "./CitationList";

/** Render tests for the `CitationList` molecule (REGISTRY: molecules/CitationList). */
describe("CitationList", () => {
  it("renders a numbered external link per citation, labeled by host", () => {
    render(
      <CitationList citations={["https://martinfowler.com/bliki/StranglerFigApplication.html"]} />,
    );

    expect(screen.getByText("Citations")).toBeInTheDocument();
    expect(screen.getByText("[1]")).toBeInTheDocument();

    const link = screen.getByRole("link", { name: "martinfowler.com" });
    expect(link).toHaveAttribute(
      "href",
      "https://martinfowler.com/bliki/StranglerFigApplication.html",
    );
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders nothing when there are no citations", () => {
    const { container } = render(<CitationList citations={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
