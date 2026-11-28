import { describe, expect, it } from "vitest";
import { aboutData } from "./about";
import { aboutSchema } from "./about.schema";

/** A minimal object that satisfies every required field in `aboutSchema`. */
function validAboutData() {
  return {
    profile: {
      name: "Leonard",
      initial: "L",
      role: "Fullstack engineer",
      pitch: "Builds boring systems.",
      summary: "Backend-heavy generalist.",
    },
    skills: ["Java 21"],
    experience: [
      {
        role: "Engineering Manager",
        company: "Platform team",
        period: "2023 — now",
        detail: "Leads a backend team.",
      },
    ],
    principles: [
      {
        role: "Evidence over opinion",
        detail: "Every claim is cited or marked as a guess.",
      },
    ],
    contacts: [
      { kind: "email", value: "leonard@leonards.garden", label: "leonard@leonards.garden" },
    ],
  };
}

describe("aboutSchema", () => {
  it("accepts a minimal valid object (company/period omitted on a principle entry)", () => {
    const result = aboutSchema.safeParse(validAboutData());
    expect(result.success).toBe(true);
  });

  it("REJECTS an empty skills array", () => {
    const result = aboutSchema.safeParse({ ...validAboutData(), skills: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "skills")).toBe(true);
    }
  });

  it("REJECTS an empty experience array", () => {
    const result = aboutSchema.safeParse({ ...validAboutData(), experience: [] });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "experience")).toBe(true);
    }
  });

  it("REJECTS an empty principles array", () => {
    const result = aboutSchema.safeParse({ ...validAboutData(), principles: [] });
    expect(result.success).toBe(false);
  });

  it("REJECTS an empty contacts array", () => {
    const result = aboutSchema.safeParse({ ...validAboutData(), contacts: [] });
    expect(result.success).toBe(false);
  });

  it("REJECTS a missing required string field (profile.name empty)", () => {
    const data = validAboutData();
    const result = aboutSchema.safeParse({
      ...data,
      profile: { ...data.profile, name: "" },
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "profile.name")).toBe(true);
    }
  });

  it("REJECTS an invalid contact.kind", () => {
    const result = aboutSchema.safeParse({
      ...validAboutData(),
      contacts: [{ kind: "twitter", value: "x", label: "X" }],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.join(".") === "contacts.0.kind")).toBe(true);
    }
  });
});

describe("aboutData", () => {
  it("parses against aboutSchema", () => {
    const result = aboutSchema.safeParse(aboutData);
    expect(result.success).toBe(true);
  });

  it("has a non-empty experience and principles list", () => {
    expect(aboutData.experience.length).toBeGreaterThan(0);
    expect(aboutData.principles.length).toBeGreaterThan(0);
  });

  it("has one contact of each kind (email, github, cv)", () => {
    const kinds = aboutData.contacts.map((c) => c.kind);
    expect(kinds).toContain("email");
    expect(kinds).toContain("github");
    expect(kinds).toContain("cv");
  });
});
