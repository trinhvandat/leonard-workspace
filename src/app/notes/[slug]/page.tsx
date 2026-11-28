import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { backlinks, getNoteBySlug, getPublicNotes } from "@/content";
import { extractToc } from "@/content/toc";
import { Container } from "@/system-design/layouts/Container";
import { TwoColumnReading } from "@/system-design/layouts/TwoColumnReading";
import { NoteMetaRail } from "@/system-design/organisms/NoteMetaRail";
import { NotePageHead } from "@/system-design/organisms/NotePageHead";
import { NoteReadingColumn } from "@/system-design/organisms/NoteReadingColumn";
import { extractDek } from "@/system-design/molecules/NoteCard/dek";
import type { ConnectedNote } from "@/system-design/molecules/BacklinkList";

interface NotePageParams {
  slug: string;
}

/** Public slugs only — drafts are never statically generated. */
export function generateStaticParams(): NotePageParams[] {
  return getPublicNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<NotePageParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};

  return {
    title: note.title,
    description: extractDek(note.raw),
  };
}

/** Resolve a note's bidirectional backlinks into `ConnectedNote[]`, dropping dead/draft targets. */
function resolveConnected(slug: string): ConnectedNote[] {
  const entry = backlinks().graph.get(slug);
  if (!entry) return [];

  const linksTo: ConnectedNote[] = entry.linksTo
    .map((targetSlug) => getNoteBySlug(targetSlug))
    .filter((target): target is NonNullable<typeof target> => target !== undefined)
    .map((note) => ({ direction: "linksTo" as const, note }));

  const linkedFrom: ConnectedNote[] = entry.linkedFrom
    .map((sourceSlug) => getNoteBySlug(sourceSlug))
    .filter((source): source is NonNullable<typeof source> => source !== undefined)
    .map((note) => ({ direction: "linkedFrom" as const, note }));

  return [...linksTo, ...linkedFrom];
}

/**
 * `/notes/[slug]` — a single note's 2-column reading layout. Server
 * component: data-fetch + composition only. Unknown or draft slugs
 * (`getNoteBySlug` excludes drafts) 404.
 */
export default async function NotePage({ params }: { params: Promise<NotePageParams> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();

  const connected = resolveConnected(slug);
  const headings = extractToc(note.raw);

  return (
    <main>
      <div>
        <Container width="reading">
          <NotePageHead note={note} />
        </Container>
      </div>

      <article>
        <Container width="reading">
          <TwoColumnReading
            main={<NoteReadingColumn note={note} connected={connected} />}
            rail={<NoteMetaRail note={note} headings={headings} connected={connected} />}
          />
        </Container>
      </article>
    </main>
  );
}
