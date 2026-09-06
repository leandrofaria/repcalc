import { describe, expect, it } from "vitest";
import { formatHHMM, fromHM as durationFromHM } from "../time/duration";
import { fromHM as timeFromHM } from "../time/timeOfDay";
import { computeLiveStatus, type LiveInput } from "./liveStatus";

const INPUT: LiveInput = {
  start: timeFromHM(8, 0),
  workday: durationFromHM(5, 45),
  breakTime: durationFromHM(0, 15),
  tolerance: durationFromHM(0, 10),
  includeBreak: true,
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
      { ...INPUT, includeBreak: false },
      timeFromHM(12, 0)
    );
    expect(formatHHMM(status.worked!)).toBe("04:00");
  });

  it("treats the exact start time as zero worked, not as an error", () => {
    const status = computeLiveStatus(
      { ...INPUT, includeBreak: false },
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
      ["before the start time", 7, 59, "before"],
      ["while the break still covers it", 8, 10, "before"],
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
      { ...INPUT, start: timeFromHM(23, 0), includeBreak: false },
      timeFromHM(23, 59)
    );
    expect(formatHHMM(late.worked!)).toBe("00:59");
  });
});
