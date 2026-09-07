import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Logo from "./Logo";

/**
 * The mark is drawn twice — here as JSX, and by scripts/generate-icons.mjs as
 * a string written to public/icons/icon.svg. Both read their numbers from
 * src/lib/design/mark.mjs, and this asserts they still agree, so the mark in
 * the header cannot drift from the one in the browser tab.
 *
 * If this fails after a deliberate change to the mark, the fix is to run
 * `npm run icons` and commit the regenerated files.
 */

/** Every attribute that places or paints a shape, in a stable order. */
const SHAPE_ATTRIBUTES = [
  "cx",
  "cy",
  "r",
  "x",
  "y",
  "width",
  "height",
  "rx",
  "d",
  "fill",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "transform",
];

function shapes(root: Element): string[] {
  return [...root.children]
    .filter((element) => element.tagName.toLowerCase() !== "title")
    .map((element) =>
      [
        element.tagName.toLowerCase(),
        ...SHAPE_ATTRIBUTES.map(
          (name) => `${name}=${element.getAttribute(name) ?? ""}`
        ),
      ].join(" ")
    );
}

describe("Logo", () => {
  it("draws the same mark as the generated icon", () => {
    const file = readFileSync(
      join(process.cwd(), "public", "icons", "icon.svg"),
      "utf8"
    );
    const generated = new DOMParser().parseFromString(
      file,
      "image/svg+xml"
    ).documentElement;

    const { container } = render(<Logo />);
    const rendered = container.querySelector("svg");

    expect(rendered).not.toBeNull();
    expect(shapes(rendered!)).toEqual(shapes(generated));
  });

  it("shares the generated icon's coordinate space", () => {
    // A different viewBox would scale the drawing differently even with
    // identical shapes.
    const file = readFileSync(
      join(process.cwd(), "public", "icons", "icon.svg"),
      "utf8"
    );
    const generated = new DOMParser().parseFromString(
      file,
      "image/svg+xml"
    ).documentElement;

    const { container } = render(<Logo />);

    expect(container.querySelector("svg")?.getAttribute("viewBox")).toBe(
      generated.getAttribute("viewBox")
    );
  });

  it("is hidden from screen readers, since the name sits beside it", () => {
    const { container } = render(<Logo />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden");
  });
});
