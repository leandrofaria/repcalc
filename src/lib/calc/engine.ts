import { duration, type Duration } from "../time/units";
import * as D from "../time/duration";

export type Value =
  { kind: "scalar"; value: number } | { kind: "duration"; value: Duration };

export type Operator = "+" | "-" | "*" | "/";

export type CalcError = "DIVIDE_BY_ZERO" | "INVALID_UNITS";

export type Applied =
  { ok: true; value: Value } | { ok: false; error: CalcError };

export const ZERO_SCALAR: Value = { kind: "scalar", value: 0 };

export function scalar(value: number): Value {
  return { kind: "scalar", value };
}

export function durationValue(value: Duration): Value {
  return { kind: "duration", value };
}

export function isDuration(value: Value | null): boolean {
  return value?.kind === "duration";
}

/** A bare number mixed with a duration is read as minutes. */
function toMinutes(value: Value): number {
  return value.value;
}

/**
 * The unit algebra.
 *
 * | left     | op    | right    | result        |
 * | duration | + -   | duration | duration      |
 * | duration | + -   | scalar   | duration      |
 * | duration | *     | scalar   | duration      |
 * | duration | *     | duration | INVALID_UNITS |
 * | duration | /     | duration | scalar        |
 * | duration | /     | scalar   | duration      |
 * | scalar   | /     | duration | INVALID_UNITS |
 * | scalar   | any   | scalar   | scalar        |
 *
 * The keypad already refuses to build the two illegal combinations, but the
 * calculation itself never checked. Enforcing it here means the rule lives in
 * one place instead of being restated by every key's disabled prop.
 */
export function apply(op: Operator, left: Value, right: Value): Applied {
  const leftIsDuration = left.kind === "duration";
  const rightIsDuration = right.kind === "duration";

  if (op === "*" && leftIsDuration && rightIsDuration) {
    return { ok: false, error: "INVALID_UNITS" };
  }
  if (op === "/" && !leftIsDuration && rightIsDuration) {
    return { ok: false, error: "INVALID_UNITS" };
  }
  if (op === "/" && toMinutes(right) === 0) {
    // Previously this leaked the string "Infinity" into the display.
    return { ok: false, error: "DIVIDE_BY_ZERO" };
  }

  const a = toMinutes(left);
  const b = toMinutes(right);
  let result: number;
  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
  }

  // Neither side carries a unit, or both do and we divided them out.
  if (!leftIsDuration && !rightIsDuration)
    return { ok: true, value: scalar(result) };
  if (op === "/" && leftIsDuration && rightIsDuration) {
    return { ok: true, value: scalar(result) };
  }
  // Preserved from the original: a zero result loses its unit.
  if (result === 0) return { ok: true, value: ZERO_SCALAR };

  return {
    ok: true,
    value: durationValue(
      duration(Math.sign(result) * Math.round(Math.abs(result)))
    ),
  };
}

export function formatValue(value: Value): string {
  return value.kind === "duration"
    ? D.formatCompact(value.value)
    : String(value.value);
}
