import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testUtils";
import TimeField from "./TimeField";

/**
 * Tab has to move from one field to the next.
 *
 * The picker's accessible DOM structure puts three tab stops on every field:
 * the sections container, the first section, and the button that opens the
 * clock. The first two look identical on screen, so pressing Tab appeared to
 * do nothing and people reached for the mouse instead.
 */
describe("tab order", () => {
  it("moves between fields with a single press", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="Primeiro" value={null} onChange={() => {}} />
        <TimeField label="Segundo" value={null} onChange={() => {}} />
      </>
    );

    const first = screen.getByRole("group", { name: "Primeiro" });
    const second = screen.getByRole("group", { name: "Segundo" });

    await user.tab();
    expect(first.contains(document.activeElement)).toBe(true);

    await user.tab();
    expect(second.contains(document.activeElement)).toBe(true);
  });

  it("leaves focus on an element that is itself a tab stop", async () => {
    // Firefox loses its place when focus sits on a tabindex="-1" element:
    // the next Tab restarts from the top of the document, which sent people
    // back to the header instead of on to the next field.
    const user = userEvent.setup();
    renderWithProviders(
      <TimeField label="Primeiro" value={null} onChange={() => {}} />
    );

    await user.tab();
    const active = document.activeElement as HTMLElement;
    expect(active.getAttribute("role")).toBe("spinbutton");
    expect(active.tabIndex).toBe(0);
  });

  it("puts focus on a real tab stop when the field is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <TimeField label="Primeiro" value={null} onChange={() => {}} />
    );

    await user.click(screen.getByRole("group", { name: "Primeiro" }));
    expect((document.activeElement as HTMLElement).tabIndex).toBe(0);
  });

  it("reaches every field in a four-field form within four presses", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="A" value={null} onChange={() => {}} />
        <TimeField label="B" value={null} onChange={() => {}} />
        <TimeField label="C" value={null} onChange={() => {}} />
        <TimeField label="D" value={null} onChange={() => {}} />
      </>
    );

    for (const name of ["A", "B", "C", "D"]) {
      await user.tab();
      const group = screen.getByRole("group", { name });
      expect(
        group.contains(document.activeElement),
        `after tabbing to ${name}`
      ).toBe(true);
    }
  });
});
