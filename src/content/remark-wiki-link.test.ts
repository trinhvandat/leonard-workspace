import { describe, expect, it } from "vitest";
import type { Root, Paragraph, Text, InlineCode } from "mdast";
import type { MdxJsxTextElement } from "mdast-util-mdx-jsx";
import remarkWikiLink from "./remark-wiki-link";

/** Run the plugin's transformer over a tree and return the mutated tree. */
function transform(tree: Root): Root {
  // The plugin is an attacher; invoke it standalone to get its transformer.
  const transformer = (remarkWikiLink as unknown as () => (tree: Root) => void)();
  transformer(tree);
  return tree;
}

function paragraph(...children: (Text | InlineCode | MdxJsxTextElement)[]): Paragraph {
  return { type: "paragraph", children };
}

function text(value: string): Text {
  return { type: "text", value };
}

function root(...children: Paragraph[]): Root {
  return { type: "root", children };
}

describe("remarkWikiLink", () => {
  it("rewrites [[slug]] in a text node into a WikiLink MDX JSX text element", () => {
    const tree = transform(root(paragraph(text("see [[feature-flags-that-scale]] now"))));
    const para = tree.children[0] as Paragraph;

    // text-before, WikiLink element, text-after
    expect(para.children.map((n) => n.type)).toEqual(["text", "mdxJsxTextElement", "text"]);

    const el = para.children[1] as MdxJsxTextElement;
    expect(el.name).toBe("WikiLink");
    expect(el.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "slug", value: "feature-flags-that-scale" },
    ]);
    expect((para.children[0] as Text).value).toBe("see ");
    expect((para.children[2] as Text).value).toBe(" now");
  });

  it("trims whitespace inside the brackets into the slug attribute", () => {
    const tree = transform(root(paragraph(text("[[  spaced-slug  ]]"))));
    const el = (tree.children[0] as Paragraph).children[0] as MdxJsxTextElement;
    expect(el.attributes).toEqual([
      { type: "mdxJsxAttribute", name: "slug", value: "spaced-slug" },
    ]);
  });

  it("rewrites multiple links within one text node", () => {
    const tree = transform(root(paragraph(text("[[a]] and [[b]]"))));
    const names = (tree.children[0] as Paragraph).children.map((n) =>
      n.type === "mdxJsxTextElement" ? (n as MdxJsxTextElement).name : n.type,
    );
    expect(names).toEqual(["WikiLink", "text", "WikiLink"]);
  });

  it("does NOT touch [[...]] inside an inline code node (not a text node)", () => {
    const code: InlineCode = { type: "inlineCode", value: "[[not-a-link]]" };
    const tree = transform(root(paragraph(code)));
    const para = tree.children[0] as Paragraph;
    expect(para.children).toHaveLength(1);
    expect(para.children[0].type).toBe("inlineCode");
  });

  it("leaves text nodes without wiki-links untouched", () => {
    const tree = transform(root(paragraph(text("plain prose, no links"))));
    const para = tree.children[0] as Paragraph;
    expect(para.children).toHaveLength(1);
    expect((para.children[0] as Text).value).toBe("plain prose, no links");
  });

  it("ignores empty brackets", () => {
    const tree = transform(root(paragraph(text("[[]] stays text"))));
    const para = tree.children[0] as Paragraph;
    expect(para.children).toHaveLength(1);
    expect(para.children[0].type).toBe("text");
  });

  it("ignores a whitespace-only target (trims to empty)", () => {
    const tree = transform(root(paragraph(text("[[   ]] stays text"))));
    const para = tree.children[0] as Paragraph;
    expect(para.children).toHaveLength(1);
    expect(para.children[0].type).toBe("text");
  });
});
