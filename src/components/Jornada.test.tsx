import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./testUtils";
import Jornada from "./Jornada";

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
      expect(screen.getByLabelText("Duração da Jornada")).toHaveValue("05:45");
    });
    expect(screen.getByLabelText("Duração do Intervalo")).toHaveValue("00:15");
    expect(screen.getByLabelText("Tolerância Permitida")).toHaveValue("00:10");
  });

  it("picks up settings saved in a previous session", async () => {
    // Reading these during render behind process.browser is what caused the
    // hydration mismatch, and would silently stop working in current Next.
    window.localStorage.setItem("defaultJornada", "06:00");
    window.localStorage.setItem("defaultIntervalo", "00:30");

    renderWithProviders(<Jornada />);

    await waitFor(() => {
      expect(screen.getByLabelText("Duração da Jornada")).toHaveValue("06:00");
    });
    expect(screen.getByLabelText("Duração do Intervalo")).toHaveValue("00:30");
    expect(screen.getByLabelText("Tolerância Permitida")).toHaveValue("00:10");
  });

  it("survives a corrupt stored value", async () => {
    // This used to reach dayjs().hour(NaN) and leave the form stuck.
    window.localStorage.setItem("defaultJornada", "abc");

    renderWithProviders(<Jornada />);

    await waitFor(() => {
      expect(screen.getByLabelText("Duração da Jornada")).toHaveValue("05:45");
    });
  });
});
