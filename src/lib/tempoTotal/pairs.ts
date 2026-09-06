import { type Duration, type TimeOfDay } from "../time/units";
import * as D from "../time/duration";
import { difference } from "../time/timeOfDay";

export const MIN_PAIRS = 1;
export const MAX_PAIRS = 6;

/** One clock-in / clock-out pair. The id is a stable React key. */
export type PunchPair = {
  id: string;
  in: TimeOfDay | null;
  out: TimeOfDay | null;
};

export type PairsResult = {
  /** The sum of every complete, well-ordered pair so far. */
  total: Duration;
  /** True when every pair is complete and in order. */
  valid: boolean;
  /** Pairs that are filled in but out of order: a real error. */
  invalidIndices: readonly number[];
  /** Pairs still waiting on a value: not an error, just unfinished. */
  incompleteIndices: readonly number[];
};

export function emptyPair(id: string): PunchPair {
  return { id, in: null, out: null };
}

/**
 * Sums a sequence of punch pairs, requiring each to be ordered and to start
 * after the previous one ended.
 *
 * Incomplete and invalid are reported separately, and deliberately so: a pair
 * nobody has typed into yet is unfinished, not wrong, and marking it red the
 * moment the row appears is noise the user cannot act on.
 *
 * The total counts every pair that is complete and ordered, so it grows as
 * the form is filled instead of staying blank until the last field.
 */
export function computePairs(pairs: readonly PunchPair[]): PairsResult {
  const invalidIndices: number[] = [];
  const incompleteIndices: number[] = [];
  let previousOut: TimeOfDay | null = null;
  let total: Duration = D.ZERO;

  pairs.forEach((pair, index) => {
    const { in: start, out: end } = pair;

    if (start === null || end === null) {
      incompleteIndices.push(index);
      // A half-filled pair still fixes the floor for the ones after it.
      if (start !== null) previousOut = start;
      return;
    }

    const outOfOrder =
      end <= start || (previousOut !== null && start <= previousOut);
    if (outOfOrder) {
      invalidIndices.push(index);
      return;
    }

    previousOut = end;
    total = D.add(total, difference(start, end));
  });

  return {
    total,
    valid: invalidIndices.length === 0 && incompleteIndices.length === 0,
    invalidIndices,
    incompleteIndices,
  };
}
