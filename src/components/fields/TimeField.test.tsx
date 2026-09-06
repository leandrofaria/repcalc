import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testUtils";
import TimeField from "./TimeField";
import { dayjsToDuration, durationToDayjs } from "@/lib/time/dayjs";
import { fromHM } from "@/lib/time/duration";

describe("TimeField", () => {
  it("associates a real label with the input", () => {
    renderWithProviders(
      <TimeField label="Duração da Jornada" value={null} onChange={() => {}} />
    );
    // Previously the label was a sibling paragraph, invisible to this query.
    expect(screen.getByLabelText("Duração da Jornada")).toBeInTheDocument();
  });

  it("renders a duration the picker can hold", () => {
    renderWithProviders(
      <TimeField
        label="Duração da Jornada"
        value={durationToDayjs(fromHM(5, 45))}
        onChange={() => {}}
      />
    );
    expect(screen.getByLabelText("Duração da Jornada")).toHaveValue("05:45");
  });

  it("reports what was typed back as domain minutes", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(
      <TimeField label="Horário de Início" value={null} onChange={onChange} />
    );

    await user.click(screen.getByLabelText("Horário de Início"));
    await user.keyboard("0845");

    const last = onChange.mock.calls.at(-1)?.[0];
    expect(dayjsToDuration(last)).toBe(525);
  });

  it("wires the error state and helper text", () => {
    renderWithProviders(
      <TimeField
        label="Marcação 2"
        value={null}
        onChange={() => {}}
        error
        helperText="Deve ser posterior à marcação anterior."
      />
    );
    expect(
      screen.getByText("Deve ser posterior à marcação anterior.")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Marcação 2")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });
});
