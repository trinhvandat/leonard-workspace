import { defineConfig, defineCollection, s } from "velite";
import rehypeShiki from "@shikijs/rehype";
import rehypeSlug from "rehype-slug";
import { noteFrontmatterSchema } from "./src/content/schema";
import remarkWikiLink from "./src/content/remark-wiki-link";

/**
 * Velite builds the type-safe content layer: it reads every `content/notes/*.mdx`
 * file, validates frontmatter against the shared Zod schema, and emits typed
 * data + a `.d.ts` into `.velite/` (aliased as `#site/content`).
 *
 * A schema violation (missing required field, bad enum) must FAIL the build.
 * Velite only exits non-zero when the CLI `--strict` flag is passed — the config
 * `strict: true` below promotes violations to logged errors but does NOT abort on
 * its own. So the `build`/`content` npm scripts run `velite build --strict`, which
 * names the file + field and exits 1, failing `next build`. `dev` stays lenient so
 * a work-in-progress note doesn't block the dev server.
 * Pure build-time read: no runtime DB/auth (Phase-2 seam).
 */

const notes = defineCollection({
  name: "Note",
  pattern: "notes/*.mdx",
  schema: noteFrontmatterSchema
    .extend({
      // Velite-derived fields (need file context — kept out of the testable schema).
      path: s.path(), // e.g. 'notes/monolith-to-microservices'
      raw: s.raw(), // untouched MDX body — feeds the [[wiki-link]] backlink graph
      // Compiled MDX for rendering. Plugins run at build time (zero client JS):
      //  - remarkWikiLink rewrites [[slug]] → <WikiLink slug="..."/> (render seam)
      //  - rehypeSlug stamps h2/h3 with ids matching extractToc() (toc.ts)
      //  - rehypeShiki highlights fenced code with dual light/dark themes
      body: s.mdx({
        remarkPlugins: [remarkWikiLink],
        rehypePlugins: [
          rehypeSlug,
          [rehypeShiki, { themes: { light: "github-light", dark: "github-dark" } }],
        ],
      }),
    })
    .transform((data) => ({
      ...data,
      // slug defaults to the filename stem when omitted in frontmatter
      slug: data.slug ?? data.path.split("/").pop()!,
    })),
});

export default defineConfig({
  root: "content",
  strict: true,
  collections: { notes },
});
