import { type Duration, type TimeOfDay } from "../time/units";
import * as D from "../time/duration";
import { elapsedForward } from "../time/timeOfDay";

export type LiveInput = {
  start: TimeOfDay;
  workday: Duration;
  breakTime: Duration;
  tolerance: Duration;
  /** Whether the break has already been taken, and so already worked off. */
  breakTaken: boolean;
};

/**
 * Where the shift is right now.
 *
 * Named in the domain rather than derived in the view, because the boundaries
 * are the tolerance rules and those are worth a test.
 */
export type ShiftPhase =
  | "notStarted" // the start time is ahead, so this is a plan, not a shift
  | "breakCovers" // the break accounts for everything since the start
  | "working"
  | "mayLeave" // inside the tolerance window: leaving now is allowed
  | "overtime"; // past the journey plus the tolerance

export type LiveStatus = {
  phase: ShiftPhase;
  /** Null until the shift is actually under way. */
  worked: Duration | null;
  /** Only counted once the excess passes the tolerance. */
  overtime: Duration | null;
  remainingTotal: Duration | null;
  remainingWithTolerance: Duration | null;
  targetWithTolerance: Duration;
};

/**
 * How far past the planned journey a shift can run and still be read as under
 * way rather than as a plan for later today.
 *
 * A start time is always in the past — you cannot have clocked in at a time
 * that has not happened. But this screen is also used to plan ("if I start at
 * 08:00, when do I leave?"), and then the start time is genuinely ahead. The
 * two are indistinguishable from the clock alone, so this is a judgment: a
 * shift running more than six hours over is less likely than someone planning
 * their morning the night before.
 */
const PLAUSIBLE_OVERRUN = 6 * 60;

/**
 * The live figures, with `now` as a parameter.
 *
 * Taking the clock as an argument is what makes this testable at all: the
 * previous implementation called dayjs() three times inside a setInterval.
 * It also means the calculation has no notion of a calendar date, so the
 * midnight page reload it used to need is gone.
 *
 * Elapsed time runs forward from the start, wrapping past midnight, so a
 * shift that began at 23:00 and is checked at 01:00 reads as two hours rather
 * than as minus twenty-two.
 */
export function computeLiveStatus(
  input: LiveInput,
  now: TimeOfDay
): LiveStatus {
  const { start, workday, breakTime, tolerance, breakTaken } = input;
  const targetWithTolerance = D.subtract(workday, tolerance);

  const elapsed = elapsedForward(start, now);
  const idle: Omit<LiveStatus, "phase"> = {
    worked: null,
    overtime: null,
    remainingTotal: null,
    remainingWithTolerance: null,
    targetWithTolerance,
  };

  if (elapsed > workday + breakTime + PLAUSIBLE_OVERRUN) {
    return { phase: "notStarted", ...idle };
  }

  const worked = breakTaken ? D.subtract(elapsed, breakTime) : elapsed;
  if (worked < 0) return { phase: "breakCovers", ...idle };

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

/**
 * The figure that sits beside the time worked, when there is one.
 *
 * Three outcomes, and the third is the point: while the journey is short there
 * is time remaining; once the excess passes the tolerance there is overtime;
 * and in between — journey done, excess still inside the tolerance — there is
 * no honest number at all. Nothing is missing, and it is not overtime yet.
 *
 * That state used to render "--:--" beneath the label "Faltam", which is a
 * placeholder pretending to be an answer to a question that has none. It also
 * kept the decision in JSX, where a wrong number is not a test away from
 * being caught.
 */
export function secondFigure(
  status: LiveStatus
): { kind: "remaining" | "overtime"; value: Duration } | null {
  if (status.overtime !== null) {
    return { kind: "overtime", value: status.overtime };
  }
  if (status.remainingTotal !== null) {
    return { kind: "remaining", value: status.remainingTotal };
  }
  return null;
}
