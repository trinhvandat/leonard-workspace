import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopicChipList } from "./TopicChipList";

/** Render tests for the `TopicChipList` molecule (REGISTRY: molecules/TopicChipList). */
describe("TopicChipList", () => {
  it("renders a pill per topic, each linking to /topics/[tag]", () => {
    render(<TopicChipList topics={["architecture", "postgres"]} />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual(["#architecture", "#postgres"]);
    expect(links[0]).toHaveAttribute("href", "/topics/architecture");
    expect(links[1]).toHaveAttribute("href", "/topics/postgres");
  });

  it("renders nothing when there are no topics", () => {
    const { container } = render(<TopicChipList topics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
