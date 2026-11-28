import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyButton } from "./CopyButton";

/**
 * Render/interaction tests for the `CopyButton` client molecule (REGISTRY:
 * molecules/CopyButton). jsdom has no `navigator.clipboard` by default, so we
 * stub it per test.
 */
describe("CopyButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("copies the value and swaps the label to the copied state, then reverts", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<CopyButton value="hello@leonard.dev" label="hello@leonard.dev" />);
    const button = screen.getByRole("button", { name: "Copy hello@leonard.dev" });

    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith("hello@leonard.dev");
    await waitFor(() => expect(screen.getByText("copied ✓")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("hello@leonard.dev")).toBeInTheDocument(), {
      timeout: 2500,
    });
  });

  it("does not throw and stays usable when the clipboard write rejects", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { clipboard: { writeText } });

    render(<CopyButton value="hello@leonard.dev" label="hello@leonard.dev" />);
    const button = screen.getByRole("button", { name: "Copy hello@leonard.dev" });

    fireEvent.click(button);
    await Promise.resolve();
    await Promise.resolve();

    expect(screen.getByText("hello@leonard.dev")).toBeInTheDocument();
    expect(button).toBeEnabled();
  });

  it("does nothing when navigator.clipboard is unavailable", () => {
    vi.stubGlobal("navigator", {});

    render(<CopyButton value="hello@leonard.dev" label="hello@leonard.dev" />);
    const button = screen.getByRole("button", { name: "Copy hello@leonard.dev" });

    expect(() => fireEvent.click(button)).not.toThrow();
    expect(screen.getByText("hello@leonard.dev")).toBeInTheDocument();
  });
});
