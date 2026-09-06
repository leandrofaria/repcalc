import { describe, expect, it } from "vitest";
import { NAV_ITEMS, isActive } from "./nav";

describe("isActive", () => {
  const home = NAV_ITEMS[0];
  const calculadora = NAV_ITEMS[1];

  it("matches Home only on the root route", () => {
    // The original nav omitted the active-state logic on Home entirely.
    expect(isActive(home, "/")).toBe(true);
    expect(isActive(home, "/jornada")).toBe(false);
  });

  it("matches the other items on their subtree", () => {
    expect(isActive(calculadora, "/calculadora")).toBe(true);
    expect(isActive(calculadora, "/calculadora/qualquer")).toBe(true);
    expect(isActive(calculadora, "/jornada")).toBe(false);
  });
});
