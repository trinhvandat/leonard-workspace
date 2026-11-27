import { describe, expect, it } from "vitest";
import { noteFrontmatterSchema } from "./schema";

/** A frontmatter object that satisfies every required field. */
function validFrontmatter() {
  return {
    title: "Monolith → microservices",
    slug: "monolith-to-microservices",
    maturity: "evergreen",
    topics: ["architecture", "microservices"],
    planted: "2026-08-01",
    tended: "2026-11-15",
    confidence: "high",
    citations: ["https://example.com/source"],
    draft: false,
  };
}

describe("noteFrontmatterSchema", () => {
  it("accepts a valid note and normalizes dates to ISO strings", () => {
    const result = noteFrontmatterSchema.safeParse(validFrontmatter());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.planted).toBe("2026-08-01T00:00:00.000Z");
      expect(result.data.maturity).toBe("evergreen");
    }
  });

  it("applies defaults for optional citations and draft", () => {
    const { citations, draft, ...rest } = validFrontmatter();
    const result = noteFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.citations).toEqual([]);
      expect(result.data.draft).toBe(false);
    }
  });

  it("treats slug as optional (defaults handled downstream)", () => {
    const { slug, ...rest } = validFrontmatter();
    const result = noteFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(true);
  });

  it("REJECTS a maturity value outside the enum, naming the field", () => {
    const result = noteFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      maturity: "ancient",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.join(".") === "maturity");
      expect(issue).toBeDefined();
    }
  });

  it("REJECTS a confidence value outside the enum, naming the field", () => {
    const result = noteFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      confidence: "certain",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "confidence")).toBe(true);
    }
  });

  it("REJECTS a missing required field, naming the field", () => {
    const { title, ...rest } = validFrontmatter();
    const result = noteFrontmatterSchema.safeParse(rest);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "title")).toBe(true);
    }
  });

  it("REJECTS a non-URL citation", () => {
    const result = noteFrontmatterSchema.safeParse({
      ...validFrontmatter(),
      citations: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });
});
