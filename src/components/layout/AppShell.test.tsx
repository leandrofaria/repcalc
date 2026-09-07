import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import AppShell from "./AppShell";

/**
 * The one structural rule that makes the bottom bar behave.
 *
 * The bar used to be `position: fixed`, which on a phone is placed against a
 * viewport that changes size while the address bar collapses — it drifted out
 * of view on Firefox for Android and the spacing above it grew and shrank as
 * you scrolled. The fix was to stop positioning it at all: it is the last
 * element of a column exactly one screen tall, outside the only thing that
 * scrolls.
 *
 * jsdom does no layout, so this asserts the structure rather than the pixels.
 * If the bar ever ends up inside the scrolling area again, it scrolls away
 * with the content and the bug is back.
 */
describe("AppShell", () => {
  it("keeps the bottom bar outside the scrolling area", () => {
    const { container } = render(
      <AppShell bottomBar={<nav data-bottom-bar>barra</nav>}>conteúdo</AppShell>
    );

    const scroller = container.querySelector("[data-scroll-area]");
    const bar = container.querySelector("[data-bottom-bar]");

    expect(scroller).not.toBeNull();
    expect(bar).not.toBeNull();
    expect(scroller!.contains(bar)).toBe(false);
  });

  it("puts the content inside the scrolling area", () => {
    const { container } = render(<AppShell>conteúdo</AppShell>);

    const scroller = container.querySelector("[data-scroll-area]");
    const main = container.querySelector("main");

    expect(scroller!.contains(main)).toBe(true);
  });

  it("renders without a bar, for the home", () => {
    const { container } = render(<AppShell>conteúdo</AppShell>);
    expect(container.querySelector("[data-bottom-bar]")).toBeNull();
  });
});
