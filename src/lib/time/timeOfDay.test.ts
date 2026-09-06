import { describe, expect, it } from "vitest";
import { duration } from "./units";
import {
  addDuration,
  compare,
  difference,
  formatClock,
  fromHM,
  nowTimeOfDay,
} from "./timeOfDay";

describe("addDuration", () => {
  it("reports the day it crossed instead of silently wrapping", () => {
    expect(addDuration(fromHM(20, 0), duration(360))).toEqual({
      time: 120,
      dayOffset: 1,
    });
  });

  it("stays on the same day when it does not cross midnight", () => {
    expect(addDuration(fromHM(8, 0), duration(345))).toEqual({
      time: 825,
      dayOffset: 0,
    });
  });

  it("handles going backwards past midnight", () => {
    expect(addDuration(fromHM(0, 0), duration(-60))).toEqual({
      time: 1380,
      dayOffset: -1,
    });
  });

  it("treats exactly midnight as the next day", () => {
    expect(addDuration(fromHM(23, 0), duration(60))).toEqual({
      time: 0,
      dayOffset: 1,
    });
  });
});

describe("difference", () => {
  it("is signed and does not wrap", () => {
    expect(difference(fromHM(8, 0), fromHM(17, 30))).toBe(570);
    expect(difference(fromHM(17, 30), fromHM(8, 0))).toBe(-570);
    expect(difference(fromHM(8, 0), fromHM(8, 0))).toBe(0);
  });
});

describe("formatClock", () => {
  it("always pads to two digits", () => {
    expect(formatClock(fromHM(23, 0))).toBe("23:00");
    expect(formatClock(fromHM(0, 0))).toBe("00:00");
    expect(formatClock(fromHM(5, 9))).toBe("05:09");
  });
});

describe("compare", () => {
  it("orders clock times", () => {
    expect(compare(fromHM(8, 0), fromHM(9, 0))).toBeLessThan(0);
    expect(compare(fromHM(9, 0), fromHM(8, 0))).toBeGreaterThan(0);
    expect(compare(fromHM(8, 0), fromHM(8, 0))).toBe(0);
  });
});

describe("nowTimeOfDay", () => {
  it("reads hours and minutes from the supplied date", () => {
    expect(nowTimeOfDay(new Date(2026, 8, 6, 13, 12))).toBe(792);
  });
});
