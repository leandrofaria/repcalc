import { type Duration, type TimeOfDay } from "../time/units";
import * as D from "../time/duration";
import { difference } from "../time/timeOfDay";

export type LiveInput = {
  start: TimeOfDay;
  workday: Duration;
  breakTime: Duration;
  tolerance: Duration;
  includeBreak: boolean;
};

/**
 * Where the shift is right now.
 *
 * Named in the domain rather than derived in the view, because the boundaries
 * are the tolerance rules and those are worth a test.
 */
export type ShiftPhase =
  | "before" // the informed start time has not arrived
  | "working" // under way, tolerance not yet reached
  | "mayLeave" // inside the tolerance window: leaving now is allowed
  | "overtime"; // past the journey plus the tolerance

export type LiveStatus = {
  phase: ShiftPhase;
  /** Null when the informed start time has not arrived yet. */
  worked: Duration | null;
  /** Only counted once the excess passes the tolerance. */
  overtime: Duration | null;
  remainingTotal: Duration | null;
  remainingWithTolerance: Duration | null;
  targetWithTolerance: Duration;
};

/**
 * The live panel's arithmetic, with `now` as a parameter.
 *
 * Taking the clock as an argument is what makes this testable at all: the
 * previous implementation called dayjs() three times inside a setInterval.
 * It also means the calculation has no notion of a calendar date, so the
 * midnight page reload it used to need is gone.
 *
 * A start time later than `now` yields worked: null. That also covers a shift
 * that began yesterday, which the live panel has never supported.
 */
export function computeLiveStatus(
  input: LiveInput,
  now: TimeOfDay
): LiveStatus {
  const { start, workday, breakTime, tolerance, includeBreak } = input;
  const targetWithTolerance = D.subtract(workday, tolerance);

  const elapsed = difference(start, now);
  const worked = includeBreak ? D.subtract(elapsed, breakTime) : elapsed;

  if (worked < 0) {
    return {
      phase: "before",
      worked: null,
      overtime: null,
      remainingTotal: null,
      remainingWithTolerance: null,
      targetWithTolerance,
    };
  }

  if (worked > workday) {
    const excess = D.subtract(worked, workday);
    const withinTolerance = tolerance > excess;
    return {
      phase: withinTolerance ? "mayLeave" : "overtime",
      worked,
      overtime: withinTolerance ? null : excess,
      remainingTotal: null,
      remainingWithTolerance: null,
      targetWithTolerance,
    };
  }

  return {
    // Reaching the tolerance window is what turns "still working" into
    // "you may leave", which is the moment the user actually cares about.
    phase: worked >= targetWithTolerance ? "mayLeave" : "working",
    worked,
    overtime: null,
    remainingTotal: D.subtract(workday, worked),
    remainingWithTolerance:
      worked > targetWithTolerance
        ? null
        : D.subtract(D.subtract(workday, worked), tolerance),
    targetWithTolerance,
  };
}
