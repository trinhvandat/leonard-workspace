import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Phase 1 is a plain statically-generated site (PRD §2–3): no backend,
  // no runtime caching model. Next 16 enables these experimental caching
  // features by default; we keep standard SSG semantics instead so the
  // content layer builds predictably. Revisit if/when Phase 2 adds dynamic
  // routes.
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;
