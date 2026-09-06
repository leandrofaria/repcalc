import { useState } from "react";
import type { Dayjs } from "dayjs";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../testUtils";
import TimeField from "./TimeField";
import { dayjsToDuration, durationToDayjs } from "@/lib/time/dayjs";
import { fromHM } from "@/lib/time/duration";
import type { Duration } from "@/lib/time/units";

/**
 * TimeField is controlled, so a test that never feeds the value back gets
 * its sections reset mid-typing. This mirrors how the screens use it: the
 * domain value is the state, and the picker is a view of it.
 */
function ControlledField({
  onValue,
}: {
  onValue: (value: Duration | null) => void;
}) {
  const [value, setValue] = useState<Dayjs | null>(null);
  return (
    <TimeField
      label="Horário de Início"
      value={value}
      onChange={(next) => {
        setValue(next);
        onValue(dayjsToDuration(next));
      }}
    />
  );
}

describe("TimeField", () => {
  it("gives the focusable control an accessible name", () => {
    renderWithProviders(
      <TimeField label="Jornada" value={null} onChange={() => {}} />
    );
    // Since x-date-pickers v9 the element holding the id is a hidden input,
    // so the name has to land on the role="group" the user actually focuses.
    expect(screen.getByRole("group", { name: "Jornada" })).toBeInTheDocument();
  });

  it("renders a duration the picker can hold", () => {
    renderWithProviders(
      <TimeField
        label="Jornada"
        value={durationToDayjs(fromHM(5, 45))}
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("spinbutton", { name: "Horas" })).toHaveTextContent(
      "05"
    );
    expect(
      screen.getByRole("spinbutton", { name: "Minutos" })
    ).toHaveTextContent("45");
  });

  it("reports what was typed back as domain minutes", async () => {
    const user = userEvent.setup();
    const seen: Array<Duration | null> = [];
    renderWithProviders(<ControlledField onValue={(v) => seen.push(v)} />);

    await user.click(screen.getByRole("spinbutton", { name: "Horas" }));
    await user.keyboard("0845");

    expect(seen.at(-1)).toBe(525);
    expect(screen.getByRole("spinbutton", { name: "Horas" })).toHaveTextContent(
      "08"
    );
    expect(
      screen.getByRole("spinbutton", { name: "Minutos" })
    ).toHaveTextContent("45");
  });

  it("localises the picker's own strings", () => {
    // Without localeText these announce as "Hours" and "Minutes".
    renderWithProviders(
      <TimeField label="Horário de Início" value={null} onChange={() => {}} />
    );
    expect(
      screen.getByRole("spinbutton", { name: "Horas" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: "Minutos" })
    ).toBeInTheDocument();
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
    expect(screen.getByRole("group", { name: "Marcação 2" })).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });
});
