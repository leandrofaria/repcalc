import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import { renderWithProviders } from "./testUtils";
import Jornada from "./Jornada";

/**
 * Reads a picker's displayed value. Since x-date-pickers v9 the value lives
 * in two spinbutton sections rather than in an input's value attribute.
 */
function fieldValue(label: string): string {
  const group = screen.getByRole("group", { name: label });
  const hours = within(group).getByRole("spinbutton", { name: "Horas" });
  const minutes = within(group).getByRole("spinbutton", { name: "Minutos" });
  return `${hours.textContent}:${minutes.textContent}`;
}

describe("Jornada", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("starts from the built-in defaults", async () => {
    renderWithProviders(<Jornada />);
    await waitFor(() => {
      expect(fieldValue("Jornada")).toBe("05:45");
    });
    expect(fieldValue("Intervalo")).toBe("00:15");
    expect(fieldValue("Tolerância")).toBe("00:10");
  });

  it("picks up settings saved in a previous session", async () => {
    // Reading these during render behind process.browser is what caused the
    // hydration mismatch, and would silently stop working in current Next.
    window.localStorage.setItem("defaultJornada", "06:00");
    window.localStorage.setItem("defaultIntervalo", "00:30");

    renderWithProviders(<Jornada />);

    await waitFor(() => {
      expect(fieldValue("Jornada")).toBe("06:00");
    });
    expect(fieldValue("Intervalo")).toBe("00:30");
    expect(fieldValue("Tolerância")).toBe("00:10");
  });

  it("survives a corrupt stored value", async () => {
    // This used to reach dayjs().hour(NaN) and leave the form stuck.
    window.localStorage.setItem("defaultJornada", "abc");

    renderWithProviders(<Jornada />);

    await waitFor(() => {
      expect(fieldValue("Jornada")).toBe("05:45");
    });
  });
});
