import { describe, expect, it } from "vitest";
import { formatHHMM, fromHM as durationFromHM } from "../time/duration";
import { fromHM as timeFromHM } from "../time/timeOfDay";
import { computeLiveStatus, secondFigure, type LiveInput } from "./liveStatus";

const INPUT: LiveInput = {
  start: timeFromHM(8, 0),
  workday: durationFromHM(5, 45),
  breakTime: durationFromHM(0, 15),
  tolerance: durationFromHM(0, 10),
  breakTaken: true,
};

function at(hour: number, minute: number) {
  const status = computeLiveStatus(INPUT, timeFromHM(hour, minute));
  const show = (d: number | null) =>
    d === null ? "N/A" : formatHHMM(d as never);
  return {
    worked: show(status.worked),
    overtime: show(status.overtime),
    remaining: show(status.remainingTotal),
    remainingTol: show(status.remainingWithTolerance),
  };
}

describe("computeLiveStatus", () => {
  // Every row here was captured from production before the refactor.
  it.each([
    ["before the start time", 7, 59, "N/A", "N/A", "N/A", "N/A"],
    ["while the break still covers it", 8, 10, "N/A", "N/A", "N/A", "N/A"],
    ["mid shift", 12, 0, "03:45", "N/A", "02:00", "01:50"],
    ["exactly at the tolerance edge", 13, 50, "05:35", "N/A", "00:10", "00:00"],
    ["one minute past it", 13, 51, "05:36", "N/A", "00:09", "N/A"],
    ["at the full workday", 14, 0, "05:45", "N/A", "00:00", "N/A"],
    ["over, but inside the tolerance", 14, 5, "05:50", "N/A", "N/A", "N/A"],
    ["over the tolerance", 14, 11, "05:56", "00:11", "N/A", "N/A"],
  ])(
    "%s",
    (_label, hour, minute, worked, overtime, remaining, remainingTol) => {
      expect(at(hour as number, minute as number)).toEqual({
        worked,
        overtime,
        remaining,
        remainingTol,
      });
    }
  );

  it("counts the break back in when asked not to deduct it", () => {
    const status = computeLiveStatus(
      { ...INPUT, breakTaken: false },
      timeFromHM(12, 0)
    );
    expect(formatHHMM(status.worked!)).toBe("04:00");
  });

  it("treats the exact start time as zero worked, not as an error", () => {
    const status = computeLiveStatus(
      { ...INPUT, breakTaken: false },
      timeFromHM(8, 0)
    );
    expect(status.worked).toBe(0);
    expect(formatHHMM(status.remainingTotal!)).toBe("05:45");
  });

  it("reports the tolerance-adjusted target", () => {
    expect(
      formatHHMM(
        computeLiveStatus(INPUT, timeFromHM(12, 0)).targetWithTolerance
      )
    ).toBe("05:35");
  });

  describe("phase", () => {
    const phaseAt = (hour: number, minute: number) =>
      computeLiveStatus(INPUT, timeFromHM(hour, minute)).phase;

    it.each([
      // 07:00 with an 08:00 start: someone planning tomorrow morning.
      ["planning a start that has not arrived", 7, 0, "notStarted"],
      ["while the break still covers it", 8, 10, "breakCovers"],
      ["mid shift", 12, 0, "working"],
      ["one minute short of the tolerance window", 13, 49, "working"],
      // 05:35 worked is the journey minus the tolerance: leaving is allowed.
      ["at the tolerance window", 13, 50, "mayLeave"],
      ["at the full journey", 14, 0, "mayLeave"],
      ["over, but inside the tolerance", 14, 5, "mayLeave"],
      ["past the journey plus the tolerance", 14, 11, "overtime"],
    ])("%s", (_label, hour, minute, expected) => {
      expect(phaseAt(hour as number, minute as number)).toBe(expected);
    });
  });

  it("does not depend on the calendar date", () => {
    // The previous implementation reloaded the page when the day rolled over.
    const late = computeLiveStatus(
      { ...INPUT, start: timeFromHM(23, 0), breakTaken: false },
      timeFromHM(23, 59)
    );
    expect(formatHHMM(late.worked!)).toBe("00:59");
  });
});

describe("secondFigure", () => {
  const figureAt = (hour: number, minute: number) => {
    const figure = secondFigure(
      computeLiveStatus(INPUT, timeFromHM(hour, minute))
    );
    return figure === null
      ? null
      : { kind: figure.kind, value: formatHHMM(figure.value) };
  };

  it("counts down while the journey is not yet done", () => {
    expect(figureAt(12, 0)).toEqual({ kind: "remaining", value: "02:00" });
  });

  it("still counts down once leaving is allowed but the journey is short", () => {
    // 13:51 is inside the tolerance window, so the phase is already
    // "mayLeave" — but two minutes of the journey are genuinely left.
    expect(figureAt(13, 51)).toEqual({ kind: "remaining", value: "00:09" });
  });

  it("counts up once the excess passes the tolerance", () => {
    expect(figureAt(14, 11)).toEqual({ kind: "overtime", value: "00:11" });
  });

  it("gives nothing while over the journey but inside the tolerance", () => {
    // The one state with no honest number: the journey is done, so nothing is
    // missing, and the excess is not overtime yet. It used to print "--:--",
    // which is a placeholder pretending to be an answer.
    expect(figureAt(14, 5)).toBeNull();
  });

  it("gives nothing before the shift is under way", () => {
    expect(figureAt(7, 59)).toBeNull();
    expect(figureAt(8, 10)).toBeNull();
  });
});
