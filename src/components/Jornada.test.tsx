import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

/**
 * Fills the start time the way people actually do, by pasting the line the
 * time clock reports. The tolerance switch lives on the answer card, which
 * only exists once a start time is known.
 */
async function startAt(user: ReturnType<typeof userEvent.setup>, time: string) {
  await user.click(
    screen.getByRole("button", { name: /colar marcações do ponto/i })
  );
  await user.type(screen.getByLabelText("Marcações"), time);
  await user.click(screen.getByRole("button", { name: "Preencher" }));
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

  describe("leaving on the tolerance", () => {
    it("remembers the switch from a previous session", async () => {
      window.localStorage.setItem("sairNaTolerancia", "1");
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);

      await startAt(user, "08:00");

      expect(await screen.findByLabelText("Sair na tolerância")).toBeChecked();
    });

    it("saves the switch the moment it is flipped", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);
      await startAt(user, "08:00");

      const toggle = await screen.findByLabelText("Sair na tolerância");
      expect(toggle).not.toBeChecked();

      await user.click(toggle);

      // No "Salvar definições" needed: a switch that waited for it would look
      // like it had not worked.
      expect(window.localStorage.getItem("sairNaTolerancia")).toBe("1");
      expect(toggle).toBeChecked();
    });

    it("turns it back off on Resetar", async () => {
      window.localStorage.setItem("sairNaTolerancia", "1");
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);
      await startAt(user, "08:00");

      await user.click(screen.getByRole("button", { name: "Resetar" }));
      expect(window.localStorage.getItem("sairNaTolerancia")).toBeNull();

      // Resetar also clears the start time, so the card has to be filled in
      // again before the switch is back on screen.
      await startAt(user, "08:00");
      expect(
        await screen.findByLabelText("Sair na tolerância")
      ).not.toBeChecked();
    });
  });
});
