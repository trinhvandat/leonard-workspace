import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { TopicCount } from "@/content";
import { WanderByTopic } from "./WanderByTopic";

/** Render test for `WanderByTopic` (REGISTRY: organisms/WanderByTopic). */
describe("WanderByTopic", () => {
  it("renders a chip per topic linking to /topics/[tag]", () => {
    const topics: TopicCount[] = [
      { topic: "java", count: 2 },
      { topic: "postgres", count: 3 },
    ];
    render(<WanderByTopic topics={topics} />);

    expect(screen.getByRole("link", { name: /java/ })).toHaveAttribute("href", "/topics/java");
    expect(screen.getByRole("link", { name: /postgres/ })).toHaveAttribute(
      "href",
      "/topics/postgres",
    );
  });

  it("renders nothing when there are no topics", () => {
    const { container } = render(<WanderByTopic topics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
