import { type Duration, type TimeOfDay } from "../time/units";
import * as D from "../time/duration";
import { elapsedForward } from "../time/timeOfDay";

export const MIN_PAIRS = 1;
export const MAX_PAIRS = 6;

/** One clock-in / clock-out pair. The id is a stable React key. */
export type PunchPair = {
  id: string;
  in: TimeOfDay | null;
  out: TimeOfDay | null;
};

export type PairState = {
  /** How many days past the first punch this pair's clock-in falls on. */
  dayOffset: number;
  /** Filled in, but says nothing: the two readings are the same. */
  invalid: boolean;
  /** Still waiting on a value. Not an error. */
  incomplete: boolean;
};

export type PairsResult = {
  /** The sum of every complete, well-formed pair so far. */
  total: Duration;
  valid: boolean;
  pairs: readonly PairState[];
};

export function emptyPair(id: string): PunchPair {
  return { id, in: null, out: null };
}

/**
 * Sums a sequence of punch pairs.
 *
 * Marks are chronological by construction, so a clock that appears to run
 * backwards means the day turned: 22:00 to 23:00 followed by 00:00 to 00:30
 * is a night shift of an hour and a half, not a sequence "out of order".
 * Refusing it was wrong in the previous version and in the one before that.
 *
 * Because that reading is an interpretation, each pair reports the day it
 * landed on, and the screen shows it. Nothing is assumed silently.
 *
 * The only thing left that cannot mean anything is a pair whose two readings
 * are identical: zero minutes, or exactly twenty-four hours, with no way to
 * tell which.
 */
export function computePairs(pairs: readonly PunchPair[]): PairsResult {
  const states: PairState[] = [];
  let total: Duration = D.ZERO;
  let dayOffset = 0;
  let previousOut: TimeOfDay | null = null;

  for (const pair of pairs) {
    const { in: start, out: end } = pair;

    if (start === null || end === null) {
      states.push({ dayOffset, invalid: false, incomplete: true });
      continue;
    }

    if (previousOut !== null) {
      const gap = elapsedForward(previousOut, start);
      if (gap === 0) {
        // Same reading as the previous clock-out: zero gap or a whole day.
        states.push({ dayOffset, invalid: true, incomplete: false });
        continue;
      }
      if (start <= previousOut) dayOffset += 1;
    }

    const worked = elapsedForward(start, end);
    if (worked === 0) {
      states.push({ dayOffset, invalid: true, incomplete: false });
      continue;
    }

    states.push({ dayOffset, invalid: false, incomplete: false });
    total = D.add(total, worked);
    // A pair that runs past midnight leaves the cursor on the next day.
    if (end < start) dayOffset += 1;
    previousOut = end;
  }

  return {
    total,
    valid: states.every((state) => !state.invalid && !state.incomplete),
    pairs: states,
  };
}
