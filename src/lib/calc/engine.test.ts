import { describe, expect, it } from "vitest";
import { fromHM } from "../time/duration";
import {
  apply,
  durationValue,
  formatValue,
  scalar,
  type Operator,
  type Value,
} from "./engine";

const d = (hours: number, minutes: number): Value =>
  durationValue(fromHM(hours, minutes));

function show(op: Operator, left: Value, right: Value): string {
  const result = apply(op, left, right);
  return result.ok ? formatValue(result.value) : result.error;
}

describe("apply", () => {
  // Ground truth captured from production before the refactor.
  it.each([
    ["duration plus duration", "+" as const, d(2, 30), d(1, 45), "4h 15m"],
    ["duration minus duration", "-" as const, d(2, 30), d(3, 0), "-30m"],
    ["duration times scalar", "*" as const, d(2, 30), scalar(3), "7h 30m"],
    ["scalar times duration", "*" as const, scalar(3), d(2, 30), "7h 30m"],
    ["duration over scalar", "/" as const, d(7, 30), scalar(3), "2h 30m"],
    ["scalar plus scalar", "+" as const, scalar(5), scalar(3), "8"],
    ["past 24 hours", "+" as const, d(25, 0), d(3, 0), "28h"],
    [
      "bare scalar reads as minutes",
      "+" as const,
      d(2, 30),
      scalar(15),
      "2h 45m",
    ],
  ])("%s", (_label, op, left, right, expected) => {
    expect(show(op, left, right)).toBe(expected);
  });

  it("divides duration by duration into a plain number", () => {
    expect(show("/", d(7, 30), d(2, 30))).toBe("3");
  });

  it("drops the unit when the result is zero, as it always has", () => {
    expect(show("/", d(0, 0), d(0, 5))).toBe("0");
    expect(show("-", d(2, 30), d(2, 30))).toBe("0");
  });

  it("refuses the unit combinations the keypad already blocks", () => {
    // The keypad disables the h and min keys in these cases, but the
    // calculation itself used to go ahead: 2h30 * 4h produced "600h".
    expect(show("*", d(2, 30), d(4, 0))).toBe("INVALID_UNITS");
    expect(show("/", scalar(5), d(2, 30))).toBe("INVALID_UNITS");
  });

  it("reports division by zero instead of leaking Infinity", () => {
    expect(show("/", d(2, 30), scalar(0))).toBe("DIVIDE_BY_ZERO");
    expect(show("/", scalar(5), scalar(0))).toBe("DIVIDE_BY_ZERO");
  });

  it("carries the sign correctly on a negative duration", () => {
    // Production printed "-1h -30m".
    expect(show("-", d(1, 0), d(2, 30))).toBe("-1h 30m");
  });

  it("rounds a fractional duration rather than truncating it", () => {
    expect(show("/", durationValue(fromHM(0, 5)), scalar(2))).toBe("3m");
  });

  it("keeps a fractional scalar as-is", () => {
    expect(show("/", scalar(5), scalar(2))).toBe("2.5");
  });
});
