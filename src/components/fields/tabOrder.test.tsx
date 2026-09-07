import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testUtils";
import TimeField from "./TimeField";

const noop = () => {};

/** Focuses a named field's hour or minute section directly. */
function section(label: string, name: "Horas" | "Minutos"): HTMLElement {
  const group = screen.getByRole("group", { name: label });
  const found = [...group.querySelectorAll<HTMLElement>('[role="spinbutton"]')];
  const match = found.find((el) => el.getAttribute("aria-label") === name);
  if (match === undefined) throw new Error(`no ${name} in ${label}`);
  return match;
}

/**
 * Tab has to leave the field, from whichever section the caret is on.
 *
 * The picker marks only the hours section as tabbable; the minutes section
 * sits at tabIndex -1. Since typing a time always ends on the minutes, the
 * browser was left with no valid place to continue from, and Firefox
 * restarted at the top of the document — walking the header again instead of
 * moving to the next field.
 */
describe("tab order", () => {
  it("moves between fields with a single press", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="Primeiro" value={null} onChange={noop} />
        <TimeField label="Segundo" value={null} onChange={noop} />
      </>
    );

    await user.tab();
    expect(
      screen
        .getByRole("group", { name: "Primeiro" })
        .contains(document.activeElement)
    ).toBe(true);

    await user.tab();
    expect(
      screen
        .getByRole("group", { name: "Segundo" })
        .contains(document.activeElement)
    ).toBe(true);
  });

  it.each(["Horas", "Minutos"] as const)(
    "leaves the field from the %s section",
    async (name) => {
      const user = userEvent.setup();
      renderWithProviders(
        <>
          <TimeField label="Primeiro" value={null} onChange={noop} />
          <TimeField label="Segundo" value={null} onChange={noop} />
        </>
      );

      section("Primeiro", name).focus();
      await user.tab();

      expect(
        screen
          .getByRole("group", { name: "Segundo" })
          .contains(document.activeElement),
        `tabbing out of ${name}`
      ).toBe(true);
    }
  );

  it("goes back to the previous field on shift+tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="Primeiro" value={null} onChange={noop} />
        <TimeField label="Segundo" value={null} onChange={noop} />
      </>
    );

    section("Segundo", "Minutos").focus();
    await user.tab({ shift: true });

    expect(
      screen
        .getByRole("group", { name: "Primeiro" })
        .contains(document.activeElement)
    ).toBe(true);
  });

  it("reaches whatever follows the last field", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="Único" value={null} onChange={noop} />
        <button type="button">Salvar</button>
      </>
    );

    section("Único", "Minutos").focus();
    await user.tab();

    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Salvar" })
    );
  });

  it("reaches every field in a four-field form within four presses", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <TimeField label="A" value={null} onChange={noop} />
        <TimeField label="B" value={null} onChange={noop} />
        <TimeField label="C" value={null} onChange={noop} />
        <TimeField label="D" value={null} onChange={noop} />
      </>
    );

    for (const name of ["A", "B", "C", "D"]) {
      await user.tab();
      expect(
        screen.getByRole("group", { name }).contains(document.activeElement),
        `after tabbing to ${name}`
      ).toBe(true);
    }
  });
});
