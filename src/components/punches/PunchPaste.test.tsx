import { describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testUtils";
import Jornada from "../Jornada";
import TempoTotal from "../TempoTotal";

/** Opens the paste section and types a line into it. */
async function paste(user: ReturnType<typeof userEvent.setup>, line: string) {
  await user.click(
    screen.getByRole("button", { name: /colar marcações do ponto/i })
  );
  await user.type(screen.getByLabelText("Marcações"), line);
}

function fieldValue(label: string): string {
  const group = screen.getByRole("group", { name: label });
  const read = (name: string) =>
    within(group).getByRole("spinbutton", { name }).textContent;
  return `${read("Horas")}:${read("Minutos")}`;
}

describe("pasting a line of punch marks", () => {
  describe("into Jornada", () => {
    it("fills the start time and the break from the gaps", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);

      // In at 08:00, out at 12:00, back at 13:00: an hour of break, and the
      // clock-out is the mark this screen exists to predict.
      await paste(user, "08:00 12:00 13:00");
      expect(
        screen.getByText(/Início 08:00, intervalo de 01:00/)
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Preencher" }));

      expect(fieldValue("Início")).toBe("08:00");
      expect(fieldValue("Intervalo")).toBe("01:00");
    });

    it("keeps the saved break when none has been taken yet", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);

      // Only clocked in. The plan still assumes a break will be taken, so the
      // saved default must survive.
      await paste(user, "08:00");
      await user.click(screen.getByRole("button", { name: "Preencher" }));

      expect(fieldValue("Início")).toBe("08:00");
      expect(fieldValue("Intervalo")).toBe("00:15");
    });

    it("says so when the marks show the day already closed", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);

      await paste(user, "08:00 12:00");
      expect(
        screen.getByText(/a jornada já foi encerrada/i)
      ).toBeInTheDocument();
    });

    it("sums more than one break", async () => {
      const user = userEvent.setup();
      renderWithProviders(<Jornada />);

      await paste(user, "08:00 09:00 09:10 12:00 13:00");
      await user.click(screen.getByRole("button", { name: "Preencher" }));

      expect(fieldValue("Intervalo")).toBe("01:10");
    });
  });

  describe("into Tempo Total", () => {
    it("fills one row per pair and totals them", async () => {
      const user = userEvent.setup();
      renderWithProviders(<TempoTotal />);

      await paste(user, "08:00 12:00 13:00 18:00");
      expect(screen.getByText("2 pares")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Preencher" }));

      expect(fieldValue("Entrada 1")).toBe("08:00");
      expect(fieldValue("Saída 2")).toBe("18:00");
      expect(screen.getByText("09:00")).toBeInTheDocument();
    });

    it("leaves the last row open on an odd count", async () => {
      const user = userEvent.setup();
      renderWithProviders(<TempoTotal />);

      // Pasted mid-shift: the person has not clocked out yet.
      await paste(user, "08:00 12:00 13:00");
      expect(
        screen.getByText("1 par e uma marcação em aberto")
      ).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Preencher" }));

      expect(fieldValue("Entrada 2")).toBe("13:00");
      expect(fieldValue("Saída 2")).toBe("hh:mm");
      // The finished pair still counts.
      expect(screen.getByText("04:00")).toBeInTheDocument();
    });
  });

  it("reports what it could not read instead of dropping it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TempoTotal />);

    await paste(user, "08:00 almoço 12:00");
    expect(screen.getByText(/Não entendi: almoço/)).toBeInTheDocument();
  });

  it("does nothing on an empty line", async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(console, "error");
    renderWithProviders(<TempoTotal />);

    await user.click(
      screen.getByRole("button", { name: /colar marcações do ponto/i })
    );
    expect(screen.getByRole("button", { name: "Preencher" })).toBeDisabled();
    spy.mockRestore();
  });
});
