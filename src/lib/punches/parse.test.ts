import { describe, expect, it } from "vitest";
import { formatClock, fromHM } from "../time/timeOfDay";
import { formatHHMM } from "../time/duration";
import {
  MAX_PUNCHES,
  breakCount,
  breaksBetween,
  parsePunches,
  stillClockedIn,
} from "./parse";

const clocks = (text: string) =>
  parsePunches(text).times.map((time) => formatClock(time));

describe("parsePunches", () => {
  it("reads the line the time clock reports", () => {
    expect(clocks("08:00 09:00 09:10")).toEqual(["08:00", "09:00", "09:10"]);
  });

  it("accepts the shapes the same time appears in", () => {
    // Depending on where the line is copied from, the colon and the leading
    // zero may or may not survive.
    expect(clocks("8:00 0900 09:10")).toEqual(["08:00", "09:00", "09:10"]);
  });

  it("accepts separators other than a single space", () => {
    expect(clocks("08:00,09:00; 09:10\t12:00\n13:00")).toEqual([
      "08:00",
      "09:00",
      "09:10",
      "12:00",
      "13:00",
    ]);
  });

  it("keeps what it could not read, rather than dropping it", () => {
    // A line pasted from the wrong place should say so, not quietly produce
    // a shorter day.
    const result = parsePunches("08:00 almoço 25:00 12:61 13:00");
    expect(result.times.map(formatClock)).toEqual(["08:00", "13:00"]);
    expect(result.rejected).toEqual(["almoço", "25:00", "12:61"]);
  });

  it("stops at the twelve marks the clock allows", () => {
    const line = Array.from({ length: 14 }, (_, i) => `0${i % 10}:00`).join(
      " "
    );
    const result = parsePunches(line);
    expect(result.times).toHaveLength(MAX_PUNCHES);
    expect(result.truncated).toBe(true);
  });

  it("reads an empty line as nothing at all", () => {
    expect(parsePunches("   ")).toEqual({
      times: [],
      rejected: [],
      truncated: false,
    });
  });
});

describe("breaksBetween", () => {
  it("sums the gaps between a clock-out and the next clock-in", () => {
    // In 08:00, out 12:00, in 13:00: one hour of break.
    const { times } = parsePunches("08:00 12:00 13:00");
    expect(formatHHMM(breaksBetween(times))).toBe("01:00");
    expect(breakCount(times)).toBe(1);
  });

  it("sums more than one break", () => {
    const { times } = parsePunches("08:00 09:00 09:10 12:00 13:00");
    expect(formatHHMM(breaksBetween(times))).toBe("01:10");
    expect(breakCount(times)).toBe(2);
  });

  it("counts no break from a single clock-in", () => {
    const { times } = parsePunches("08:00");
    expect(breaksBetween(times)).toBe(0);
    expect(breakCount(times)).toBe(0);
  });

  it("ignores a trailing mark, which is a state and not a gap", () => {
    // The 13:00 has nothing after it: the person is back on the clock.
    const { times } = parsePunches("08:00 12:00 13:00");
    expect(breakCount(times)).toBe(1);
  });

  it("reads a break that runs past midnight", () => {
    expect(
      formatHHMM(breaksBetween([fromHM(22, 0), fromHM(23, 30), fromHM(0, 15)]))
    ).toBe("00:45");
  });
});

describe("stillClockedIn", () => {
  it("is true for an odd number of marks", () => {
    // Odd means the last mark was an entry: the Jornada screen's whole
    // premise, since it exists to predict the mark that has not happened.
    expect(stillClockedIn(parsePunches("08:00").times)).toBe(true);
    expect(stillClockedIn(parsePunches("08:00 12:00 13:00").times)).toBe(true);
  });

  it("is false once the day has been closed", () => {
    expect(stillClockedIn(parsePunches("08:00 12:00").times)).toBe(false);
  });
});
