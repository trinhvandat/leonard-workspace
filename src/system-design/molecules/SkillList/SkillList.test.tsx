import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SkillList } from "./SkillList";

/** Render tests for `SkillList` (REGISTRY: molecules/SkillList). */
describe("SkillList", () => {
  it("renders one chip per skill, in order", () => {
    render(<SkillList skills={["Java", "Kotlin", "PostgreSQL"]} />);

    const chips = screen.getAllByText(/Java|Kotlin|PostgreSQL/);
    expect(chips.map((chip) => chip.textContent)).toEqual(["Java", "Kotlin", "PostgreSQL"]);
  });
});
