import { s } from "velite";

/**
 * Validation schema for the `/about` CV page's data. Kept separate from
 * `about.ts` so the page-facing module never imports `velite` (and so
 * Next's server bundle for `/about` never traces velite's `esbuild`/`sharp`
 * toolchain into the page). This file is imported ONLY by tests and the
 * build-time validation hook in `velite.config.ts` — never by `src/app/**`.
 */

export const CONTACT_KINDS = ["email", "github", "cv"] as const;
export type ContactKind = (typeof CONTACT_KINDS)[number];

const profileSchema = s.object({
  name: s.string().min(1),
  initial: s.string().min(1),
  role: s.string().min(1),
  pitch: s.string().min(1),
  summary: s.string().min(1),
});

const jobEntrySchema = s.object({
  role: s.string().min(1),
  company: s.string().min(1).optional(),
  period: s.string().min(1).optional(),
  detail: s.string().min(1),
});

const contactSchema = s.object({
  kind: s.enum(CONTACT_KINDS),
  value: s.string().min(1),
  label: s.string().min(1),
});

/** Validated shape of the whole `/about` CV data module. */
export const aboutSchema = s.object({
  profile: profileSchema,
  skills: s.array(s.string().min(1)).nonempty(),
  experience: s.array(jobEntrySchema).nonempty(),
  principles: s.array(jobEntrySchema).nonempty(),
  contacts: s.array(contactSchema).nonempty(),
});
