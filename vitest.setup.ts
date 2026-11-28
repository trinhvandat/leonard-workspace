// Registers `@testing-library/jest-dom` matchers (`toBeInTheDocument`,
// `toHaveAttribute`, ...) for component render tests. Safe to load for every
// test file: it only extends `expect`, it never touches the DOM at import
// time, so the `node`-environment content tests are unaffected.
import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Unmount rendered trees after each test. This config does not enable Vitest
// `globals`, so RTL's auto-cleanup never registers — without this, mounted
// `next/link` components keep a scheduler task alive that touches `window`
// after jsdom is torn down ("window is not defined"), and DOM leaks between
// tests. `cleanup` is a no-op in the node-environment content tests.
afterEach(() => cleanup());
