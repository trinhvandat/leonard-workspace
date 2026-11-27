import { describe, expect, it } from "vitest";
import { parseWikiLinks } from "./wiki-links";

describe("parseWikiLinks", () => {
  it("extracts [[slug]] targets in document order", () => {
    expect(parseWikiLinks("see [[alpha]] then [[beta]]")).toEqual(["alpha", "beta"]);
  });

  it("deduplicates repeated targets, preserving first-seen order", () => {
    expect(parseWikiLinks("[[beta]] [[alpha]] [[beta]]")).toEqual(["beta", "alpha"]);
  });

  it("trims whitespace inside the brackets", () => {
    expect(parseWikiLinks("[[  alpha  ]]")).toEqual(["alpha"]);
  });

  it("returns an empty array when there are no wiki-links", () => {
    expect(parseWikiLinks("plain prose with [a normal link](/x)")).toEqual([]);
  });

  it("ignores empty brackets", () => {
    expect(parseWikiLinks("[[]] and [[real]]")).toEqual(["real"]);
  });
});
