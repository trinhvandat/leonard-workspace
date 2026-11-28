// Server-only MDX render bridge.
//
// Phase 1 is pure SSG: every note is compiled to a self-contained JS function
// body by Velite's `s.mdx()` (see velite.config.ts). Turning that string back
// into React happens here, on the server, so the MDX body and its component
// map never ship to the client bundle — a note page needs zero extra client
// JS to render its prose. This file has no "use client" directive and must
// never gain one.
//
// This is the Velite-documented render pattern (velite.js.org "Markdown &
// MDX" guide, also used by the zce/taxonomy reference app linked from the
// Velite readme): the compiled `code` is a function body that, invoked with
// the React jsx-runtime bound as its only argument, returns `{ default:
// Content }` — a component accepting a `components` map.
import * as runtime from "react/jsx-runtime";
import type { ReactElement } from "react";
import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "./mdxComponents";

type MDXModule = { default: (props: { components?: MDXComponents }) => ReactElement };

function compile(code: string): MDXModule {
  // Velite's documented MDX render invocation: `code` is build-time-generated,
  // trusted output from our own `velite.config.ts`, never user input — not an
  // eval of anything external.
  const run = new Function(code) as (args: Record<string, unknown>) => MDXModule;
  return run({ ...runtime });
}

interface MDXContentProps {
  /** A `Note['body']` — the compiled MDX function-body string from Velite. */
  code: string;
}

/** Renders a note's compiled MDX body with the garden's element map. */
export function MDXContent({ code }: MDXContentProps) {
  const { default: Content } = compile(code);
  return <Content components={mdxComponents} />;
}
