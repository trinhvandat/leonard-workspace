// Registers `@testing-library/jest-dom` matchers (`toBeInTheDocument`,
// `toHaveAttribute`, ...) for component render tests. Safe to load for every
// test file: it only extends `expect`, it never touches the DOM at import
// time, so the `node`-environment content tests are unaffected.
import "@testing-library/jest-dom/vitest";
