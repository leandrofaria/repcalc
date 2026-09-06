import { describe, expect, it } from "vitest";
import { duration } from "./units";
import {
  ZERO,
  add,
  divide,
  formatCompact,
  formatHHMM,
  fromHM,
  parseCompact,
  parseHHMM,
  ratio,
  scale,
  subtract,
  sum,
  toHM,
} from "./duration";

describe("formatHHMM", () => {
  it("does not wrap at 24 hours", () => {
    expect(formatHHMM(fromHM(25, 30))).toBe("25:30");
    expect(formatHHMM(duration(1440))).toBe("24:00");
  });

  it("carries the sign once, on the whole value", () => {
    expect(formatHHMM(duration(-90))).toBe("-01:30");
    expect(formatHHMM(duration(-1))).toBe("-00:01");
  });

  it("formats zero and everyday values", () => {
    expect(formatHHMM(ZERO)).toBe("00:00");
    expect(formatHHMM(fromHM(5, 45))).toBe("05:45");
    expect(formatHHMM(fromHM(14, 0))).toBe("14:00");
  });
});

describe("formatCompact", () => {
  // Ground truth captured from production before the refactor.
  it("matches the previous output where the previous output was right", () => {
    expect(formatCompact(fromHM(4, 15))).toBe("4h 15m");
    expect(formatCompact(fromHM(2, 30))).toBe("2h 30m");
    expect(formatCompact(fromHM(1, 0))).toBe("1h");
    expect(formatCompact(fromHM(28, 0))).toBe("28h");
    expect(formatCompact(fromHM(25, 30))).toBe("25h 30m");
  });

  it("fixes the double sign", () => {
    // Production printed "-1h -30m".
    expect(formatCompact(duration(-90))).toBe("-1h 30m");
  });

  it("fixes the leading space on minute-only values", () => {
    // Production printed " 30m" and " -1m".
    expect(formatCompact(duration(30))).toBe("30m");
    expect(formatCompact(duration(-1))).toBe("-1m");
  });

  it("renders zero instead of an empty display", () => {
    // Production printed "", which blanked the calculator.
    expect(formatCompact(ZERO)).toBe("0m");
  });
});

describe("parseCompact", () => {
  it("accepts both the min and m suffixes", () => {
    expect(parseCompact("2h 30min")).toBe(150);
    expect(parseCompact("2h 30m")).toBe(150);
    expect(parseCompact("2h")).toBe(120);
    expect(parseCompact("30min")).toBe(30);
    expect(parseCompact("0h 5min")).toBe(5);
    expect(parseCompact("-1h 30m")).toBe(-90);
  });

  it("rejects anything else", () => {
    expect(parseCompact("lixo")).toBeNull();
    expect(parseCompact("")).toBeNull();
    expect(parseCompact("   ")).toBeNull();
    expect(parseCompact("2:30")).toBeNull();
  });

  it("round-trips through formatCompact", () => {
    for (const minutes of [0, 1, 59, 60, 61, 345, 1530, -90, -1]) {
      const d = duration(minutes);
      expect(parseCompact(formatCompact(d))).toBe(d);
    }
  });
});

describe("parseHHMM", () => {
  it("parses picker-representable values", () => {
    expect(parseHHMM("05:45")).toBe(345);
    expect(parseHHMM("5:45")).toBe(345);
    expect(parseHHMM("00:00")).toBe(0);
    expect(parseHHMM("23:59")).toBe(1439);
  });

  it("rejects values a TimePicker cannot hold", () => {
    expect(parseHHMM("24:00")).toBeNull();
    expect(parseHHMM("ab:cd")).toBeNull();
    expect(parseHHMM("5:60")).toBeNull();
    expect(parseHHMM("")).toBeNull();
  });
});

describe("arithmetic", () => {
  it("adds and subtracts", () => {
    expect(add(fromHM(2, 30), fromHM(1, 45))).toBe(255);
    expect(subtract(fromHM(2, 30), fromHM(3, 0))).toBe(-30);
    expect(add(fromHM(25, 0), fromHM(3, 0))).toBe(1680);
  });

  it("scales and divides, rounding half away from zero", () => {
    expect(scale(fromHM(2, 30), 3)).toBe(450);
    expect(divide(fromHM(7, 30), 3)).toBe(150);
    // Production truncated 2.5 to 2, silently losing time.
    expect(divide(duration(5), 2)).toBe(3);
    expect(divide(duration(-5), 2)).toBe(-3);
  });

  it("divides duration by duration into a plain number", () => {
    expect(ratio(fromHM(7, 30), fromHM(2, 30))).toBe(3);
  });

  it("sums a list, with an empty list yielding zero", () => {
    expect(sum([])).toBe(0);
    expect(sum([fromHM(5, 6), fromHM(5, 6), fromHM(13, 0)])).toBe(1392);
  });

  it("splits into sign and components", () => {
    expect(toHM(duration(-90))).toEqual({
      negative: true,
      hours: 1,
      minutes: 30,
    });
    expect(toHM(fromHM(25, 30))).toEqual({
      negative: false,
      hours: 25,
      minutes: 30,
    });
  });
});
