import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../testUtils";
import JornadaHero from "./JornadaHero";
import { fromHM as durationFromHM } from "@/lib/time/duration";
import { fromHM as timeFromHM } from "@/lib/time/timeOfDay";
import type { LiveInput } from "@/lib/jornada/liveStatus";

const LIVE: LiveInput = {
  start: timeFromHM(8, 0),
  workday: durationFromHM(5, 45),
  breakTime: durationFromHM(0, 15),
  tolerance: durationFromHM(0, 10),
  breakTaken: true,
};

/** Clock-out is 08:00 + 05:45 + 00:15. */
const CLOCK_OUT = { time: timeFromHM(14, 0), dayOffset: 0 };
const EARLY = { time: timeFromHM(13, 50), dayOffset: 0 };

function renderAt(hour: number, minute: number) {
  vi.setSystemTime(new Date(2026, 8, 6, hour, minute, 0));
  return renderWithProviders(
    <JornadaHero
      complete
      startMissing={false}
      clockOut={CLOCK_OUT}
      earlyClockOut={EARLY}
      liveInput={LIVE}
      tolerance={durationFromHM(0, 10)}
      breakTaken
      onBreakTakenChange={() => {}}
    />
  );
}

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("JornadaHero", () => {
  it("leads with the clock-out time", () => {
    renderAt(12, 0);
    expect(screen.getByText("14:00")).toBeInTheDocument();
    expect(screen.getByText("13:50")).toBeInTheDocument();
  });

  it("says what is missing instead of showing a placeholder answer", () => {
    renderWithProviders(
      <JornadaHero
        complete={false}
        startMissing
        clockOut={null}
        earlyClockOut={null}
        liveInput={null}
        tolerance={durationFromHM(0, 10)}
        breakTaken
        onBreakTakenChange={() => {}}
      />
    );
    // A giant "--:--" under "Você sai às" is a placeholder pretending to be
    // an answer.
    expect(
      screen.getByText("Informe o horário de início para ver sua saída")
    ).toBeInTheDocument();
    expect(screen.queryByText("--:--")).not.toBeInTheDocument();
    expect(screen.queryByText("Você sai às")).not.toBeInTheDocument();
  });

  it("says something different when a field was cleared", () => {
    renderWithProviders(
      <JornadaHero
        complete={false}
        startMissing={false}
        clockOut={null}
        earlyClockOut={null}
        liveInput={null}
        tolerance={durationFromHM(0, 10)}
        breakTaken
        onBreakTakenChange={() => {}}
      />
    );
    expect(
      screen.getByText("Complete os campos para ver seu horário de saída")
    ).toBeInTheDocument();
  });

  it("shows the live figures inline, without a dialog", () => {
    // These used to live behind a button, in a modal.
    renderAt(12, 0);
    expect(screen.getByText("03:45")).toBeInTheDocument();
    expect(screen.getByText("02:00")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "65"
    );
  });

  it.each([
    ["mid shift", 12, 0, "Em jornada"],
    ["inside the tolerance window", 14, 5, "Já pode sair"],
    ["past the tolerance", 14, 11, "Em excedente"],
  ])("names the phase %s", (_label, hour, minute, expected) => {
    renderAt(hour as number, minute as number);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it("reports overtime once the tolerance is passed", () => {
    renderAt(14, 11);
    expect(screen.getByText("00:11")).toBeInTheDocument();
  });

  it("drops the second figure while over the journey but inside the tolerance", () => {
    // The journey is done, so nothing is missing, and the excess is not
    // overtime yet. It used to read "Faltam --:--".
    renderAt(14, 5);

    expect(screen.getByText("05:50")).toBeInTheDocument();
    expect(screen.queryByText("--:--")).not.toBeInTheDocument();
    expect(screen.queryByText("Faltam")).not.toBeInTheDocument();
    expect(screen.queryByText("Excedente")).not.toBeInTheDocument();
  });

  it("still counts down when leaving is allowed and the journey is short", () => {
    // "Já pode sair" starts inside the tolerance window, before the journey
    // is actually complete — there the countdown is real and must stay.
    renderAt(13, 51);

    expect(screen.getByText("Já pode sair")).toBeInTheDocument();
    expect(screen.getByText("Faltam")).toBeInTheDocument();
    expect(screen.getByText("00:09")).toBeInTheDocument();
  });

  it("says the next day in words, not as a parenthesised number", () => {
    renderWithProviders(
      <JornadaHero
        complete
        startMissing={false}
        clockOut={{ time: timeFromHM(2, 0), dayOffset: 1 }}
        earlyClockOut={{ time: timeFromHM(1, 50), dayOffset: 1 }}
        liveInput={null}
        tolerance={durationFromHM(0, 10)}
        breakTaken
        onBreakTakenChange={() => {}}
      />
    );
    // It used to render "02:00 (+1)", a notation nobody should have to learn.
    expect(screen.getByText("02:00")).toBeInTheDocument();
    expect(screen.getByText("no dia seguinte")).toBeInTheDocument();
  });
});
