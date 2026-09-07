import { describe, expect, it } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./testUtils";
import TempoTotal from "./TempoTotal";

describe("TempoTotal", () => {
  it("does not mark an untouched field as an error", () => {
    // The first row used to render red, with "deve ser posterior à marcação
    // anterior", before anyone had typed anything.
    renderWithProviders(<TempoTotal />);
    const saida = screen.getByRole("group", { name: "Saída 1" });
    expect(saida).not.toHaveAttribute("aria-invalid", "true");
    expect(screen.queryByText("Fora de ordem.")).not.toBeInTheDocument();
  });

  it("starts at zero and asks for a pair", () => {
    renderWithProviders(<TempoTotal />);
    expect(screen.getByText("00:00")).toBeInTheDocument();
    expect(
      screen.getByText("Preencha pelo menos um par de marcações")
    ).toBeInTheDocument();
  });

  it("adds and removes rows independently", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TempoTotal />);

    // Only the last pair could be removed before, so fixing the second of
    // five meant deleting three.
    expect(screen.getByLabelText("Excluir o par 1")).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /adicionar par/i }));
    await user.click(screen.getByRole("button", { name: /adicionar par/i }));
    expect(screen.getAllByRole("group", { name: /^Entrada/ })).toHaveLength(3);

    await user.click(screen.getByLabelText("Excluir o par 2"));
    expect(screen.getAllByRole("group", { name: /^Entrada/ })).toHaveLength(2);
  });

  it("stops at six pairs", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TempoTotal />);
    const add = () => screen.getByRole("button", { name: /adicionar par/i });

    for (let i = 0; i < 5; i += 1) await user.click(add());

    expect(screen.getAllByRole("group", { name: /^Entrada/ })).toHaveLength(6);
    expect(add()).toBeDisabled();
  });

  it("totals the pairs as they are filled in", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TempoTotal />);

    const type = async (label: string, digits: string) => {
      const group = screen.getByRole("group", { name: label });
      await user.click(
        within(group).getByRole("spinbutton", { name: "Horas" })
      );
      await user.keyboard(digits);
    };

    await type("Entrada 1", "0800");
    await type("Saída 1", "1200");

    expect(screen.getByText("04:00")).toBeInTheDocument();
  });
});
