import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AsideExcerpt } from "./AsideExcerpt";
import { asideExcerptContent } from "./content";

/** Render test for `AsideExcerpt` (REGISTRY: organisms/AsideExcerpt). */
describe("AsideExcerpt", () => {
  it("renders the tape label, the emphasized quote word, and a code snippet", () => {
    const { container } = render(<AsideExcerpt />);

    expect(screen.getByText(asideExcerptContent.tapeLabel)).toBeInTheDocument();
    expect(screen.getByText(asideExcerptContent.quoteEmphasis)).toBeInTheDocument();
    expect(container.querySelector("pre code")).not.toBeNull();
  });
});
