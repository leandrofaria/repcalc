import { describe, expect, it } from "vitest";
import { fromHM as durationFromHM } from "../time/duration";
import { formatClock, fromHM as timeFromHM } from "../time/timeOfDay";
import { clockOutFigures, computeJornada, type JornadaInput } from "./schedule";

const DEFAULTS = {
  workday: durationFromHM(5, 45),
  breakTime: durationFromHM(0, 15),
  tolerance: durationFromHM(0, 10),
};

function run(startHour: number, startMinute: number) {
  const result = computeJornada({
    start: timeFromHM(startHour, startMinute),
    ...DEFAULTS,
  });
  return {
    clockOut: formatClock(result.clockOut!.time),
    clockOutDay: result.clockOut!.dayOffset,
    early: formatClock(result.earlyClockOut!.time),
    earlyDay: result.earlyClockOut!.dayOffset,
  };
}

describe("computeJornada", () => {
  // Ground truth captured from production before the refactor.
  it.each([
    [8, 0, "14:00", "13:50"],
    [13, 12, "19:12", "19:02"],
    [0, 0, "06:00", "05:50"],
  ])(
    "start %i:%i gives clock-out %s and early %s",
    (hour, minute, clockOut, early) => {
      const result = run(hour, minute);
      expect(result.clockOut).toBe(clockOut);
      expect(result.early).toBe(early);
      expect(result.clockOutDay).toBe(0);
    }
  );

  it("says which day a night shift ends on", () => {
    // Production showed 02:00 with no indication it was the next day.
    const result = run(20, 0);
    expect(result.clockOut).toBe("02:00");
    expect(result.clockOutDay).toBe(1);
    expect(result.early).toBe("01:50");
    expect(result.earlyDay).toBe(1);
  });

  it("tracks the day offset when tolerance pulls back across midnight", () => {
    const result = computeJornada({
      start: timeFromHM(18, 10),
      workday: durationFromHM(5, 45),
      breakTime: durationFromHM(0, 15),
      tolerance: durationFromHM(0, 10),
    });
    expect(formatClock(result.clockOut!.time)).toBe("00:10");
    expect(result.clockOut!.dayOffset).toBe(1);
    expect(formatClock(result.earlyClockOut!.time)).toBe("00:00");
    expect(result.earlyClockOut!.dayOffset).toBe(1);
  });

  it("treats a zero tolerance as no early exit", () => {
    const result = computeJornada({
      start: timeFromHM(8, 0),
      workday: durationFromHM(5, 45),
      breakTime: durationFromHM(0, 15),
      tolerance: durationFromHM(0, 0),
    });
    expect(formatClock(result.earlyClockOut!.time)).toBe(
      formatClock(result.clockOut!.time)
    );
  });

  it.each([
    ["start", { start: null }],
    ["workday", { workday: null }],
    ["breakTime", { breakTime: null }],
    ["tolerance", { tolerance: null }],
  ])("is incomplete when %s is missing", (_field, override) => {
    const input: JornadaInput = {
      start: timeFromHM(8, 0),
      ...DEFAULTS,
      ...override,
    };
    expect(computeJornada(input)).toEqual({
      complete: false,
      clockOut: null,
      earlyClockOut: null,
    });
  });
});

describe("clockOutFigures", () => {
  const figuresFor = (
    startHour: number,
    startMinute: number,
    leave: boolean
  ) => {
    const result = computeJornada({
      start: timeFromHM(startHour, startMinute),
      ...DEFAULTS,
    });
    const figures = clockOutFigures(
      result.clockOut!,
      result.earlyClockOut!,
      leave
    );
    return {
      headline: formatClock(figures.headline.time),
      headlineDay: figures.headline.dayOffset,
      alternate: formatClock(figures.alternate.time),
      alternateWithTolerance: figures.alternateWithTolerance,
    };
  };

  it("leads with the full journey by default", () => {
    expect(figuresFor(8, 0, false)).toEqual({
      headline: "14:00",
      headlineDay: 0,
      alternate: "13:50",
      alternateWithTolerance: true,
    });
  });

  it("leads with the tolerance when asked to", () => {
    expect(figuresFor(8, 0, true)).toEqual({
      headline: "13:50",
      headlineDay: 0,
      alternate: "14:00",
      alternateWithTolerance: false,
    });
  });

  it("keeps each clock's own day when the two straddle midnight", () => {
    // 18:05 plus six hours is 00:05 the next day; ten minutes earlier is 23:55
    // the same day. Whichever leads, the day note has to describe that one.
    expect(figuresFor(18, 5, false).headlineDay).toBe(1);
    expect(figuresFor(18, 5, true)).toMatchObject({
      headline: "23:55",
      headlineDay: 0,
    });
  });
});
