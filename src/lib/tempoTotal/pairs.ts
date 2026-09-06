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
  total: Duration | null;
  valid: boolean;
  /** Indices of the pairs that broke the chronological order. */
  invalidIndices: readonly number[];
};

export function emptyPair(id: string): PunchPair {
  return { id, in: null, out: null };
}

/**
 * Sums a sequence of punch pairs, requiring each to be ordered and to start
 * after the previous one ended.
 *
 * invalidIndices lets the UI mark the offending picker instead of showing one
 * global error paragraph for the whole form.
 */
export function computePairs(pairs: readonly PunchPair[]): PairsResult {
  const invalidIndices: number[] = [];
  let previousOut: TimeOfDay | null = null;
  let total: Duration = D.ZERO;

  pairs.forEach((pair, index) => {
    const { in: start, out: end } = pair;
    if (start === null || end === null) {
      invalidIndices.push(index);
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

  const valid = invalidIndices.length === 0;
  return { total: valid ? total : null, valid, invalidIndices };
}
