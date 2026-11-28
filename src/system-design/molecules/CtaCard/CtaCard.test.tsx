import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtaCard } from "./CtaCard";

describe("CtaCard", () => {
  it("renders its children", () => {
    render(
      <CtaCard>
        <p>Hello</p>
      </CtaCard>,
    );

    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("applies the center align class by default", () => {
    render(
      <CtaCard>
        <p>Hello</p>
      </CtaCard>,
    );

    const className = screen.getByText("Hello").parentElement?.className ?? "";
    expect(className).toMatch(/center/);
  });

  it("applies the start align class when align='start'", () => {
    render(
      <CtaCard align="start">
        <p>Hello</p>
      </CtaCard>,
    );

    const className = screen.getByText("Hello").parentElement?.className ?? "";
    expect(className).toMatch(/start/);
  });
});
