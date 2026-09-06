import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { DARK, LIGHT, type Tokens } from "./tokens";

const css = readFileSync("src/app/tokens.css", "utf8");

function block(selector: string): string {
  const start = css.indexOf(selector);
  expect(start, `${selector} missing from tokens.css`).toBeGreaterThan(-1);
  return css.slice(start, css.indexOf("}", start));
}

/**
 * "Single source of truth" is only true if something enforces it. MUI reads
 * the TypeScript values and Tailwind reads the CSS ones, so a drift between
 * them would show up as one system themed and the other not.
 */
describe("design tokens", () => {
  it.each([
    ["light", ":root {", LIGHT],
    ["dark", '[data-mui-color-scheme="dark"] {', DARK],
  ])("mirrors the %s palette into tokens.css", (_name, selector, tokens) => {
    const declarations = block(selector).toLowerCase();
    for (const [name, value] of Object.entries(tokens as Tokens)) {
      expect(declarations, `${name} missing or wrong`).toContain(
        value.toLowerCase()
      );
    }
  });

  it("defines the same token names in both schemes", () => {
    expect(Object.keys(LIGHT)).toEqual(Object.keys(DARK));
  });
});
