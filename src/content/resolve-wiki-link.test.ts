import { describe, expect, it } from "vitest";
import { resolveWikiLink } from "./resolve-wiki-link";
import { makeNote } from "./fixtures";

describe("resolveWikiLink", () => {
  const target = makeNote({ slug: "feature-flags-that-scale", title: "Feature flags that scale" });
  const lookup = (slug: string) => (slug === target.slug ? target : undefined);

  it("resolves a known public slug to an internal link with href and the target title", () => {
    expect(resolveWikiLink("feature-flags-that-scale", lookup)).toEqual({
      kind: "link",
      slug: "feature-flags-that-scale",
      href: "/notes/feature-flags-that-scale",
      title: "Feature flags that scale",
    });
  });

  it("falls back to plain text for an unknown slug (never a dead link)", () => {
    expect(resolveWikiLink("does-not-exist", lookup)).toEqual({
      kind: "text",
      text: "does-not-exist",
    });
  });

  it("falls back to plain text when the lookup returns undefined (e.g. a draft the API excludes)", () => {
    // getNoteBySlug excludes drafts, so a draft slug resolves to undefined here.
    const draftAwareLookup = (): undefined => undefined;
    expect(resolveWikiLink("event-driven-sagas", draftAwareLookup)).toEqual({
      kind: "text",
      text: "event-driven-sagas",
    });
  });
});
