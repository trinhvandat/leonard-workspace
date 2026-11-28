import type { ContactKind } from "./about.schema";

export type { ContactKind };

/**
 * Plain-TS content module for the `/about` CV page. Deliberately has NO
 * `velite` import and NO runtime `.parse()` call — this is the module
 * `src/app/about/page.tsx` imports, so it must stay free of velite's
 * `esbuild`/`sharp` toolchain to keep the page's serverless bundle clean.
 *
 * Validation of `aboutData` against `aboutSchema` (see `about.schema.ts`)
 * happens at `velite build` time via the `prepare` hook in
 * `velite.config.ts`, and is covered directly in `about.test.ts`.
 */

export interface Profile {
  name: string;
  initial: string;
  role: string;
  pitch: string;
  summary: string;
}

export interface JobEntry {
  role: string;
  company?: string;
  period?: string;
  detail: string;
}

export interface Contact {
  kind: ContactKind;
  value: string;
  label: string;
}

export interface AboutData {
  profile: Profile;
  skills: string[];
  experience: JobEntry[];
  principles: JobEntry[];
  contacts: Contact[];
}

/**
 * CV data for `/about` — placeholder-but-real content; Leonard swaps the
 * real text in before deploy (see `docs/plans/about.md` §7). Validated
 * against `aboutSchema` at `velite build` time, not here.
 */
export const aboutData: AboutData = {
  profile: {
    name: "Leonard",
    initial: "L",
    role: "Fullstack engineer (backend-heavy) & engineering manager",
    pitch:
      "Fullstack engineer (backend-heavy) & engineering manager. I build systems that stay boring under load, and I grow teams that keep them that way.",
    summary:
      "Backend architecture under real traffic — service decomposition, data ownership, and the unglamorous reliability work (idempotency, pooling, flags) that keeps a migration from becoming an incident. I also run the team doing it.",
  },
  skills: [
    "Java 21",
    "Spring Boot",
    "Kotlin",
    "TypeScript",
    "PostgreSQL",
    "Microservices",
    "Event-driven",
    "CI/CD",
    "Team leadership",
  ],
  experience: [
    {
      role: "Engineering Manager",
      company: "Platform team · fintech",
      period: "2023 — now",
      detail:
        "Lead a backend team through a monolith-to-services migration without a flag day. Set the reliability bar and the review culture.",
    },
    {
      role: "Senior Backend Engineer",
      company: "Payments & ledger",
      period: "2020 — 2023",
      detail:
        "Owned the exactly-once write path across Spring Boot services on PostgreSQL. Cut p99 and startup time by double digits.",
    },
    {
      role: "Fullstack Engineer",
      company: "Product",
      period: "2017 — 2020",
      detail:
        "Shipped across Kotlin, Java and TypeScript. Learned the trade-offs I now write about here.",
    },
  ],
  principles: [
    {
      role: "Evidence over opinion",
      detail:
        "Every strong claim in this garden is cited or marked as a guess. Same in code review.",
    },
    {
      role: "Boring on purpose",
      detail:
        "I reach for the dullest thing that holds under load before the clever thing that reads well.",
    },
    {
      role: "Write it down",
      detail:
        "If it mattered enough to tune, it's worth a note. This site is that habit, in public.",
    },
  ],
  contacts: [
    { kind: "email", value: "leonard@leonards.garden", label: "leonard@leonards.garden" },
    { kind: "github", value: "https://github.com", label: "GitHub" },
    { kind: "cv", value: "https://leonards.garden/cv.pdf", label: "Download CV" },
  ],
};
