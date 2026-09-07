import { describe, expect, it } from "vitest";
import { NAV_ITEMS, isActive } from "./nav";

describe("NAV_ITEMS", () => {
  it("carries no Home entry", () => {
    // The home exists as a page, but it is reached by the app's name in the
    // header. A bar entry would be a second control for the same place.
    expect(NAV_ITEMS[0].href).toBe("/jornada");
    expect(NAV_ITEMS.map((item) => item.href)).not.toContain("/");
  });

  it("gives every item a short label for the bottom bar", () => {
    for (const item of NAV_ITEMS) {
      expect(item.shortLabel.length).toBeLessThanOrEqual(item.label.length);
    }
  });
});

describe("isActive", () => {
  it("matches an item on its own subtree", () => {
    const jornada = NAV_ITEMS[0];
    expect(isActive(jornada, "/jornada")).toBe(true);
    expect(isActive(jornada, "/jornada/qualquer")).toBe(true);
    expect(isActive(jornada, "/calculadora")).toBe(false);
  });
});
