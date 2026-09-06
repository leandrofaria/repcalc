import dayjs from "dayjs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { duration } from "./units";
import * as D from "./duration";
import {
  PICKER_EPOCH,
  dayjsToDuration,
  dayjsToTimeOfDay,
  durationToDayjs,
  timeOfDayToDayjs,
} from "./dayjs";
import { fromHM as timeFromHM } from "./timeOfDay";

afterEach(() => {
  vi.useRealTimers();
});

describe("dayjsToDuration", () => {
  it("reads hours and minutes as a duration", () => {
    expect(dayjsToDuration(dayjs(PICKER_EPOCH).hour(5).minute(45))).toBe(345);
  });

  it("returns null for absent or invalid values", () => {
    expect(dayjsToDuration(null)).toBeNull();
    expect(dayjsToDuration(dayjs("nao e uma data"))).toBeNull();
  });
});

describe("durationToDayjs", () => {
  it("round-trips picker-representable durations", () => {
    const value = durationToDayjs(D.fromHM(5, 45));
    expect(value?.hour()).toBe(5);
    expect(value?.minute()).toBe(45);
  });

  it("refuses durations a picker cannot hold", () => {
    // This is the architectural rule that makes 25h30 totals possible.
    expect(durationToDayjs(D.fromHM(25, 30))).toBeNull();
    expect(durationToDayjs(duration(1440))).toBeNull();
    expect(durationToDayjs(duration(-1))).toBeNull();
    expect(durationToDayjs(null)).toBeNull();
  });
});

describe("clock conversions", () => {
  it("round-trips a time of day", () => {
    const value = timeOfDayToDayjs(timeFromHM(13, 12));
    expect(dayjsToTimeOfDay(value)).toBe(792);
  });

  it("returns null for absent values", () => {
    expect(timeOfDayToDayjs(null)).toBeNull();
    expect(dayjsToTimeOfDay(null)).toBeNull();
  });
});

describe("date independence", () => {
  // The previous implementation anchored picker values to dayjs(), so the
  // live panel had to reload the page when the day rolled over.
  it.each([
    ["first of the month", new Date(2026, 0, 1, 3, 0, 0)],
    ["last of the month", new Date(2026, 0, 31, 23, 59, 0)],
    ["across a DST boundary", new Date(2026, 9, 18, 2, 30, 0)],
  ])("produces the same values on the %s", (_label, when) => {
    vi.useFakeTimers();
    vi.setSystemTime(when);
    expect(dayjsToDuration(durationToDayjs(D.fromHM(5, 45)))).toBe(345);
    expect(dayjsToTimeOfDay(timeOfDayToDayjs(timeFromHM(20, 0)))).toBe(1200);
  });
});
