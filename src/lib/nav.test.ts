import { describe, expect, it } from "vitest";
import { NAV_ITEMS, isActive } from "./nav";

describe("NAV_ITEMS", () => {
  it("opens on Jornada and carries no Home entry", () => {
    // The menu page was one tap between the user and the tool.
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
