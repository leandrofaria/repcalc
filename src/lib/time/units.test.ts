import { describe, expect, it } from "vitest";
import { MINUTES_PER_DAY, duration, timeOfDay } from "./units";

describe("duration", () => {
  it("accepts whole minutes, including negatives", () => {
    expect(duration(0)).toBe(0);
    expect(duration(1530)).toBe(1530);
    expect(duration(-90)).toBe(-90);
  });

  it("rejects fractional minutes", () => {
    expect(() => duration(1.5)).toThrow(RangeError);
  });
});

describe("timeOfDay", () => {
  it("accepts any minute within the day", () => {
    expect(timeOfDay(0)).toBe(0);
    expect(timeOfDay(MINUTES_PER_DAY - 1)).toBe(1439);
  });

  it("rejects values outside the day", () => {
    expect(() => timeOfDay(-1)).toThrow(RangeError);
    expect(() => timeOfDay(MINUTES_PER_DAY)).toThrow(RangeError);
  });
});
