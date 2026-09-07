import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import ThemeColorMeta from "./ThemeColorMeta";

/**
 * The status bar has to follow the app's own scheme, not the phone's.
 *
 * The server renders one theme-color per colour scheme, which answers the
 * system preference — and this app's scheme is a switch in its header, so the
 * two disagree the moment someone reads a light phone in dark mode.
 */
function currentMetas() {
  return [...document.querySelectorAll('meta[name="theme-color"]')].map(
    (meta) => ({
      media: meta.getAttribute("media"),
      content: meta.getAttribute("content"),
    })
  );
}

function seedServerMetas() {
  for (const media of [
    "(prefers-color-scheme: light)",
    "(prefers-color-scheme: dark)",
  ]) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.setAttribute("media", media);
    meta.content = "#000000";
    document.head.appendChild(meta);
  }
}

function seedHeader(colour: string) {
  const header = document.createElement("div");
  header.setAttribute("data-theme-color-source", "");
  header.style.backgroundColor = colour;
  document.body.appendChild(header);
}

describe("ThemeColorMeta", () => {
  it("replaces the system-preference metas with the header's own colour", () => {
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.remove());
    seedServerMetas();
    seedHeader("rgb(15, 118, 110)");

    renderWithProviders(<ThemeColorMeta />);

    expect(currentMetas()).toEqual([
      { media: null, content: "rgb(15, 118, 110)" },
    ]);
  });

  it("leaves the document alone when there is no header to read", () => {
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((m) => m.remove());
    document.body
      .querySelectorAll("[data-theme-color-source]")
      .forEach((e) => e.remove());
    seedServerMetas();

    render(<ThemeColorMeta />);

    // Better the server's pair than a colour invented from nothing.
    expect(currentMetas()).toHaveLength(2);
  });
});
