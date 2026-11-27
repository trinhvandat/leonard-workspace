import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildBacklinkGraph,
  computeStats,
  computeTopicCounts,
  findBySlug,
  selectFeatured,
  selectPublic,
} from "./derive";
import { makeNote, sampleNotes } from "./fixtures";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("selectPublic", () => {
  it("excludes drafts", () => {
    const slugs = selectPublic(sampleNotes()).map((n) => n.slug);
    expect(slugs).toEqual(["alpha", "beta", "gamma"]);
    expect(slugs).not.toContain("delta");
  });
});

describe("findBySlug", () => {
  it("returns the matching note (hit)", () => {
    expect(findBySlug(sampleNotes(), "beta")?.slug).toBe("beta");
  });

  it("returns undefined when absent (miss)", () => {
    expect(findBySlug(sampleNotes(), "nope")).toBeUndefined();
  });
});

describe("computeTopicCounts", () => {
  it("aggregates topics across the given notes, sorted by count desc", () => {
    // public notes only: alpha[architecture,postgres], beta[architecture], gamma[postgres]
    const counts = computeTopicCounts(selectPublic(sampleNotes()));
    expect(counts).toEqual([
      { topic: "architecture", count: 2 },
      { topic: "postgres", count: 2 },
    ]);
  });

  it("breaks count ties alphabetically for determinism", () => {
    const notes = [
      makeNote({ slug: "a", topics: ["zebra"] }),
      makeNote({ slug: "b", topics: ["apple"] }),
    ];
    expect(computeTopicCounts(notes).map((c) => c.topic)).toEqual(["apple", "zebra"]);
  });
});

describe("buildBacklinkGraph", () => {
  it("builds both directions and resolves targets by slug", () => {
    const { graph } = buildBacklinkGraph(selectPublic(sampleNotes()));
    expect(graph.get("alpha")?.linksTo).toEqual(["beta", "gamma"]);
    expect(graph.get("beta")?.linkedFrom).toContain("alpha");
    expect(graph.get("gamma")?.linkedFrom).toContain("alpha");
    expect(graph.get("beta")?.linksTo).toEqual(["alpha"]);
    expect(graph.get("alpha")?.linkedFrom).toContain("beta");
  });

  it("reports an unresolved [[wiki-link]] as a warning and counts it (never silent)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const { deadLinks } = buildBacklinkGraph(selectPublic(sampleNotes()));
    expect(deadLinks).toBe(1); // gamma -> [[ghost]]
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0]).toContain("ghost");
  });

  it("excludes drafts from the public graph (delta never appears)", () => {
    const { graph } = buildBacklinkGraph(selectPublic(sampleNotes()));
    expect(graph.has("delta")).toBe(false);
    // alpha is linked from beta only, not from the draft delta
    expect(graph.get("alpha")?.linkedFrom).toEqual(["beta"]);
  });
});

describe("selectFeatured", () => {
  it("returns newest-tended evergreen/budding public notes, deterministically", () => {
    const slugs = selectFeatured(sampleNotes()).map((n) => n.slug);
    // gamma (seedling) and delta (draft) excluded; sorted by tended desc
    expect(slugs).toEqual(["beta", "alpha"]);
  });

  it("respects the limit", () => {
    expect(selectFeatured(sampleNotes(), 1).map((n) => n.slug)).toEqual(["beta"]);
  });

  it("breaks tended ties by slug asc", () => {
    const notes = [
      makeNote({ slug: "yy", maturity: "evergreen", tended: "2026-05-01T00:00:00.000Z" }),
      makeNote({ slug: "xx", maturity: "evergreen", tended: "2026-05-01T00:00:00.000Z" }),
    ];
    expect(selectFeatured(notes).map((n) => n.slug)).toEqual(["xx", "yy"]);
  });
});

describe("computeStats", () => {
  it("reports notes, topics, pctCited and deadLinks over public notes", () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const stats = computeStats(sampleNotes());
    expect(stats.notes).toBe(3); // drafts excluded
    expect(stats.topics).toBe(2); // architecture, postgres
    expect(stats.pctCited).toBe(67); // alpha + beta cited, gamma not → 2/3
    expect(stats.deadLinks).toBe(1); // gamma -> [[ghost]]
  });

  it("reports 0% cited with no notes", () => {
    expect(computeStats([])).toEqual({ notes: 0, topics: 0, pctCited: 0, deadLinks: 0 });
  });
});
