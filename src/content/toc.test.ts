import { describe, expect, it } from "vitest";
import { extractToc } from "./toc";

describe("extractToc", () => {
  it("extracts ## and ### headings in document order", () => {
    const raw = ["# Title (h1 ignored)", "", "## First", "", "### Nested", "", "## Second"].join(
      "\n",
    );
    expect(extractToc(raw)).toEqual([
      { id: "first", text: "First", depth: 2 },
      { id: "nested", text: "Nested", depth: 3 },
      { id: "second", text: "Second", depth: 2 },
    ]);
  });

  it("ignores h1 and h4+ (only depth 2 and 3 are TOC-worthy)", () => {
    const raw = ["# One", "## Two", "### Three", "#### Four", "##### Five"].join("\n");
    expect(extractToc(raw).map((h) => h.depth)).toEqual([2, 3]);
  });

  it("slugs ids the way github-slugger / rehype-slug does (lowercase, punctuation stripped)", () => {
    const raw = "## Route, don't rewrite!";
    expect(extractToc(raw)).toEqual([
      { id: "route-dont-rewrite", text: "Route, don't rewrite!", depth: 2 },
    ]);
  });

  it("ignores ## lines inside fenced code blocks", () => {
    const raw = [
      "## Real heading",
      "",
      "```kotlin",
      "// ## not a heading",
      "fun x() = 1",
      "```",
      "",
      "## After code",
    ].join("\n");
    expect(extractToc(raw)).toEqual([
      { id: "real-heading", text: "Real heading", depth: 2 },
      { id: "after-code", text: "After code", depth: 2 },
    ]);
  });

  it("also ignores headings inside tilde-fenced code blocks", () => {
    const raw = ["~~~", "## fake", "~~~", "## real"].join("\n");
    expect(extractToc(raw)).toEqual([{ id: "real", text: "real", depth: 2 }]);
  });

  it("gives duplicate heading text unique, incrementing ids (slugger state)", () => {
    const raw = ["## Seams", "## Seams", "## Seams"].join("\n");
    expect(extractToc(raw).map((h) => h.id)).toEqual(["seams", "seams-1", "seams-2"]);
  });

  it("returns an empty array when there are no headings", () => {
    expect(extractToc("just prose, no headings here")).toEqual([]);
  });

  it("returns a single-element array for one heading (the < 2 / hidden case is the caller's)", () => {
    expect(extractToc("## Only one")).toEqual([{ id: "only-one", text: "Only one", depth: 2 }]);
  });

  it("strips closed-ATX trailing hashes from the heading text", () => {
    expect(extractToc("## Closed ##")).toEqual([{ id: "closed", text: "Closed", depth: 2 }]);
  });
});
