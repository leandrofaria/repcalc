import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "./testUtils";
import Calculadora from "./Calculadora";

describe("Calculadora", () => {
  it("calculates from the physical keyboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calculadora />);

    await user.keyboard("2h30m+1h45m{Enter}");

    expect(screen.getByLabelText("Resultado")).toHaveTextContent("4h 15m");
    expect(screen.getByText("2h 30m + 1h 45m = 4h 15m")).toBeInTheDocument();
  });

  it("leaves browser shortcuts alone", async () => {
    const user = userEvent.setup({ document });
    const prevented = vi.fn();
    window.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) prevented();
    });

    renderWithProviders(<Calculadora />);
    // The old handler called preventDefault() on every key before checking
    // whether it handled it, so /calculadora swallowed Ctrl+R and Ctrl+C.
    await user.keyboard("{Control>}r{/Control}");
    await user.keyboard("{Control>}c{/Control}");

    expect(prevented).not.toHaveBeenCalled();
  });

  it("clears the entry first and the memory second", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calculadora />);

    await user.keyboard("2h+3");
    expect(screen.getByRole("button", { name: "Limpar" })).toHaveTextContent(
      "CE"
    );

    await user.keyboard("c");
    expect(screen.getByLabelText("Resultado")).toHaveTextContent("0");
    expect(screen.getByRole("button", { name: "Limpar" })).toHaveTextContent(
      "C"
    );
  });

  it("clears the history on request, keeping the current value", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calculadora />);

    await user.keyboard("2h+3h{Enter}");
    expect(screen.getByText("2h + 3h = 5h")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Limpar histórico" }));
    expect(screen.queryByText("2h + 3h = 5h")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Resultado")).toHaveTextContent("5h");
  });

  it("keeps the digit keys usable after a result with minutes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Calculadora />);

    await user.keyboard("2h30m+1h45m{Enter}");
    // Production disabled every digit key whenever the result had minutes.
    expect(screen.getByRole("button", { name: "7" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "7" }));
    expect(screen.getByLabelText("Resultado")).toHaveTextContent("7");
  });
});
